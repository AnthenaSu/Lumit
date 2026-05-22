import { useState, useEffect } from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  LayoutChangeEvent,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FIGMA_W = 942;
const FIGMA_H = 601;

const ART1 = require("../assets/images/gallery_art1.png");
const ART2 = require("../assets/images/gallery_art2.png");
const ART3 = require("../assets/images/gallery_art3.png");

function artSource(id: string) {
  if (id === "f1") return ART1;
  if (id === "f4") return ART2;
  if (id === "f7") return ART3;
  return null;
}

type RawFrame = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  borderColor: string;
  borderWidth: number;
  art?: boolean;
};

const RAW_FRAMES: RawFrame[] = [
  {
    id: "f1",
    left: 28,
    top: 44,
    width: 146,
    height: 246,
    borderColor: "transparent",
    borderWidth: 0,
    art: true,
  },
  {
    id: "f2",
    left: 226,
    top: 0,
    width: 141,
    height: 187,
    borderColor: "#141414",
    borderWidth: 5,
  },
  {
    id: "f3",
    left: 171,
    top: 206,
    width: 214,
    height: 326,
    borderColor: "#d9d9d9",
    borderWidth: 5,
  },
  {
    id: "f4",
    left: 0,
    top: 435,
    width: 136,
    height: 116,
    borderColor: "transparent",
    borderWidth: 0,
    art: true,
  },
  {
    id: "f5",
    left: 409,
    top: 53,
    width: 213,
    height: 275,
    borderColor: "rgba(82,37,4,0.7)",
    borderWidth: 3,
  },
  {
    id: "f6",
    left: 442,
    top: 404,
    width: 118,
    height: 147,
    borderColor: "#595959",
    borderWidth: 2,
  },
  {
    id: "f7",
    left: 617,
    top: 350,
    width: 116,
    height: 210,
    borderColor: "transparent",
    borderWidth: 0,
    art: true,
  },
  {
    id: "f8",
    left: 675,
    top: 106,
    width: 267,
    height: 170,
    borderColor: "rgba(82,37,4,0.7)",
    borderWidth: 3,
  },
];

const STORAGE_KEY = "gallery_frame_images";
const GALLERY_DIR = `${FileSystem.documentDirectory}gallery/`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(GALLERY_DIR);
  if (!info.exists)
    await FileSystem.makeDirectoryAsync(GALLERY_DIR, { intermediates: true });
}

async function loadImages(): Promise<Record<string, string>> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return {};
    const stored: Record<string, string> = JSON.parse(json);
    const verified: Record<string, string> = {};
    await Promise.all(
      Object.entries(stored).map(async ([id, uri]) => {
        try {
          const info = await FileSystem.getInfoAsync(uri);
          if (info.exists) verified[id] = uri;
        } catch {}
      }),
    );
    return verified;
  } catch {
    return {};
  }
}

async function saveImages(images: Record<string, string>) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

export default function GalleryView() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [containerH, setContainerH] = useState(0);

  useEffect(() => {
    loadImages().then(setImages);
  }, []);

  const scale = containerH > 0 ? containerH / FIGMA_H : 0;
  const canvasW = Math.ceil(FIGMA_W * scale);
  const canvasH = containerH;

  const frames = RAW_FRAMES.map((fr) => ({
    ...fr,
    left: Math.round(fr.left * scale),
    top: Math.round(fr.top * scale),
    width: Math.round(fr.width * scale),
    height: Math.round(fr.height * scale),
  }));

  const removeImage = async (frameId: string) => {
    try {
      await FileSystem.deleteAsync(`${GALLERY_DIR}${frameId}.jpg`, {
        idempotent: true,
      });
    } catch {}
    const updated = { ...images };
    delete updated[frameId];
    setImages(updated);
    await saveImages(updated);
    setSelected(null);
  };

  const pickImage = async (frameId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.85,
    });
    if (result.canceled) return;
    await ensureDir();
    const dest = `${GALLERY_DIR}${frameId}.jpg`;
    await FileSystem.copyAsync({ from: result.assets[0].uri, to: dest });
    const updated = { ...images, [frameId]: dest };
    setImages(updated);
    await saveImages(updated);
    setSelected(null);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setContainerH(h);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      {containerH > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: canvasW, height: canvasH }}
        >
          <Pressable
            style={{ width: canvasW, height: canvasH }}
            onPress={() => setSelected(null)}
          >
            {frames.map((frame) => (
              <Pressable
                key={frame.id}
                style={[
                  styles.frame,
                  frame.art && styles.frameArt,
                  {
                    left: frame.left,
                    top: frame.top,
                    width: frame.width,
                    height: frame.height,
                    borderColor: frame.borderColor,
                    borderWidth: frame.borderWidth,
                  },
                  selected === frame.id && styles.frameSelected,
                ]}
                onPress={() => {
                  if (selected === frame.id) {
                    pickImage(frame.id);
                  } else {
                    setSelected(frame.id);
                  }
                }}
              >
                {images[frame.id] ? (
                  <Image
                    source={{ uri: images[frame.id] }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                ) : artSource(frame.id) ? (
                  <Image
                    source={artSource(frame.id)!}
                    style={styles.artImage}
                    resizeMode="cover"
                  />
                ) : null}
                {selected === frame.id && (
                  <View style={styles.tapHint}>
                    <View style={styles.tapDot} />
                  </View>
                )}
                {selected === frame.id && images[frame.id] && (
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      removeImage(frame.id);
                    }}
                  >
                    <View style={styles.deleteLine1} />
                    <View style={styles.deleteLine2} />
                  </Pressable>
                )}
              </Pressable>
            ))}
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  frame: {
    position: "absolute",
    backgroundColor: "#c8c8c8",
    overflow: "hidden",
  },
  frameArt: {
    backgroundColor: "#f4f0ea",
  },
  artImage: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 1.5 }],
  },
  frameSelected: {
    opacity: 0.75,
  },
  tapHint: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  tapDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 2,
    borderColor: "#000",
  },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteLine1: {
    position: "absolute",
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },
  deleteLine2: {
    position: "absolute",
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#fff",
    transform: [{ rotate: "-45deg" }],
  },
});
