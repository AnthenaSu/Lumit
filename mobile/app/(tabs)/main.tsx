import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
  Image, Modal, TextInput, KeyboardAvoidingView, Platform, Animated, FlatList,
  Share, Linking,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import * as Clipboard from "expo-clipboard";

const { width, height } = Dimensions.get("window");
const photoWidth = width;
const photoHeight = width * (4 / 3);

type Comment = {
  id: number; user: string; avatar: number | null; color: string | null; text: string;
};

const MOCK_USERS = {
  anthena: { avatar: require("../../assets/images/anthena.jpg") as number, color: null },
  ian:     { avatar: require("../../assets/images/ian.jpg") as number, color: null },
  mia:     { avatar: null, color: "#B5C4B1" },
};

const POSTS = [
  {
    id: 1, user: "Anthena", location: "Sydney", time: "1 hour ago",
    photo: require("../../assets/images/post1.jpg"),
    comments: [
      { id: 1, user: "ian.lin", ...MOCK_USERS.ian,     text: "So beautiful! 🌻" },
      { id: 2, user: "mia.c",   ...MOCK_USERS.mia,     text: "Love the arrangement 😍" },
      { id: 3, user: "Anthena", ...MOCK_USERS.anthena, text: "Thank you both 🌸" },
    ] as Comment[],
  },
  {
    id: 2, user: "ian.lin", location: "Melbourne", time: "3 hours ago",
    photo: require("../../assets/images/post2.jpg"),
    comments: [
      { id: 1, user: "Anthena", ...MOCK_USERS.anthena, text: "I love this find!" },
      { id: 2, user: "mia.c",   ...MOCK_USERS.mia,     text: "The Sunday market is the best 🛍️" },
      { id: 3, user: "ian.lin", ...MOCK_USERS.ian,     text: "Had to grab it haha" },
    ] as Comment[],
  },
];

const SHARE_FRIENDS = [
  { id: "1", user: "Anthena", label: "Anthena", avatar: require("../../assets/images/anthena.jpg") as number, color: null },
  { id: "2", user: "ian.lin", label: "ian.lin",  avatar: require("../../assets/images/ian.jpg") as number,     color: null },
  { id: "3", user: "mia.c",   label: "mia.c",    avatar: null,                                                  color: "#B5C4B1" },
  { id: "4", user: "ian.lin", label: "Chris",     avatar: require("../../assets/images/ian.jpg") as number,     color: null },
  { id: "5", user: "Anthena", label: "scnr_c",    avatar: require("../../assets/images/anthena.jpg") as number, color: null },
  { id: "6", user: "mia.c",   label: "1risyan9",  avatar: null,                                                  color: "#C4B5C1" },
];

const SHARE_APPS = [
  { id: "1", label: "Copy link",  bg: "#e5e5ea", icon: "link" },
  { id: "2", label: "Instagram",  bg: "#000",    icon: "instagram" },
  { id: "3", label: "Share to…",  bg: "#e5e5ea", icon: "share" },
];

type CatState = { visible: boolean; x: number };

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconComment() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconSearchSm() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke="#808080" strokeWidth={2} />
      <Path d="M21 21l-4.35-4.35" stroke="#808080" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

function IconGroupAdd() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={4} stroke="#000" strokeWidth={1.5} />
      <Path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 8v6M16 11h6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

