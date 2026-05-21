import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  FlatList,
  Share,
  Linking,
  Keyboard,
  DeviceEventEmitter,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import * as Clipboard from "expo-clipboard";

const { width, height } = Dimensions.get("window");
const photoWidth = width;
const photoHeight = width * (4 / 3);

type Comment = {
  id: number;
  user: string;
  avatar: number | null;
  color: string | null;
  text: string;
};

const MOCK_USERS = {
  anthena: {
    avatar: require("../../assets/images/anthena.jpg") as number,
    color: null,
  },
  ian: {
    avatar: require("../../assets/images/ian.jpg") as number,
    color: null,
  },
  mia: { avatar: null, color: "#B5C4B1" },
};

const POSTS = [
  {
    id: 1,
    user: "Anthena",
    location: "Sydney",
    time: "1 hour ago",
    photo: require("../../assets/images/post1.jpg"),
    comments: [
      { id: 1, user: "ian.lin", ...MOCK_USERS.ian, text: "So beautiful! 🌻" },
      {
        id: 2,
        user: "mia.c",
        ...MOCK_USERS.mia,
        text: "Love the arrangement 😍",
      },
      {
        id: 3,
        user: "Anthena",
        ...MOCK_USERS.anthena,
        text: "Thank you both 🌸",
      },
    ] as Comment[],
  },
  {
    id: 2,
    user: "ian.lin",
    location: "Melbourne",
    time: "3 hours ago",
    photo: require("../../assets/images/post2.jpg"),
    comments: [
      {
        id: 1,
        user: "Anthena",
        ...MOCK_USERS.anthena,
        text: "I love this find!",
      },
      {
        id: 2,
        user: "mia.c",
        ...MOCK_USERS.mia,
        text: "The Sunday market is the best 🛍️",
      },
      {
        id: 3,
        user: "ian.lin",
        ...MOCK_USERS.ian,
        text: "Had to grab it haha",
      },
    ] as Comment[],
  },
];

const SHARE_FRIENDS = [
  {
    id: "1",
    user: "Anthena",
    label: "Anthena",
    avatar: require("../../assets/images/anthena.jpg") as number,
    color: null,
  },
  {
    id: "2",
    user: "ian.lin",
    label: "ian.lin",
    avatar: require("../../assets/images/ian.jpg") as number,
    color: null,
  },
  { id: "3", user: "mia.c", label: "mia.c", avatar: null, color: "#B5C4B1" },
  {
    id: "4",
    user: "ian.lin",
    label: "Chris",
    avatar: require("../../assets/images/ian.jpg") as number,
    color: null,
  },
  {
    id: "5",
    user: "Anthena",
    label: "scnr_c",
    avatar: require("../../assets/images/anthena.jpg") as number,
    color: null,
  },
  { id: "6", user: "mia.c", label: "1risyan9", avatar: null, color: "#C4B5C1" },
];


