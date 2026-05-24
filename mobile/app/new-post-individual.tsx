import { useState, useEffect, useRef } from 'react'
import {
  View, Text, Image, TextInput, Pressable,
  StyleSheet, Dimensions, ScrollView, FlatList,
  Keyboard, Animated, Easing, PanResponder,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import * as Location from 'expo-location'
import { newPostStore } from './new-post-store'

const { width } = Dimensions.get('window')
const H_MARGIN = 26
const PHOTO_W = width
const PHOTO_H = Math.round(PHOTO_W * 4 / 3)
const CAT_W = 52
const CAT_H = 54

const avatarImg = require('../assets/images/anthena.jpg')


const CARD_W = 270
const TILE_GAP = 8
const TILE_W = 75
const ADD_TILE_W = 47

const STICKERS = [
  { id: 0,  label: 'cat 1',  src: require('../assets/images/cat1.png') },
  { id: 1,  label: 'cat 2',  src: require('../assets/images/cat2.png') },
  { id: 2,  label: 'cat 3',  src: require('../assets/images/cat3.png') },
  { id: 3,  label: 'cat 4',  src: require('../assets/images/cat4.png') },
  { id: 4,  label: 'cat 5',  src: require('../assets/images/cat5.png') },
  { id: 5,  label: 'cat 6',  src: require('../assets/images/cat6.png') },
  { id: 6,  label: 'cat 7',  src: require('../assets/images/cat7.png') },
  { id: 7,  label: 'cat 8',  src: require('../assets/images/cat8.png') },
  { id: 8,  label: 'cat 9',  src: require('../assets/images/cat1.png') },
  { id: 9,  label: 'cat 10', src: require('../assets/images/cat2.png') },
  { id: 10, label: 'cat 11', src: require('../assets/images/cat3.png') },
  { id: 11, label: 'cat 12', src: require('../assets/images/cat4.png') },
  { id: 12, label: 'cat 13', src: require('../assets/images/cat5.png') },
  { id: 13, label: 'cat 14', src: require('../assets/images/cat6.png') },
  { id: 14, label: 'cat 15', src: require('../assets/images/cat7.png') },
  { id: 15, label: 'cat 16', src: require('../assets/images/cat8.png') },
  { id: 16, label: 'cat 17', src: require('../assets/images/cat1.png') },
  { id: 17, label: 'cat 18', src: require('../assets/images/cat2.png') },
]

function chunk<T>(arr: T[], n: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))
}

