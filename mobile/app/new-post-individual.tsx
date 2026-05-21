import { useState } from 'react'
import {
  View, Text, Image, TextInput, Pressable,
  StyleSheet, Dimensions, ScrollView,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { newPostStore } from './new-post-store'

const { width } = Dimensions.get('window')
const H_MARGIN = 26
const PHOTO_W = width - H_MARGIN * 2
const PHOTO_H = Math.round(PHOTO_W * 420 / 350)

const catImg = require('../assets/images/cat.png')
const avatarImg = require('../assets/images/anthena.jpg')

export default function NewPostIndividual() {
  const router = useRouter()
  const { index } = useLocalSearchParams<{ index: string }>()
  const idx = Number(index)
  const photo = newPostStore[idx]
  const [caption, setCaption] = useState(photo?.caption ?? '')

  const save = () => {
    if (photo) newPostStore[idx].caption = caption
    router.back()
  }

  if (!photo) return null

  return (
    <View style={styles.page}>
      {/* Top area: Cancel (left) + cat sticker (right) + username */}
      <View style={styles.topArea}>
        <View style={styles.topLeft}>
          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.username}>Anthena</Text>
        </View>
        <Image source={catImg} style={styles.catSticker} resizeMode="contain" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
        </View>

        {/* Comments label */}
        <Text style={styles.commentsLabel}>comments</Text>

        {/* Caption input pill */}
        <View style={styles.captionPillWrap}>
          <View style={styles.captionPill}>
            <Image source={avatarImg} style={styles.avatar} resizeMode="cover" />
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="#b3b3b3"
              value={caption}
              onChangeText={setCaption}
              multiline
              returnKeyType="done"
              blurOnSubmit
            />
          </View>
        </View>

        {/* Save button */}
        <View style={styles.saveRow}>
          <Pressable style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },

  topArea: {
    paddingTop: 60,
    paddingHorizontal: H_MARGIN,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  topLeft: {
    flexDirection: 'column',
    gap: 18,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  cancelText: {
    fontFamily: 'CormorantSC-Medium',
    fontSize: 16,
    color: '#000',
  },
  username: {
    fontFamily: 'Alyamama',
    fontSize: 18,
    color: '#000',
  },
  catSticker: {
    width: 47,
    height: 49,
  },

  photoContainer: {
    paddingHorizontal: H_MARGIN,
    marginBottom: 16,
  },
  photo: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: 5,
  },

  commentsLabel: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#000',
    marginLeft: H_MARGIN + 1,
    marginBottom: 12,
  },

  captionPillWrap: {
    paddingHorizontal: 21,
    marginBottom: 12,
  },
  captionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217,217,217,0.7)',
    borderRadius: 15,
    height: 50,
    paddingHorizontal: 9,
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 15,
  },
  captionInput: {
    flex: 1,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 16,
    color: '#595959',
  },

  saveRow: {
    paddingHorizontal: H_MARGIN,
    alignItems: 'flex-end',
    paddingBottom: 32,
    marginTop: 4,
  },
  saveBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  saveBtnText: {
    fontFamily: 'CormorantSC-Bold',
    fontSize: 16,
    color: '#000',
  },
})
