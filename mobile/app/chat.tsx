import { useState, useRef } from 'react'
import {
  View, Text, FlatList, Image, Pressable, TextInput,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform,
  Modal, Animated,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Svg, { Path, Circle, Line } from 'react-native-svg'

const { width } = Dimensions.get('window')

const AVATARS: Record<string, number> = {
  'Anthena': require('../assets/images/anthena.jpg'),
  'ian.lin':  require('../assets/images/ian.jpg'),
}
const COLORS: Record<string, string> = {
  'mia.c': '#B5C4B1',
}
const MY_AVATAR = require('../assets/images/profile_avatar.jpg')

const POST_DATA: Record<number, { user: string; photo: number }> = {
  1: { user: 'Anthena', photo: require('../assets/images/post1.jpg') },
  2: { user: 'ian.lin', photo: require('../assets/images/post2.jpg') },
}

type Message =
  | { id: number; from: 'me' | 'other'; type: 'text'; text: string }
  | { id: number; from: 'me'; type: 'post'; postId: number }
  | { id: number; type: 'timestamp'; label: string }

function Avatar({ user, size = 40 }: { user: string; size?: number }) {
  const avatar = AVATARS[user]
  const style = { width: size, height: size, borderRadius: size * 0.375, alignItems: 'center' as const, justifyContent: 'center' as const }
  if (avatar) return <Image source={avatar} style={style} />
  return (
    <View style={[style, { backgroundColor: COLORS[user] ?? '#ccc' }]}>
      <Text style={{ color: '#fff', fontSize: size * 0.4, fontWeight: '600' }}>{user[0].toUpperCase()}</Text>
    </View>
  )
}

function IconBack() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconMore() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={12} r={1.5} fill="#000" />
      <Circle cx={12} cy={12} r={1.5} fill="#000" />
      <Circle cx={19} cy={12} r={1.5} fill="#000" />
    </Svg>
  )
}

function IconTrash() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#ff3b30" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11v6M14 11v6" stroke="#ff3b30" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

function IconMute() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
      <Line x1="1" y1="1" x2="23" y2="23" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

function IconSearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke="#fff" strokeWidth={1.6} />
      <Path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

function IconPhoto() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#808080" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={13} r={4} stroke="#808080" strokeWidth={1.5} />
    </Svg>
  )
}

export default function Chat() {
  const router = useRouter()
  const { user = 'User', sharedPostId } = useLocalSearchParams<{ user: string; sharedPostId?: string }>()

  const [messages, setMessages] = useState<Message[]>(() => {
    const initial: Message[] = [
      { id: 0, type: 'timestamp', label: 'Today' },
      { id: 1, from: 'other', type: 'text', text: 'Hi' },
      { id: 2, from: 'me',    type: 'text', text: 'Hi' },
    ]
    if (sharedPostId) {
      initial.push({ id: 3, from: 'me', type: 'post', postId: Number(sharedPostId) })
    }
    return initial
  })

  const [input, setInput] = useState('')
  const [muted, setMuted] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const menuAnim = useRef(new Animated.Value(0)).current
  const listRef = useRef<FlatList>(null)

  const openMenu = () => {
    setMenuVisible(true)
    Animated.spring(menuAnim, { toValue: 1, damping: 20, stiffness: 300, useNativeDriver: true }).start()
  }

  const closeMenu = (cb?: () => void) => {
    Animated.timing(menuAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setMenuVisible(false)
      cb?.()
    })
  }

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { id: Date.now(), from: 'me', type: 'text', text: input.trim() }])
    setInput('')
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50)
  }

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'timestamp') {
      return (
        <View style={styles.timestampRow}>
          <Text style={styles.timestampText}>{item.label}</Text>
        </View>
      )
    }

    const isMe = item.from === 'me'

    if (item.type === 'post') {
      const post = POST_DATA[item.postId]
      if (!post) return null
      return (
        <View style={[styles.row, styles.rowMe]}>
          <View style={styles.postBubble}>
            <View style={styles.postBubbleHeader}>
              <Avatar user={post.user} size={22} />
              <Text style={styles.postBubbleUser}>{post.user}</Text>
            </View>
            <Image source={post.photo} style={styles.postBubblePhoto} resizeMode="cover" />
          </View>
        </View>
      )
    }

    return (
      <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && <Avatar user={user} />}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>{item.text}</Text>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconBack />
        </Pressable>
        <Avatar user={user} />
        <Text style={styles.username}>{user}</Text>
        <Pressable style={styles.moreBtn} onPress={openMenu}>
          <IconMore />
        </Pressable>
      </View>
      <View style={styles.divider} />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Send a message..."
          placeholderTextColor="#808080"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Pressable style={styles.photoBtn}>
          <IconPhoto />
        </Pressable>
      </View>
      <Modal visible={menuVisible} transparent animationType="none" onRequestClose={() => closeMenu()}>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
          <Animated.View style={[styles.menuCard, {
            opacity: menuAnim,
            transform: [{ scale: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
          }]}>
            <Pressable style={styles.menuRow} onPress={() => closeMenu(() => setMuted(m => !m))}>
              <Text style={styles.menuText}>{muted ? 'Unmute' : 'Mute'}</Text>
              <IconMute />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuRow} onPress={() => closeMenu()}>
              <Text style={styles.menuText}>Search</Text>
              <IconSearchIcon />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuRow} onPress={() => closeMenu(() => router.back())}>
              <Text style={[styles.menuText, { color: '#ff3b30' }]}>Delete Chat</Text>
              <IconTrash />
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: { marginRight: 2 },
  username: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 22, color: '#000', flex: 1 },
  moreBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
  avatar: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  messageList: { padding: 16, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowMe: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: { maxWidth: width * 0.65, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  bubbleMe: { backgroundColor: '#1c1c1e' },
  bubbleOther: { backgroundColor: '#e5e5ea' },
  bubbleText: { fontFamily: 'PublicSans-Regular', fontSize: 16 },
  bubbleTextMe: { color: '#fff' },
  bubbleTextOther: { color: '#000' },
  timestampRow: { alignItems: 'center', marginVertical: 8 },
  timestampText: { fontFamily: 'PublicSans-Regular', fontSize: 12, color: '#808080' },

  // Shared post bubble
  postBubble: {
    width: width * 0.65,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postBubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  postBubblePhoto: {
    width: '100%',
    height: 200,
  },
  postBubbleUser: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 13,
    color: '#333',
  },

  menuCard: {
    position: 'absolute',
    top: 100,
    right: 16,
    width: 220,
    backgroundColor: 'rgba(30,30,32,0.96)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 17, color: '#fff' },
  menuDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.15)' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 34 : 16,
    marginTop: 8,
    backgroundColor: '#e5e5ea',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  input: { flex: 1, fontFamily: 'PublicSans-Regular', fontSize: 16, color: '#000' },
  photoBtn: { marginLeft: 8 },
})
