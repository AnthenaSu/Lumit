import { useState, useRef } from 'react'
import {
  View, Text, TextInput, FlatList, Image, Pressable,
  StyleSheet, Dimensions, ScrollView, Keyboard,
} from 'react-native'
import { Link } from 'expo-router'
import Svg, { Path, Circle } from 'react-native-svg'

const { width } = Dimensions.get('window')
const GRID_GAP = 8
const GRID_MARGIN = 16
const ITEM_WIDTH = (width - GRID_MARGIN * 2 - GRID_GAP * 2) / 3
const ITEM_HEIGHT = ITEM_WIDTH * (133 / 106)

// ─── Mock data ───────────────────────────────────────────────────────────────

const RECENT_PEOPLE_DATA = [
  { id: '1', username: 'Ian_lin',  subtitle: 'User', avatar: require('../assets/images/ian.jpg') },
  { id: '2', username: 'Anya',     subtitle: 'User', avatar: require('../assets/images/anthena.jpg') },
  { id: '3', username: 'Anthena',  subtitle: 'User', avatar: require('../assets/images/anthena.jpg') },
  { id: '4', username: 'momo_22',  subtitle: 'User', avatar: require('../assets/images/ian.jpg') },
  { id: '5', username: 'glass_lover', subtitle: 'User', avatar: require('../assets/images/anthena.jpg') },
  { id: '6', username: 'barista_k',   subtitle: 'User', avatar: require('../assets/images/ian.jpg') },
]

const RECENT_ITEMS_DATA = [
  { id: '1', name: 'cocktail',  subtitle: 'Keyword', thumbnail: require('../assets/images/post1.jpg') },
  { id: '2', name: 'wine',      subtitle: 'Keyword', thumbnail: require('../assets/images/post2.jpg') },
  { id: '3', name: 'lamp',      subtitle: 'Keyword', thumbnail: require('../assets/images/post1.jpg') },
  { id: '4', name: 'vase',      subtitle: 'Keyword', thumbnail: require('../assets/images/post2.jpg') },
  { id: '5', name: 'negroni',   subtitle: 'Keyword', thumbnail: require('../assets/images/post1.jpg') },
  { id: '6', name: 'martini',   subtitle: 'Keyword', thumbnail: require('../assets/images/post2.jpg') },
  { id: '7', name: 'bar cart',  subtitle: 'Keyword', thumbnail: require('../assets/images/post1.jpg') },
  { id: '8', name: 'glass set', subtitle: 'Keyword', thumbnail: require('../assets/images/post2.jpg') },
]

const USERS_DATA = [
  { id: '1', username: 'Ian_lin',        subtitle: 'User',             avatar: require('../assets/images/ian.jpg'),     defaultFollowing: true  },
  { id: '2', username: 'Inannne',        subtitle: '2 mutual friends', avatar: require('../assets/images/anthena.jpg'), defaultFollowing: false },
  { id: '3', username: 'lanlan_22',      subtitle: 'User',             avatar: require('../assets/images/ian.jpg'),     defaultFollowing: false },
  { id: '4', username: 'lan_likes_dogs', subtitle: '1 mutual friend',  avatar: require('../assets/images/anthena.jpg'), defaultFollowing: false },
]

const GRID_ITEMS = [
  { id: '0',  source: require('../assets/images/search1.jpg') },
  { id: '1',  source: require('../assets/images/search2.jpg') },
  { id: '2',  source: require('../assets/images/search3.jpg') },
  { id: '3',  source: require('../assets/images/search4.jpg') },
  { id: '4',  source: require('../assets/images/search5.jpg') },
  { id: '5',  source: require('../assets/images/search6.jpg') },
  { id: '6',  source: require('../assets/images/search7.jpg') },
  { id: '7',  source: require('../assets/images/search8.jpg') },
  { id: '8',  source: require('../assets/images/search9.jpg') },
  { id: '9',  source: require('../assets/images/search10.jpg') },
  { id: '10', source: require('../assets/images/search11.jpg') },
  { id: '11', source: require('../assets/images/search12.jpg') },
]

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconChevronBack() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

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
      <Circle cx={12} cy={7} r={4} stroke="#000" strokeWidth={1.5} />
    </Svg>
  )
}