type CatState = { visible: boolean; x: number };

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconComment() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconSearchSm() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke="#808080" strokeWidth={2} />
      <Path
        d="M21 21l-4.35-4.35"
        stroke="#808080"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function IconCheck() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconGroupAdd() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={4} stroke="#000" strokeWidth={1.5} />
      <Path
        d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M19 8v6M16 11h6"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function AppIcon({ icon }: { icon: string }) {
  const sw = 1.8;
  return (
    <View style={styles.appIconCircle}>
      {(icon === "link" || icon === "check") && (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          {icon === "check" ? (
            <Path
              d="M20 6L9 17l-5-5"
              stroke="#000"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <Path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                stroke="#000"
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                stroke="#000"
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </Svg>
      )}
      {icon === "share" && (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
            stroke="#000"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 6l-4-4-4 4M12 2v13"
            stroke="#000"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
      {icon === "instagram" && (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={5} stroke="#000" strokeWidth={sw} />
          <Path
            d="M17.5 3h-11A3.5 3.5 0 0 0 3 6.5v11A3.5 3.5 0 0 0 6.5 21h11a3.5 3.5 0 0 0 3.5-3.5v-11A3.5 3.5 0 0 0 17.5 3z"
            stroke="#000"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={18} cy={6} r={1} fill="#000" />
        </Svg>
      )}
    </View>
  );
}

function FriendCircle({
  avatar,
  color,
  user,
  size,
}: {
  avatar: number | null;
  color: string | null;
  user: string;
  size: number;
}) {
  const sq = { width: size, height: size, borderRadius: 15 };
  if (avatar) return <Image source={avatar} style={sq} />;
  return (
    <View
      style={[
        sq,
        {
          backgroundColor: color ?? "#ccc",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Text style={{ color: "#fff", fontSize: size * 0.38, fontWeight: "600" }}>
        {user[0].toUpperCase()}
      </Text>
    </View>
  );
}

function CommentAvatar({
  avatar,
  color,
  user,
}: {
  avatar: number | null;
  color: string | null;
  user: string;
}) {
  if (avatar) return <Image source={avatar} style={styles.commentAvatar} />;
  return (
    <View
      style={[
        styles.commentAvatar,
        styles.commentAvatarPlaceholder,
        { backgroundColor: color ?? "#ccc" },
      ]}
    >
      <Text style={styles.commentAvatarInitial}>{user[0].toUpperCase()}</Text>
    </View>
  );
}

// ─── Notification page ────────────────────────────────────────────────────────

const NOTIF_AVATARS: Record<string, number> = {
  "Ian Lin": require("../../assets/images/ian.jpg"),
  Anthena: require("../../assets/images/anthena.jpg"),
};
type NAction = { label: string; filled?: boolean };
type NItem = {
  id: number;
  user: string;
  avatarColor?: string;
  time: string;
  action: string;
  actions?: NAction[];
  postThumb?: number;
};

const NOTIFICATIONS: NItem[] = [
  { id: 1, user: "Ian Lin",     time: "just now",    action: "invited you to join Decor Profile Gallery", actions: [{ label: "View Gallery" }] },
  { id: 2, user: "Anthena",     time: "2 mins ago",  action: "❤️  your post", postThumb: require("../../assets/images/post1.jpg") },
  { id: 3, user: "Ian Lin",     time: "1 hour ago",  action: "started following you", actions: [{ label: "View Profile" }] },
  { id: 4, user: "Lumit",       avatarColor: "#000", time: "8 hours ago", action: "New weekly theme is live", actions: [{ label: "View Theme" }] },
  { id: 5, user: "Ian Lin",     time: "yesterday",   action: "decorated your gallery" },
  { id: 6, user: "Coco_poodle", avatarColor: "#B5C4B1", time: "2 mins ago", action: "❤️  your post", postThumb: require("../../assets/images/post2.jpg") },
  { id: 7, user: "Ian Lin",     time: "1 hour ago",  action: "started following you", actions: [{ label: "View Profile" }] },
];
const NOTIF_FILTERS = ["Invite", "Like", "Follow", "Theme"];

function NotifAvatar({ user, color }: { user: string; color?: string }) {
  const avatar = NOTIF_AVATARS[user];
  const s = { width: 45, height: 45, borderRadius: 15 };
  if (avatar) return <Image source={avatar} style={s} />;
  return (
    <View
      style={[
        s,
        {
          backgroundColor: color ?? "#ccc",
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
      ]}
    >
      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
        {user[0].toUpperCase()}
      </Text>
    </View>
  );
}

function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filtered = activeFilter
    ? NOTIFICATIONS.filter((n) => {
        if (activeFilter === "Invite")  return n.action.includes("invited");
        if (activeFilter === "Like")    return n.action.includes("liked") || n.action.includes("❤️");
        if (activeFilter === "Follow")  return n.action.includes("following");
        if (activeFilter === "Theme")   return n.action.toLowerCase().includes("theme");
        return true;
      })
    : NOTIFICATIONS;
  return (
    <View style={{ flex: 1 }}>
      <View style={nStyles.header}>
        <Text style={nStyles.title}>Notification</Text>
      </View>
      <View style={nStyles.filterRow}>
        {NOTIF_FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[nStyles.pill, activeFilter === f && nStyles.pillActive]}
            onPress={() => setActiveFilter(activeFilter === f ? null : f)}
          >
            <Text
              style={[
                nStyles.pillText,
                activeFilter === f && nStyles.pillTextActive,
              ]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={nStyles.list}
      >
        {filtered.map((item) => (
          <View key={item.id} style={nStyles.row}>
            <NotifAvatar user={item.user} color={item.avatarColor} />
            <View style={nStyles.textArea}>
              <View style={nStyles.half}>
                <Text style={nStyles.username} numberOfLines={1}>{item.user}</Text>
                <Text style={nStyles.time}>{item.time}</Text>
              </View>
              <View style={nStyles.half}>
                <Text style={nStyles.action}>{item.action}</Text>
              </View>
            </View>
            {item.postThumb && (
              <Image source={item.postThumb} style={nStyles.thumb} resizeMode="cover" />
            )}
            {!item.postThumb && item.actions && item.actions[0] && (
              <Pressable style={nStyles.actionBtn}>
                <Text style={nStyles.actionText}>{item.actions[0].label}</Text>
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const nStyles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontFamily: "GCPrometheusDemo-Medium", fontSize: 40, color: "#000" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: "#1e1e1e",
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  pillActive: { backgroundColor: "#1e1e1e" },
  pillText: {
    fontFamily: "GCPrometheusDemo-Medium",
    fontSize: 14,
    color: "#000",
  },
  pillTextActive: { color: "#fff" },
  list: { paddingHorizontal: 16, paddingBottom: 120, gap: 20 },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  textArea: { flex: 1 },
  half: { flexDirection: "row", alignItems: "center", gap: 6 },
  username: { fontFamily: "PublicSans-SemiBold", fontSize: 14, color: "#000" },
  action: { fontFamily: "PublicSans-Regular", fontSize: 14, color: "#000", flex: 1 },
  time: { fontFamily: "PublicSans-Regular", fontSize: 12, color: "#808080", flexShrink: 0 },
  thumb: { width: 45, height: 45, borderRadius: 8 },
  actionBtn: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  actionText: { fontFamily: "GCPrometheusDemo-Medium", fontSize: 13, color: "#fff" },
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function Main() {
  const router = useRouter();
  const pagerRef = useRef<ScrollView>(null);
  const [cats, setCats] = useState<Record<number, CatState>>({});
  const [iconVisible, setIconVisible] = useState<Record<number, boolean>>({});
  const lastTap = useRef<Record<number, number>>({});
  const singleTapTimer = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {},
  );
  const usernameWidths = useRef<Record<number, number>>({});
  const metaWidths = useRef<Record<number, number>>({});
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Share sheet
  const [sharePostId, setSharePostId] = useState<number | null>(null);
  const [shareSearch, setShareSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<
    (typeof SHARE_FRIENDS)[0] | null
  >(null);
  const [sendMessage, setSendMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const sheetAnim = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sendBarAnim = useRef(new Animated.Value(0)).current;
  const sheetBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('resetMainPager', () => {
      pagerRef.current?.scrollTo({ x: 0, animated: true });
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    Animated.timing(sendBarAnim, {
      toValue: selectedFriend ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedFriend]);

  useEffect(() => {
    if (sharePostId === null) {
      sheetBottom.setValue(0);
      return;
    }
    const onShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(sheetBottom, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === "ios" ? e.duration : 200,
          useNativeDriver: false,
        }).start();
      },
    );
    const onHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        Animated.timing(sheetBottom, {
          toValue: 0,
          duration: Platform.OS === "ios" ? e.duration : 200,
          useNativeDriver: false,
        }).start();
      },
    );
    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [sharePostId]);

  const openShare = (postId: number) => {
    setSharePostId(postId);
    setShareSearch("");
    setSelectedFriend(null);
    setSendMessage("");
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(sheetAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeShare = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 500,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSharePostId(null);
      setSelectedFriend(null);
      setSendMessage("");
    });
  };

  const confirmSend = () => {
    if (!selectedFriend) return;
    const postId = sharePostId;
    const friendUser = selectedFriend.user;
    closeShare();
    setTimeout(() => {
      router.push({
        pathname: "/chat",
        params: { user: friendUser, sharedPostId: String(postId) },
      });
    }, 200);
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://lumit.app/post/${sharePostId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
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
    await Share.share({
      message: `Check out this post on Lumit 🌿 lumit.app/post/${sharePostId}`,
    });
  };

  // Comment sheet
  const openComment = (postId: number) => {
    setOpenPostId(postId);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeComment = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
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

  const filteredFriends = SHARE_FRIENDS.filter((f) =>
    f.label.toLowerCase().includes(shareSearch.toLowerCase()),
  );

  return (
    <View style={styles.page}>
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={{ flex: 1 }}
      >
        {/* Page 0: main feed */}
        <View style={{ width }}>
          <ScrollView
            style={styles.feed}
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.brand}>Lumit</Text>
            </View>

            {POSTS.map((post) => (
              <View key={post.id} style={styles.post}>
                <View style={styles.postHeader}>
                  <View>
                    <Pressable onPress={() => router.push({ pathname: '/user-profile', params: { user: post.user } })}>
                      <Text
                        style={styles.username}
                        onLayout={(e) => {
                          usernameWidths.current[post.id] =
                            e.nativeEvent.layout.width;
                        }}
                      >
                        {post.user}
                      </Text>
                    </Pressable>
                    <Text
                      style={styles.meta}
                      onLayout={(e) => {
                        metaWidths.current[post.id] =
                          e.nativeEvent.layout.width;
                      }}
                    >
                      {post.location} · {post.time}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: photoWidth,
                    height: photoHeight,
                    overflow: "visible",
                  }}
                >
                  {cats[post.id]?.visible && (
                    <Image
                      source={require("../../assets/images/cat.png")}
                      style={[styles.catSticker, { left: cats[post.id].x }]}
                    />
                  )}
                  <Pressable
                    onPress={() => handlePhotoPress(post.id)}
                    onLongPress={() => openShare(post.id)}
                    delayLongPress={400}
                    style={StyleSheet.absoluteFill}
                  >
                    <Image
                      source={post.photo}
                      style={styles.photoImg}
                      resizeMode="cover"
                    />
                  </Pressable>
                  {iconVisible[post.id] && (
                    <Pressable
                      style={styles.commentIconBtn}
                      onPress={() => openComment(post.id)}
                    >
                      <IconComment />
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* end page 0 */}

        {/* Page 1: notification */}
        <View style={{ width }}>
          <NotificationPage />
        </View>
      </ScrollView>
      {/* end horizontal pager */}

      {/* ── Share sheet modal ── */}
      <Modal
        visible={sharePostId !== null}
        transparent
        animationType="none"
        onRequestClose={closeShare}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* backdrop */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.shareBackdrop,
              { opacity: backdropAnim },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeShare} />
          </Animated.View>

          {/* sheet — outer for keyboard bottom, inner for spring slide-in */}
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: sheetBottom,
            }}
          >
            <Animated.View
              style={[
                styles.shareSheet,
                { transform: [{ translateY: sheetAnim }] },
              ]}
            >
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

              {/* Friends grid */}
              <FlatList
                data={filteredFriends}
                keyExtractor={(f) => f.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.friendGrid}
                columnWrapperStyle={styles.friendGridRow}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.friendCell}
                    onPress={() =>
                      setSelectedFriend(
                        selectedFriend?.id === item.id ? null : item,
                      )
                    }
                  >
                    <View>
                      <FriendCircle
                        avatar={item.avatar}
                        color={item.color}
                        user={item.user}
                        size={72}
                      />
                      {selectedFriend?.id === item.id && (
                        <View style={styles.selectedBadge}>
                          <IconCheck />
                        </View>
                      )}
                    </View>
                    <Text style={styles.friendCellName} numberOfLines={1}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />

              <View style={styles.shareDivider} />

              {/* App share row */}
              <View style={styles.appShareRow}>
                <Pressable style={styles.appItem} onPress={handleCopyLink}>
                  <AppIcon icon={copied ? "check" : "link"} />
                  <Text style={styles.appLabel}>
                    {copied ? "Copied" : "Copy link"}
                  </Text>
                </Pressable>
                <Pressable style={styles.appItem} onPress={handleInstagram}>
                  <AppIcon icon="instagram" />
                  <Text style={styles.appLabel}>Instagram</Text>
                </Pressable>
                <Pressable style={styles.appItem} onPress={handleShareTo}>
                  <AppIcon icon="share" />
                  <Text style={styles.appLabel}>Share to…</Text>
                </Pressable>
              </View>

              {/* Send bar — absolutely positioned, animates over app row when friend selected */}
              <Animated.View
                style={[
                  styles.sendBar,
                  {
                    opacity: sendBarAnim,
                    transform: [
                      {
                        translateY: sendBarAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents={selectedFriend ? "auto" : "none"}
              >
                <TextInput
                  style={styles.sendMsgInput}
                  placeholder="Write a message..."
                  placeholderTextColor="#aaa"
                  value={sendMessage}
                  onChangeText={setSendMessage}
                />
                <Pressable style={styles.sendBtn} onPress={confirmSend}>
                  <Text style={styles.sendBtnText}>Send</Text>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>

      {/* ── Comment sheet modal ── */}
      <Modal
        visible={openPostId !== null}
        transparent
        animationType="none"
        onRequestClose={closeComment}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeComment} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Animated.View
              style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
            >
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Comment</Text>
              <ScrollView
                style={styles.commentList}
                contentContainerStyle={styles.commentListContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {openPost?.comments.map((c) => (
                  <View key={c.id} style={styles.commentRow}>
                    <CommentAvatar
                      avatar={c.avatar}
                      color={c.color}
                      user={c.user}
                    />
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
  brand: {
    fontFamily: "GCPrometheusDemo-Regular",
    fontSize: 40,
    color: "#000",
  },
  post: { paddingBottom: 8, marginBottom: 12 },
  postHeader: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 14,
    paddingRight: 12,
  },
  catSticker: { position: "absolute", top: -50, width: 48, height: 50 },
  username: {
    fontFamily: "Alyamama",
    fontSize: 18,
    lineHeight: 20,
    color: "#000",
    alignSelf: "flex-start",
  },
  photoImg: { width: photoWidth, height: photoHeight },
  commentIconBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { fontSize: 13, color: "rgba(0,0,0,0.5)", alignSelf: "flex-start" },

  // ── Share sheet ──
  shareBackdrop: { backgroundColor: "rgba(0,0,0,0.55)" },
  shareSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    overflow: "hidden",
  },
  shareHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#d0d0d0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 14,
  },
  shareSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  shareSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    paddingHorizontal: 14,
    height: 42,
    gap: 8,
  },
  shareSearchInput: {
    flex: 1,
    fontFamily: "PublicSans-Regular",
    fontSize: 16,
    color: "#000",
  },
  shareGroupBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },

  // Friends grid
  friendGrid: { paddingHorizontal: 8 },
  friendGridRow: { justifyContent: "space-around", marginBottom: 16 },
  friendCell: { alignItems: "center", gap: 6, width: (width - 32) / 3 },
  friendCellName: {
    fontFamily: "PublicSans-Regular",
    fontSize: 12,
    color: "#000",
    maxWidth: 80,
    textAlign: "center",
  },

  shareDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginBottom: 16,
  },

  // App share row
  appShareRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  appItem: { alignItems: "center", gap: 6 },
  appIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e5ea",
    alignItems: "center",
    justifyContent: "center",
  },
  appLabel: {
    fontFamily: "PublicSans-Regular",
    fontSize: 11,
    color: "#000",
    textAlign: "center",
    maxWidth: 64,
  },

  // Selected badge
  selectedBadge: {
    position: "absolute",
    bottom: -3,
    right: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#3478f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Send bar — overlays the app buttons row
  sendBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
  },
  sendMsgInput: {
    height: 44,
    backgroundColor: "#f0f0f0",
    borderRadius: 22,
    paddingHorizontal: 16,
    fontFamily: "PublicSans-Regular",
    fontSize: 15,
    color: "#000",
  },
  sendBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
    fontFamily: "GCPrometheusDemo-SemiBold",
    fontSize: 17,
    color: "#fff",
  },

  // ── Comment modal ──
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.65,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetTitle: {
    fontFamily: "GCPrometheusDemo-Regular",
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    paddingVertical: 12,
  },
  commentList: { flex: 1 },
  commentListContent: { paddingHorizontal: 20, paddingBottom: 8 },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  commentAvatar: { width: 40, height: 40, borderRadius: 20 },
  commentAvatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  commentAvatarInitial: { fontSize: 16, color: "#fff", fontWeight: "600" },
  commentBody: { flex: 1, gap: 2 },
  commentUser: { fontFamily: "Alyamama", fontSize: 14, color: "#808080" },
  commentText: { fontSize: 15, color: "#000", lineHeight: 21 },
  inputRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  commentInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: "#000",
  },
});
