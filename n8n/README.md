# RecruitFlow AI - n8n Workflow Automation Architecture

Production n8n workflow templates orchestrating the RecruitFlow AI Python Flask backend services via HTTP REST API calls (`/api/v1`).

---

## 🛠️ Workflows Included (`n8n/workflows/`)

1. **`resume_ingestion_workflow.json`**:
   - **Trigger**: Webhook `/webhook/resume-ingestion`
   - **Orchestration**: Webhook $\rightarrow$ Parse Resume API $\rightarrow$ Candidate Scoring API $\rightarrow$ Job Matching API $\rightarrow$ Create ATS Candidate $\rightarrow$ IF (Score $\ge 75$) $\rightarrow$ Yes: Schedule Interview & Send Email / No: Send Rejection Email & Update Status.

2. **`candidate_scoring_workflow.json`**:
   - **Trigger**: Webhook `/webhook/candidate-scoring`
   - **Orchestration**: Score Candidate API $\rightarrow$ Update Candidate Record in ATS.

3. **`job_matching_workflow.json`**:
   - **Trigger**: Webhook `/webhook/job-matching`
   - **Orchestration**: Match Job API $\rightarrow$ Update ATS Match Results $\rightarrow$ IF Match $\ge 85\%$ $\rightarrow$ Send Recruiter Slack Alert.

4. **`interview_scheduling_workflow.json`**:
   - **Trigger**: Webhook `/webhook/interview-scheduling`
   - **Orchestration**: Schedule Interview & Calendar Event API $\rightarrow$ Update Candidate Status to `Interview Scheduled`.

5. **`reminder_workflow.json`**:
   - **Trigger**: Webhook `/webhook/reminder`
   - **Orchestration**: Fetch Upcoming Interviews $\rightarrow$ Send 24-hour / 1-hour Reminders $\rightarrow$ Update ATS Lifecycle Status.

---

## ⚙️ Environment Variables Setup

Configure the following environment variables inside your n8n instance settings:

```bash
# n8n Environment Configuration
BACKEND_API_URL=http://localhost:5000/api/v1
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
```

---

## 📥 How to Import Workflows into n8n

1. Open your n8n Dashboard (e.g. `http://localhost:5678`).
2. Go to **Workflows** $\rightarrow$ **Import from File**.
3. Select any workflow JSON file from `n8n/workflows/`.
4. Verify HTTP Request node URLs reference `{{$env["BACKEND_API_URL"]}}`.
5. Save & Activate the workflow.

---

## 🔍 Troubleshooting

- **Connection Refused**: Ensure Flask backend server is running (`python backend/run.py` at `http://localhost:5000`).
- **Webhook Not Triggering**: Verify endpoint path matches n8n webhook URL config.
- **Environment Variable Missing**: Set `BACKEND_API_URL` in n8n environment or container environment.
