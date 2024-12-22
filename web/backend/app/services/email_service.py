from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

# MailHog configuration
conf = ConnectionConfig(
    MAIL_USERNAME="test@example.com",
    MAIL_PASSWORD="password",
    MAIL_FROM="test@example.com",
    MAIL_PORT=1025,
    MAIL_SERVER="localhost",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=False,
)

async def send_verification_email(email: EmailStr, code: str):
    message = MessageSchema(
        subject="Your Verification Code",
        recipients=[email],
        body=f"Your verification code is: {code}",
        subtype="plain",  # or "html" for HTML emails
    )
    fm = FastMail(conf)
    await fm.send_message(message)