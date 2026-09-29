/** Fixtures for the lab sheets. Every target and address here is fictional (documentation ranges or .lab names). */

export interface ChainStage {
  id: string; title: string; mitre: string; summary: string;
  red: string[]; blue: string[]; command: string; rule: string;
  packets: { source: string; destination: string; protocol: string; observation: string }[];
  outcome: string; sourceUrl: string;
}

export const CHAIN_STAGES: ChainStage[] = [
  {
    id: 'kerberos', title: 'Recon and Kerberos roasting', mitre: 'T1558.004 / T1558.003',
    summary: 'An isolated AD lab exposes a preauthentication exception. Follow-on service-ticket activity triggers network triage. AS-REP and TGS are separate exchanges.',
    red: ['[00:00.000] LAB / 10.10.14.22', '[00:00.080] svc_legacy: preauthentication disabled', '[00:00.130] AS-REP sample collected (redacted)', '[00:02.500] Follow-on TGS request burst to DC01'],
    blue: ['[00:00.140] Security 4768: PreAuthType=0', '[00:02.510] Suricata: TGS burst threshold reached', '[00:02.560] Correlate Security 4769 and account baseline', '[00:02.600] Analyst verdict: investigate; not proof alone'],
    command: '# Authorized lab only; prompts for a lab credential where needed\nimpacket-GetNPUsers LAB.EXAMPLE/svc_legacy -no-pass -dc-ip 10.10.10.5\nimpacket-GetUserSPNs LAB.EXAMPLE/analyst -request -dc-ip 10.10.10.5',
    rule: 'alert krb5 $HOME_NET any -> $HOME_NET 88 (msg:"LAB Kerberos TGS request burst"; krb5_msg_type:12; threshold:type both, track by_src, count 10, seconds 60; sid:1000001; rev:1;)\n\n# Message type 12 = TGS-REQ, not AS-REP.\n# Correlate with 4768 PreAuthType=0 for the AS-REP stage.\n# Tune against legitimate service-account traffic before deployment.',
    packets: [
      { source: '10.10.14.22', destination: 'DC01 · 10.10.10.5:88', protocol: 'Kerberos AS', observation: 'AS-REQ → AS-REP; preauthentication exception' },
      { source: '10.10.14.22', destination: 'DC01 · 10.10.10.5:88', protocol: 'Kerberos TGS', observation: '10 TGS requests / 60 seconds; synthetic threshold' }
    ],
    outcome: 'Restore preauthentication, rotate exposed service credentials and evaluate gMSA adoption.',
    sourceUrl: 'https://attack.mitre.org/techniques/T1558/004/'
  },
  {
    id: 'wmi', title: 'WMI lateral movement', mitre: 'T1047 / T1003.001',
    summary: 'A compromised lab identity launches a remote process through WMI. Process creation proves execution; a separate process-access event signals attempted credential access.',
    red: ['[00:08.000] LAB / authenticated WMI session to WIN-02', '[00:08.160] WmiPrvSE.exe → cmd.exe /c whoami', '[00:09.400] Simulated process attempts LSASS access'],
    blue: ['[00:08.170] Sysmon 1: ParentImage=WmiPrvSE.exe', '[00:08.210] Sigma: unexpected WMI child process', '[00:09.410] Sysmon 10: TargetImage=lsass.exe', '[00:09.450] Correlate account, host and ProcessGuid'],
    command: '# Authorized lab only; password is prompted\nimpacket-wmiexec LAB.EXAMPLE/analyst@10.10.10.12 "whoami"\n# Credential-access telemetry below is a simulated fixture.',
    rule: "title: Lab WMI Child Process\nstatus: experimental\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  selection:\n    ParentImage|endswith: '\\WmiPrvSE.exe'\n    Image|endswith: '\\cmd.exe'\n  condition: selection\nfalsepositives:\n  - Approved remote administration\nlevel: high\ntags:\n  - attack.execution\n  - attack.t1047\n\n# Sysmon Event 10 is separate ProcessAccess telemetry.\n# Correlate LSASS access with the process tree; it does not identify WMI alone.",
    packets: [
      { source: '10.10.14.22', destination: 'WIN-02 · 10.10.10.12:135', protocol: 'RPC / DCOM', observation: 'WMI remote invocation; subsequent dynamic RPC ports' },
      { source: 'WIN-02', destination: 'SIEM · 10.10.10.30:6514', protocol: 'TLS log forwarding', observation: 'Synthetic Sysmon 1 + Sysmon 10 correlation' }
    ],
    outcome: 'Contain the affected endpoint, restrict remote administration and investigate the compromised identity.',
    sourceUrl: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon'
  }
];

export interface Finding {
  id: string; title: string; severity: 'Medium' | 'Low'; where: string; found: string;
  evidence: string; impact: string; fix: string[]; refs: { label: string; url: string }[];
}

