import resend
from app.config import Config

class EmailService:
    def __init__(self):
        self.api_key = Config.RESEND_API_KEY
        if self.api_key:
            resend.api_key = self.api_key

    def send_interview_email(self, candidate_email, candidate_name, date_str, time_str, calendar_link):
        """Send interview invitation email using Resend API."""
        subject = f"Interview Scheduled - RecruitFlow AI ({date_str})"
        html_content = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2>Interview Scheduled!</h2>
          <p>Hi <strong>{candidate_name}</strong>,</p>
          <p>We are pleased to invite you to an interview with our technical hiring team.</p>
          <hr />
          <p><strong>Date:</strong> {date_str}</p>
          <p><strong>Time:</strong> {time_str}</p>
          <p><strong>Calendar Link:</strong> <a href="{calendar_link}">Add to Google Calendar</a></p>
          <hr />
          <p>Best regards,<br />RecruitFlow AI Talent Acquisition</p>
        </div>
        """
        
        if self.api_key:
            try:
                params = {
                    "from": "RecruitFlow AI <onboarding@resend.dev>",
                    "to": [candidate_email],
                    "subject": subject,
                    "html": html_content,
                }
                email_res = resend.Emails.send(params)
                return {"status": "sent", "resend_id": email_res.get("id")}
            except Exception as e:
                print(f"Resend dispatch error: {e}")
        
        return {"status": "sent_mock", "message": "Email notification logged (dev mode)"}

email_service = EmailService()
