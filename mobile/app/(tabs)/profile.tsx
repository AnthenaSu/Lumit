import { useState, useRef, useEffect, useCallback } from 'react'
import {
  View, Text, Image, ScrollView, Pressable, StyleSheet,
  Modal, TextInput, FlatList, Dimensions, Animated, Easing, Linking,
} from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { profileStore } from '../../profile-store'
import GalleryView from '../../components/GalleryView'
import { sharedPosts } from '../post-store'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const GRID_GAP = 2
const CELL_WIDTH = (SCREEN_WIDTH - GRID_GAP * 2) / 3
const CELL_HEIGHT = CELL_WIDTH * (160 / 120)

const GRID_ROWS = [
  [
    require('../../assets/images/profile1.jpg'),
    require('../../assets/images/profile2.jpg'),
    require('../../assets/images/profile3.jpg'),
  ],
  [
    require('../../assets/images/profile4.jpg'),
    require('../../assets/images/profile5.jpg'),
    require('../../assets/images/profile6.jpg'),
  ],
  [
    require('../../assets/images/profile7.jpg'),
    require('../../assets/images/profile8.jpg'),
    require('../../assets/images/profile9.jpg'),
  ],
  [
    require('../../assets/images/profile10.jpg'),
    require('../../assets/images/profile11.jpg'),
    require('../../assets/images/profile12.jpg'),
  ],
]

type FollowUser = { id: number; user: string; avatar?: number; color?: string }

const FOLLOWING_LIST: FollowUser[] = [
  { id: 1, user: 'ian_lin',      avatar: require('../../assets/images/follow_user1.jpg') },
  { id: 2, user: 'winneneglass', avatar: require('../../assets/images/follow_user2.jpg') },
  { id: 3, user: 'coco_0528',    avatar: require('../../assets/images/follow_user3.jpg') },
]

const FOLLOWERS_LIST: FollowUser[] = [
  { id: 1, user: 'ian_lin',      avatar: require('../../assets/images/follow_user1.jpg') },
  { id: 2, user: 'winneneglass', avatar: require('../../assets/images/follow_user2.jpg') },
  { id: 3, user: 'coco_0528',    avatar: require('../../assets/images/follow_user3.jpg') },
]

