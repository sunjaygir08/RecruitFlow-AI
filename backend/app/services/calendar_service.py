import urllib.parse
from datetime import datetime

class CalendarService:
    def create_event(self, candidate_name, candidate_email, date_str, time_str, job_title="Full Stack Position"):
        """Generate Google Calendar meeting invite link and event details."""
        summary = f"Interview with {candidate_name} for {job_title}"
        description = f"Technical Candidate Interview with RecruitFlow AI.\nCandidate Email: {candidate_email}"
        
        # Build Web Google Calendar quick link
        base_url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        params = {
            "text": summary,
            "details": description,
            "add": candidate_email,
        }
        
        calendar_link = f"{base_url}&{urllib.parse.urlencode(params)}"
        
        return {
            "status": "success",
            "event_id": f"evt-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "calendar_link": calendar_link,
            "summary": summary,
            "date": date_str,
            "time": time_str
        }

calendar_service = CalendarService()
