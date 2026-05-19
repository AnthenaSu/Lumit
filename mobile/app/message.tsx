import { useState } from 'react'
import {
  View, Text, FlatList, Image, Pressable,
  TextInput, StyleSheet, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Link } from 'expo-router'
import Svg, { Path, Circle, Rect } from 'react-native-svg'
import { BlurView } from 'expo-blur'

const { width } = Dimensions.get('window')

type Conversation = {
  id: number
  user: string
  avatar: number | null
  color: string | null
  preview: string
}

const CONVERSATIONS: Conversation[] = [
  { id: 1, user: 'Anthena',  avatar: require('../assets/images/anthena.jpg'), color: null,       preview: 'Love the arrangement 😍' },
  { id: 2, user: 'ian.lin',  avatar: require('../assets/images/ian.jpg'),     color: null,       preview: 'Had to grab it haha' },
  { id: 3, user: 'mia.c',    avatar: null,                                    color: '#B5C4B1',  preview: 'The Sunday market is the best 🛍️' },
]

function Avatar({ avatar, color, user }: { avatar: number | null; color: string | null; user: string }) {
  if (avatar) {
    return <Image source={avatar} style={styles.avatar} />
  }
  return (
    <View style={[styles.avatar, { backgroundColor: color ?? '#ccc' }]}>
      <Text style={styles.avatarInitial}>{user[0].toUpperCase()}</Text>
    </View>
  )
}

function IconHome() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V12h6v9" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconSend() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconSearch() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke="#000" strokeWidth={1.5} />
      <Path d="M21 21l-4.35-4.35" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

function IconUser() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={7} r={4} stroke="#000" strokeWidth={1.5} />
    </Svg>
  )
}

function IconEdit() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function Message() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = CONVERSATIONS.filter(c =>
    c.user.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Message</Text>
        <Pressable style={styles.editBtn}>
          <IconEdit />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for someone"
          placeholderTextColor="#b3b3b3"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: '/chat', params: { user: item.user, avatarId: item.id } })}
          >
            <Avatar avatar={item.avatar} color={item.color} user={item.user} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.user}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.preview}</Text>
            </View>
          </Pressable>
        )}
      />

      {/* Nav pill */}
      <View style={styles.navPillShadow}>
        <BlurView intensity={80} tint="light" style={styles.navPill}>
          <View style={styles.navPillGlass} pointerEvents="none" />
          <Link href="/main" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconHome />
            </Pressable>
          </Link>
          <Pressable style={[styles.navBtn, { opacity: 1 }]}>
            <IconSend />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
            <Text style={styles.navBtnTText}>W</Text>
          </Pressable>
          <Link href="/search" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconSearch />
            </Pressable>
          </Link>
          <Link href="/profile" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconUser />
            </Pressable>
          </Link>
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 48,
    color: '#000',
    flex: 1,
  },
  editBtn: { padding: 4 },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  searchInput: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    color: '#000',
  },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  preview: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 14,
    color: '#b3b3b3',
  },

  // ── Nav pill ──
  navPillShadow: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    marginLeft: -160,
    width: 320,
    height: 50,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  navPill: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navPillGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  navBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnTText: {
    fontFamily: 'GCPrometheusDemo-Bold',
    fontSize: 25,
    color: '#000',
  },
})
