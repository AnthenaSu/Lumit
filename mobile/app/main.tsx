import { useState, useRef } from "react";
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
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

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
    avatar: require("../assets/images/anthena.jpg") as number,
    color: null,
  },
  ian: { avatar: require("../assets/images/ian.jpg") as number, color: null },
  mia: { avatar: null, color: "#B5C4B1" },
};

const POSTS = [
  {
    id: 1,
    user: "Anthena",
    location: "Sydney",
    time: "1 hour ago",
    photo: require("../assets/images/post1.jpg"),
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
    photo: require("../assets/images/post2.jpg"),
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

type CatState = { visible: boolean; x: number };

function IconHome() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 21V12h6v9"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconSend() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconSearch() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke="#000" strokeWidth={1.5} />
      <Path
        d="M21 21l-4.35-4.35"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function IconUser() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={12}
        cy={7}
        r={4}
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
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

export default function Main() {
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

  return (
    <View style={styles.page}>
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
                <Text
                  style={styles.username}
                  onLayout={(e) => {
                    usernameWidths.current[post.id] =
                      e.nativeEvent.layout.width;
                  }}
                >
                  {post.user}
                </Text>
                <Text
                  style={styles.meta}
                  onLayout={(e) => {
                    console.log(
                      `meta onLayout id=${post.id} w=${e.nativeEvent.layout.width}`,
                    );
                    metaWidths.current[post.id] = e.nativeEvent.layout.width;
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
                  source={require("../assets/images/cat.png")}
                  style={[styles.catSticker, { left: cats[post.id].x }]}
                />
              )}
              <Pressable
                onPress={() => handlePhotoPress(post.id)}
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

      <View style={styles.navPill}>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
        >
          <IconHome />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
        >
          <IconSend />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
        >
          <Text style={styles.navBtnTText}>T</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
        >
          <IconSearch />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
        >
          <IconUser />
        </Pressable>
      </View>

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

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  feed: { flex: 1 },
  feedContent: { paddingBottom: 110 },
  header: {
    paddingTop: 56,
    paddingBottom: 14,
    alignItems: "center",
  },
  brand: {
    fontFamily: "GCPrometheusDemo-Regular",
    fontSize: 40,
    color: "#000",
  },
  post: {
    paddingBottom: 8,
    marginBottom: 12,
  },
  postHeader: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 14,
    paddingRight: 12,
  },
  catSticker: {
    position: "absolute",
    top: -50,
    width: 48,
    height: 50,
  },
  username: {
    fontFamily: "Alyamama",
    fontSize: 18,
    lineHeight: 20,
    color: "#000",
    alignSelf: "flex-start",
  },
  photoImg: {
    width: photoWidth,
    height: photoHeight,
  },
  commentIconBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    fontSize: 13,
    color: "rgba(0,0,0,0.5)",
    marginTop: 0,
    alignSelf: "flex-start",
  },
  navPill: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    marginLeft: -160,
    width: 320,
    height: 50,
    backgroundColor: "rgba(235,235,235,0.35)",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  navBtn: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnTText: {
    fontFamily: "GCPrometheusDemo-Bold",
    fontSize: 25,
    color: "#000",
  },
  // Modal
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
  commentList: {
    flex: 1,
  },
  commentListContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentAvatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarInitial: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  commentBody: {
    flex: 1,
    gap: 2,
  },
  commentUser: {
    fontFamily: "Alyamama",
    fontSize: 14,
    color: "#808080",
  },
  commentText: {
    fontSize: 15,
    color: "#000",
    lineHeight: 21,
  },
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
