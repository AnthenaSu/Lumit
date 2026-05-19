import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native'

const GRID_GAP = 2

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

export default function Profile() {
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Image
            source={require('../../assets/images/profile_avatar.jpg')}
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
  scroll: { paddingBottom: 110 },
  header: { paddingTop: 75, paddingHorizontal: 26, paddingBottom: 24 },
  avatar: {
    position: 'absolute',
    top: 75,
    right: 26,
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
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
  pillBtnText: { fontFamily: 'CormorantSC-SemiBold', fontSize: 18, color: '#000' },
  gridRow: { flexDirection: 'row', marginBottom: GRID_GAP },
  gridItem: { flex: 1, aspectRatio: 120 / 160 },
})
