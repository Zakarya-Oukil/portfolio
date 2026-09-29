// Add new recruitment fields while preserving existing portfolio content.
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync('src/os/recruitment-data.ts', 'utf8');
const { DEFAULT_FAST_PASS } = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`);
const regulatory = 'GDPR: assess personal-data breach exposure. PCI DSS 4.0/4.0.1: assess cardholder-data scope and contractual consequences. NIS2: assess covered-entity status and incident-reporting duties. Applicability and any penalties require legal review; no automatic fine is assumed.';
for (const file of ['src/data/seed.json', 'server/data.json']) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.config.recruiterFastPass ??= DEFAULT_FAST_PASS;
  for (const report of data.config.pentestReports || []) {
    const ad = report.id.includes('ad-');
    report.executiveBriefing ??= {
      financialExposure: ad ? 'Domain compromise can expose business data, recovery costs and interrupted revenue. Model loss as recovery effort + interruption cost + confirmed data exposure; no client loss figures supplied.' : 'Payment-token trust failure can expose transaction integrity, investigation costs and customer remediation. Quantify affected transactions before assigning a loss estimate.',
      regulatoryImpact: regulatory,
      downtimeRisk: ad ? 'Identity recovery may interrupt dependent applications while privileged credentials rotate. Sequence recovery with the identity and service owners.' : 'Payment verification may need a controlled pause while token validation is patched and affected transactions reconciled.',
      mitigationRoi: ad ? 'Prioritize service-account hardening and tier isolation to remove the demonstrated escalation path. Compare rollout effort with identity recovery and service interruption costs.' : 'An explicit algorithm allowlist and tenant authorization checks address the demonstrated trust failure. Compare fix and regression-test effort with fraud and reconciliation exposure.',
      assumptions: 'Illustrative business-risk translation of portfolio evidence. No measured financial loss, downtime or legally determined penalty; validate assumptions with the engagement owner.'
    };
    report.technicalBriefing ??= {
      mapping: ad ? 'MITRE T1558.003 (Kerberoasting), T1558.001 (Golden Ticket). No CVE assigned: configuration and identity-control weaknesses.' : 'MITRE T1550.001 (Application Access Token). No product-specific CVE assigned; JWT validation logic must be assessed in its implementation context.',
      commands: report.exploitChain.map(s => s.codeSnippet || '').filter(Boolean).join('\n\n'),
      patches: ad ? '# Domain hardening checklist\n# Require Kerberos preauthentication; migrate service identities to gMSA.\n# Remove unnecessary GenericAll rights and legacy RC4 after compatibility testing.\n# Restrict Tier-0 sign-ins and document ticket-key rotation prerequisites.' : '# Illustrative server-side JWT validation policy\nallowed_algorithms = ["RS256"]\nrequired_claims = ["exp", "iss", "aud", "sub"]\n# Validate signature with the trusted issuer key set.\n# Reject alg=none and algorithm/key-type mismatches.\n# Enforce tenant authorization separately from signature validation.',
      validation: 'Repeat the authorized lab PoC after remediation; record expected rejection, legitimate-user regression checks and evidence timestamps. Published snippets are reference material, not executed by this portfolio.'
    };
  }
  for (const rule of data.config.socRules || []) {
    rule.executiveBriefing ??= {
      financialExposure: `Undetected ${rule.mitreTactic.toLowerCase()} can expand investigation and recovery scope. Estimate affected assets and response hours before assigning a monetary value.`,
      regulatoryImpact: regulatory,
      downtimeRisk: 'Containment may interrupt the affected endpoint or workload. Use a scoped isolation decision and confirm critical dependencies before escalation.',
      mitigationRoi: 'Correlated detection can shorten the path from telemetry to triage. Measure alert precision, analyst effort and time to containment against a documented baseline.',
      assumptions: 'Illustrative detection use case. Alert efficacy, business savings and legal exposure are not measured production outcomes.'
    };
    rule.technicalBriefing ??= {
      mapping: `MITRE ${rule.mitreTechniqueId} · ${rule.mitreTactic}. Behavior-based detection; no CVE association asserted.`,
      commands: rule.format === 'suricata' ? '# Validate a staged ruleset before rollout\nsuricata -T -c /etc/suricata/suricata.yaml -S ./lab.rules' : rule.format === 'yara' ? '# Scan an authorized fixture\nyara ./lab.yar ./fixtures/known-sample.bin' : '# Convert with your deployed SIEM backend and pipeline\nsigma check ./lab-rule.yml\n# Replay positive and benign fixtures before enabling alerts.',
      patches: 'Version the ruleset; tune known-good activity; apply scoped containment only after correlation. Preserve the original event and rollback configuration. Never treat a single heuristic as confirmed compromise.',
      validation: 'Validate against malicious and benign lab fixtures. Check field mappings, false positives and sensor versions. The displayed stream is simulated; these rules are not validated against a live SIEM.'
    };
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}
