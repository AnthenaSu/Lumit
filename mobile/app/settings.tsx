import { useState } from 'react'
import {
  View, Text, Image, Pressable, ScrollView,
  StyleSheet, Switch, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path, Line } from 'react-native-svg'
import { profileStore } from '../profile-store'

const DEFAULT_AVATAR = require('../assets/images/profile_avatar.jpg')

function IconX() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke="#000" strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke="#000" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  )
}

function IconChevron() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>
}

function Row({ label, onPress, danger, right }: {
  label: string
  onPress?: () => void
  danger?: boolean
  right?: React.ReactNode
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      {right ?? (onPress && !danger ? <IconChevron /> : null)}
    </Pressable>
  )
}

function Divider() {
  return <View style={styles.divider} />
}

export default function Settings() {
  const router = useRouter()
  const [privateAccount, setPrivateAccount] = useState(false)
  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => router.back() },
    ])
  }

  const confirmDelete = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. All your data will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete Account', style: 'destructive', onPress: () => {} },
    ])
  }

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <IconX />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User card */}
        <Pressable style={styles.userCard} onPress={() => router.push('/edit-profile')}>
          <View style={styles.userCardLeft}>
            <Text style={styles.userName}>{profileStore.name || 'Your Name'}</Text>
            <Text style={styles.userHandle}>@{(profileStore.name || 'username').toLowerCase().replace(/\s/g, '_')}</Text>
          </View>
          <View style={styles.avatarClip}>
            <Image
              source={profileStore.avatarUri ? { uri: profileStore.avatarUri } : DEFAULT_AVATAR}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </Pressable>

        {/* Account */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <Row label="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <Divider />
          <Row label="Email" onPress={() => {}} />
          <Divider />
          <Row label="Change Password" onPress={() => {}} />
        </View>

        {/* Privacy */}
        <SectionHeader title="Privacy" />
        <View style={styles.section}>
          <Row
            label="Private Account"
            right={<Switch value={privateAccount} onValueChange={setPrivateAccount} trackColor={{ true: '#000' }} />}
          />
          <Divider />
          <Row label="Blocked Users" onPress={() => {}} />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <Row
            label="Push Notifications"
            right={<Switch value={pushNotif} onValueChange={setPushNotif} trackColor={{ true: '#000' }} />}
          />
          <Divider />
          <Row
            label="Email Notifications"
            right={<Switch value={emailNotif} onValueChange={setEmailNotif} trackColor={{ true: '#000' }} />}
          />
        </View>

        {/* Help */}
        <SectionHeader title="Help" />
        <View style={styles.section}>
          <Row label="Terms of Service" onPress={() => {}} />
          <Divider />
          <Row label="Privacy Policy" onPress={() => {}} />
          <Divider />
          <Row label="Contact Us" onPress={() => {}} />
        </View>

        {/* 危險操作 */}
        <View style={[styles.section, { marginTop: 32 }]}>
          <Row label="Sign Out" danger onPress={confirmSignOut} />
          <Divider />
          <Row label="Delete Account" danger onPress={confirmDelete} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f2f2f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 18, color: '#000' },
  closeBtn: {
    position: 'absolute', right: 20, top: 18,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#e8e8e8',
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: 20 },

  userCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  userCardLeft: { gap: 4 },
  userName: { fontFamily: 'GCPrometheusDemo-SemiBold', fontSize: 17, color: '#000' },
  userHandle: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 14, color: '#888' },
  avatarClip: { width: 52, height: 52, borderRadius: 12, overflow: 'hidden' },
  avatar: { width: 52, height: 52 },

  sectionHeader: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#000' },
  rowLabelDanger: { color: '#e03030' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },
})
