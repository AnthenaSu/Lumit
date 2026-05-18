import { useState } from 'react'
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path, Circle } from 'react-native-svg'

const { width } = Dimensions.get('window')
const GRID_GAP = 8
const GRID_MARGIN = 16
const ITEM_WIDTH = (width - GRID_MARGIN * 2 - GRID_GAP * 2) / 3
const ITEM_HEIGHT = ITEM_WIDTH * (133 / 106)

const GRID_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i),
  source: i % 2 === 0
    ? require('../assets/images/post1.jpg')
    : require('../assets/images/post2.jpg'),
}))

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

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  return (
    <View style={styles.page}>
      <FlatList
        data={GRID_ITEMS}
        numColumns={3}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Wine Glass</Text>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="search users, items ..."
                placeholderTextColor="#595959"
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Image source={item.source} style={styles.gridItem} resizeMode="cover" />
        )}
      />

      <View style={styles.navPill}>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
          onPress={() => router.push('/main')}
        >
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
  listContent: {
    paddingTop: 65,
    paddingHorizontal: GRID_MARGIN,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 50,
    color: '#000',
    lineHeight: 60,
    marginBottom: 14,
  },
  searchBar: {
    width: 340,
    height: 42,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchInput: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#000',
  },
  row: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 5,
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
