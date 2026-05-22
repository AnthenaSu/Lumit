import { useState, useEffect, useCallback } from 'react'
import {
  View, Image, Pressable, StyleSheet,
  ScrollView, Dimensions, Alert, Text,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Svg, { Path, Line } from 'react-native-svg'
import {
  GalleryFrame, loadFrames, saveFrames, addFrame, deleteFrame,
} from '../gallery-store'

const { width: SCREEN_W } = Dimensions.get('window')
const COL = 2
const GAP = 12
const FRAME_W = (SCREEN_W - GAP * (COL + 1)) / COL

function IconPlus() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" stroke="#000" strokeWidth={2} strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke="#000" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

function IconTrash() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function Gallery() {
  const [frames, setFrames] = useState<GalleryFrame[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    loadFrames().then(setFrames)
  }, [])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') { Alert.alert('Permission needed'); return }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, quality: 0.85,
    })
    if (result.canceled) return
    const frame = await addFrame(result.assets[0].uri)
    const updated = [...frames, frame]
    setFrames(updated)
    await saveFrames(updated)
  }

  const remove = async (frame: GalleryFrame) => {
    Alert.alert('Remove', 'Remove this frame?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: async () => {
          await deleteFrame(frame)
          const updated = frames.filter(f => f.id !== frame.id)
          setFrames(updated)
          await saveFrames(updated)
          setSelected(null)
        },
      },
    ])
  }

  const left = frames.filter((_, i) => i % 2 === 0)
  const right = frames.filter((_, i) => i % 2 === 1)

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setSelected(null)}
      >
        <View style={styles.columns}>
          <View style={styles.column}>
            {left.map(frame => (
              <FrameItem
                key={frame.id}
                frame={frame}
                selected={selected === frame.id}
                onPress={() => setSelected(selected === frame.id ? null : frame.id)}
                onDelete={() => remove(frame)}
              />
            ))}
          </View>
          <View style={styles.column}>
            {right.map(frame => (
              <FrameItem
                key={frame.id}
                frame={frame}
                selected={selected === frame.id}
                onPress={() => setSelected(selected === frame.id ? null : frame.id)}
                onDelete={() => remove(frame)}
              />
            ))}
          </View>
        </View>

        {frames.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Tap + to add your first frame</Text>
          </View>
        )}
      </ScrollView>

      <Pressable style={styles.addBtn} onPress={pickImage}>
        <IconPlus />
      </Pressable>
    </View>
  )
}

function FrameItem({ frame, selected, onPress, onDelete }: {
  frame: GalleryFrame
  selected: boolean
  onPress: () => void
  onDelete: () => void
}) {
  const aspectRatio = frame.height / frame.width
  const h = FRAME_W * aspectRatio

  return (
    <Pressable style={[styles.frame, { height: h }, selected && styles.frameSelected]} onPress={onPress}>
      <Image source={{ uri: frame.imageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      {selected && (
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <IconTrash />
        </Pressable>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: GAP, paddingBottom: 100 },
  columns: { flexDirection: 'row', gap: GAP },
  column: { flex: 1, gap: GAP },
  frame: {
    width: FRAME_W,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8e8e8',
  },
  frameSelected: { opacity: 0.85 },
  deleteBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 15, color: '#aaa' },
  addBtn: {
    position: 'absolute', bottom: 24, right: 24,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
})
