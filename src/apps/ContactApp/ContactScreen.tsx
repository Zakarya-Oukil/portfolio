import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useOS } from '../../context/OSContext';
import { DEVELOPER_PROFILE, SKILLS_LIST } from '../../data/portfolioData';

export const ContactScreen: React.FC = () => {
  const { closeApp } = useOS();

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resumeDownloaded, setResumeDownloaded] = useState(false);

  // Skills Tab Filter State
  const [activeSkillCat, setActiveSkillCat] = useState<
    'Security' | 'Languages' | 'Systems & Cloud' | 'Web & Frameworks'
  >('Security');

  const filteredSkills = SKILLS_LIST.filter(
    (s) => s.category === activeSkillCat
  );

  const handleSendMessage = () => {
    if (!name.trim() || name.length < 2) {
      setErrorMsg('Please provide your name (at least 2 characters).');
      setFormStatus('error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      setFormStatus('error');
      return;
    }
    if (!message.trim() || message.length < 5) {
      setErrorMsg('Message must be at least 5 characters.');
      setFormStatus('error');
      return;
    }

    setErrorMsg('');
    setFormStatus('sending');

    // Simulate reliable dispatch
    setTimeout(() => {
      setFormStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  const handleDownloadResume = () => {
    setResumeDownloaded(true);
    // Trigger download / open
    window.open(DEVELOPER_PROFILE.email, '_blank');
    setTimeout(() => setResumeDownloaded(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>GET IN TOUCH</Text>
          <Text style={styles.title}>Resume & Contact</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close Contact"
          onPress={() => closeApp()}
          style={({ pressed }) => [
            styles.exitBtn,
            pressed && styles.exitBtnPressed,
          ]}
        >
          <Text style={styles.exitGlyph}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Interactive Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarGlyph}>👨‍💻</Text>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.verifiedRow}>
                <Text style={styles.profileName}>{DEVELOPER_PROFILE.name}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheck}>✓</Text>
                </View>
              </View>
              <Text style={styles.profileRole}>{DEVELOPER_PROFILE.role}</Text>
              <Text style={styles.profileLoc}>📍 {DEVELOPER_PROFILE.location}</Text>
            </View>
          </View>

          {/* Availability Status */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{DEVELOPER_PROFILE.status}</Text>
          </View>

          {/* Quick External Actions */}
          <View style={styles.actionGrid}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send Email"
              onPress={() => (window.location.href = `mailto:${DEVELOPER_PROFILE.email}`)}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text style={styles.actionBtnIcon}>✉</Text>
              <Text style={styles.actionBtnText}>Email Me</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View GitHub"
              onPress={() => window.open(DEVELOPER_PROFILE.github, '_blank')}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text style={styles.actionBtnIcon}>🐙</Text>
              <Text style={styles.actionBtnText}>GitHub</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View LinkedIn"
              onPress={() => window.open(DEVELOPER_PROFILE.linkedin, '_blank')}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text style={styles.actionBtnIcon}>💼</Text>
              <Text style={styles.actionBtnText}>LinkedIn</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Download Resume"
              onPress={handleDownloadResume}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.resumeBtn,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text style={styles.actionBtnIcon}>📄</Text>
              <Text style={[styles.actionBtnText, styles.resumeBtnText]}>
                {resumeDownloaded ? 'Opened!' : 'Resume PDF'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 3. Interactive Contact Message Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>SEND DIRECT TRANSMISSION</Text>
          <Text style={styles.sectionSubtitle}>
            Leave a message for cybersecurity contracts, engineering roles, or consulting
          </Text>

          {formStatus === 'sent' ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Transmission Dispatched</Text>
              <Text style={styles.successDesc}>
                Thank you! Your message has been routed to Zakaria's inbox.
              </Text>
              <Pressable
                onPress={() => setFormStatus('idle')}
                style={styles.sendAnotherBtn}
              >
                <Text style={styles.sendAnotherText}>Send Another Message</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.formFields}>
              {formStatus === 'error' && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠ {errorMsg}</Text>
                </View>
              )}

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Your Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor="#64748B"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Your Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="e.g. alex@company.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Message / Proposal</Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Tell me about your project, security engagement, or open role..."
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={4}
                  style={[styles.textInput, styles.textArea]}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send Message"
                onPress={handleSendMessage}
                disabled={formStatus === 'sending'}
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.submitBtnPressed,
                ]}
              >
                <Text style={styles.submitBtnText}>
                  {formStatus === 'sending'
                    ? 'Encrypting & Dispatching...'
                    : 'Dispatch Message ↗'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* 4. Categorized Skills Matrix Tab */}
        <View style={styles.skillsCard}>
          <Text style={styles.sectionTitle}>TECHNICAL SKILLS MATRIX</Text>

          {/* Category Tabs */}
          <View style={styles.categoryTabs}>
            {(
              [
                'Security',
                'Languages',
                'Systems & Cloud',
                'Web & Frameworks',
              ] as const
            ).map((cat) => {
              const isSelected = activeSkillCat === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveSkillCat(cat)}
                  style={[
                    styles.tabPill,
                    isSelected && styles.tabPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isSelected && styles.tabTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Skill Proficiency Bars */}
          <View style={styles.skillsList}>
            {filteredSkills.map((skill) => (
              <View key={skill.name} style={styles.skillItem}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillPercent}>{skill.level}%</Text>
                </View>

                {/* Animated / styled bar */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${skill.level}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    userSelect: 'none',
  },
  header: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  exitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  exitGlyph: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarGlyph: {
    fontSize: 26,
  },
  profileInfo: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  profileRole: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  profileLoc: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 14,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Action Grid */
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  resumeBtn: {
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    borderColor: '#38BDF8',
  },
  actionBtnIcon: {
    fontSize: 16,
  },
  actionBtnText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
  },
  resumeBtnText: {
    color: '#38BDF8',
  },
  actionBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  /* Form Card */
  formCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 12,
  },
  formFields: {
    gap: 10,
  },
  fieldRow: {
    gap: 4,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 10.5,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#070B12',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 12,
    outlineStyle: 'none',
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
  },
  submitBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
  },
  submitBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  successIcon: {
    fontSize: 32,
    color: '#10B981',
    fontWeight: '900',
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  successDesc: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
  },
  sendAnotherBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sendAnotherText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Skills Card */
  skillsCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  tabPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  skillsList: {
    gap: 10,
    marginTop: 4,
  },
  skillItem: {
    gap: 4,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  skillPercent: {
    color: '#38BDF8',
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  barTrack: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2.5,
    backgroundColor: '#38BDF8',
  },
});
