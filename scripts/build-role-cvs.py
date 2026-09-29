"""Generate role-focused CVs from published portfolio content, without invented employment history."""
import json
from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'src/data/seed.json').read_text(encoding='utf-8'))['config']
out = ROOT / 'public/resumes'
out.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='NameLine', fontName='Helvetica-Bold', fontSize=27, leading=33, textColor=colors.HexColor('#0b0f19'), spaceAfter=5))
styles.add(ParagraphStyle(name='RoleLine', fontName='Helvetica', fontSize=13, leading=19, textColor=colors.HexColor('#0369a1'), spaceAfter=12))
styles.add(ParagraphStyle(name='CVBody', fontName='Helvetica', fontSize=10, leading=15, textColor=colors.HexColor('#243247'), spaceAfter=8))
styles.add(ParagraphStyle(name='CVSection', fontName='Helvetica-Bold', fontSize=10, leading=15, textColor=colors.HexColor('#0369a1'), spaceBefore=17, spaceAfter=8))
styles.add(ParagraphStyle(name='CVSmall', fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor('#526176'), spaceAfter=8))

def text(value):
    return escape(value.replace('’', "'").replace('–', '-').replace('—', '-').replace('·', ' / '))

evidence = {
    'pentest': [
        ('Active Directory assessment', 'Portfolio case study covering Kerberos service-account exposure, privilege paths and remediation through encryption policy, gMSA adoption and domain tiering.'),
        ('API authentication assessment', 'Portfolio case study of JWT algorithm confusion and cross-tenant authorization, with explicit verification policies and remediation guidance.')
    ],
    'soc': [
        ('Detection engineering library', 'Sigma process-access detections, Suricata network rules and YARA artifact matching, with sample telemetry and MITRE ATT&CK mappings.'),
        ('Incident response demonstration', 'Interactive lab replay correlates Kerberos activity, WMI execution and process access before a Linux workload containment scenario.')
    ],
    'systems': [
        ('Kernel security research', 'Research focus on eBPF LSM sandboxing and observable security controls for Linux workloads in zero-trust runtimes.'),
        ('Adversarial ML & systems evaluation', 'Portfolio research examines evasion against intrusion detection and compares sandbox approaches. Replay timing is illustrative, not a production benchmark.')
    ]
}
tools = {
    'pentest': 'Burp Suite / Nmap / BloodHound / Impacket / Hashcat / Ghidra / Python',
    'soc': 'Sigma / Suricata / YARA / Wireshark / Splunk / Elastic Security / Volatility',
    'systems': 'C / C++ / Python / Linux / eBPF / Docker / Kubernetes / Git'
}
titles = {'pentest': 'Offensive Security / Penetration Testing', 'soc': 'SOC Analysis / Threat Hunting', 'systems': 'Security Systems / eBPF Engineering'}

for role in data['recruiterFastPass']['roles']:
    target = out / role['resumeFilename']
    doc = SimpleDocTemplate(str(target), pagesize=A4, rightMargin=46, leftMargin=46, topMargin=40, bottomMargin=44, title=f"Zakarya Oukil - {titles[role['id']]}", author='Zakarya Oukil')
    story = [Paragraph('ZAKARYA OUKIL', styles['NameLine']), Paragraph(text(titles[role['id']]), styles['RoleLine']), Paragraph(text(data['widgets']['about']['location']) + ' | Available for hire', styles['CVSmall']), HRFlowable(width='100%', thickness=2, color=colors.HexColor('#0ea5e9')), Spacer(1, 14), Paragraph(text(role['summary']), styles['CVBody'])]
    story.append(Paragraph('CORE COMPETENCIES', styles['CVSection']))
    for skill in role['competencies']:
        story.append(Paragraph('- ' + text(skill), styles['CVBody']))
    story.append(Paragraph('SELECTED PORTFOLIO EVIDENCE', styles['CVSection']))
    for title, body in evidence[role['id']]:
        story.append(KeepTogether([Paragraph('<b>' + text(title) + '</b>', styles['CVBody']), Paragraph(text(body), styles['CVBody'])]))
    story.append(Paragraph('EDUCATION & CREDENTIALS', styles['CVSection']))
    story.append(Paragraph("Master's degree candidate - Cybersecurity &amp; Systems Architecture", styles['CVBody']))
    story.append(Paragraph('eJPT - Certified / INE Security<br/>BTL1 - In progress / Security Blue Team<br/>CompTIA Security+ - In progress', styles['CVBody']))
    story.append(Paragraph('TOOLS & ENGINEERING', styles['CVSection']))
    story.append(Paragraph(text(tools[role['id']]), styles['CVBody']))
    story.append(Paragraph('CONTACT & AVAILABILITY', styles['CVSection']))
    story.append(Paragraph('Remote / Hybrid / Open to relocation<br/>Immediate / 2 weeks - confirm during screening<br/>Contact through the portfolio Recruiter Fast-Pass inquiry form.', styles['CVBody']))
    def footer(canvas, doc):
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.HexColor('#526176'))
        canvas.drawString(46, 25, 'Role-focused CV | Portfolio evidence and candidate-provided profile | September 2026')
        canvas.drawRightString(A4[0] - 46, 25, str(doc.page))
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(target.name)
