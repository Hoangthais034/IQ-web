"""Provisional scoring. Recalibrate the curve from real attempts once ~1,000 exist."""

FULL_TEST_SIZE = 40
FULL_TEST_MINUTES = 35
PRACTICE_SIZE = 10
AD_GATE_SECONDS = 15

# Assumed mean/sd of the weighted share of points for the general population.
ASSUMED_MEAN = 0.5
ASSUMED_SD = 0.2


def weighted_share(results: list[tuple[int, bool]]) -> float:
    """results: (difficulty, is_correct) per question."""
    total = sum(d for d, _ in results)
    return 0.0 if total == 0 else sum(d for d, ok in results if ok) / total


def iq_estimate(share: float) -> int:
    z = max(-3.0, min(3.0, (share - ASSUMED_MEAN) / ASSUMED_SD))
    return round(100 + 15 * z)
