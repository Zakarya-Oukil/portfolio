import type { RecruiterFastPassConfig, IncidentReplayStage } from './state';

export const DEFAULT_FAST_PASS: RecruiterFastPassConfig = {
  workAuthorization: '',
  availability: 'Immediate / 2 Weeks.',
  workPreference: 'Remote / Hybrid / Relocation Friendly.',
  clearance: '',
  publicKeyUrl: '',
  roles: [
    { id: 'pentest', label: '⚔️ Offensive / Penetration Tester', summary: 'Trace the attack path. Explain the exposure. Verify the fix.', certifications: ['eJPTv2 track · eJPT certified'], competencies: ['Active Directory & Kerberos assessment', 'Web / API authentication testing', 'Exploit chaining & CVSS assessment', 'Remediation validation & reporting'], resumeUrl: '', resumeFilename: 'Zakarya_Oukil_Pentest_CV.pdf', evidenceApp: 'pentest-reports' },
    { id: 'soc', label: '🛡️ SOC Analyst / Threat Hunter', summary: 'Connect endpoint evidence to detection logic and a defensible response.', certifications: ['BTL1 · In progress'], competencies: ['Sigma, Suricata & YARA engineering', 'SIEM triage & MITRE ATT&CK mapping', 'Memory forensics & incident response', 'Threat hunting & containment playbooks'], resumeUrl: '', resumeFilename: 'Zakarya_Oukil_SOC_CV.pdf', evidenceApp: 'soc-hunting' },
    { id: 'systems', label: '⚙️ Security Systems & eBPF Engineer', summary: 'Translate security policy into observable Linux runtime controls.', certifications: ['CompTIA Security+ · In progress', "Master’s · Candidate"], competencies: ['Linux kernel & eBPF LSM research', 'Zero-trust runtime architecture', 'C / C++ & Python systems tooling', 'Adversarial ML & sandbox benchmarking'], resumeUrl: '', resumeFilename: 'Zakarya_Oukil_Systems_CV.pdf', evidenceApp: 'masters-research' }
  ]
};

