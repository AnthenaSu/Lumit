import { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";

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

type CatAnimData = {
  translateY: Animated.Value
  scale: Animated.Value
  rotate: Animated.Value
  rotateInterp: Animated.AnimatedInterpolation<string>
};

export default function Weekly() {
  const router = useRouter();
  const lastTap = useRef<Record<number, number>>({});
  const singleTapTimer = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const catAnims = useRef<Record<number, CatAnimData>>({});
  const [catVisible, setCatVisible] = useState<Record<number, boolean>>({});

  const handlePress = (index: number, postIdx: number) => {
    const now = Date.now();
    const prev = lastTap.current[index] ?? 0;
    if (now - prev < 300) {
      clearTimeout(singleTapTimer.current[index]);
      const existing = catAnims.current[index];
      if (existing && catVisible[index]) {
        // Wiggle
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
          Animated.timing(existing.rotate, { toValue: -10, duration: 55, useNativeDriver: true }),
          Animated.timing(existing.rotate, { toValue: 10,  duration: 75, useNativeDriver: true }),
          Animated.timing(existing.rotate, { toValue: -6,  duration: 65, useNativeDriver: true }),
          Animated.timing(existing.rotate, { toValue: 6,   duration: 65, useNativeDriver: true }),
          Animated.timing(existing.rotate, { toValue: 0,   duration: 55, useNativeDriver: true }),
        ]).start();
        Animated.sequence([
          Animated.spring(existing.scale, { toValue: 1.2, damping: 5,  stiffness: 320, useNativeDriver: true }),
          Animated.spring(existing.scale, { toValue: 1,   damping: 14, stiffness: 200, useNativeDriver: true }),
        ]).start();
      } else {
        // Entrance — spring up from below
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const translateY = new Animated.Value(60);
        const scale = new Animated.Value(0);
        const rotate = new Animated.Value(-10);
        const rotateInterp = rotate.interpolate({ inputRange: [-15, 15], outputRange: ['-15deg', '15deg'] });
        catAnims.current[index] = { translateY, scale, rotate, rotateInterp };
        setCatVisible((s) => ({ ...s, [index]: true }));
        Animated.parallel([
          Animated.spring(translateY, { toValue: 0, damping: 9,  stiffness: 110, useNativeDriver: true }),
          Animated.spring(scale,      { toValue: 1, damping: 10, stiffness: 140, useNativeDriver: true }),
          Animated.spring(rotate,     { toValue: 0, damping: 11, stiffness: 140, useNativeDriver: true }),
        ]).start();
      }
    } else {
      singleTapTimer.current[index] = setTimeout(() => {
        router.push({ pathname: '/post', params: { idx: String(postIdx) } });
      }, 300);
    }
    lastTap.current[index] = now;
  };

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const col = index % 2;
    const postIdx = Math.floor(index / 2);
    const anim = catAnims.current[index];
    return (
      <View>
        <Pressable
          onPress={() => handlePress(index, postIdx)}
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
        {catVisible[index] && anim && (
          <Animated.Image
            source={require("../../assets/images/cat.png")}
            style={{
              position: 'absolute',
              top: 0,
              left: CELL / 2 - 24,
              width: 48,
              height: 50,
              zIndex: 10,
              transform: [
                { translateY: anim.translateY },
                { scale: anim.scale },
                { rotate: anim.rotateInterp },
              ],
            }}
          />
        )}
      </View>
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
        extraData={catVisible}
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
