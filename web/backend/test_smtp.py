from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import asyncio

conf = ConnectionConfig(
    MAIL_USERNAME=None,  # No username required for MailDev
    MAIL_PASSWORD=None,  # No password required for MailDev
    MAIL_FROM="noreply@example.com",
    MAIL_PORT=1025,
    MAIL_SERVER="localhost",
    MAIL_FROM_NAME="Data Studio",
    MAIL_STARTTLS=False,  # No STARTTLS for MailDev
    MAIL_SSL_TLS=False,   # No SSL/TLS for MailDev
    USE_CREDENTIALS=False # No credentials needed
)

async def send_email():
    message = MessageSchema(
        subject="Test Email",
        recipients=["putrodwifebri@gmail.com"],
        body="This is a test email with MailDev.",
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    print("Email sent!")

if __name__ == "__main__":
    asyncio.run(send_email())
