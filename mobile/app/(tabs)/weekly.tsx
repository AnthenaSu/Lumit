import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

const lampImg = require("../../assets/images/lamp.png");

const { width } = Dimensions.get("window");
const GAP = 2;
const CELL = (width - GAP) / 2;

const PHOTOS = [
  require("../../assets/images/profile1.jpg"),
  require("../../assets/images/profile2.jpg"),
  require("../../assets/images/profile3.jpg"),
  require("../../assets/images/profile4.jpg"),
  require("../../assets/images/profile5.jpg"),
  require("../../assets/images/profile6.jpg"),
  require("../../assets/images/profile7.jpg"),
  require("../../assets/images/profile8.jpg"),
  require("../../assets/images/profile9.jpg"),
  require("../../assets/images/profile10.jpg"),
  require("../../assets/images/profile11.jpg"),
  require("../../assets/images/profile12.jpg"),
];

export default function Weekly() {
  const router = useRouter();
  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const col = index % 2;
    const postIdx = Math.floor(index / 2);
    return (
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        onPress={() => router.push({ pathname: '/post', params: { idx: String(postIdx) } })}
      >
        <Image
          source={item}
          style={{
            width: CELL,
            height: CELL,
            marginRight: col < 1 ? GAP : 0,
            marginBottom: GAP,
          }}
          resizeMode="cover"
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={PHOTOS}
        keyExtractor={(_, i) => String(i)}
        key="2col"
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{"What's on\nthis week"}</Text>
            <Image source={lampImg} style={styles.vase} resizeMode="contain" />
            <Svg
              width={width * 0.55}
              height={20}
              viewBox={`0 0 ${width * 0.55} 20`}
              fill="none"
              style={styles.arrow}
            >
              <Path
                d={`M 0 10 L ${width * 0.55 - 12} 10`}
                stroke="#333"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <Path
                d={`M ${width * 0.55 - 22} 4 L ${width * 0.55 - 10} 10 L ${width * 0.55 - 22} 16`}
                stroke="#333"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        }
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  list: { paddingBottom: 110 },
  header: {
    paddingTop: 68,
    paddingHorizontal: 16,
    paddingBottom: 20,
    overflow: "visible",
  },
  title: {
    fontFamily: "GCPrometheusDemo-Medium",
    fontSize: 42,
    color: "#333",
    lineHeight: 46,
    maxWidth: width * 0.52,
  },
  arrow: {
    marginTop: 12,
  },
  vase: {
    position: "absolute",
    right: 4,
    top: 36,
    width: 175,
    height: 175,
  },
});
