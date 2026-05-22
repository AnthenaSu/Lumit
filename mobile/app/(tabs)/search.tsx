import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const GRID_GAP = 2;
const GRID_MARGIN = 16;
const { width } = Dimensions.get("window");
const CELL_W = Math.floor((width - GRID_GAP * 2) / 3);
const CELL_H = Math.round(CELL_W * 133 / 106);

const GRID_ITEMS = [
  { id: "0",  source: require("../../assets/images/search1.jpg") },
  { id: "1",  source: require("../../assets/images/search2.jpg") },
  { id: "2",  source: require("../../assets/images/search3.jpg") },
  { id: "3",  source: require("../../assets/images/search4.jpg") },
  { id: "4",  source: require("../../assets/images/search5.jpg") },
  { id: "5",  source: require("../../assets/images/search6.jpg") },
  { id: "6",  source: require("../../assets/images/search7.jpg") },
  { id: "7",  source: require("../../assets/images/search8.jpg") },
  { id: "8",  source: require("../../assets/images/search9.jpg") },
  { id: "9",  source: require("../../assets/images/search10.jpg") },
  { id: "10", source: require("../../assets/images/search11.jpg") },
  { id: "11", source: require("../../assets/images/search12.jpg") },
  { id: "12", source: require("../../assets/images/profile1.jpg") },
  { id: "13", source: require("../../assets/images/profile2.jpg") },
  { id: "14", source: require("../../assets/images/profile3.jpg") },
  { id: "15", source: require("../../assets/images/profile4.jpg") },
  { id: "16", source: require("../../assets/images/profile5.jpg") },
  { id: "17", source: require("../../assets/images/profile6.jpg") },
  { id: "18", source: require("../../assets/images/profile7.jpg") },
  { id: "19", source: require("../../assets/images/profile8.jpg") },
  { id: "20", source: require("../../assets/images/profile9.jpg") },
  { id: "21", source: require("../../assets/images/profile10.jpg") },
  { id: "22", source: require("../../assets/images/profile11.jpg") },
  { id: "23", source: require("../../assets/images/profile12.jpg") },
  { id: "24", source: require("../../assets/images/search1.jpg") },
  { id: "25", source: require("../../assets/images/search4.jpg") },
  { id: "26", source: require("../../assets/images/search7.jpg") },
  { id: "27", source: require("../../assets/images/search2.jpg") },
  { id: "28", source: require("../../assets/images/search5.jpg") },
  { id: "29", source: require("../../assets/images/search8.jpg") },
  { id: "30", source: require("../../assets/images/search3.jpg") },
  { id: "31", source: require("../../assets/images/search6.jpg") },
  { id: "32", source: require("../../assets/images/search9.jpg") },
];

export default function Search() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const lastScrollY = useRef(0);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const isFloatVisible = useRef(false);
  const [floatMounted, setFloatMounted] = useState(false);

  const FADE_START = 120;
  const FADE_END = 70;
  const SHOW_TRIGGER = 140;

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const scrollingUp = y < lastScrollY.current;
    lastScrollY.current = y;

    if (!isFloatVisible.current) {
      if (scrollingUp && y > SHOW_TRIGGER) {
        isFloatVisible.current = true;
        setFloatMounted(true);
        Animated.timing(floatAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      }
      return;
    }

    if (!scrollingUp) {
      isFloatVisible.current = false;
      Animated.timing(floatAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setFloatMounted(false));
    } else if (y >= FADE_START) {
      floatAnim.setValue(1);
    } else if (y <= FADE_END) {
      isFloatVisible.current = false;
      floatAnim.setValue(0);
      setFloatMounted(false);
    } else {
      floatAnim.setValue((y - FADE_END) / (FADE_START - FADE_END));
    }
  };

  const goToSearch = () => router.push("/search-history");

  return (
    <View style={styles.page}>
      <FlatList
        ref={listRef}
        data={GRID_ITEMS}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={{ marginBottom: GRID_GAP }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.browseHeaderArea}>
            <Text style={styles.browseTitle}>Search</Text>
            <Pressable style={styles.searchBarWrap} onPress={goToSearch}>
              <Text style={styles.searchPlaceholder}>search users, items ...</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => {
          const col = index % 3;
          const postIdx = index % 6;
          return (
            <Pressable
              style={[{ width: CELL_W, height: CELL_H }, col < 2 && { marginRight: GRID_GAP }]}
              onPress={() => router.push({ pathname: '/post', params: { idx: String(postIdx) } })}
            >
              <Image source={item.source} style={{ width: CELL_W, height: CELL_H }} resizeMode="cover" />
            </Pressable>
          );
        }}
      />

      {floatMounted && (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.floatingBarShadow, { opacity: floatAnim }]}
        >
          <Pressable onPress={goToSearch}>
            <BlurView intensity={70} tint="light" style={styles.floatingBarBlur}>
              <View style={styles.floatingBarGlass} pointerEvents="none" />
              <View style={[styles.searchBarWrap, { margin: 4 }]} pointerEvents="none">
                <Text style={styles.searchPlaceholder}>search users, items ...</Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  browseHeaderArea: {
    paddingTop: 60,
    paddingHorizontal: GRID_MARGIN,
    paddingBottom: 12,
  },
  browseTitle: {
    fontFamily: "GCPrometheusDemo-SemiBold",
    fontSize: 50,
    color: "#000",
    lineHeight: 58,
    marginBottom: 10,
  },
  searchBarWrap: {
    height: 42,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  searchPlaceholder: {
    fontFamily: "GCPrometheusDemo-Regular",
    fontSize: 16,
    color: "#595959",
  },
  gridContent: { paddingBottom: 110 },
  floatingBarShadow: {
    position: "absolute",
    top: 70,
    left: GRID_MARGIN,
    right: GRID_MARGIN,
    zIndex: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  floatingBarBlur: {
    borderRadius: 15,
    overflow: "hidden",
  },
  floatingBarGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});