/** The decoy target for the Spider run. A fictional host on the documentation range 203.0.113.0/24. */
export const DECOY = 'demo.target.lab';
export interface RunStep { id: string; title: string; lines: string[]; finding?: string }
export const RUN_STEPS: RunStep[] = [
  { id: 'dns', title: 'DNS records', lines: ['A     demo.target.lab → 203.0.113.10', 'NS    ns1.demo.target.lab', 'MX    10 mail.demo.target.lab', 'TXT   "v=spf1 mx -all"'] },
  { id: 'cert', title: 'Certificate inspection', lines: ['subject   CN=demo.target.lab', 'issuer    Lab Test CA', 'valid     2026-07-01 → 2026-12-29', 'SANs      demo.target.lab, www.demo.target.lab'] },
  { id: 'ct', title: 'Subdomain discovery through certificate transparency', lines: ['found  www.demo.target.lab', 'found  api.demo.target.lab', 'found  staging.demo.target.lab   (certificate issued 2026-08-14)'], finding: 'F1' },
  { id: 'robots', title: 'robots.txt parsing', lines: ['User-agent: *', 'Disallow: /admin', 'Disallow: /backup-2026/'], finding: 'F2' },
  { id: 'headers', title: 'Security header grading', lines: ['present  X-Content-Type-Options: nosniff', 'missing  Content-Security-Policy', 'missing  Strict-Transport-Security', 'missing  Referrer-Policy', 'grade    C'], finding: 'F3' }
];
export const FINDINGS: Finding[] = [
  {
    id: 'F1', title: 'Forgotten staging subdomain with a valid certificate', severity: 'Medium', where: 'staging.demo.target.lab', found: 'Certificate transparency log',
    evidence: 'CT log entry: staging.demo.target.lab, issued 2026-08-14 by Lab Test CA.\nThe name is not linked from the public site, but it is published in the certificate log.',
    impact: 'Staging systems often run older code and weaker access controls. Anyone can list the name from public logs and probe it, so a forgotten environment becomes the easiest way in.',
    fix: ['Confirm whether the environment is still needed; decommission it if not.', 'Put staging behind authentication or a VPN, and keep it off public DNS.', 'Review certificate issuance for names that should not be public.'],
    refs: [{ label: 'OWASP Top 10: A05 Security Misconfiguration', url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/' }, { label: 'RFC 6962: Certificate Transparency', url: 'https://www.rfc-editor.org/rfc/rfc6962' }]
  },
  {
    id: 'F2', title: 'Sensitive path disclosed in robots.txt', severity: 'Low', where: 'https://demo.target.lab/robots.txt', found: 'robots.txt parsing',
    evidence: 'GET /robots.txt → 200\nDisallow: /admin\nDisallow: /backup-2026/',
    impact: 'robots.txt is public. Listing /backup-2026/ tells an attacker exactly where to look. The file keeps well-behaved crawlers out, but it does not protect anything.',
    fix: ['Remove sensitive paths from robots.txt and protect them with authentication.', 'Do not store backups under the web root.'],
    refs: [{ label: 'CWE-200: Exposure of Sensitive Information', url: 'https://cwe.mitre.org/data/definitions/200.html' }]
  },
  {
    id: 'F3', title: 'Missing browser security headers', severity: 'Low', where: 'https://demo.target.lab/', found: 'Security header grading',
    evidence: 'Response headers: X-Content-Type-Options present.\nMissing: Content-Security-Policy, Strict-Transport-Security, Referrer-Policy.',
    impact: 'Without a Content-Security-Policy, an injected script runs with the full trust of the page. Without HSTS, a first visit over HTTP can be downgraded.',
    fix: ['Add a restrictive Content-Security-Policy, starting in report-only mode.', 'Send Strict-Transport-Security once HTTPS is stable.', 'Set Referrer-Policy to strict-origin-when-cross-origin.'],
    refs: [{ label: 'OWASP Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/' }, { label: 'OWASP Top 10: A05 Security Misconfiguration', url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/' }]
  }
];

export const RULES = [
  {
    id: 'sigma-lsass', title: 'Suspicious process access to LSASS', format: 'Sigma', mitre: 'T1003.001',
    note: 'Detects access masks often used when dumping credentials from lsass.exe. Legitimate security agents also read LSASS, so the filter list needs tuning per environment.',
    syntax: "title: Suspicious LSASS Process Access\nstatus: experimental\ndescription: Detects memory access to lsass.exe with masks often used by credential dumping tools\nlogsource:\n  category: process_access\n  product: windows\ndetection:\n  selection:\n    TargetImage|endswith: '\\lsass.exe'\n    GrantedAccess|contains:\n      - '0x1010'\n      - '0x1fffff'\n  filter_legit:\n    SourceImage|endswith:\n      - '\\MsMpEng.exe'\n      - '\\csrss.exe'\n  condition: selection and not filter_legit\nfalsepositives:\n  - Antivirus and EDR agents\nlevel: high\ntags:\n  - attack.credential_access\n  - attack.t1003.001"
  },
  { id: 'suricata-tgs', title: 'Kerberos TGS request burst', format: 'Suricata', mitre: 'T1558.003', note: 'Counts service-ticket requests from one source. A burst is a reason to look, not proof of an attack.', syntax: CHAIN_STAGES[0].rule },
  { id: 'sigma-wmi', title: 'Child process of the WMI provider host', format: 'Sigma', mitre: 'T1047', note: 'Process creation from WmiPrvSE.exe. Approved remote administration will also match, so correlate with the account and host.', syntax: CHAIN_STAGES[1].rule }
];

export const HOSTS = [
  { ip: '10.10.14.1', name: 'gateway.lab', os: 'Linux', ports: [22, 53, 443] },
  { ip: '10.10.14.22', name: 'operator.lab', os: 'Kali Linux', ports: [22, 8080] },
  { ip: '10.10.14.50', name: 'dc01.lab', os: 'Windows Server 2022', ports: [88, 135, 389, 445] },
  { ip: '10.10.14.105', name: 'app01.lab', os: 'Ubuntu (Docker)', ports: [80, 443, 3000] }
];