export const REPLAY_STAGES: IncidentReplayStage[] = [
  {
    id: 'kerberos', title: 'Recon & Kerberos roasting', mitre: 'T1558.004 / T1558.003',
    summary: 'An isolated AD lab exposes a preauthentication exception. Follow-on service-ticket activity triggers network triage. AS-REP and TGS are separate exchanges.',
    redLog: '[00:00.000] LAB / 10.10.14.22\n[00:00.080] svc_legacy: preauthentication disabled\n[00:00.130] AS-REP sample collected (redacted)\n[00:02.500] Follow-on TGS request burst to DC01',
    blueLog: '[00:00.140] Security 4768: PreAuthType=0\n[00:02.510] Suricata: TGS burst threshold reached\n[00:02.560] Correlate Security 4769 and account baseline\n[00:02.600] Analyst verdict: investigate; not proof alone',
    exploitSyntax: '# Authorized lab only; prompts for a lab credential where needed\nimpacket-GetNPUsers LAB.EXAMPLE/svc_legacy -no-pass -dc-ip 10.10.10.5\nimpacket-GetUserSPNs LAB.EXAMPLE/analyst -request -dc-ip 10.10.10.5',
    detectionRule: 'alert krb5 $HOME_NET any -> $HOME_NET 88 (msg:"LAB Kerberos TGS request burst"; krb5_msg_type:12; threshold:type both, track by_src, count 10, seconds 60; sid:1000001; rev:1;)\n\n# Message type 12 = TGS-REQ, not AS-REP.\n# Correlate with 4768 PreAuthType=0 for the AS-REP stage.\n# Tune against legitimate service-account traffic before deployment.',
    packetFlow: [{ source: '10.10.14.22', destination: 'DC01 · 10.10.10.5:88', protocol: 'Kerberos AS', observation: 'AS-REQ → AS-REP; preauthentication exception' }, { source: '10.10.14.22', destination: 'DC01 · 10.10.10.5:88', protocol: 'Kerberos TGS', observation: '10 TGS requests / 60 seconds; synthetic threshold' }],
    outcome: 'Restore preauthentication, rotate exposed service credentials and evaluate gMSA adoption.',
    sourceUrl: 'https://attack.mitre.org/techniques/T1558/004/'
  },
  {
    id: 'wmi', title: 'WMI lateral movement', mitre: 'T1047 / T1003.001',
    summary: 'A compromised lab identity launches a remote process through WMI. Process creation proves execution; a separate process-access event signals attempted credential access.',
    redLog: '[00:08.000] LAB / authenticated WMI session to WIN-02\n[00:08.160] WmiPrvSE.exe → cmd.exe /c whoami\n[00:09.400] Simulated process attempts LSASS access',
    blueLog: '[00:08.170] Sysmon 1: ParentImage=WmiPrvSE.exe\n[00:08.210] Sigma: unexpected WMI child process\n[00:09.410] Sysmon 10: TargetImage=lsass.exe\n[00:09.450] Correlate account, host and ProcessGuid',
    exploitSyntax: '# Authorized lab only; password is prompted\nimpacket-wmiexec LAB.EXAMPLE/analyst@10.10.10.12 "whoami"\n# Credential-access telemetry below is a simulated fixture.',
    detectionRule: "title: Lab WMI Child Process\nstatus: experimental\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  selection:\n    ParentImage|endswith: '\\WmiPrvSE.exe'\n    Image|endswith: '\\cmd.exe'\n  condition: selection\nfalsepositives:\n  - Approved remote administration\nlevel: high\ntags:\n  - attack.execution\n  - attack.t1047\n\n# Sysmon Event 10 is separate ProcessAccess telemetry.\n# Correlate LSASS access with the process tree; it does not identify WMI alone.",
    packetFlow: [{ source: '10.10.14.22', destination: 'WIN-02 · 10.10.10.12:135', protocol: 'RPC / DCOM', observation: 'WMI remote invocation; subsequent dynamic RPC ports' }, { source: 'WIN-02', destination: 'SIEM · 10.10.10.30:6514', protocol: 'TLS log forwarding', observation: 'Synthetic Sysmon 1 + Sysmon 10 correlation' }],
    outcome: 'Contain the affected endpoint, restrict remote administration and investigate the compromised identity.',
    sourceUrl: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon'
  },
  {
    id: 'kernel', title: 'Privilege attempt → kernel containment', mitre: 'T1078 / T1548',
    summary: 'Scenario transition: a reused lab credential reaches a Linux workload from WIN-02. An already-loaded eBPF LSM policy denies a restricted process’s privilege transition; a userspace responder terminates it.',
    redLog: '[00:16.000] LAB / WIN-02 → Linux workload via SSH\n[00:17.000] restricted PID 4820 requests setuid(0)\n[00:17.001] setuid: EPERM\n[00:17.100] Session terminated by response agent',
    blueLog: '[00:17.000] LSM task_fix_setuid: restricted cgroup\n[00:17.001] Return -EPERM; privilege change denied\n[00:17.010] Responder receives policy event\n[00:17.100] Userspace terminates PID 4820\n[TARGET] < 0.12 µs hook overhead — unmeasured\n[NOTE] Timeline is illustrative, not a benchmark',
    exploitSyntax: '# Illustrative lab harness, not an exploit\n# Run inside the restricted test cgroup:\n./setuid_probe --uid 0\n# Expected: Operation not permitted',
    detectionRule: '/* Illustrative eBPF LSM fragment; not a standalone program.\n * Requires CO-RE types, helpers, policy map, loader and tests.\n * Denies the operation; process termination is userspace work. */\nSEC("lsm/task_fix_setuid")\nint BPF_PROG(guard_setuid, struct cred *new,\n             const struct cred *old, int flags, int ret)\n{\n    if (ret) return ret;\n    __u64 cgroup = bpf_get_current_cgroup_id();\n    if (bpf_map_lookup_elem(&restricted_cgroups, &cgroup)\n        && new->euid.val == 0 && old->euid.val != 0)\n        return -EPERM;\n    return 0;\n}',
    packetFlow: [{ source: 'WIN-02 · 10.10.10.12', destination: 'LINUX-01 · 10.10.10.20:22', protocol: 'SSH', observation: 'Lab credential reuse; explicit Windows → Linux pivot' }, { source: 'PID 4820 · restricted cgroup', destination: 'Linux LSM → response agent', protocol: 'Local kernel event', observation: 'Not a packet: deny privilege transition, then terminate' }],
    outcome: 'Privilege change denied; isolate workload, revoke the reused credential and preserve evidence. The < 0.12 µs value is a research target, not end-to-end containment time.',
    sourceUrl: 'https://docs.kernel.org/bpf/prog_lsm.html'
  }
];
