import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system/legacy'

export type GalleryFrame = {
  id: string
  imageUri: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

const STORAGE_KEY = 'gallery_frames'
const GALLERY_DIR = `${FileSystem.documentDirectory}gallery/`

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(GALLERY_DIR)
  if (!info.exists) await FileSystem.makeDirectoryAsync(GALLERY_DIR, { intermediates: true })
}

export async function loadFrames(): Promise<GalleryFrame[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY)
    return json ? JSON.parse(json) : []
  } catch {
    return []
  }
}

export async function saveFrames(frames: GalleryFrame[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(frames))
}

export async function addFrame(pickedUri: string): Promise<GalleryFrame> {
  await ensureDir()
  const id = Date.now().toString()
  const dest = `${GALLERY_DIR}${id}.jpg`
  await FileSystem.copyAsync({ from: pickedUri, to: dest })
  return { id, imageUri: dest, x: 0, y: 0, width: 160, height: 200, rotation: 0 }
}

export async function deleteFrame(frame: GalleryFrame) {
  try { await FileSystem.deleteAsync(frame.imageUri, { idempotent: true }) } catch {}
}
