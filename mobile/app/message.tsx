import { useState } from 'react'
import {
  View, Text, FlatList, Image, Pressable,
  TextInput, StyleSheet, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path, Rect } from 'react-native-svg'

const { width } = Dimensions.get('window')

type Conversation = {
  id: number
  user: string
  avatar: number | null
  color: string | null
  preview: string
}

const CONVERSATIONS: Conversation[] = [
  { id: 1, user: 'Anthena',  avatar: require('../assets/images/anthena.jpg'), color: null,       preview: 'Love the arrangement 😍' },
  { id: 2, user: 'ian.lin',  avatar: require('../assets/images/ian.jpg'),     color: null,       preview: 'Had to grab it haha' },
  { id: 3, user: 'mia.c',    avatar: null,                                    color: '#B5C4B1',  preview: 'The Sunday market is the best 🛍️' },
]

function Avatar({ avatar, color, user }: { avatar: number | null; color: string | null; user: string }) {
  if (avatar) {
    return <Image source={avatar} style={styles.avatar} />
  }
  return (
    <View style={[styles.avatar, { backgroundColor: color ?? '#ccc' }]}>
      <Text style={styles.avatarInitial}>{user[0].toUpperCase()}</Text>
    </View>
  )
}

function IconEdit() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function Message() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = CONVERSATIONS.filter(c =>
    c.user.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Message</Text>
        <Pressable style={styles.editBtn}>
          <IconEdit />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for someone"
          placeholderTextColor="#b3b3b3"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: '/chat', params: { user: item.user, avatarId: item.id } })}
          >
            <Avatar avatar={item.avatar} color={item.color} user={item.user} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.user}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.preview}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 48,
    color: '#000',
    flex: 1,
  },
  editBtn: { padding: 4 },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  searchInput: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    color: '#000',
  },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  preview: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 14,
    color: '#b3b3b3',
  },
})
