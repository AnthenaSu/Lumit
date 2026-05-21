import { useState, useRef } from 'react'
import {
  View, Text, Image, Pressable, StyleSheet, Dimensions,
  FlatList, Modal, TextInput, KeyboardAvoidingView, Platform, Animated,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import Svg, { Path, Circle, Line } from 'react-native-svg'

const { width, height } = Dimensions.get('window')
const PHOTO_HEIGHT = width * (4 / 3)
const HEADER_HEIGHT = 60
const ITEM_HEIGHT = HEADER_HEIGHT + PHOTO_HEIGHT + 8

type Comment = { id: number; user: string; text: string }
type Post = { id: number; user: string; location: string; time: string; photo: number; comments: Comment[] }

const INITIAL_POSTS: Post[] = [
  { id: 0,  user: 'Ian Lin', location: 'Sydney',    time: '1 hour ago',   photo: require('../assets/images/profile1.jpg'),  comments: [] },
  { id: 1,  user: 'Ian Lin', location: 'Melbourne', time: '3 hours ago',  photo: require('../assets/images/profile2.jpg'),  comments: [] },
  { id: 2,  user: 'Ian Lin', location: 'Sydney',    time: '5 hours ago',  photo: require('../assets/images/profile3.jpg'),  comments: [] },
  { id: 3,  user: 'Ian Lin', location: 'Sydney',    time: '1 day ago',    photo: require('../assets/images/profile4.jpg'),  comments: [] },
  { id: 4,  user: 'Ian Lin', location: 'Melbourne', time: '2 days ago',   photo: require('../assets/images/profile5.jpg'),  comments: [] },
  { id: 5,  user: 'Ian Lin', location: 'Sydney',    time: '3 days ago',   photo: require('../assets/images/profile6.jpg'),  comments: [] },
  { id: 6,  user: 'Ian Lin', location: 'Sydney',    time: '4 days ago',   photo: require('../assets/images/profile7.jpg'),  comments: [] },
  { id: 7,  user: 'Ian Lin', location: 'Melbourne', time: '5 days ago',   photo: require('../assets/images/profile8.jpg'),  comments: [] },
  { id: 8,  user: 'Ian Lin', location: 'Sydney',    time: '6 days ago',   photo: require('../assets/images/profile9.jpg'),  comments: [] },
  { id: 9,  user: 'Ian Lin', location: 'Sydney',    time: '1 week ago',   photo: require('../assets/images/profile10.jpg'), comments: [] },
  { id: 10, user: 'Ian Lin', location: 'Melbourne', time: '2 weeks ago',  photo: require('../assets/images/profile11.jpg'), comments: [] },
  { id: 11, user: 'Ian Lin', location: 'Sydney',    time: '3 weeks ago',  photo: require('../assets/images/profile12.jpg'), comments: [] },
]

function IconComment() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconDots() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={12} r={1.5} fill="#fff" />
      <Circle cx={12} cy={12} r={1.5} fill="#fff" />
      <Circle cx={19} cy={12} r={1.5} fill="#fff" />
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

function IconMessageOff() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="4" y1="4" x2="20" y2="20" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

function IconMessageOn() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconEyeOff() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
        stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.73 10.73A2 2 0 0 0 14 13.27" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
      <Line x1="1" y1="1" x2="23" y2="23" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

function IconEyeOn() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={3} stroke="#fff" strokeWidth={1.6} />
    </Svg>
  )
}

type CatState = { visible: boolean; x: number }