function AppIcon({ icon, bg }: { icon: string; bg: string }) {
  const sw = 1.8
  const stroke = bg === "#e5e5ea" ? "#333" : "#fff"
  return (
    <View style={[styles.appIconCircle, { backgroundColor: bg }]}>
      {icon === "link" && (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
      {icon === "share" && (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M16 6l-4-4-4 4M12 2v13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
      {icon === "instagram" && (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={5} stroke="#fff" strokeWidth={sw} />
          <Path d="M17.5 3h-11A3.5 3.5 0 0 0 3 6.5v11A3.5 3.5 0 0 0 6.5 21h11a3.5 3.5 0 0 0 3.5-3.5v-11A3.5 3.5 0 0 0 17.5 3z" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx={18} cy={6} r={1} fill="#fff" />
        </Svg>
      )}
    </View>
  )
}

function FriendCircle({ avatar, color, user, size }: { avatar: number | null; color: string | null; user: string; size: number }) {
  const sq = { width: size, height: size, borderRadius: 15 }
  if (avatar) return <Image source={avatar} style={sq} />
  return (
    <View style={[sq, { backgroundColor: color ?? "#ccc", alignItems: "center", justifyContent: "center" }]}>
      <Text style={{ color: "#fff", fontSize: size * 0.38, fontWeight: "600" }}>{user[0].toUpperCase()}</Text>
    </View>
  )
}

function CommentAvatar({ avatar, color, user }: { avatar: number | null; color: string | null; user: string }) {
  if (avatar) return <Image source={avatar} style={styles.commentAvatar} />;
  return (
    <View style={[styles.commentAvatar, styles.commentAvatarPlaceholder, { backgroundColor: color ?? "#ccc" }]}>
      <Text style={styles.commentAvatarInitial}>{user[0].toUpperCase()}</Text>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Main() {
  const router = useRouter();
  const [cats, setCats] = useState<Record<number, CatState>>({});
  const [iconVisible, setIconVisible] = useState<Record<number, boolean>>({});
  const lastTap = useRef<Record<number, number>>({});
  const singleTapTimer = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const usernameWidths = useRef<Record<number, number>>({});
  const metaWidths = useRef<Record<number, number>>({});
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Share sheet
  const [sharePostId, setSharePostId] = useState<number | null>(null);
  const [shareSearch, setShareSearch] = useState("");
  const [pendingFriend, setPendingFriend] = useState<typeof SHARE_FRIENDS[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const sheetAnim = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openShare = (postId: number) => {
    setSharePostId(postId);
    setShareSearch("");
    setPendingFriend(null);
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(sheetAnim, { toValue: 0, damping: 24, stiffness: 280, useNativeDriver: true }),
    ]).start();
  };

  const closeShare = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetAnim, { toValue: 500, duration: 200, useNativeDriver: true }),
    ]).start(() => { setSharePostId(null); setPendingFriend(null); });
  };

  const confirmSend = () => {
    if (!pendingFriend) return;
    const postId = sharePostId;
    const friendUser = pendingFriend.user;
    closeShare();
    setTimeout(() => {
      router.push({ pathname: "/chat", params: { user: friendUser, sharedPostId: String(postId) } });
    }, 200);
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://lumit.app/post/${sharePostId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInstagram = async () => {
    const canOpen = await Linking.canOpenURL("instagram://app");
    if (canOpen) {
      Linking.openURL("instagram://app");
    } else {
      Linking.openURL("https://www.instagram.com");
    }
  };

  const handleShareTo = async () => {
    await Share.share({ message: `Check out this post on Lumit 🌿 lumit.app/post/${sharePostId}` });
  };

  // Comment sheet
  const openComment = (postId: number) => {
    setOpenPostId(postId);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const closeComment = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }),
    ]).start(() => setOpenPostId(null));
  };

  const handlePhotoPress = (postId: number) => {
    const now = Date.now();
    const prev = lastTap.current[postId] ?? 0;
    if (now - prev < 300) {
      clearTimeout(singleTapTimer.current[postId]);
      if (cats[postId]?.visible) {
        setCats((s) => ({ ...s, [postId]: { visible: false, x: 0 } }));
      } else {
        const nameWidth = usernameWidths.current[postId] ?? 100;
        const metaWidth = metaWidths.current[postId] ?? 0;
        const minX = 14 + Math.max(nameWidth, metaWidth) + 6;
        const maxX = width - 48;
        const x = minX + Math.random() * (maxX - minX);
        setCats((s) => ({ ...s, [postId]: { visible: true, x } }));
      }
    } else {
      singleTapTimer.current[postId] = setTimeout(() => {
        setIconVisible((s) => ({ ...s, [postId]: !s[postId] }));
      }, 300);
    }
    lastTap.current[postId] = now;
  };

  const openPost = POSTS.find((p) => p.id === openPostId) ?? null;

  const filteredFriends = SHARE_FRIENDS.filter(f =>
    f.label.toLowerCase().includes(shareSearch.toLowerCase())
  );

  return (
    <View style={styles.page}>
      <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Lumit</Text>
        </View>

        {POSTS.map((post) => (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <View>
                <Text style={styles.username} onLayout={(e) => { usernameWidths.current[post.id] = e.nativeEvent.layout.width; }}>
                  {post.user}
                </Text>
                <Text style={styles.meta} onLayout={(e) => { metaWidths.current[post.id] = e.nativeEvent.layout.width; }}>
                  {post.location} · {post.time}
                </Text>
              </View>
            </View>

            <View style={{ width: photoWidth, height: photoHeight, overflow: "visible" }}>
              {cats[post.id]?.visible && (
                <Image source={require("../../assets/images/cat.png")} style={[styles.catSticker, { left: cats[post.id].x }]} />
              )}
              <Pressable
                onPress={() => handlePhotoPress(post.id)}
                onLongPress={() => openShare(post.id)}
                delayLongPress={400}
                style={StyleSheet.absoluteFill}
              >
                <Image source={post.photo} style={styles.photoImg} resizeMode="cover" />
              </Pressable>
              {iconVisible[post.id] && (
                <Pressable style={styles.commentIconBtn} onPress={() => openComment(post.id)}>
                  <IconComment />
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Share sheet modal ── */}
      <Modal visible={sharePostId !== null} transparent animationType="none" onRequestClose={closeShare}>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* backdrop */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.shareBackdrop, { opacity: backdropAnim }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeShare} />
          </Animated.View>

          {/* sheet */}
          <Animated.View style={[styles.shareSheet, { transform: [{ translateY: sheetAnim }] }]}>
            <View style={styles.shareHandle} />

            {/* Search row */}
            <View style={styles.shareSearchRow}>
              <View style={styles.shareSearchBar}>
                <IconSearchSm />
                <TextInput
                  style={styles.shareSearchInput}
                  placeholder="Search"
                  placeholderTextColor="#808080"
                  value={shareSearch}
                  onChangeText={setShareSearch}
                />
              </View>
              <View style={styles.shareGroupBtn}>
                <IconGroupAdd />
              </View>
            </View>

            {pendingFriend ? (
              /* ── Confirmation view ── */
              <View style={styles.confirmView}>
                <FriendCircle avatar={pendingFriend.avatar} color={pendingFriend.color} user={pendingFriend.user} size={72} />
                <Text style={styles.confirmText}>傳送給</Text>
                <Text style={styles.confirmName}>{pendingFriend.label}</Text>
                <View style={styles.confirmBtns}>
                  <Pressable style={styles.confirmCancel} onPress={() => setPendingFriend(null)}>
                    <Text style={styles.confirmCancelText}>取消</Text>
                  </Pressable>
                  <Pressable style={styles.confirmSend} onPress={confirmSend}>
                    <Text style={styles.confirmSendText}>確認傳送</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                {/* Friends grid */}
                <FlatList
                  data={filteredFriends}
                  keyExtractor={f => f.id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={styles.friendGrid}
                  columnWrapperStyle={styles.friendGridRow}
                  renderItem={({ item }) => (
                    <Pressable style={styles.friendCell} onPress={() => setPendingFriend(item)}>
                      <FriendCircle avatar={item.avatar} color={item.color} user={item.user} size={72} />
                      <Text style={styles.friendCellName} numberOfLines={1}>{item.label}</Text>
                    </Pressable>
                  )}
                />

                <View style={styles.shareDivider} />

                {/* App share row */}
                <View style={styles.appShareRow}>
                  <Pressable style={styles.appItem} onPress={handleCopyLink}>
                    <AppIcon icon="link" bg="#e5e5ea" />
                    <Text style={styles.appLabel}>{copied ? "已複製！" : "Copy link"}</Text>
                  </Pressable>
                  <Pressable style={styles.appItem} onPress={handleInstagram}>
                    <AppIcon icon="instagram" bg="#000" />
                    <Text style={styles.appLabel}>Instagram</Text>
                  </Pressable>
                  <Pressable style={styles.appItem} onPress={handleShareTo}>
                    <AppIcon icon="share" bg="#e5e5ea" />
                    <Text style={styles.appLabel}>Share to…</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* ── Comment sheet modal ── */}
      <Modal visible={openPostId !== null} transparent animationType="none" onRequestClose={closeComment}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeComment} />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Comment</Text>
              <ScrollView style={styles.commentList} contentContainerStyle={styles.commentListContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {openPost?.comments.map((c) => (
                  <View key={c.id} style={styles.commentRow}>
                    <CommentAvatar avatar={c.avatar} color={c.color} user={c.user} />
                    <View style={styles.commentBody}>
                      <Text style={styles.commentUser}>{c.user}</Text>
                      <Text style={styles.commentText}>{c.text}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder={`Add a comment for ${openPost?.user ?? ""} ...`}
                  placeholderTextColor="#b3b3b3"
                  value={commentInput}
                  onChangeText={setCommentInput}
                  returnKeyType="send"
                  onSubmitEditing={() => setCommentInput("")}
                />
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  feed: { flex: 1 },
  feedContent: { paddingBottom: 110 },
  header: { paddingTop: 56, paddingBottom: 14, alignItems: "center" },
  brand: { fontFamily: "GCPrometheusDemo-Regular", fontSize: 40, color: "#000" },
  post: { paddingBottom: 8, marginBottom: 12 },
  postHeader: { paddingTop: 4, paddingBottom: 4, paddingLeft: 14, paddingRight: 12 },
  catSticker: { position: "absolute", top: -50, width: 48, height: 50 },
  username: { fontFamily: "Alyamama", fontSize: 18, lineHeight: 20, color: "#000", alignSelf: "flex-start" },
  photoImg: { width: photoWidth, height: photoHeight },
  commentIconBtn: { position: "absolute", bottom: 12, right: 12, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  meta: { fontSize: 13, color: "rgba(0,0,0,0.5)", alignSelf: "flex-start" },

  // ── Share sheet ──
  shareBackdrop: { backgroundColor: "rgba(0,0,0,0.55)" },
  shareSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  shareHandle: {
    width: 36, height: 4, backgroundColor: "#d0d0d0", borderRadius: 2,
    alignSelf: "center", marginTop: 10, marginBottom: 14,
  },
  shareSearchRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, gap: 10, marginBottom: 20,
  },
  shareSearchBar: {
    flex: 1, flexDirection: "row", alignItems: "center",
    backgroundColor: "#f0f0f0", borderRadius: 50,
    paddingHorizontal: 14, height: 42, gap: 8,
  },
  shareSearchInput: {
    flex: 1, fontFamily: "PublicSans-Regular", fontSize: 16, color: "#000",
  },
  shareGroupBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#f0f0f0",
    alignItems: "center", justifyContent: "center",
  },

  // Friends grid
  friendGrid: { paddingHorizontal: 8 },
  friendGridRow: { justifyContent: "space-around", marginBottom: 16 },
  friendCell: { alignItems: "center", gap: 6, width: (width - 32) / 3 },
  friendCellName: {
    fontFamily: "PublicSans-Regular", fontSize: 12, color: "#000",
    maxWidth: 80, textAlign: "center",
  },

  shareDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#e0e0e0", marginHorizontal: 16, marginBottom: 16 },

  // App share row
  appShareRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  appItem: { alignItems: "center", gap: 6 },
  appIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  appLabel: { fontFamily: "PublicSans-Regular", fontSize: 11, color: "#000", textAlign: "center", maxWidth: 64 },

  // Confirmation view
  confirmView: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 6,
  },
  confirmText: {
    fontFamily: "PublicSans-Regular",
    fontSize: 13,
    color: "#999",
    marginTop: 12,
  },
  confirmName: {
    fontFamily: "PublicSans-Regular",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  confirmBtns: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmCancel: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCancelText: {
    fontFamily: "PublicSans-Regular",
    fontSize: 16,
    color: "#333",
  },
  confirmSend: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmSendText: {
    fontFamily: "PublicSans-Regular",
    fontSize: 16,
    color: "#fff",
  },

  // ── Comment modal ──
  modalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    height: height * 0.65, paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  sheetTitle: { fontFamily: "GCPrometheusDemo-Regular", fontSize: 18, color: "#000", textAlign: "center", paddingVertical: 12 },
  commentList: { flex: 1 },
  commentListContent: { paddingHorizontal: 20, paddingBottom: 8 },
  commentRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20, gap: 12 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20 },
  commentAvatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  commentAvatarInitial: { fontSize: 16, color: "#fff", fontWeight: "600" },
  commentBody: { flex: 1, gap: 2 },
  commentUser: { fontFamily: "Alyamama", fontSize: 14, color: "#808080" },
  commentText: { fontSize: 15, color: "#000", lineHeight: 21 },
  inputRow: { paddingHorizontal: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  commentInput: { backgroundColor: "#f0f0f0", borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, color: "#000" },
});