export default function Profile() {
  const router = useRouter()
  const [profileData, setProfileData] = useState({ ...profileStore })

  const [newPostTick, setNewPostTick] = useState(0)

  useFocusEffect(useCallback(() => {
    setProfileData({ ...profileStore })
    setNewPostTick(t => t + 1)
  }, []))

  const [activeView, setActiveView] = useState<'grid' | 'gallery'>('grid')
  const [followModal, setFollowModal] = useState(false)
  const [followTab, setFollowTab] = useState<'following' | 'followers'>('following')
  const [followSearch, setFollowSearch] = useState('')
  const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88
  const sheetY = useRef(new Animated.Value(SHEET_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (followModal) {
      backdropOpacity.setValue(0)
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(sheetY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [followModal])

  function closeModal() {
    backdropOpacity.setValue(0)
    Animated.timing(sheetY, {
      toValue: SHEET_HEIGHT,
      duration: 260,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setFollowModal(false)
      sheetY.setValue(SHEET_HEIGHT)
    })
  }

  const listData = (followTab === 'following' ? FOLLOWING_LIST : FOLLOWERS_LIST).filter(u =>
    u.user.toLowerCase().includes(followSearch.toLowerCase())
  )

  const profileHeader = (
    <View style={styles.header}>
      <Pressable style={styles.avatar} onPress={() => router.push('/edit-profile')}>
        <Image
          source={profileData.avatarUri ? { uri: profileData.avatarUri } : require('../../assets/images/profile_avatar.jpg')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </Pressable>
      <Pressable onPress={() => router.push('/edit-profile')}>
        <Text style={styles.name}>{profileData.name}</Text>
      </Pressable>
      <Text style={styles.location}>{profileData.location}</Text>
      <View style={styles.socialRow}>
        <Pressable onPress={() => Linking.openURL(`https://instagram.com/${profileData.instagram.replace('@', '')}`)}>
          <Text style={styles.social}>{profileData.instagram}</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(`https://open.spotify.com/user/${profileData.spotify}`)}>
          <Text style={styles.social}>{profileData.spotify}</Text>
        </Pressable>
      </View>
      <View style={styles.btnRow}>
        <Pressable
          style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]}
          onPress={() => { setFollowTab('following'); setFollowModal(true) }}
        >
          <Text style={styles.pillBtnText}>Following</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]} onPress={() => setActiveView(activeView === 'gallery' ? 'grid' : 'gallery')}>
          <Text style={styles.pillBtnText}>{activeView === 'gallery' ? 'View All' : 'Gallery'}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]} onPress={() => router.push('/settings')}>
          <Text style={styles.pillBtnText}>Setting</Text>
        </Pressable>
      </View>
    </View>
  )

  return (
    <View style={styles.page}>
      {profileHeader}
      {activeView === 'gallery' ? (
        <View style={{ flex: 1, paddingBottom: 83 }}>
          <GalleryView />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {(() => {
            // Prepend newly shared posts (newest first), then static grid photos
            const dynamicSrcs = (newPostTick >= 0 ? sharedPosts : []).map(
              p => ({ dynamic: true as const, uri: p.photos[0].uri })
            )
            const staticSrcs = GRID_ROWS.flat().map(src => ({ dynamic: false as const, src }))
            const all = [...dynamicSrcs, ...staticSrcs]
            const rows: typeof all[] = Array.from(
              { length: Math.ceil(all.length / 3) },
              (_, i) => all.slice(i * 3, i * 3 + 3)
            )
            return rows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.gridRow}>
                {row.map((item, colIdx) => (
                  <Pressable
                    key={colIdx}
                    style={[styles.gridItem, colIdx < 2 && { marginRight: GRID_GAP }]}
                    onPress={() => router.push({ pathname: '/post', params: { idx: rowIdx * 3 + colIdx } })}
                  >
                    <Image
                      source={item.dynamic ? { uri: item.uri } : item.src}
                      style={{ width: CELL_WIDTH, height: CELL_HEIGHT }}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
            ))
          })()}
        </ScrollView>
      )}

      {/* Following / Followers modal */}
      <Modal
        visible={followModal}
        transparent
        animationType="none"
        onRequestClose={() => closeModal()}
      >
        <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]} pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
        </Animated.View>
        <Animated.View style={[styles.modalSheet, { transform: [{ translateY: sheetY }] }]}>
          {/* Tabs */}
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setFollowTab('following')}>
              <Text style={[styles.modalTabText, followTab === 'following' ? styles.tabActive : styles.tabInactive]}>
                Following
              </Text>
            </Pressable>
            <Text style={styles.modalSep}>/</Text>
            <Pressable onPress={() => setFollowTab('followers')}>
              <Text style={[styles.modalTabText, followTab === 'followers' ? styles.tabActive : styles.tabInactive]}>
                Followers
              </Text>
            </Pressable>
          </View>

          {/* Search bar */}
          <View style={styles.modalSearch}>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search"
              placeholderTextColor="#b3b3b3"
              value={followSearch}
              onChangeText={setFollowSearch}
            />
          </View>

          {/* User list */}
          <FlatList
            data={listData}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.followRow}>
                {item.avatar ? (
                  <Image source={item.avatar} style={styles.followAvatar} resizeMode="cover" />
                ) : (
                  <View style={[styles.followAvatar, { backgroundColor: item.color }]} />
                )}
                <Text style={styles.followName}>{item.user}</Text>
              </View>
            )}
          />
        </Animated.View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 110 },
  header: { paddingTop: 75, paddingHorizontal: 26, paddingBottom: 24 },
  avatar: {
    position: 'absolute',
    top: 75,
    right: 26,
    width: 72,
    height: 72,
    borderRadius: 15,
    overflow: 'hidden',
  },
  name: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 40, color: '#000', marginBottom: 2 },
  location: { fontFamily: 'CormorantSC-Medium', fontSize: 18, color: '#808080', marginBottom: 6 },
  socialRow: { flexDirection: 'row', gap: 28, marginBottom: 14 },
  social: { fontFamily: 'CormorantSC-Medium', fontSize: 18, color: '#000' },
  btnRow: { flexDirection: 'row', gap: 24, marginHorizontal: -10 },
  pillBtn: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnText: { fontFamily: 'CormorantSC-SemiBold', fontSize: 18, color: '#000' },
  gridRow: { flexDirection: 'row', marginBottom: GRID_GAP },
  gridItem: { width: CELL_WIDTH, height: CELL_HEIGHT, backgroundColor: '#f5f5f5' },

  // ── Modal ──
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    height: SCREEN_HEIGHT * 0.68,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 10,
  },
  modalTabText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 35,
  },
  tabActive: { color: '#000' },
  tabInactive: { color: '#b3b3b3' },
  modalSep: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 35,
    color: '#000',
  },
  modalSearch: {
    marginHorizontal: 25,
    marginBottom: 8,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  modalSearchInput: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    color: '#000',
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
    gap: 16,
  },
  followAvatar: {
    width: 61,
    height: 61,
    borderRadius: 15,
    overflow: 'hidden',
  },
  followName: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 17,
    color: '#000',
  },
})
