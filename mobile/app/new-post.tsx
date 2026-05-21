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
const ITEM_WIDTH  = Math.floor((width - GRID_GAP * 2) / 3)
const ITEM_HEIGHT = Math.floor(ITEM_WIDTH * 140 / 112)
const MAX_PHOTOS = 10
const THUMB = 72

type Category = { id: string; label: string; album?: MediaLibrary.Album }

// Album cover tile — lazy-loads cover photo
const CategoryTile = memo(({ cat, active, onPress }: {
  cat: Category; active: boolean; onPress: () => void
}) => {
  const [coverUri, setCoverUri] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const result = await MediaLibrary.getAssetsAsync({
        first: 1,
        sortBy: MediaLibrary.SortBy.creationTime,
        mediaType: MediaLibrary.MediaType.photo,
        ...(cat.album ? { album: cat.album } : {}),
      })
      if (!mounted || result.assets.length === 0) return
      const info = await MediaLibrary.getAssetInfoAsync(result.assets[0], { shouldDownloadFromNetwork: false })
      if (mounted) setCoverUri(info.localUri ?? null)
    }
    load().catch(() => {})
    return () => { mounted = false }
  }, [cat.id])

  return (
    <Pressable style={styles.catTile} onPress={onPress}>
      <View style={[styles.catThumb, active && styles.catThumbActive]}>
        {coverUri
          ? <Image source={{ uri: coverUri }} style={styles.catThumbImg} resizeMode="cover" />
          : <View style={[styles.catThumbImg, styles.catThumbPlaceholder]} />
        }
      </View>
      <Text
        style={[styles.catLabel, active && styles.catLabelActive]}
        numberOfLines={1}
      >
        {cat.label}
      </Text>
    </Pressable>
  )
})

// Library grid item — lazy-loads local URI
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
  const [categories, setCategories] = useState<Category[]>([{ id: 'all', label: 'All' }])
  const [selectedId, setSelectedId] = useState('all')
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { newPostStore.splice(0) }, [])

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => setTick(t => t + 1))
    return unsub
  }, [navigation])

  useEffect(() => {
    if (!permission?.granted) return
    loadAlbums()
    loadPhotos(undefined)
  }, [permission?.granted])

  const loadAlbums = async () => {
    const albums = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true })
    const cats: Category[] = [{ id: 'all', label: 'All' }]
    for (const a of albums) {
      if (a.assetCount > 0) cats.push({ id: a.id, label: a.title, album: a })
    }
    setCategories(cats)
  }

  const loadPhotos = async (album: MediaLibrary.Album | undefined) => {
    setLoading(true)
    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: 200,
      sortBy: MediaLibrary.SortBy.creationTime,
      ...(album ? { album } : {}),
    })
    setAssets(result.assets)
    setLoading(false)
  }

  const selectCategory = (cat: Category) => {
    setSelectedId(cat.id)
    loadPhotos(cat.album)
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
          <View key={`e${i}`} style={[styles.slotEmpty, i === 0 && styles.slotFirstLeft]} />
        ))}
      </ScrollView>

      {/* Library label */}
      <Text style={styles.libraryLabel}>Choose from your library</Text>

      {/* Album cover row */}
      <View style={styles.catRowWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      >
        {categories.map(cat => (
          <CategoryTile
            key={cat.id}
            cat={cat}
            active={cat.id === selectedId}
            onPress={() => selectCategory(cat)}
          />
        ))}
      </ScrollView>
      </View>

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
    width: 100,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pillBtnText: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 14,
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
    overflow: 'hidden',
  },
  slotFilled: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
    overflow: 'hidden',
  },
  slotFirstLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
    marginBottom: 10,
  },

  // Album cover row
  catRowWrap: {
    height: THUMB + 30,
  },
  catRow: {
    paddingHorizontal: GRID_MARGIN,
    gap: 12,
    paddingBottom: 10,
  },
  catTile: {
    width: THUMB,
    alignItems: 'center',
  },
  catThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  catThumbActive: {
    borderColor: '#1e1e1e',
  },
  catThumbImg: {
    width: THUMB,
    height: THUMB,
    borderRadius: 8,
  },
  catThumbPlaceholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  catLabel: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 11,
    color: '#808080',
    marginTop: 4,
    textAlign: 'center',
    width: THUMB,
  },
  catLabelActive: {
    color: '#000',
    fontFamily: 'GCPrometheusDemo-SemiBold',
  },

  gridRow: { gap: GRID_GAP },
  libraryItem: { width: ITEM_WIDTH, height: ITEM_HEIGHT, marginBottom: GRID_GAP },
  libraryImage: { width: ITEM_WIDTH, height: ITEM_HEIGHT },
  libraryPlaceholder: { backgroundColor: '#e0e0e0' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permissionBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 20 },
  permissionText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24 },
})
