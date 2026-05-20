import { useState, useRef, useEffect } from 'react'
import {
  View, Text, Image, ScrollView, Pressable, StyleSheet,
  Dimensions, Animated, Easing,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const GRID_GAP = 2

const AVATARS: Record<string, number> = {
  'Anthena': require('../assets/images/anthena.jpg'),
  'ian.lin': require('../assets/images/ian.jpg'),
}
const AVATAR_COLORS: Record<string, string> = {
  'mia.c': '#B5C4B1',
}

const GRID_ROWS = [
  [
    require('../assets/images/profile1.jpg'),
    require('../assets/images/profile2.jpg'),
    require('../assets/images/profile3.jpg'),
  ],
  [
    require('../assets/images/profile4.jpg'),
    require('../assets/images/profile5.jpg'),
    require('../assets/images/profile6.jpg'),
  ],
  [
    require('../assets/images/profile7.jpg'),
    require('../assets/images/profile8.jpg'),
    require('../assets/images/profile9.jpg'),
  ],
  [
    require('../assets/images/profile10.jpg'),
    require('../assets/images/profile11.jpg'),
    require('../assets/images/profile12.jpg'),
  ],
]

export default function UserProfile() {
  const router = useRouter()
  const { user } = useLocalSearchParams<{ user: string }>()
  const [followed, setFollowed] = useState(false)

  const avatarImg = AVATARS[user]
  const avatarColor = AVATAR_COLORS[user] ?? '#C4B5B5'

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          {avatarImg ? (
            <Image source={avatarImg} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarInitial}>{user?.[0]?.toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.name}>{user}</Text>
          <Text style={styles.location}>Sydney AUS</Text>
          <Text style={styles.social}>Instagram{'             '}Spotify</Text>
          <View style={styles.btnRow}>
            <Pressable
              style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]}
              onPress={() => router.push({ pathname: '/chat', params: { user } })}
            >
              <Text style={styles.pillBtnText}>Message</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]}>
              <Text style={styles.pillBtnText}>Gallery</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.pillBtn, followed && styles.pillBtnFilled, pressed && { opacity: 0.6 }]}
              onPress={() => setFollowed(f => !f)}
            >
              <Text style={[styles.pillBtnText, followed && styles.pillBtnTextFilled]}>
                {followed ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>
        </View>

        {GRID_ROWS.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.gridRow}>
            {row.map((src, colIdx) => (
              <Image
                key={colIdx}
                source={src}
                style={[styles.gridItem, colIdx < 2 && { marginRight: GRID_GAP }]}
                resizeMode="cover"
              />
            ))}
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },
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
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 28, color: '#fff', fontWeight: '600' },
  name: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 40, color: '#000', marginBottom: 2 },
  location: { fontFamily: 'CormorantSC-Medium', fontSize: 18, color: '#808080', marginBottom: 6 },
  social: { fontFamily: 'CormorantSC-Medium', fontSize: 18, color: '#000', marginBottom: 14 },
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
  pillBtnFilled: { backgroundColor: '#000' },
  pillBtnText: { fontFamily: 'CormorantSC-SemiBold', fontSize: 18, color: '#000' },
  pillBtnTextFilled: { color: '#fff' },
  gridRow: { flexDirection: 'row', marginBottom: GRID_GAP },
  gridItem: { flex: 1, aspectRatio: 120 / 160 },
})
