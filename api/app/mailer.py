import logging
import smtplib
from email.message import EmailMessage

from app.config import get_settings

log = logging.getLogger(__name__)


def smtp_configured() -> bool:
    s = get_settings()
    return bool(s.contact_to_email and s.smtp_host and s.smtp_username and s.smtp_password)


def send_mail(subject: str, body: str, reply_to: str | None = None) -> None:
    """Send a plain-text email to the site owner. Raises on SMTP failure."""
    s = get_settings()
    msg = EmailMessage()
    msg["From"] = s.smtp_from or s.smtp_username
    msg["To"] = s.contact_to_email
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(body)
    if s.smtp_port == 465:
        with smtplib.SMTP_SSL(s.smtp_host, s.smtp_port, timeout=20) as smtp:
            smtp.login(s.smtp_username, s.smtp_password)
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(s.smtp_username, s.smtp_password)
            smtp.send_message(msg)
