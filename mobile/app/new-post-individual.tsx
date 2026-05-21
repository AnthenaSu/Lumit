import { useState, useEffect, useRef } from 'react'
import {
  View, Text, Image, TextInput, Pressable,
  StyleSheet, Dimensions, ScrollView,
  Keyboard, Animated, Easing, PanResponder,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { newPostStore } from '../new-post-store'

const { width } = Dimensions.get('window')
const H_MARGIN = 26
const PHOTO_W = width
const PHOTO_H = Math.round(PHOTO_W * 4 / 3)
const CAT_W = 52
const CAT_H = 54

const catImg = require('../assets/images/cat.png')
const avatarImg = require('../assets/images/anthena.jpg')

function IconSend() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function NewPostIndividual() {
  const router = useRouter()
  const { index } = useLocalSearchParams<{ index: string }>()
  const idx = Number(index)
  const photo = newPostStore[idx]
  const [caption, setCaption] = useState('')
  const [comments, setComments] = useState<string[]>([])
  const [kbVisible, setKbVisible] = useState(false)
  const bottomAnim = useRef(new Animated.Value(0)).current
  const dragX = useRef(new Animated.Value(0)).current
  const dragY = useRef(new Animated.Value(0)).current
  const captionRef = useRef(caption)

  const screenW = Dimensions.get('window').width
  const screenH = Dimensions.get('window').height

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || g.dy > 4,
    onPanResponderMove: (_, g) => {
      dragX.setValue(g.dx)
      if (g.dy > 0) dragY.setValue(g.dy)
    },
    onPanResponderRelease: (_, g) => {
      const dismissH = g.dy > 120
      const dismissX = Math.abs(g.dx) > 100
      if (dismissH) {
        Animated.timing(dragY, { toValue: screenH, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start(() => router.back())
      } else if (dismissX) {
        Animated.timing(dragX, { toValue: g.dx > 0 ? screenW : -screenW, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start(() => router.back())
      } else {
        Animated.parallel([
          Animated.spring(dragX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }),
        ]).start()
      }
    },
  })).current

  useEffect(() => { captionRef.current = caption }, [caption])

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', e => {
      setKbVisible(true)
      Animated.timing(bottomAnim, {
        toValue: e.endCoordinates.height,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start()
    })
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setKbVisible(false)
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start()
    })
    return () => { show.remove(); hide.remove() }
  }, [])

  useEffect(() => {
    return () => { if (photo) newPostStore[idx].caption = captionRef.current }
  }, [])

  const addComment = () => {
    if (!caption.trim()) return
    setComments(c => [...c, caption.trim()])
    setCaption('')
    Keyboard.dismiss()
  }

  if (!photo) return null

  const scale = dragY.interpolate({
    inputRange: [0, screenH],
    outputRange: [1, 0.55],
    extrapolate: 'clamp',
  })

  return (
    <Animated.View style={[styles.page, { transform: [{ translateX: dragX }, { translateY: dragY }, { scale }] }]}>
      {/* Cancel button — swipe-down handle */}
      <View style={styles.headerRow} {...panResponder.panHandlers}>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Username + cat */}
        <View style={styles.usernameRow}>
          <Text style={styles.username}>Anthena</Text>
          <Image source={catImg} style={styles.catSticker} resizeMode="contain" />
        </View>

        {/* Photo */}
        <View style={styles.photoWrap}>
          <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
        </View>

        {comments.map((c, i) => (
          <View key={i} style={styles.commentRow}>
            <Image source={avatarImg} style={styles.commentAvatar} resizeMode="cover" />
            <Text style={styles.commentText}>{c}</Text>
          </View>
        ))}
      </ScrollView>


      {/* Bottom bar */}
      {kbVisible && (
        <Animated.View style={[styles.bottomCover, { bottom: bottomAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />
        </Animated.View>
      )}
      <Animated.View style={[styles.bottomBar, { bottom: bottomAnim }]}>
        <View style={styles.captionPillWrap}>
          <View style={styles.captionPill}>
            <Image source={avatarImg} style={styles.avatar} resizeMode="cover" />
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="#808080"
              value={caption}
              onChangeText={setCaption}
              multiline
            />
            {caption.trim().length >= 1 && (
              <Pressable style={styles.sendBtn} onPress={addComment}>
                <IconSend />
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },

  headerRow: {
    paddingTop: 76,
    paddingHorizontal: H_MARGIN,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    width: 100,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  cancelText: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 14,
    color: '#000',
  },

  usernameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: H_MARGIN,
    marginBottom: 0,
    marginTop: 10,
  },
  username: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 18,
    color: '#000',
  },
  catSticker: {
    width: CAT_W,
    height: CAT_H,
  },

  photoWrap: {
    marginBottom: 16,
  },
  photo: {
    width: PHOTO_W,
    height: PHOTO_H,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingBottom: 34,
    zIndex: 11,
  },
  captionPillWrap: {
    paddingHorizontal: 21,
  },
  captionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    opacity: 50,
    borderRadius: 15,
    minHeight: 50,
    paddingHorizontal: 9,
    paddingVertical: 7,
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  captionInput: {
    flex: 1,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#000',
  },
  bottomCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: H_MARGIN,
    marginBottom: 12,
    gap: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  commentText: {
    flex: 1,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 15,
    color: '#1e1e1e',
    paddingTop: 6,
  },
})
