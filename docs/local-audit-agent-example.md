# Local audit-agent teaching example

Two slides follow `aib-daily-tasks` (original slide 19): local workspace setup, then an animated document flow. The credit-limit example is fictional. The editor and folder views are authored mockups, not screenshots of a deployed product. No files or model requests run from these slides. Animation supports pause/replay and reduced-motion preferences.

## Demonstration script

Open an approved engagement folder in the chosen agent. Register `skills/credit-review/SKILL.md` according to that product's skill-discovery mechanism. Attach approved templates and grant file permissions explicitly: read evidence; write drafts; require a human for release. Local files do not imply local model inference or authorisation to process confidential material.

Example task: review 40 credit-limit changes. Read E01 policy, E02 register and E03 approvals. Produce a draft working paper and an exception register with criterion, evidence reference, observation, limitation, clarification request and reviewer status. Never edit source evidence or infer fraud from a missing document.

The illustrated exception references E01 section 4.2 and E02 row 18, with no matching approval in the supplied E03 pack. The draft asks for clarification. A reviewer checks the sources and conclusion before a human moves the approved version to output/reviewed/. These are illustrative observations, not actual client results.

## What each resource contributes

* audit-rules.md: engagement scope, permitted actions, evidence rules and stop conditions.
* SKILL.md: reusable review procedure, activation description and references to permitted tools/resources.
* templates/: approved output structure, not evidence or policy authority.
* evidence/: read-only originals with stable source identifiers.
* scripts/reconcile.py: an explicitly permitted deterministic reconciliation tool; not supplied or executed by the deck.
* output/drafts/: tentative files requiring review.
* output/reviewed/: human-approved versions; a folder name alone does not enforce this gate.

Sources: https://agentskills.io/specification and https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/

Deploy both Render and Pages. The runtime topic-library adapter inserts missing example slides after the existing daily-tasks anchor, preserves other edits and does not duplicate slides on repeated reads. No database schema migration is required.


## Cinematic revision

Setup now explains three concepts separately: a skill is the repeatable procedure, a template specifies output fields, and the workspace defines permitted source material. Permission and processing-location tips appear below those cards.

The workflow is a 58-second, 11-scene simulated desktop: prompt typing, skill loading, template inspection, policy reading, register inspection, approval matching, a permitted reconciliation script, exception review, a five-section draft working paper, a six-row exception register and a human review gate. Folder/file icons and active-file highlights connect every step to the workspace. Draft sections and spreadsheet rows appear progressively. Outputs are illustrative, not measured client results or real files.

Playback supports Play/Pause, Replay, next scene, timeline scrubbing and 0.5x/1x/1.5x/2x speed. It plays once and stops at review. Time freezes when the slide is off-screen or browser is hidden. Reduced-motion users start paused and can advance scenes manually. The scene localizes its own EN/ID text, so typewriter changes are excluded from the full-deck translation observer. No network, database or agent/model requests run during playback.

This revision changes frontend assets only. Deploy GitHub Pages; no Render or database change is needed if the two example slide identities are already present from the previous release.