export default function Post() {
  const { idx } = useLocalSearchParams<{ idx: string }>()
  const initialIndex = Math.min(Math.max(Number(idx) ?? 0, 0), INITIAL_POSTS.length - 1)

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [cats, setCats] = useState<Record<number, CatState>>({})
  const [iconVisible, setIconVisible] = useState<Record<number, boolean>>({})
  const [commentOff, setCommentOff] = useState<Record<number, boolean>>({})
  const [hideCat, setHideCat] = useState<Record<number, boolean>>({})
  const lastTap = useRef<Record<number, number>>({})
  const singleTapTimer = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const usernameWidths = useRef<Record<number, number>>({})
  const metaWidths = useRef<Record<number, number>>({})

  // Dots menu (floating card)
  const [menuPostId, setMenuPostId] = useState<number | null>(null)
  const [menuBottom, setMenuBottom] = useState(130)
  const [menuRight, setMenuRight] = useState(16)
  const menuAnim = useRef(new Animated.Value(0)).current
  const dotsBtnRefs = useRef<Record<number, View | null>>({})

  const openMenu = (postId: number) => {
    const btn = dotsBtnRefs.current[postId]
    if (btn) {
      btn.measure((_x, _y, w, h, pageX, pageY) => {
        setMenuBottom(height - pageY + 8)
        setMenuRight(width - pageX - w)
        setMenuPostId(postId)
        Animated.spring(menuAnim, { toValue: 1, damping: 20, stiffness: 300, useNativeDriver: true }).start()
      })
    } else {
      setMenuPostId(postId)
      Animated.spring(menuAnim, { toValue: 1, damping: 20, stiffness: 300, useNativeDriver: true }).start()
    }
  }

  const closeMenu = (cb?: () => void) => {
    Animated.timing(menuAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setMenuPostId(null)
      cb?.()
    })
  }

  // Comment sheet
  const [openPostId, setOpenPostId] = useState<number | null>(null)
  const [commentInput, setCommentInput] = useState('')
  const slideAnim = useRef(new Animated.Value(height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const openComment = (postId: number) => {
    setOpenPostId(postId)
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start()
  }

  const closeComment = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }),
    ]).start(() => setOpenPostId(null))
  }

  const handlePhotoPress = (postId: number) => {
    const now = Date.now()
    const prev = lastTap.current[postId] ?? 0
    if (now - prev < 300) {
      clearTimeout(singleTapTimer.current[postId])
      if (!hideCat[postId]) {
        if (cats[postId]?.visible) {
          setCats(s => ({ ...s, [postId]: { visible: false, x: 0 } }))
        } else {
          const nameWidth = usernameWidths.current[postId] ?? 100
          const metaWidth = metaWidths.current[postId] ?? 0
          const minX = 14 + Math.max(nameWidth, metaWidth) + 6
          const maxX = width - 48
          const x = minX + Math.random() * (maxX - minX)
          setCats(s => ({ ...s, [postId]: { visible: true, x } }))
        }
      }
    } else {
      singleTapTimer.current[postId] = setTimeout(() => {
        setIconVisible(s => ({ ...s, [postId]: !s[postId] }))
      }, 300)
    }
    lastTap.current[postId] = now
  }

  const openPost = posts.find(p => p.id === openPostId) ?? null

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View>
          <Text style={styles.username} onLayout={e => { usernameWidths.current[item.id] = e.nativeEvent.layout.width }}>
            {item.user}
          </Text>
          <Text style={styles.meta} onLayout={e => { metaWidths.current[item.id] = e.nativeEvent.layout.width }}>
            {item.location} · {item.time}
          </Text>
        </View>
      </View>

      <View style={{ width, height: PHOTO_HEIGHT, overflow: 'visible' }}>
        {cats[item.id]?.visible && (
          <Image source={require('../assets/images/cat.png')} style={[styles.catSticker, { left: cats[item.id].x }]} />
        )}
        <Pressable onPress={() => handlePhotoPress(item.id)} style={StyleSheet.absoluteFill}>
          <Image source={item.photo} style={styles.photoImg} resizeMode="cover" />
        </Pressable>

        {iconVisible[item.id] && (
          <View style={styles.iconRow}>
            <Pressable
              ref={r => { dotsBtnRefs.current[item.id] = r as View | null }}
              style={styles.iconBtn}
              onPress={() => openMenu(item.id)}
            >
              <IconDots />
            </Pressable>
            {!commentOff[item.id] && (
              <Pressable style={styles.iconBtn} onPress={() => openComment(item.id)}>
                <IconComment />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  )

  return (
    <View style={styles.page}>
      <FlatList
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        initialScrollIndex={initialIndex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 50 }}
      />

      {/* Floating dots menu */}
      <Modal visible={menuPostId !== null} transparent animationType="none" onRequestClose={() => closeMenu()}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
        <Animated.View style={[styles.menuCard, { bottom: menuBottom, right: menuRight }, {
          opacity: menuAnim,
          transform: [{ scale: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
        }]}>
          <Pressable
            style={styles.menuRow}
            onPress={() => closeMenu(() => {
              if (menuPostId !== null) {
                setCommentOff(s => ({ ...s, [menuPostId]: !s[menuPostId] }))
                setIconVisible(s => ({ ...s, [menuPostId!]: false }))
              }
            })}
          >
            <Text style={styles.menuText}>
              {commentOff[menuPostId!] ? 'Comment on' : 'Comment off'}
            </Text>
            {commentOff[menuPostId!] ? <IconMessageOn /> : <IconMessageOff />}
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable
            style={styles.menuRow}
            onPress={() => closeMenu(() => {
              if (menuPostId !== null) {
                setHideCat(s => ({ ...s, [menuPostId]: !s[menuPostId] }))
                setCats(s => ({ ...s, [menuPostId!]: { visible: false, x: 0 } }))
              }
            })}
          >
            <Text style={styles.menuText}>
              {hideCat[menuPostId!] ? 'Show cat' : 'Hide cat'}
            </Text>
            {hideCat[menuPostId!] ? <IconEyeOn /> : <IconEyeOff />}
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable
            style={styles.menuRow}
            onPress={() => closeMenu(() => {
              if (menuPostId !== null) setPosts(p => p.filter(x => x.id !== menuPostId))
            })}
          >
            <Text style={[styles.menuText, { color: '#ff3b30' }]}>Delete Post</Text>
            <IconTrash />
          </Pressable>
        </Animated.View>
      </Modal>

      {/* Comment sheet */}
      <Modal visible={openPostId !== null} transparent animationType="none" onRequestClose={closeComment}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeComment} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Comment</Text>
              <View style={styles.commentList}>
                {openPost?.comments.length === 0 && (
                  <Text style={styles.noComments}>No comments yet</Text>
                )}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder={`Add a comment for ${openPost?.user ?? ''} ...`}
                  placeholderTextColor="#b3b3b3"
                  value={commentInput}
                  onChangeText={setCommentInput}
                  returnKeyType="send"
                  onSubmitEditing={() => setCommentInput('')}
                />
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  post: { paddingBottom: 8, marginBottom: 12 },
  postHeader: { height: HEADER_HEIGHT, paddingLeft: 14, paddingRight: 12, justifyContent: 'center' },
  username: { fontFamily: 'Alyamama', fontSize: 18, lineHeight: 20, color: '#000', alignSelf: 'flex-start' },
  meta: { fontSize: 13, color: 'rgba(0,0,0,0.5)', alignSelf: 'flex-start', marginTop: 2 },
  catSticker: { position: 'absolute', top: -50, width: 48, height: 50 },
  photoImg: { width, height: PHOTO_HEIGHT },

  iconRow: {
    position: 'absolute', bottom: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  // Floating menu card
  menuCard: {
    position: 'absolute',
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

  // Comment sheet
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    height: height * 0.65, paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetTitle: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 18, color: '#000', textAlign: 'center', paddingVertical: 12 },
  commentList: { flex: 1, paddingHorizontal: 20 },
  noComments: { fontFamily: 'PublicSans-Regular', fontSize: 14, color: '#b3b3b3', textAlign: 'center', marginTop: 40 },
  inputRow: { paddingHorizontal: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  commentInput: {
    backgroundColor: '#f0f0f0', borderRadius: 22,
    paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, color: '#000',
  },
})
