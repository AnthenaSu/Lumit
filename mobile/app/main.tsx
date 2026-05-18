import { useState, useRef } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Image } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'

const { width, height } = Dimensions.get('window')
// Scale photo proportionally to screen, capped by both width and height
const photoWidthByWidth = width * (350 / 402)
const photoWidthByHeight = height * (420 / 874) * (350 / 420)
const photoWidth = Math.min(photoWidthByWidth, photoWidthByHeight)
const photoHeight = photoWidth * (420 / 350)

const POSTS = [
  {
    id: 1,
    user: 'Anthena',
    location: 'Sydney',
    time: '1 hour ago',
    photo: require('../assets/images/post1.jpg'),
    caption: 'A vase is an open, typically hollow container used for displaying flowers, storing items, or acting as decorative art, crafted from materials like glass, ceramic, metal, or wood',
  },
  {
    id: 2,
    user: 'ian.lin',
    location: 'Melbourne',
    time: '3 hours ago',
    photo: require('../assets/images/post2.jpg'),
    caption: 'Stumbled upon the most incredible lamp at the Sunday market — sometimes the best finds are completely unplanned',
  },
]

type CatState = { visible: boolean; x: number }

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
      <Circle cx={12} cy={7} r={4} stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function Main() {
  const [cats, setCats] = useState<Record<number, CatState>>({})
  const lastTap = useRef<Record<number, number>>({})

  const handlePhotoPress = (postId: number) => {
    const now = Date.now()
    const prev = lastTap.current[postId] ?? 0
    if (now - prev < 300) {
      // double tap — place cat at random x within the post header area
      const maxX = width - 48 - 12
      const minX = 70
      const x = Math.random() * (maxX - minX) + minX
      setCats(s => ({ ...s, [postId]: { visible: true, x } }))
    }
    lastTap.current[postId] = now
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>Lumit</Text>
        </View>

        {POSTS.map((post) => (
          <View key={post.id} style={styles.post}>

            <View style={styles.postHeader}>
              <Text style={styles.username}>{post.user}</Text>
              {cats[post.id]?.visible && (
                <Image
                  source={require('../assets/images/cat.png')}
                  style={[styles.catSticker, { left: cats[post.id].x }]}
                />
              )}
            </View>

            <Pressable
              onPress={() => handlePhotoPress(post.id)}
              style={{ width: photoWidth, height: photoHeight, marginLeft: 24 }}
            >
              <Image source={post.photo} style={styles.photoImg} resizeMode="cover" />
            </Pressable>

            <Text style={styles.caption}>{post.caption}</Text>
            <Text style={styles.meta}>{post.location} · {post.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navPill}>
        <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <IconHome />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <IconSend />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <Text style={styles.navBtnTText}>T</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <IconSearch />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <IconUser />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  feed: { flex: 1 },
  feedContent: { paddingBottom: 110 },
  header: {
    paddingTop: 56,
    paddingBottom: 14,
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 40,
    color: '#000',
  },
  post: {
    paddingBottom: 20,
    marginBottom: 32,
  },
  postHeader: {
    minHeight: 54,
    paddingTop: 8,
    paddingLeft: 25,
    paddingRight: 12,
    justifyContent: 'flex-end',
  },
  catSticker: {
    position: 'absolute',
    bottom: 0,
    width: 48,
    height: 50,
  },
  username: {
    fontSize: 18,
    color: '#000',
  },
  photo: {
    width: photoWidth,
    height: photoHeight,
    marginLeft: 24,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  photoImg: {
    width: photoWidth,
    height: photoHeight,
    borderRadius: 5,
  },
  caption: {
    fontSize: 16,
    color: '#000',
    lineHeight: 23,
    paddingHorizontal: 25,
    paddingTop: 14,
    paddingBottom: 8,
  },
  meta: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 25,
  },
  navPill: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    marginLeft: -160,
    width: 320,
    height: 50,
    backgroundColor: 'rgba(235,235,235,0.35)',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
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
