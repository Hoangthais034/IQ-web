from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://iq:iq@localhost:5432/iq"
    api_jwt_secret: str = "change-me"
    admin_emails: str = ""
    cors_origins: str = "http://localhost:3000"

    # SePay (VietQR bank transfer). Webhook auth header: "Authorization: Apikey <key>".
    sepay_webhook_api_key: str = ""
    sepay_bank_account: str = ""
    sepay_bank: str = ""  # bank short name, e.g. Vietcombank, MBBank
    subscription_price_vnd: int = 30000
    subscription_days: int = 30

    # Contact form: messages are stored in DB, then emailed to contact_to_email via SMTP (Gmail App Password works).
    contact_to_email: str = ""
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587  # 587 = STARTTLS, 465 = SSL
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from: str = ""  # defaults to smtp_username
    contact_max_per_hour: int = 3

    @property
    def admin_email_set(self) -> set[str]:
        return {e.strip().lower() for e in self.admin_emails.split(",") if e.strip()}

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
