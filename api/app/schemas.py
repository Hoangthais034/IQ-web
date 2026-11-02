"""Shared question format used by the code generators, the Claude question skill and the importer."""

from typing import Literal

from pydantic import BaseModel, Field, model_validator

from app.models import QuestionSource, QuestionType


class OptionIn(BaseModel):
    key: str = Field(pattern=r"^[A-H]$")
    text: str | None = None
    svg: str | None = None

    @model_validator(mode="after")
    def has_content(self):
        if not self.text and not self.svg:
            raise ValueError("option needs text or svg")
        return self


class QuestionIn(BaseModel):
    type: QuestionType
    difficulty: int = Field(ge=1, le=5)
    prompt: str = Field(min_length=3)
    prompt_svg: str | None = None
    options: list[OptionIn] = Field(min_length=4, max_length=8)
    answer_key: str
    explanation: str = Field(min_length=3)
    tip_slug: str | None = None
    source: QuestionSource = QuestionSource.generator

    @model_validator(mode="after")
    def answer_in_options(self):
        keys = [o.key for o in self.options]
        if len(set(keys)) != len(keys):
            raise ValueError("duplicate option keys")
        if self.answer_key not in keys:
            raise ValueError("answer_key not in options")
        texts = [o.text or o.svg for o in self.options]
        if len(set(texts)) != len(texts):
            raise ValueError("duplicate option contents")
        return self


Mode = Literal["full", "practice"]
