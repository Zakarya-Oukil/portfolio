# Recruitment funnel implementation

The Kali top panel, desktop dock, Ctrl/Cmd+K shortcut and NetHunter home open the Recruiter Fast-Pass drawer. The previous three-window briefing remains available inside the drawer and from its existing HUD entry.

## Recruiter flow

- Three role profiles switch the certification strip, four competencies, evidence destination and CV download.
- `src/os/RecruiterFastPassDrawer.tsx` uses a native modal dialog, restores focus, supports Escape and keeps the background inert.
- `src/os/recruitment-data.ts` supplies typed defaults. The same configuration is seeded in `server/data.json` and `src/data/seed.json`.
- Admin → Recruiter Fast-Pass edits screening details, role copy, credentials, competencies, CV URLs and the public PGP-key URL.
- Admin → Appearance → Recruiter brief & contact edits the scheduling URL and email address. A valid HTTP(S) scheduling URL opens the external scheduler. Without one, the form proposes a 15-minute screen through the existing `/api/mail` inbox. It does not claim a confirmed reservation.
- Without an email address, priority inquiries use that same inbox. With an address, the action launches a role-specific email. Publishing a public key enables the encryption-related label and instructions; encryption must still be enabled in the sender's mail client. The form does not implement end-to-end encryption.
- Candidate-provided authorization, availability and clearance wording is editable. Clearance eligibility is distinguished from an issued clearance. BTL1 and Security+ remain in progress, matching the existing CMS.

The files in `public/resumes/` are three one-page CVs based on existing portfolio evidence. They contain no invented employment history, contact address or graduation date. Replace them with fuller approved CVs when available. `scripts/build-role-cvs.py` rebuilds the initial variants with ReportLab. Editing CMS competencies does not automatically regenerate static PDF files.

## Executive and engineering reports

`src/os/ReportAudience.tsx` provides the common audience control and content panels. Both `PentestReportItem` and `SocDetectionRule` have optional, typed `executiveBriefing` and `technicalBriefing` properties, retaining compatibility with older records.

Executive content covers financial exposure, regulatory applicability, downtime, mitigation ROI and assumptions. Seeded content is qualitative: no invented financial losses, penalties, recovery durations or production returns are presented as measured facts. Technical content includes mappings, commands, patches and validation notes alongside the existing exploit chains, remediation, rule syntax and log samples.

`src/admin/RecruitmentEditors.tsx` and `CyberAppsAdmin.tsx` edit both views. Pentest phases and remediation lists are also editable. The API validates the new shapes and URLs before publishing. `useCyberHeader.ts` measures wrapped headers so sticky evidence sidebars remain below them.

## Incident replay

`src/os/IncidentReplayApp.tsx` is registered as `incident-replay` in the window manager, Applications menu, search and NetHunter tools. The drawer also links directly to it.

Three stages show attack traces, defensive telemetry, sample syntax and packet/event flows. Previous, next, stage markers, play/pause and replay controls are supported. Automatic playback advances every 6.5 seconds and stops after the final stage; background/minimized app playback pauses. There is no autoplay on launch and no execution of displayed commands.

The scenario separates AS-REP from TGS exchanges, WMI process creation from subsequent LSASS access, and Linux LSM denial from userspace process termination. The Windows-to-Linux pivot is explicit. The requested `< 0.12 µs` value is displayed as an unmeasured research target, not a containment benchmark.

Technical references: [MITRE AS-REP roasting](https://attack.mitre.org/techniques/T1558/004/), [Microsoft Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon), [Linux BPF LSM](https://docs.kernel.org/bpf/prog_lsm.html), [Suricata Kerberos keywords](https://docs.suricata.io/en/latest/rules/kerberos-keywords.html).

## Verification

- `npm test`: all original 17 tests plus 3 new integration tests pass (20 total). Added coverage checks malformed shapes and links, backward compatibility, authenticated publishing round trips and interview-request delivery to the protected inbox.
- `npm run build`: strict TypeScript and production bundling pass with zero errors or warnings. Strict mode is now enabled. Existing Pressable declarations and a timer received type fixes. Vendor splitting removes the oversized-bundle warning.
- Browser: role changes, targeted CV links, opening the request form, both report audience views, replay stage navigation and playback/automatic stop, modal focus/Escape restoration, narrow drawer/replay layout, desktop sticky header/sidebar clearance and zero-window reload were exercised.
- Three PDF responses returned HTTP 200 and `application/pdf`; all three were parsed and visually reviewed as one-page documents.
- The two persistence files have matching recruitment, pentest and SOC data.
- Screen-reader, cross-browser and live Sigma/Suricata/eBPF execution were not tested. Browser evidence is from the Codex in-app browser. New inquiry delivery tests use isolated temporary API fixtures, not a real recruiter or external calendar.
