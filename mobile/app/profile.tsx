import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { BlurView } from 'expo-blur'
import Svg, { Path, Circle } from 'react-native-svg'

const GRID_GAP = 2

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

// ─── Icons ───────────────────────────────────────────────────────────────────

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
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={7} r={4} stroke="#000" strokeWidth={2} />
    </Svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Profile() {
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/profile_avatar.jpg')}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.name}>Ian Lin</Text>
          <Text style={styles.location}>Sydney AUS</Text>
          <Text style={styles.social}>Instagram{'             '}Spotify</Text>
          <View style={styles.btnRow}>
            <Pressable style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]}>
              <Text style={styles.pillBtnText}>Following</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]}>
              <Text style={styles.pillBtnText}>Gallery</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.6 }]}>
              <Text style={styles.pillBtnText}>Setting</Text>
            </Pressable>
          </View>
        </View>

        {/* Grid */}
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

      {/* Nav pill */}
      <View style={styles.navPillShadow}>
        <BlurView intensity={80} tint="light" style={styles.navPill}>
          <View style={styles.navPillGlass} pointerEvents="none" />
          <Link href="/main" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconHome />
            </Pressable>
          </Link>
          <Link href="/message" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconSend />
            </Pressable>
          </Link>
          <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
            <Text style={styles.navBtnTText}>W</Text>
          </Pressable>
          <Link href="/search" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconSearch />
            </Pressable>
          </Link>
          <Pressable style={styles.navBtn}>
            <IconUser />
          </Pressable>
        </BlurView>
      </View>
    </View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 110 },

  // ── Header ──
  header: {
    paddingTop: 75,
    paddingHorizontal: 26,
    paddingBottom: 24,
  },
  avatar: {
    position: 'absolute',
    top: 75,
    right: 26,
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  name: {
    fontFamily: 'GCPrometheusDemo-Medium',
    fontSize: 40,
    color: '#000',
    marginBottom: 2,
  },
  location: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 18,
    color: '#808080',
    marginBottom: 6,
  },
  social: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 18,
    color: '#000',
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 24,
    marginHorizontal: -10,
  },
  pillBtn: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnText: {
    fontFamily: 'CormorantSC-SemiBold',
    fontSize: 18,
    color: '#000',
  },

  // ── Grid ──
  gridRow: {
    flexDirection: 'row',
    marginBottom: GRID_GAP,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 120 / 160,
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