function IconTrash() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#e53535" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11v6M14 11v6" stroke="#e53535" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

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

  const [currentIdx, setCurrentIdx] = useState(idx)
  const [caption, setCaption] = useState(newPostStore[idx]?.caption ?? '')
  const [comments, setComments] = useState<string[]>([])
  const [kbVisible, setKbVisible] = useState(false)
  const [locationLabel, setLocationLabel] = useState<string>(newPostStore[idx]?.locationLabel ?? '')
  const [locationSheet, setLocationSheet] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [menuVisible, setMenuVisible] = useState(false)
  const menuAnim = useRef(new Animated.Value(0)).current
  const [selectedComment, setSelectedComment] = useState<number | null>(null)
  const commentMenuAnim = useRef(new Animated.Value(0)).current
  const [pickerVisible, setPickerVisible] = useState(false)
  const [stickerQuery, setStickerQuery] = useState('')
  const [selectedSticker, setSelectedSticker] = useState(0)
  const pickerAnim = useRef(new Animated.Value(0)).current
  const stickerOpacity = useRef(new Animated.Value(1)).current
  const stickerPickerRef = useRef(false)

  const dragX = useRef(new Animated.Value(0)).current
  const dragY = useRef(new Animated.Value(0)).current
  const kbOffset = useRef(new Animated.Value(0)).current
  const kbOverlay = useRef(new Animated.Value(0)).current
  const locationSheetY = useRef(new Animated.Value(0)).current
  const locationSheetAnim = useRef(new Animated.Value(400)).current

  const captionRef = useRef(caption)
  const currentIdxRef = useRef(currentIdx)
  const locationSheetRef = useRef(false)

  const screenW = Dimensions.get('window').width
  const screenH = Dimensions.get('window').height

  useEffect(() => { captionRef.current = caption }, [caption])
  useEffect(() => { currentIdxRef.current = currentIdx }, [currentIdx])
  useEffect(() => { locationSheetRef.current = locationSheet }, [locationSheet])
  useEffect(() => { stickerPickerRef.current = pickerVisible }, [pickerVisible])

  useEffect(() => {
    const photo = newPostStore[currentIdx]
    if (!photo) return
    setLocationLabel(photo.locationLabel ?? '')
    if (photo.locationLabel || !photo.location) return
    let cancelled = false
    Location.reverseGeocodeAsync({ latitude: photo.location.latitude, longitude: photo.location.longitude })
      .then(results => {
        if (cancelled || !results[0]) return
        const r = results[0]
        const name = [r.city ?? r.subregion, r.country].filter(Boolean).join(', ')
        if (name) {
          newPostStore[currentIdx].locationLabel = name
          setLocationLabel(name)
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [currentIdx])

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', e => {
      if (locationSheetRef.current) {
        Animated.timing(locationSheetY, { toValue: -e.endCoordinates.height, duration: 250, useNativeDriver: true }).start()
        return
      }
      if (stickerPickerRef.current) return
      setKbVisible(true)
      Animated.parallel([
        Animated.timing(kbOffset, { toValue: e.endCoordinates.height, duration: 250, useNativeDriver: false }),
        Animated.timing(kbOverlay, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start()
    })
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      if (locationSheetRef.current) {
        Animated.timing(locationSheetY, { toValue: 0, duration: 250, useNativeDriver: true }).start()
        return
      }
      if (stickerPickerRef.current) return
      setKbVisible(false)
      Animated.parallel([
        Animated.timing(kbOffset, { toValue: 0, duration: 250, useNativeDriver: false }),
        Animated.timing(kbOverlay, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start()
    })
    return () => { show.remove(); hide.remove() }
  }, [])

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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        Animated.timing(dragY, { toValue: screenH, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start(() => router.back())
      } else if (dismissX) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        Animated.timing(dragX, { toValue: g.dx > 0 ? screenW : -screenW, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start(() => router.back())
      } else {
        Animated.parallel([
          Animated.spring(dragX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }),
        ]).start()
      }
    },
  })).current

  useEffect(() => {
    return () => {
      const ci = currentIdxRef.current
      if (newPostStore[ci]) newPostStore[ci].caption = captionRef.current
    }
  }, [])

  const openLocationSheet = () => {
    setLocationInput(locationLabel)
    locationSheetAnim.setValue(400)
    locationSheetY.setValue(0)
    setLocationSheet(true)
    requestAnimationFrame(() => {
      Animated.timing(locationSheetAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    })
  }

  const closeLocationSheet = () => {
    Keyboard.dismiss()
    Animated.timing(locationSheetAnim, {
      toValue: 400,
      duration: 220,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setLocationSheet(false)
      locationSheetY.setValue(0)
    })
  }

  const saveLocation = () => {
    const trimmed = locationInput.trim()
    newPostStore[currentIdx].locationLabel = trimmed
    setLocationLabel(trimmed)
    closeLocationSheet()
  }

  const removeLocation = () => {
    newPostStore[currentIdx].locationLabel = ''
    setLocationLabel('')
    closeLocationSheet()
  }

  const openMenu = () => {
    setMenuVisible(true)
    Animated.spring(menuAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 15 }).start()
  }

  const closeMenu = () => {
    Animated.timing(menuAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => setMenuVisible(false))
  }

  const doDiscard = () => {
    closeMenu()
    newPostStore.splice(0)
    router.back()
  }

  const openCommentMenu = (i: number) => {
    setSelectedComment(i)
    commentMenuAnim.setValue(0)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Animated.spring(commentMenuAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 15 }).start()
  }

  const closeCommentMenu = () => {
    Animated.timing(commentMenuAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => setSelectedComment(null))
  }

  const deleteComment = (i: number) => {
    setComments(c => c.filter((_, ci) => ci !== i))
    closeCommentMenu()
  }

  const openPicker = () => {
    setStickerQuery('')
    setPickerVisible(true)
    pickerAnim.setValue(0)
    Animated.spring(pickerAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 18 }).start()
  }

  const closePicker = () => {
    Animated.timing(pickerAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setPickerVisible(false))
  }

  const selectSticker = (id: number) => {
    setSelectedSticker(id)
    closePicker()
  }

  const removeSticker = () => {
    // Dismiss picker instantly so it no longer covers the sticker
    pickerAnim.setValue(0)
    setPickerVisible(false)
    // Now the sticker is fully exposed — fade it out
    stickerOpacity.setValue(1)
    Animated.timing(stickerOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
      setSelectedSticker(-1)
      stickerOpacity.setValue(1)
    })
  }

  const addComment = () => {
    if (!caption.trim()) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setComments(c => [...c, caption.trim()])
    setCaption('')
    Keyboard.dismiss()
  }

  const onPhotoPageChange = (e: any) => {
    const newIdx = Math.round(e.nativeEvent.contentOffset.x / PHOTO_W)
    if (newIdx !== currentIdxRef.current) {
      newPostStore[currentIdxRef.current].caption = captionRef.current
      setCurrentIdx(newIdx)
      setCaption(newPostStore[newIdx]?.caption ?? '')
      setComments([])
    }
  }

  if (!newPostStore[currentIdx]) return null

  const scale = dragY.interpolate({
    inputRange: [0, screenH],
    outputRange: [1, 0.55],
    extrapolate: 'clamp',
  })

  const sheetTranslate = Animated.add(locationSheetAnim, locationSheetY)
  const canSave = locationInput.trim().length > 0

  return (
    <Animated.View style={[styles.page, { transform: [{ translateX: dragX }, { translateY: dragY }, { scale }] }]}>
      <View style={{ flex: 1 }}>

        <View style={styles.dragHandle} {...panResponder.panHandlers}>
          <View style={styles.dragHandleBar} />
        </View>

        <View style={styles.usernameRow} {...panResponder.panHandlers}>
          <View style={{ paddingBottom: 14 }}>
            <Text style={styles.username}>Anthena</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
          {selectedSticker >= 0 ? (
            <Animated.View style={[styles.catStickerWrap, { opacity: stickerOpacity }]}>
              <Pressable onPress={openPicker}>
                <View style={styles.catStickerClip}>
                  <Image source={STICKERS[selectedSticker].src} style={styles.catStickerInner} resizeMode="cover" />
                </View>
              </Pressable>
              {pickerVisible && (
                <Pressable style={styles.catMinusBtn} onPress={removeSticker} hitSlop={6}>
                  <Text style={styles.catMinusBtnText}>−</Text>
                </Pressable>
              )}
            </Animated.View>
          ) : (
            <Pressable style={styles.addStickerBtn} onPress={openPicker}>
              <Text style={styles.addStickerBtnText}>+</Text>
            </Pressable>
          )}
        </View>

        <View style={{ height: PHOTO_H, flexShrink: 0 }}>
          <FlatList
            data={newPostStore}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={idx}
            getItemLayout={(_, i) => ({ length: PHOTO_W, offset: PHOTO_W * i, index: i })}
            onMomentumScrollEnd={onPhotoPageChange}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <Pressable style={{ width: PHOTO_W, height: PHOTO_H }} onPress={() => Keyboard.dismiss()}>
                <Image source={{ uri: item.uri }} style={styles.photo} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.45)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0.55 }}
                  end={{ x: 0, y: 1 }}
                />
              </Pressable>
            )}
            style={styles.photoList}
          />

          {newPostStore.length > 1 && (
            <View style={styles.dotsRow} pointerEvents="none">
              {newPostStore.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentIdx && styles.dotActive]} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.contentArea}>
          {/* subtle top shadow bridging photo → content */}
          <View style={styles.photoTopShadow} pointerEvents="none">
            <LinearGradient
              colors={['rgba(0,0,0,0.09)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <Pressable style={styles.locationRow} onPress={openLocationSheet}>
            <Text style={[styles.locationText, !locationLabel && styles.locationPlaceholder]}>
              {locationLabel ? `> ${locationLabel}` : '> Add location'}
            </Text>
          </Pressable>

          {/* Comments scroll */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {comments.map((c, i) => (
              <Pressable key={i} style={styles.commentRow} onLongPress={() => openCommentMenu(i)}>
                <Image source={avatarImg} style={styles.commentAvatar} resizeMode="cover" />
                <Text style={styles.commentText}>{c}</Text>
                {selectedComment === i && (
                  <Animated.View style={[styles.deleteBtn, {
                    opacity: commentMenuAnim,
                    transform: [{ scale: commentMenuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
                  }]}>
                    <Pressable onPress={() => deleteComment(i)}>
                      <IconTrash />
                    </Pressable>
                  </Animated.View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

      </View>

      {/* Dismiss menus on outside tap */}
      {menuVisible && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      )}
      {selectedComment !== null && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeCommentMenu} />
      )}

      {/* Overlay at page level — covers full screen */}
      <Animated.View
        pointerEvents={kbVisible ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, { opacity: kbOverlay }]}
      >
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => Keyboard.dismiss()} />
      </Animated.View>

      {/* Pill at page level — slides up with keyboard */}
      <Animated.View style={[styles.captionPillWrap, { bottom: kbOffset }]}>
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
        {!kbVisible && <View style={{ position: 'relative' }}>
          {menuVisible && (
            <Animated.View style={[styles.discardMenu, {
              opacity: menuAnim,
              transform: [{ scale: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
            }]}>
              <Pressable style={styles.discardOption} onPress={doDiscard}>
                <Text style={styles.discardText}>Discard</Text>
              </Pressable>
            </Animated.View>
          )}
          <Pressable style={styles.moreBtn} onPress={menuVisible ? closeMenu : openMenu}>
            <Text style={styles.moreBtnText}>···</Text>
          </Pressable>
        </View>}
      </Animated.View>

      {/* Location input sheet */}
      {locationSheet && (
        <Pressable style={styles.locationSheetOverlay} onPress={closeLocationSheet}>
          <View style={styles.locationSheetFloor} />
          <Animated.View style={[styles.locationSheet, { transform: [{ translateY: sheetTranslate }] }]}>
            <Pressable onPress={() => {}}>
              <View style={styles.sheetHandleBar} />

              <View style={styles.locationSheetHeader}>
                <Text style={styles.locationSheetTitle}>Location</Text>
                {locationLabel ? (
                  <Pressable onPress={removeLocation} hitSlop={8}>
                    <Text style={styles.locationSheetRemove}>Remove</Text>
                  </Pressable>
                ) : null}
              </View>

              <TextInput
                style={styles.locationSheetInput}
                placeholder="City, country..."
                placeholderTextColor="#b0b0b0"
                value={locationInput}
                onChangeText={setLocationInput}
                returnKeyType="done"
                onSubmitEditing={canSave ? saveLocation : undefined}
                autoFocus
              />

              <Pressable
                style={[styles.locationSheetDone, !canSave && styles.locationSheetDoneDisabled]}
                disabled={!canSave}
                onPress={saveLocation}
              >
                <Text style={[styles.locationSheetDoneText, !canSave && styles.locationSheetDoneTextDisabled]}>
                  Done
                </Text>
              </Pressable>
            </Pressable>
          </Animated.View>
        </Pressable>
      )}

      {/* Sticker picker */}
      {pickerVisible && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
          <Animated.View
            pointerEvents="box-none"
            style={[styles.pickerContainer, {
              opacity: pickerAnim,
              transform: [{ scale: pickerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
            }]}
          >
            <View style={styles.pickerCard}>
              <View style={styles.pickerSearchWrap}>
                <TextInput
                  style={styles.pickerSearchInput}
                  placeholder="search illustration"
                  placeholderTextColor="#aaa"
                  value={stickerQuery}
                  onChangeText={setStickerQuery}
                />
              </View>
              <View style={styles.pickerGridContainer}>
                <ScrollView
                  pagingEnabled
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {(() => {
                    const filtered = STICKERS.filter(s => s.label.includes(stickerQuery.toLowerCase()))
                    const pages = chunk(filtered, 8)
                    const safePages = pages.length > 0 ? pages : [[]]
                    return safePages.map((page, pi) => {
                      const padded = [...page, ...Array(8 - page.length).fill(null)] as (typeof STICKERS[0] | null)[]
                      const rows = [
                        [padded[0], padded[1], padded[2]],
                        [padded[3], padded[4], padded[5]],
                        [padded[6], padded[7], null],
                      ]
                      return (
                        <View key={pi} style={styles.pickerPage}>
                          {rows.map((row, ri) => (
                            <View key={ri} style={styles.pickerRow}>
                              {row.map((item, ci) => {
                                if (!item) return <View key={ci} style={styles.pickerTileCell} />
                                return (
                                  <Pressable
                                    key={item.id}
                                    style={[styles.pickerTile, selectedSticker === item.id && styles.pickerTileActive]}
                                    onPress={() => selectSticker(item.id)}
                                  >
                                    <Image source={item.src} style={styles.pickerTileImage} resizeMode="cover" />
                                  </Pressable>
                                )
                              })}
                            </View>
                          ))}
                        </View>
                      )
                    })
                  })()}
                </ScrollView>
                <View style={styles.pickerAddFixed}>
                  <Pressable style={styles.pickerAddTile}>
                    <Text style={styles.pickerAddText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>
        </>
      )}

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },

  dragHandle: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 4,
  },
  dragHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
  },
  headerRow: {
    paddingTop: 8,
    paddingHorizontal: H_MARGIN,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    paddingHorizontal: 16,
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
    marginBottom: -2,
    marginTop: 10,
  },
  username: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 18,
    color: '#000',
  },
  dateText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 11,
    color: '#808080',
    marginTop: 2,
  },
  catSticker: {
    width: CAT_W,
    height: CAT_H,
  },

  photoList: {
    height: PHOTO_H,
    flexGrow: 0,
    flexShrink: 0,
  },
  photo: {
    width: PHOTO_W,
    height: PHOTO_H,
  },

  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  captionPillWrap: {
    position: 'absolute',
    left: 21,
    right: 21,
    paddingBottom: 34,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  captionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    minHeight: 50,
    paddingHorizontal: 9,
    paddingVertical: 7,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
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
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  moreBtnText: {
    fontSize: 16,
    color: '#1e1e1e',
    letterSpacing: 1,
    lineHeight: 20,
  },
  discardMenu: {
    position: 'absolute',
    bottom: 46,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  photoTopShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
    zIndex: 1,
  },
  discardOption: {
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  discardText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 15,
    color: '#e53535',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_MARGIN,
    paddingVertical: 8,
  },
  locationText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 13,
    color: '#1e1e1e',
  },
  locationPlaceholder: {
    color: '#b0b0b0',
  },

  locationSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  locationSheetFloor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: '#fff',
  },
  locationSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 48,
  },
  sheetHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    alignSelf: 'center',
    marginBottom: 22,
  },
  locationSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationSheetTitle: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 17,
    color: '#1e1e1e',
  },
  locationSheetRemove: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 13,
    color: '#b0b0b0',
  },
  locationSheetInput: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 17,
    color: '#1e1e1e',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d0d0d0',
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 28,
  },
  locationSheetDone: {
    backgroundColor: '#1e1e1e',
    borderRadius: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationSheetDoneDisabled: {
    backgroundColor: '#f0f0f0',
  },
  locationSheetDoneText: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  locationSheetDoneTextDisabled: {
    color: '#c0c0c0',
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
  deleteBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  addStickerBtn: {
    width: CAT_W,
    height: CAT_H,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStickerBtnText: {
    fontSize: 22,
    color: '#c0c0c0',
  },

  pickerContainer: {
    position: 'absolute',
    top: 110,
    left: H_MARGIN,
    right: 10,
  },
  pickerCard: {
    width: CARD_W,
    alignSelf: 'flex-start',
    backgroundColor: '#666',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerSearchWrap: {
    width: 162,
    height: 29,
    backgroundColor: '#555',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  pickerSearchInput: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 13,
    color: '#fff',
  },
  pickerGridContainer: {
    height: 3 * TILE_W + 2 * TILE_GAP,
  },
  pickerPage: {
    height: 3 * TILE_W + 2 * TILE_GAP,
    gap: TILE_GAP,
  },
  pickerAddFixed: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: TILE_W,
    height: TILE_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerGrid: {
    gap: TILE_GAP,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  pickerTileCell: {
    width: TILE_W,
    height: TILE_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerTile: {
    width: TILE_W,
    height: TILE_W,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  pickerTileActive: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  pickerTileImage: {
    width: TILE_W,
    height: TILE_W,
    borderRadius: 5,
  },
  pickerAddTile: {
    width: ADD_TILE_W,
    height: ADD_TILE_W,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#B3B3B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerAddText: {
    fontSize: 24,
    color: '#333',
    lineHeight: 28,
  },
  pickerScrollbar: {
    position: 'absolute',
    right: 8,
    top: 51,
    height: 60,
    width: 3,
    borderRadius: 1.5,
    backgroundColor: '#D9D9D9',
  },
  catStickerWrap: {
    position: 'relative',
  },
  catStickerClip: {
    width: CAT_W,
    height: CAT_H,
    borderRadius: 6,
    overflow: 'hidden',
  },
  catStickerInner: {
    width: CAT_W + 10,
    height: CAT_H + 10,
    marginLeft: -5,
    marginTop: -5,
  },
  catMinusBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  catMinusBtnText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
})
