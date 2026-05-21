import { useState, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, Image, Pressable,
  StyleSheet, ScrollView, Keyboard,
} from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'


const GRID_MARGIN = 16

const RECENT_PEOPLE_DATA = [
  { id: '1', username: 'Ian_lin',     subtitle: 'User', avatar: require('../assets/images/ian.jpg') },
  { id: '2', username: 'Anya',        subtitle: 'User', avatar: require('../assets/images/anthena.jpg') },
  { id: '3', username: 'Anthena',     subtitle: 'User', avatar: require('../assets/images/anthena.jpg') },
  { id: '4', username: 'momo_22',     subtitle: 'User', avatar: require('../assets/images/ian.jpg') },
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

function IconChevronDown() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M5 7.5l5 5 5-5" stroke="#333" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function SearchHistory() {
  const router = useRouter()
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState('')
  const [showMorePeople, setShowMorePeople] = useState(false)
  const [showMoreItems, setShowMoreItems]   = useState(false)
  const [removedPeople, setRemovedPeople]   = useState<Set<string>>(new Set())
  const [removedItems, setRemovedItems]     = useState<Set<string>>(new Set())
  const [followedUsers, setFollowedUsers]   = useState<Set<string>>(
    new Set(USERS_DATA.filter(u => u.defaultFollowing).map(u => u.id))
  )

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const isTyping = query.length > 0

  const handleBack = () => {
    Keyboard.dismiss()
    router.back()
  }

  const handleSubmit = () => {
    if (!query.trim()) return
    Keyboard.dismiss()
    router.back()
  }

  const toggleFollow = (id: string) =>
    setFollowedUsers(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const availablePeople   = RECENT_PEOPLE_DATA.filter(p => !removedPeople.has(p.id))
  const displayedPeople   = showMorePeople ? availablePeople : availablePeople.slice(0, 3)
  const hiddenPeopleCount = Math.max(0, availablePeople.length - 3)

  const availableItems   = RECENT_ITEMS_DATA.filter(i => !removedItems.has(i.id))
  const displayedItems   = showMoreItems ? availableItems : availableItems.slice(0, 3)
  const hiddenItemsCount = Math.max(0, availableItems.length - 3)

  const filteredUsers = USERS_DATA.filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <View style={styles.page}>
      {/* Fixed header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.searchBarWrap}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="search users, items ..."
            placeholderTextColor="#595959"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
          />
        </View>
      </View>

      {/* History cards */}
      {!isTyping && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.historyContent}
        >
          {availablePeople.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>RECENT PEOPLE</Text>
                <Pressable onPress={() => setRemovedPeople(new Set(RECENT_PEOPLE_DATA.map(p => p.id)))} hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>
              {displayedPeople.map((person, idx) => (
                <View key={person.id} style={[styles.row, idx === displayedPeople.length - 1 && styles.rowLast]}>
                  <Image source={person.avatar} style={styles.avatar} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{person.username}</Text>
                    <Text style={styles.rowSub}>{person.subtitle}</Text>
                  </View>
                  <Pressable onPress={() => setRemovedPeople(prev => new Set([...prev, person.id]))} hitSlop={10} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>x</Text>
                  </Pressable>
                </View>
              ))}
              {hiddenPeopleCount > 0 && (
                <Pressable onPress={() => setShowMorePeople(v => !v)} style={styles.showMoreRow}>
                  <Text style={styles.showMoreText}>{showMorePeople ? 'Show less' : `Show ${hiddenPeopleCount} more people`}</Text>
                  <View style={showMorePeople ? styles.chevronFlipped : undefined}><IconChevronDown /></View>
                </Pressable>
              )}
            </View>
          )}

          {availableItems.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>RECENT ITEMS</Text>
                <Pressable onPress={() => setRemovedItems(new Set(RECENT_ITEMS_DATA.map(i => i.id)))} hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>
              {displayedItems.map((item, idx) => (
                <View key={item.id} style={[styles.row, idx === displayedItems.length - 1 && styles.rowLast]}>
                  <Image source={item.thumbnail} style={styles.avatar} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{item.name}</Text>
                    <Text style={styles.rowSub}>{item.subtitle}</Text>
                  </View>
                  <Pressable onPress={() => setRemovedItems(prev => new Set([...prev, item.id]))} hitSlop={10} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>x</Text>
                  </Pressable>
                </View>
              ))}
              {hiddenItemsCount > 0 && (
                <Pressable onPress={() => setShowMoreItems(v => !v)} style={styles.showMoreRow}>
                  <Text style={styles.showMoreText}>{showMoreItems ? 'Show less' : `Show ${hiddenItemsCount} more items`}</Text>
                  <View style={showMoreItems ? styles.chevronFlipped : undefined}><IconChevronDown /></View>
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Typing results */}
      {isTyping && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContent}
        >
          <Text style={styles.peopleLabel}>PEOPLE</Text>
          {filteredUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <Image source={user.avatar} style={styles.avatar} />
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
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },

  header: { paddingTop: 60, paddingHorizontal: GRID_MARGIN, paddingBottom: 12 },
  headerTitle: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 50,
    color: '#000',
    lineHeight: 58,
    marginBottom: 10,
  },
  searchBarWrap: {
    height: 42,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  searchInput: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#000' },

  historyContent: { paddingHorizontal: GRID_MARGIN, paddingTop: 8, paddingBottom: 60 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  cardLabel: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 11, color: '#888', letterSpacing: 0.8 },
  clearText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 13, color: '#333' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    paddingHorizontal: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
  },
  rowLast: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e8e8e8', marginBottom: 4 },
  avatar: { width: 40, height: 40, borderRadius: 15, marginRight: 12 },
  rowInfo: { flex: 1 },
  rowName: { fontFamily: 'PublicSans-SemiBold', fontSize: 14, color: '#000', marginBottom: 1 },
  rowSub: { fontFamily: 'PublicSans-Regular', fontSize: 12, color: '#808080' },
  removeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(217,217,217,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  removeBtnText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 12, color: '#000', lineHeight: 16 },
  showMoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  showMoreText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 13, color: '#333' },
  chevronFlipped: { transform: [{ rotate: '180deg' }] },

  resultsContent: { paddingHorizontal: GRID_MARGIN, paddingTop: 8, paddingBottom: 40 },
  peopleLabel: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 13, color: '#b3b3b3', letterSpacing: 0.8, marginBottom: 10 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 80,
    paddingHorizontal: 16,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
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
  followBtnText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 13, color: '#1e1e1e' },
})
