import { useState } from 'react'
import {
  View, Text, ScrollView, Image, Pressable, StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path, Circle } from 'react-native-svg'

const AVATARS: Record<string, number> = {
  'Ian Lin':  require('../assets/images/ian.jpg'),
  'Anthena':  require('../assets/images/anthena.jpg'),
}

type Segment = { text: string; bold?: boolean }
type Action = { label: string; filled?: boolean }
type NotifItem = {
  id: number
  user: string
  avatarColor?: string
  time: string
  segments: Segment[]
  actions?: Action[]
  postThumb?: number
}

const NOTIFICATIONS: NotifItem[] = [
  {
    id: 1,
    user: 'Ian Lin',
    time: 'just now',
    segments: [
      { text: 'Ian Lin', bold: true },
      { text: ' invited you to join ' },
      { text: 'Decor Profile Gallery', bold: true },
    ],
    actions: [{ label: 'View Gallery' }],
  },
  {
    id: 2,
    user: 'Anthena',
    time: '2 mins ago',
    segments: [
      { text: 'Anthena', bold: true },
      { text: ' liked' },
      { text: ' your post' },
    ],
    postThumb: require('../assets/images/post1.jpg'),
  },
  {
    id: 3,
    user: 'Ian Lin',
    time: '1 hour ago',
    segments: [
      { text: 'Ian Lin ', bold: true },
      { text: 'started' },
      { text: ' following ' },
      { text: 'you' },
    ],
    actions: [{ label: 'View Profile' }, { label: 'Follow Back' }],
  },
  {
    id: 4,
    user: 'Lumit',
    avatarColor: '#000',
    time: '8 hours ago',
    segments: [
      { text: 'New ' },
      { text: 'weekly', bold: true },
      { text: ' ' },
      { text: 'theme', bold: true },
      { text: ' is live' },
    ],
    actions: [{ label: 'View Theme' }],
  },
  {
    id: 5,
    user: 'Ian Lin',
    time: 'yesterday',
    segments: [
      { text: 'Ian Lin', bold: true },
      { text: ' ' },
      { text: 'decorated', bold: true },
      { text: ' your gallery' },
    ],
  },
  {
    id: 6,
    user: 'Coco_poodle',
    avatarColor: '#B5C4B1',
    time: '2 mins ago',
    segments: [
      { text: 'Coco_poodle', bold: true },
      { text: ' liked ' },
      { text: 'your post' },
    ],
    postThumb: require('../assets/images/post2.jpg'),
  },
  {
    id: 7,
    user: 'Ian Lin',
    time: '1 hour ago',
    segments: [
      { text: 'Ian Lin ', bold: true },
      { text: 'started' },
      { text: ' following ' },
      { text: 'you' },
    ],
    actions: [{ label: 'View Profile' }, { label: 'Following', filled: true }],
  },
]

const FILTERS = ['Invite', 'Like', 'Follow', 'Theme']

function IconBack() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function NotifAvatar({ user, color }: { user: string; color?: string }) {
  const avatar = AVATARS[user]
  const size = 35
  const style = { width: size, height: size, borderRadius: size / 2 }
  if (avatar) return <Image source={avatar} style={style} />
  return (
    <View style={[style, { backgroundColor: color ?? '#ccc', alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{user[0].toUpperCase()}</Text>
    </View>
  )
}

function NotifText({ segments }: { segments: Segment[] }) {
  return (
    <Text style={styles.notifText} numberOfLines={2}>
      {segments.map((s, i) => (
        <Text key={i} style={s.bold ? styles.notifBold : styles.notifRegular}>{s.text}</Text>
      ))}
    </Text>
  )
}

export default function Notification() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filtered = activeFilter
    ? NOTIFICATIONS.filter(n => {
        if (activeFilter === 'Invite') return n.segments.some(s => s.text.includes('invited'))
        if (activeFilter === 'Like')   return n.segments.some(s => s.text.includes('liked'))
        if (activeFilter === 'Follow') return n.segments.some(s => s.text.includes('following'))
        if (activeFilter === 'Theme')  return n.segments.some(s => s.text.includes('theme') || s.text.includes('Theme'))
        return true
      })
    : NOTIFICATIONS

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconBack />
        </Pressable>
        <Text style={styles.title}>Notification</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <Pressable
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setActiveFilter(activeFilter === f ? null : f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filtered.map(item => (
          <View key={item.id} style={styles.notifRow}>
            <NotifAvatar user={item.user} color={item.avatarColor} />
            <View style={styles.notifBody}>
              <View style={styles.notifTopRow}>
                <NotifText segments={item.segments} />
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              {item.postThumb && (
                <Image source={item.postThumb} style={styles.postThumb} resizeMode="cover" />
              )}
              {item.actions && item.actions.length > 0 && (
                <View style={styles.actionRow}>
                  {item.actions.map(a => (
                    <Pressable
                      key={a.label}
                      style={({ pressed }) => [
                        styles.actionBtn,
                        a.filled && styles.actionBtnFilled,
                        pressed && { opacity: 0.6 },
                      ]}
                    >
                      <Text style={[styles.actionText, a.filled && styles.actionTextFilled]}>
                        {a.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  backBtn: { padding: 4, marginRight: 4 },
  title: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 40, color: '#000' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
    marginTop: 4,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  filterPillActive: {
    backgroundColor: '#1e1e1e',
  },
  filterText: {
    fontFamily: 'GCPrometheusDemo-Medium',
    fontSize: 14,
    color: '#000',
  },
  filterTextActive: {
    color: '#fff',
  },

  list: { paddingHorizontal: 16, paddingBottom: 120, gap: 24 },

  notifRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  notifBody: { flex: 1 },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  notifText: { flex: 1 },
  notifBold: { fontFamily: 'PublicSans-SemiBold', fontSize: 16, color: '#000' },
  notifRegular: { fontFamily: 'PublicSans-Regular', fontSize: 16, color: '#000' },
  notifTime: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 12,
    color: '#808080',
    marginTop: 2,
    flexShrink: 0,
  },

  postThumb: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginTop: 6,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  actionBtnFilled: {
    backgroundColor: 'rgba(212,212,212,0.74)',
    borderColor: 'rgba(212,212,212,0.74)',
  },
  actionText: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 14,
    color: '#000',
  },
  actionTextFilled: {
    color: '#000',
  },
})
