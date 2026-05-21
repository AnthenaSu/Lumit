import { useState, useEffect, useCallback, memo } from 'react'
import {
  View, Text, Image, Pressable, FlatList, ScrollView,
  StyleSheet, Dimensions, ActivityIndicator,
} from 'react-native'
import { useRouter, useNavigation } from 'expo-router'
import * as MediaLibrary from 'expo-media-library'
import { newPostStore } from './new-post-store'

const { width } = Dimensions.get('window')
const GRID_MARGIN = 30
const GRID_GAP = 2
const SLOT_WIDTH  = Math.floor((width - GRID_MARGIN * 2 - GRID_GAP * 2) / 3)
const SLOT_HEIGHT = Math.floor(SLOT_WIDTH * 1.6)
const ITEM_WIDTH  = Math.floor((width - GRID_GAP * 2) / 3)  // edge-to-edge grid
const ITEM_HEIGHT = Math.floor(ITEM_WIDTH * 140 / 112)
const MAX_PHOTOS = 9

// Lazily resolve ph:// → file:// per visible item
const LibraryItem = memo(({ asset, onPress }: { asset: MediaLibrary.Asset; onPress: () => void }) => {
  const [uri, setUri] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    MediaLibrary.getAssetInfoAsync(asset, { shouldDownloadFromNetwork: false })
      .then(info => { if (active) setUri(info.localUri ?? null) })
      .catch(() => {})
    return () => { active = false }
  }, [asset.id])

  return (
    <Pressable style={styles.libraryItem} onPress={onPress}>
      {uri
        ? <Image source={{ uri }} style={styles.libraryImage} resizeMode="cover" />
        : <View style={[styles.libraryImage, styles.libraryPlaceholder]} />
      }
    </Pressable>
  )
})

export default function NewPost() {
  const router = useRouter()
  const navigation = useNavigation()
  const [tick, setTick] = useState(0)
  const [permission, requestPermission] = MediaLibrary.usePermissions()
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { newPostStore.splice(0) }, [])

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => setTick(t => t + 1))
    return unsub
  }, [navigation])

  useEffect(() => {
    if (permission?.granted) loadPhotos()
  }, [permission?.granted])

  const loadPhotos = async () => {
    setLoading(true)
    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: 200,
      sortBy: MediaLibrary.SortBy.creationTime,
    })
    setAssets(result.assets)
    setLoading(false)
  }

  const photos = newPostStore

  const addPhoto = useCallback(async (asset: MediaLibrary.Asset) => {
    if (photos.length >= MAX_PHOTOS) return
    const info = await MediaLibrary.getAssetInfoAsync(asset, { shouldDownloadFromNetwork: false })
    const uri = info.localUri ?? asset.uri
    photos.push({ uri, caption: '' })
    setTick(t => t + 1)
  }, [])

  const removePhoto = (index: number) => {
    photos.splice(index, 1)
    setTick(t => t + 1)
  }

  const handleCancel = () => { photos.splice(0); router.back() }

  if (!permission) return <View style={styles.page} />

  if (!permission.granted) {
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable style={styles.pillBtn} onPress={handleCancel}>
            <Text style={styles.pillBtnText}>Cancel</Text>
          </Pressable>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>Allow access to your photo library to select photos.</Text>
          <Pressable style={styles.pillBtnSolid} onPress={requestPermission}>
            <Text style={[styles.pillBtnText, { color: '#fff' }]}>Allow Access</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.pillBtn} onPress={handleCancel}>
          <Text style={styles.pillBtnText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.pillBtn}>
          <Text style={[styles.pillBtnText, styles.pillBtnBold]}>Share</Text>
        </Pressable>
      </View>

      {/* Selected slots row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slotsRow}
      >
        {photos.map((photo, i) => (
          <View key={i} style={[styles.slotFilled, i === 0 && styles.slotFirstLeft]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => router.push({ pathname: '/new-post-individual', params: { index: String(i) } })}
            >
              <Image source={{ uri: photo.uri }} style={styles.slotImage} resizeMode="cover" />
            </Pressable>
            <Pressable style={styles.removeBtn} onPress={() => removePhoto(i)} hitSlop={6}>
              <Text style={styles.removeBtnText}>×</Text>
            </Pressable>
          </View>
        ))}
        {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length) }, (_, i) => (
          <View key={`e${i}`} style={[styles.slotEmpty, photos.length === 0 && i === 0 && styles.slotFirstLeft]} />
        ))}
      </ScrollView>

      {/* Library label */}
      <Text style={styles.libraryLabel}>Choose from your library</Text>

      {/* Library grid */}
      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator size="large" color="#000" /></View>
      ) : (
        <FlatList
          data={assets}
          numColumns={3}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridRow}
          initialNumToRender={24}
          windowSize={5}
          renderItem={({ item }) => (
            <LibraryItem asset={item} onPress={() => addPhoto(item)} />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 76,
    paddingHorizontal: GRID_MARGIN,
    paddingBottom: 16,
  },
  pillBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  pillBtnText: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 16,
    color: '#000',
  },
  pillBtnBold: { fontFamily: 'CormorantSC-Bold' },
  pillBtnSolid: {
    borderRadius: 50,
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: '#000',
  },

  slotsRow: {
    paddingLeft: GRID_MARGIN,
    paddingRight: GRID_MARGIN,
    gap: GRID_GAP,
    alignItems: 'center',
    paddingBottom: 12,
  },
  slotEmpty: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
    backgroundColor: '#d9d9d9',
  },
  slotFilled: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
    overflow: 'hidden',
  },
  slotFirstLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  slotImage: { width: SLOT_WIDTH, height: SLOT_HEIGHT },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 13, lineHeight: 18 },

  libraryLabel: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 14,
    color: '#808080',
    marginLeft: GRID_MARGIN,
    marginTop: 8,
    marginBottom: 3,
  },

  gridRow: { gap: GRID_GAP },
  libraryItem: { width: ITEM_WIDTH, height: ITEM_HEIGHT, marginBottom: GRID_GAP },
  libraryImage: { width: ITEM_WIDTH, height: ITEM_HEIGHT },
  libraryPlaceholder: { backgroundColor: '#e0e0e0' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permissionBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 20 },
  permissionText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24 },
})