function IconChevronDown() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M5 7.5l5 5 5-5" stroke="#333" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Search() {
  const inputRef = useRef<TextInput>(null)
  const justSubmitted = useRef(false)

  const [query, setQuery]           = useState('')
  const [focused, setFocused]       = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [showMorePeople, setShowMorePeople] = useState(false)
  const [showMoreItems, setShowMoreItems]   = useState(false)
  const [removedPeople, setRemovedPeople]   = useState<Set<string>>(new Set())
  const [removedItems, setRemovedItems]     = useState<Set<string>>(new Set())
  const [followedUsers, setFollowedUsers]   = useState<Set<string>>(
    new Set(USERS_DATA.filter(u => u.defaultFollowing).map(u => u.id))
  )

  const isHistory = searchActive && query.length === 0
  const isTyping  = searchActive && query.length > 0
  const isResults = !searchActive && submitted && query.length > 0
  const showSearchHeader = searchActive

  const handleBack = () => {
    justSubmitted.current = false
    setSearchActive(false)
    setFocused(false)
    setQuery('')
    setSubmitted(false)
    inputRef.current?.blur()
  }

  const handleSubmit = () => {
    if (!query.trim()) return
    justSubmitted.current = true
    setSubmitted(true)
    setSearchActive(false)
    setFocused(false)
    Keyboard.dismiss()
  }

  const toggleFollow = (id: string) =>
    setFollowedUsers(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const availablePeople  = RECENT_PEOPLE_DATA.filter(p => !removedPeople.has(p.id))
  const displayedPeople  = showMorePeople ? availablePeople : availablePeople.slice(0, 3)
  const hiddenPeopleCount = Math.max(0, availablePeople.length - 3)

  const availableItems  = RECENT_ITEMS_DATA.filter(i => !removedItems.has(i.id))
  const displayedItems  = showMoreItems ? availableItems : availableItems.slice(0, 3)
  const hiddenItemsCount = Math.max(0, availableItems.length - 3)

  const filteredUsers = USERS_DATA.filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase())
  )

  const pageBg = showSearchHeader ? '#f8f7f7' : '#fff'

  return (
    <View style={[styles.page, { backgroundColor: pageBg }]}>

      {/* ── Top area ── */}
      <Pressable onPress={Keyboard.dismiss} style={styles.topArea}>
        {showSearchHeader ? (
          <View style={styles.headerRow}>
            <Pressable onPress={handleBack} hitSlop={16} style={styles.chevronBtn}>
              <IconChevronBack />
            </Pressable>
            <Text style={styles.headerTitle}>Search</Text>
          </View>
        ) : (
          <Text style={styles.browseTitle}>
            {isResults ? query : 'Search ...'}
          </Text>
        )}

        <View style={styles.searchBarWrap}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="search users, items ..."
            placeholderTextColor="#595959"
            value={query}
            onChangeText={setQuery}
            onFocus={() => { setFocused(true); setSearchActive(true); setSubmitted(false) }}
            onBlur={() => setFocused(false)}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
          />
        </View>
      </Pressable>

      {/* ── History state ── */}
      {isHistory && (
        <ScrollView
          style={styles.contentArea}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentPadding}
        >
          {/* Recent People card */}
          {availablePeople.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionCardHeader}>
                <Text style={styles.sectionLabel}>RECENT PEOPLE</Text>
                <Pressable
                  onPress={() => setRemovedPeople(new Set(RECENT_PEOPLE_DATA.map(p => p.id)))}
                  hitSlop={8}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>

              {displayedPeople.map((person, idx) => (
                <View
                  key={person.id}
                  style={[
                    styles.historyRow,
                    idx === displayedPeople.length - 1 && styles.historyRowLast,
                  ]}
                >
                  <Image source={person.avatar} style={styles.rowAvatar} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{person.username}</Text>
                    <Text style={styles.rowSub}>{person.subtitle}</Text>
                  </View>
                  <Pressable
                    onPress={() => setRemovedPeople(prev => new Set([...prev, person.id]))}
                    hitSlop={10}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeBtnText}>x</Text>
                  </Pressable>
                </View>
              ))}

              {hiddenPeopleCount > 0 && (
                <Pressable
                  onPress={() => setShowMorePeople(v => !v)}
                  style={styles.showMoreRow}
                >
                  <Text style={styles.showMoreText}>
                    {showMorePeople ? 'Show less' : `Show ${hiddenPeopleCount} more people`}
                  </Text>
                  <View style={showMorePeople && styles.chevronFlipped}>
                    <IconChevronDown />
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* Recent Items card */}
          {availableItems.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionCardHeader}>
                <Text style={styles.sectionLabel}>RECENT ITEMS</Text>
                <Pressable
                  onPress={() => setRemovedItems(new Set(RECENT_ITEMS_DATA.map(i => i.id)))}
                  hitSlop={8}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>

              {displayedItems.map((item, idx) => (
                <View
                  key={item.id}
                  style={[
                    styles.historyRow,
                    idx === displayedItems.length - 1 && styles.historyRowLast,
                  ]}
                >
                  <Image source={item.thumbnail} style={styles.rowAvatar} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{item.name}</Text>
                    <Text style={styles.rowSub}>{item.subtitle}</Text>
                  </View>
                  <Pressable
                    onPress={() => setRemovedItems(prev => new Set([...prev, item.id]))}
                    hitSlop={10}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeBtnText}>x</Text>
                  </Pressable>
                </View>
              ))}

              {hiddenItemsCount > 0 && (
                <Pressable
                  onPress={() => setShowMoreItems(v => !v)}
                  style={styles.showMoreRow}
                >
                  <Text style={styles.showMoreText}>
                    {showMoreItems ? 'Show less' : `Show ${hiddenItemsCount} more items`}
                  </Text>
                  <View style={showMoreItems && styles.chevronFlipped}>
                    <IconChevronDown />
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Typing state ── */}
      {isTyping && (
        <ScrollView
          style={styles.contentArea}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentPadding}
        >
          <Text style={styles.peopleLabel}>PEOPLE</Text>

          {filteredUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <Image source={user.avatar} style={styles.rowAvatar} />
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{user.username}</Text>
                <Text style={styles.rowSub}>{user.subtitle}</Text>
              </View>
              <Pressable
                onPress={() => toggleFollow(user.id)}
                style={followedUsers.has(user.id) ? styles.followingBtn : styles.followBtn}
              >
                <Text style={styles.followBtnText}>
                  {followedUsers.has(user.id) ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Browse & Results: image grid ── */}
      {!isHistory && !isTyping && (
        <FlatList
          data={GRID_ITEMS}
          numColumns={3}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <Image source={item.source} style={styles.gridItem} resizeMode="cover" />
          )}
        />
      )}

      {/* ── Nav pill (hidden while in search mode) ── */}
      {!searchActive && (
        <View style={styles.navPill}>
          <Link href="/main" asChild>
            <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
              <IconHome />
            </Pressable>
          </Link>
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
      )}
    </View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1 },

  // ── Top area ──
  topArea: {
    paddingTop: 60,
    paddingHorizontal: GRID_MARGIN,
    paddingBottom: 10,
  },

  // Browse / Results title
  browseTitle: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 50,
    color: '#000',
    lineHeight: 58,
    marginBottom: 10,
  },

  // History / Typing header row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  chevronBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 58,
  },
  headerTitle: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 50,
    color: '#000',
    lineHeight: 58,
  },

  // Search bar
  searchBarWrap: {
    height: 42,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchInput: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#000',
  },

  // ── Shared content area ──
  contentArea: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: GRID_MARGIN,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ── History section card ──
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#b3b3b3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 13,
    color: '#b3b3b3',
    letterSpacing: 0.8,
  },
  clearText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#333',
  },

  // History rows (inside card)
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b3b3b3',
  },
  historyRowLast: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#b3b3b3',
  },

  // Remove (x) button
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(217,217,217,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  removeBtnText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
  },

  // Show more row (inside card, below last row)
  showMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#333',
  },
  chevronFlipped: {
    transform: [{ rotate: '180deg' }],
  },

  // ── Typing: PEOPLE label ──
  peopleLabel: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 13,
    color: '#b3b3b3',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Typing: individual user cards
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 80,
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  // Shared row content
  rowAvatar: {
    width: 56,
    height: 56,
    borderRadius: 15,
    marginRight: 14,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontFamily: 'PublicSans-SemiBold',
    fontSize: 17,
    color: '#000',
    marginBottom: 2,
  },
  rowSub: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 15,
    color: '#808080',
  },

  // Follow buttons
  followBtn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  followingBtn: {
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: 'rgba(217,217,217,0.5)',
  },
  followBtnText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 13,
    color: '#1e1e1e',
  },

  // ── Grid ──
  gridContent: {
    paddingHorizontal: GRID_MARGIN,
    paddingTop: 6,
    paddingBottom: 110,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 5,
  },

  // ── Nav pill ──
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
