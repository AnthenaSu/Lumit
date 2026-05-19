import { useState, useRef } from 'react'
import {
  View, Text, FlatList, Image, Pressable, TextInput,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Svg, { Path, Circle } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

const AVATARS: Record<string, number> = {
  'Anthena': require('../assets/images/anthena.jpg'),
  'ian.lin':  require('../assets/images/ian.jpg'),
}
const COLORS: Record<string, string> = {
  'mia.c': '#B5C4B1',
}

type Message = { id: number; from: 'me' | 'other'; text: string }

const MOCK_MESSAGES: Message[] = [
  { id: 1, from: 'other', text: 'Hi' },
  { id: 2, from: 'me',    text: 'Hi' },
]

function Avatar({ user }: { user: string }) {
  const avatar = AVATARS[user]
  if (avatar) return <Image source={avatar} style={styles.avatar} />
  return (
    <View style={[styles.avatar, { backgroundColor: COLORS[user] ?? '#ccc' }]}>
      <Text style={styles.avatarInitial}>{user[0].toUpperCase()}</Text>
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
  const { user = 'User' } = useLocalSearchParams<{ user: string }>()
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const listRef = useRef<FlatList>(null)

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { id: Date.now(), from: 'me', text: input.trim() }])
    setInput('')
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50)
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconBack />
        </Pressable>
        <Avatar user={user} />
        <Text style={styles.username}>{user}</Text>
        <Pressable style={styles.moreBtn}>
          <IconMore />
        </Pressable>
      </View>
      <View style={styles.divider} />

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.row, item.from === 'me' ? styles.rowMe : styles.rowOther]}>
            {item.from === 'other' && (
              <Avatar user={user} />
            )}
            <View style={[styles.bubble, item.from === 'me' ? styles.bubbleMe : styles.bubbleOther]}>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="send a message"
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
  username: {
    fontFamily: 'GCPrometheusDemo-Medium',
    fontSize: 22,
    color: '#000',
    flex: 1,
  },
  moreBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 16, color: '#fff', fontWeight: '600' },
  messageList: { padding: 16, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowMe: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: width * 0.65,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  bubbleMe: { backgroundColor: '#e5e5ea' },
  bubbleOther: { backgroundColor: '#f0f0f0' },
  bubbleText: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    color: '#000',
  },
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
  input: {
    flex: 1,
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    color: '#000',
  },
  photoBtn: { marginLeft: 8 },
})
