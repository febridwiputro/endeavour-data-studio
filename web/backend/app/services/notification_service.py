from twilio.rest import Client
from jinja2 import Template
from pathlib import Path
from fastapi_mail import FastMail, MessageSchema
from app.config.mail_config import conf

# Twilio client setup
twilio_client = Client("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN")
twilio_phone_number = "YOUR_TWILIO_PHONE_NUMBER"

async def send_verification_email(email: str, code: str):
    """Send a verification email with the code."""
    # Define the template path
    template_path = Path("app/templates/verification_email_template.html")

    # Ensure the template file exists
    if not template_path.exists():
        raise FileNotFoundError("Email template not found at app/templates/verification_email_template.html")

    # Load and render the HTML template
    with template_path.open("r", encoding="utf-8") as file:
        template_content = file.read()

    # Render the template with the verification code
    template = Template(template_content)
    email_body = template.render(code=code)

    # Create and send the email
    message = MessageSchema(
        subject="Verify Your Email",
        recipients=[email],
        body=email_body,
        subtype="html",  # Specify the email body as HTML
    )
    fm = FastMail(conf)
    await fm.send_message(message)

def send_verification_sms(phone_number: str, code: str):
    """Send a verification code via SMS."""
    twilio_client.messages.create(
        to=phone_number,
        from_=twilio_phone_number,
        body=f"Your verification code is: {code}",
    )

def send_verification_whatsapp(phone_number: str, code: str):
    """Send a verification code via WhatsApp."""
    twilio_client.messages.create(
        to=f"whatsapp:{phone_number}",
        from_=f"whatsapp:{twilio_phone_number}",
        body=f"Your verification code is: {code}",
    )
