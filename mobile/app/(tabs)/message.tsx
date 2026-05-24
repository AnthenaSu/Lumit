import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Conversation = {
  id: number;
  user: string;
  avatar: number | null;
  color: string | null;
  preview: string;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    user: "Anthena",
    avatar: require("../../assets/images/anthena.jpg"),
    color: null,
    preview: "Love the arrangement 😍",
  },
  {
    id: 2,
    user: "ian.lin",
    avatar: require("../../assets/images/ian.jpg"),
    color: null,
    preview: "Had to grab it haha",
  },
  {
    id: 3,
    user: "mia.c",
    avatar: null,
    color: "#B5C4B1",
    preview: "The Sunday market is the best 🛍️",
  },
];

function Avatar({
  avatar,
  color,
  user,
}: {
  avatar: number | null;
  color: string | null;
  user: string;
}) {
  if (avatar) return <Image source={avatar} style={styles.avatar} />;
  return (
    <View style={[styles.avatar, { backgroundColor: color ?? "#ccc" }]}>
      <Text style={styles.avatarInitial}>{user[0].toUpperCase()}</Text>
    </View>
  );
}


export default function Message() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = CONVERSATIONS.filter((c) =>
    c.user.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Message</Text>
      </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for someone"
          placeholderTextColor="#595959"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({ pathname: "/chat", params: { user: item.user } })
            }
          >
            <Avatar avatar={item.avatar} color={item.color} user={item.user} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.user}</Text>
              <Text style={styles.preview} numberOfLines={1}>
                {item.preview}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  title: {
    fontFamily: "GCPrometheusDemo-SemiBold",
    fontSize: 50,
    lineHeight: 58,
    color: "#000",
    marginBottom: 10,
    flex: 1,
  },
  editBtn: { padding: 4 },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  searchInput: {
    fontFamily: "GCPrometheusDemo-Regular",
    fontSize: 16,
    color: "#000",
  },
  list: { paddingHorizontal: 16, paddingBottom: 110 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontFamily: "PublicSans-Regular",
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
  },
  preview: {
    fontFamily: "PublicSans-Regular",
    fontSize: 14,
    color: "#b3b3b3",
  },
});
