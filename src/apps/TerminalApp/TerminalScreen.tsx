import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useOS } from '../../context/OSContext';
import { DEVELOPER_PROFILE, PROJECTS, SKILLS_LIST } from '../../data/portfolioData';
import { OSMode, TerminalEntry, ThemeMode } from '../../types';

export const TerminalScreen: React.FC = () => {
  const { osMode, setOSMode, theme, setTheme, closeApp, batteryLevel } = useOS();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      content:
        '┌────────────────────────────────────────────────────────────┐\n' +
        '│ ZakOS Cybersecurity & Systems Lab Terminal v2.4.0-hardened │\n' +
        '│ Type "help" to inspect commands or tap quick pills below.  │\n' +
        '└────────────────────────────────────────────────────────────┘',
      timestamp: '00:00:00',
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const scrollRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const quickCommands = [
    'help',
    'whoami',
    'tools',
    'skills',
    'projects',
    'neofetch',
    'contact',
    'clear',
  ];

  // Auto-scroll on new entries
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const now = new Date().toLocaleTimeString();

    // 1. Add user command entry
    const userEntry: TerminalEntry = {
      id: `${Date.now()}-user`,
      type: 'command',
      content: `visitor@zak-portfolio:~$ ${raw}`,
      timestamp: now,
    };

    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    // 2. Compute command output
    let outputContent = '';
    let entryType: 'output' | 'error' | 'system' = 'output';

    switch (cmd) {
      case 'help':
        outputContent =
          'Available Shell Commands:\n\n' +
          '  whoami          Display security profile, certifications & background\n' +
          '  tools           Inspect offensive security, reverse eng & dev tools\n' +
          '  skills          View categorized competencies & proficiency metrics\n' +
          '  projects        List verified production systems & CTF research labs\n' +
          '  neofetch        Display system architecture, kernel info & ASCII logo\n' +
          '  os [mode]       Switch OS frame directly (ios | android | desktop)\n' +
          '  theme [mode]    Switch color theme (dark | light | cyberpunk)\n' +
          '  contact         Display direct contact endpoints & PGP key\n' +
          '  clear           Clear terminal screen buffer\n' +
          '  exit            Close terminal and return to Home Screen';
        break;

      case 'whoami':
        outputContent =
          `Identity: ${DEVELOPER_PROFILE.name} (${DEVELOPER_PROFILE.handle})\n` +
          `Role: ${DEVELOPER_PROFILE.role}\n` +
          `Location: ${DEVELOPER_PROFILE.location}\n` +
          `Status: ${DEVELOPER_PROFILE.status}\n\n` +
          `Overview: ${DEVELOPER_PROFILE.bio}\n` +
          `Certifications in progress: eJPT, OSCP, AWS Certified Security Specialist`;
        break;

      case 'tools':
        outputContent =
          '[+] OFFENSIVE CYBERSECURITY & REVERSE ENGINEERING:\n' +
          '    • Recon & Scanning: Nmap, Masscan, Wireshark, Scapy, Tcpdump\n' +
          '    • Web Security: Burp Suite Pro, OWASP ZAP, SQLmap, Postman\n' +
          '    • Exploit & Post-Exploitation: Metasploit, Impacket, BloodHound, Chisel\n' +
          '    • Reverse Engineering & Binaries: Ghidra, x64dbg, Volatility 3, GDB-Peda\n\n' +
          '[+] SYSTEMS, CLOUD & SOFTWARE ENGINEERING:\n' +
          '    • Operating Systems: Kali Linux, Arch Linux, Debian, Alpine Linux\n' +
          '    • Containerization & Orchestration: Docker, Docker Compose, Kubernetes, Helm\n' +
          '    • Cloud & IaC: AWS (Lambda, KMS, S3, EventBridge), GCP, Terraform\n' +
          '    • Persistence & Messaging: PostgreSQL, ClickHouse, Redis, Apache Kafka';
        break;

      case 'skills':
        outputContent =
          '[+] TECHNICAL SKILLS & PROFICIENCIES:\n\n' +
          SKILLS_LIST.map((s) => {
            const barLength = Math.round(s.level / 10);
            const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
            return `    ${s.name.padEnd(38, ' ')} [${bar}] ${s.level}%`;
          }).join('\n');
        break;

      case 'projects':
        outputContent =
          '[+] FEATURED PRODUCTION PROJECTS & SECURITY LABS:\n\n' +
          PROJECTS.map(
            (p, idx) =>
              `  ${(idx + 1).toString().padStart(2, '0')}. [${p.category.toUpperCase()}] ${p.title}\n` +
              `      Badge: ${p.badge} | Complexity: ${p.complexity} | Stars: ★ ${p.stars}\n` +
              `      Stack: ${p.techStack.join(', ')}\n`
          ).join('\n') +
          '\n[*] Hint: Open the Projects App on the Home Screen to inspect interactive 3D cards & architecture deep-dives.';
        break;

      case 'neofetch':
        outputContent =
          '     . .....:-=*%@#.      visitor@zak-portfolio\n' +
          '     -===-+#@%+-:         ---------------------\n' +
          '      =*+: .*#####*+@#    OS: ZakOS v2.4.0-hardened x86_64\n' +
          '    += :*@@= .+@######    Host: Antigravity Virtual Subsystem\n' +
          '    .#@:  :##*: -*####    Kernel: 6.8.0-kali-amd64\n' +
          '    :##*  .####@=..=%#    Uptime: 13 hours, 45 mins\n' +
          '    *##+  .#######*: .    Shell: zsh 5.9 (x86_64-pc-linux-gnu)\n' +
          '   .###*  .#########@:    Terminal: ZakTerminal 1.4 WASM\n' +
          '   %###%  .##########*    CPU: Intel Core i7-9750H (12) @ 2.59GHz\n' +
          '  =####%  .##########+    Memory: 15480MiB / 31850MiB (48%)\n' +
          ' :#####%  :##########-    Battery: ' +
          batteryLevel +
          '% [AC Connected]\n' +
          '                  Active OS Mode: ' +
          osMode.toUpperCase() +
          '\n' +
          '                  Active Theme: ' +
          theme.toUpperCase();
        break;

      case 'os':
        if (!args[0]) {
          outputContent =
            `Current OS mode: ${osMode.toUpperCase()}\n` +
            'Usage: os <ios | android | desktop>\n' +
            'Example: os android';
        } else {
          const targetOS = args[0].toLowerCase() as OSMode;
          if (['ios', 'android', 'desktop'].includes(targetOS)) {
            setOSMode(targetOS);
            outputContent = `[✓] Successfully re-skinned device framework to: ${targetOS.toUpperCase()}`;
          } else {
            outputContent = `[!] Unknown OS mode: "${args[0]}". Choose from: ios, android, desktop`;
            entryType = 'error';
          }
        }
        break;

      case 'theme':
        if (!args[0]) {
          outputContent =
            `Current theme: ${theme.toUpperCase()}\n` +
            'Usage: theme <dark | light | cyberpunk>\n' +
            'Example: theme cyberpunk';
        } else {
          const targetTheme = args[0].toLowerCase() as ThemeMode;
          if (['dark', 'light', 'cyberpunk'].includes(targetTheme)) {
            setTheme(targetTheme);
            outputContent = `[✓] Applied color theme: ${targetTheme.toUpperCase()}`;
          } else {
            outputContent = `[!] Unknown theme: "${args[0]}". Choose from: dark, light, cyberpunk`;
            entryType = 'error';
          }
        }
        break;

      case 'contact':
        outputContent =
          `Email: ${DEVELOPER_PROFILE.email}\n` +
          `GitHub: ${DEVELOPER_PROFILE.github}\n` +
          `LinkedIn: ${DEVELOPER_PROFILE.linkedin}\n` +
          `PGP Fingerprint: 4A7B 890F 1234 CDEF 5678 9ABC DEF0 1234 5678 9ABC\n` +
          `Status: Open to high-impact software & cybersecurity opportunities`;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        closeApp();
        return;

      default:
        outputContent = `bash: command not found: ${cmd}. Type "help" to view supported commands.`;
        entryType = 'error';
        break;
    }

    const resEntry: TerminalEntry = {
      id: `${Date.now()}-res`,
      type: entryType,
      content: outputContent,
      timestamp: now,
    };

    setHistory((prev) => [...prev, userEntry, resEntry]);
    setInputVal('');
  };

  return (
    <View style={styles.container}>
      {/* 1. Terminal Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftInfo}>
          <View style={styles.terminalIndicator} />
          <Text style={styles.terminalTitle}>bash — 80x24 (zak-terminal)</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Exit terminal"
          onPress={() => closeApp()}
          style={({ pressed }) => [
            styles.exitBtn,
            pressed && styles.exitBtnPressed,
          ]}
        >
          <Text style={styles.exitGlyph}>✕</Text>
        </Pressable>
      </View>

      {/* 2. Output Scroll View */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={true}
        style={styles.terminalOutputArea}
        contentContainerStyle={styles.terminalOutputContent}
      >
        {history.map((entry) => (
          <View key={entry.id} style={styles.entryRow}>
            <Text
              style={[
                styles.terminalText,
                entry.type === 'command' && styles.commandText,
                entry.type === 'error' && styles.errorText,
                entry.type === 'system' && styles.systemText,
              ]}
            >
              {entry.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 3. Mobile Quick-Command Bar */}
      <View style={styles.quickBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickBarContent}
        >
          {quickCommands.map((qCmd) => (
            <Pressable
              key={qCmd}
              accessibilityRole="button"
              accessibilityLabel={`Run ${qCmd}`}
              onPress={() => executeCommand(qCmd)}
              style={({ pressed }) => [
                styles.quickPill,
                pressed && styles.quickPillPressed,
              ]}
            >
              <Text style={styles.quickPillText}>{qCmd}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 4. Active Command Input Line */}
      <View style={styles.inputLine}>
        <Text style={styles.promptLabel}>visitor@zak-portfolio:~$</Text>
        <TextInput
          ref={inputRef}
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={() => executeCommand(inputVal)}
          placeholder="type command..."
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.commandInput}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Execute command"
          onPress={() => executeCommand(inputVal)}
          style={({ pressed }) => [
            styles.sendCmdBtn,
            pressed && styles.sendCmdBtnPressed,
          ]}
        >
          <Text style={styles.sendCmdText}>↵</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    userSelect: 'none',
  },
  topBar: {
    height: 40,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  terminalIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  terminalTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  exitBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  exitGlyph: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  terminalOutputArea: {
    flex: 1,
    backgroundColor: '#070B12',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  terminalOutputContent: {
    paddingBottom: 16,
  },
  entryRow: {
    marginBottom: 8,
  },
  terminalText: {
    color: '#38BDF8',
    fontSize: 11.5,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  commandText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
  },
  systemText: {
    color: '#A855F7',
    fontWeight: '600',
  },

  /* Quick Bar */
  quickBar: {
    height: 42,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
  },
  quickBarContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  quickPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  quickPillPressed: {
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
  },
  quickPillText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },

  /* Input Line */
  inputLine: {
    minHeight: 46,
    backgroundColor: '#0A0E17',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  promptLabel: {
    color: '#10B981',
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  commandInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    height: 38,
    outlineStyle: 'none',
  },
  sendCmdBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCmdBtnPressed: {
    opacity: 0.7,
  },
  sendCmdText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
