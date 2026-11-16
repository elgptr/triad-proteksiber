# Connected agentic audit exercise

Local revision. The active RSM audit-suite entry now opens one connected journey rather than separate AMS and risk exercises. Existing legacy components and browser records are preserved. New decisions use a separate `connected-v1` browser-storage key.

## Participant flow

1. Choose the exporter or SME lender. Each has one objective, five registered risks, owners, initial scores and tolerances.
2. Review the annual audit proposal: weighted risk exposure, business change, coverage gap, strategic importance and audit-day capacity. Mandatory information-protection work remains included. Select the engagement theme and document the planning rationale and scope.
3. Establish criteria in the same planning stage. Review proposed requirements, edit or remove them, and add custom criteria with a reference. Every retained criterion requires explicit approval. Changing a criterion clears its approval.
4. Assign the auditor, inspect the scenario evidence pack and develop a bounded finding. Validate evidence, limitations and management response. Missing approval references do not establish that approval never occurred.
5. Review the full reporting pack. Return it for revision or authorise release. Release creates an audit signal linked to the same organisation's selected risk.
6. Add internal minutes and historical ANTARA news. Both provide proposed links to the same register; each link can be accepted or declined independently.
7. For each affected risk, decide all signals, review or customise the proposed score, explain the decision and approve a mitigation if above tolerance. Current exposure and target residual remain separate.
8. Review updated ranking using the reassessed risk evidence. A changed priority does not automatically authorise another engagement.

## Implementation boundaries

- Prepared rules and scenario evidence, not live model output or client records.
- Ranking weights are a transparent example, not an audit standard or probability estimate.
- Browser-local persistence, not cross-device backend persistence. This revision does not change the production database, Atlas, or the previous CRA presenter-release API.
- Historical news is explicitly dated; the exercise does not assert that the tariff is current or that a company incurred a loss.
- Mitigation effectiveness verification is a subsequent real-world responsibility; the exercise records planned effects without treating them as achieved reductions.

## Validation

Automated domain and React interaction checks cover both organisations, five-risk setup, planning prerequisites, criterion approval/customisation, evidence validation, report-to-risk linkage, audit/memo/news intake, relevance decisions and above-tolerance response. The accepted-signal example moves exposure from 12 to 16 with a planned target of 12. Source decline preserves the existing assessment. Build and deck regression checks must also pass.
