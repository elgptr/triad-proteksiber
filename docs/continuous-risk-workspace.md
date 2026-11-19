# Continuous risk assurance workspace

The continuous-risk application opens its own risk workspace after organisation selection. It does not enter the audit journey. The audience link and presenter walkthrough use the same interface and separate private participant workspaces.

## Run the exercise

1. Open **Demo applications -> Continuous risk assurance** to walk through organisation selection, the risk map and register.
2. In admin **Signals & participants**, use **Continuous risk assurance / Release signal pack**. These controls are available regardless of the active presentation topic. The release uses the current seminar epoch and an optimistic revision to reject stale or concurrent changes.
3. Each organisation has three initial risks. Their pending-alert counts are 4, 1 and 1. Open a risk to view its description or the Early warning tab. Expand a source, inspect its summary and illustrative score proposal, and open the original news or simulated PDF in a new tab.
4. Accept or reject each pending source for that risk. Accept the prepared AI assessment or enter a risk-owner assessment and reasoning. Rejecting a source does not prevent a separately justified assessment.
5. If the updated score exceeds tolerance 12, supply a mitigation title, accountable unit, due date, planned likelihood/impact reductions and explanation. The AI suggestion fills editable fields. Planned effects do not lower the current assessment automatically.
6. **Save & finish risk review** atomically saves source decisions, the score, reasoning and mitigation to the participant's database record. Pending alerts clear for that risk only. Other risks linked to the same source still require their own review. Closing an unsaved review does not consume alerts.

## Evidence pack

- Two real ANTARA news articles replay the April 2025 US tariff announcement and Indonesian policy response. They concern the same event and are not independent evidence of a company loss or current tariff rates.
- One simulated internal report and one simulated audit report per organisation are served as static, five-page PDFs in `website/assets/documents/`. They contain executive summaries, scope and limitations, evidence tables, detailed observations, management response and traceability appendices. They contain fictional teaching data.
- To regenerate the four PDFs, install Python `reportlab` and `pypdf`, then run `python app/scripts/build-cra-reports.py`. The generator checks that each report has five pages. Outputs are copied to `output/pdf/` for review and the website assets directory for publishing.

## Compatibility and deployment

Existing CRA states remain valid. Releasing materialises missing pack sources idempotently and preserves existing per-risk decisions. The previous finance new-risk endpoint remains supported for older clients, although the new single-page interface uses the three registered risks. A global seminar reset clears the release and participant decisions for a fresh run; it is not required for a routine deployment.

No database schema migration or connection-string change is required: CRA uses the existing participant JSON state and shared session release. Deploy the latest API to Render before publishing the frontend through the **Publish SIGNAL app and deck** GitHub Actions workflow on `main`. Backend changes are required for topic-independent access, risk-owner assessment and mitigation fields.

## Speaker slide

Slide 3 displays each speaker's short credentials and three selected-experience items transcribed from page 2 of the user-provided `AI-in-Audit-and-Beyond-RSM-Bahan-Papar.pdf`. The supplied PDF is a content reference; existing web-deck branding is retained.
