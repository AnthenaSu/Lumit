import { useState, useRef, useEffect } from 'react'
import {
  View, Text, Image, Pressable, TextInput,
  StyleSheet, Animated, Easing, Dimensions,
  Platform, ActionSheetIOS, Alert, Keyboard,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import Svg, { Path, Line } from 'react-native-svg'
import { profileStore } from '../profile-store'

const { height: SCREEN_H } = Dimensions.get('window')
const SHEET_H = 260
const DEFAULT_AVATAR = require('../assets/images/profile_avatar.jpg')

function IconX() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke="#000" strokeWidth={2} strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke="#000" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

function IconChevron() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconPin() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#000" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="#000" strokeWidth={1.6} />
    </Svg>
  )
}

function IconPencil() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

type Field = { key: 'name' | 'location' | 'instagram' | 'spotify'; label: string; placeholder: string }

const FIELDS: Field[] = [
  { key: 'name',      label: 'Name',      placeholder: 'Your name' },
  { key: 'location',  label: 'Location',  placeholder: 'City, Country' },
  { key: 'instagram', label: 'Instagram', placeholder: '@username' },
  { key: 'spotify',   label: 'Spotify',   placeholder: 'Spotify username' },
]

export default function EditProfile() {
  const router = useRouter()
  const [values, setValues] = useState({
    name: profileStore.name,
    location: profileStore.location,
    instagram: profileStore.instagram,
    spotify: profileStore.spotify,
  })
  const [avatarUri, setAvatarUri] = useState<string | null>(profileStore.avatarUri)

  // Bottom sheet
  const [activeField, setActiveField] = useState<Field | null>(null)
  const [inputValue, setInputValue] = useState('')
  const sheetY = useRef(new Animated.Value(SHEET_H)).current
  const sheetBottom = useRef(new Animated.Value(0)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', e => {
      Animated.timing(sheetBottom, { toValue: e.endCoordinates.height, duration: e.duration, useNativeDriver: false }).start()
    })
    const hide = Keyboard.addListener('keyboardWillHide', e => {
      Animated.timing(sheetBottom, { toValue: 0, duration: e.duration, useNativeDriver: false }).start()
    })
    return () => { show.remove(); hide.remove() }
  }, [])

  useEffect(() => {
    if (activeField) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(sheetY, { toValue: 0, duration: 220, easing: Easing.out(Easing.back(2)), useNativeDriver: false }),
      ]).start()
    }
  }, [activeField])

  const openSheet = (field: Field) => {
    sheetY.setValue(SHEET_H)
    backdropOpacity.setValue(0)
    setInputValue(values[field.key])
    setActiveField(field)
  }

  const closeSheet = () => {
    Keyboard.dismiss()
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 80, useNativeDriver: false }),
      Animated.timing(sheetY, { toValue: SHEET_H, duration: 160, easing: Easing.in(Easing.cubic), useNativeDriver: false }),
    ]).start(() => setActiveField(null))
  }

  const saveField = () => {
    if (activeField) setValues(v => ({ ...v, [activeField.key]: inputValue.trim() || v[activeField.key] }))
    closeSheet()
  }

  const [locating, setLocating] = useState(false)

  const autoLocate = async () => {
    setLocating(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow location access in Settings.'); return }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      const [geo] = await Location.reverseGeocodeAsync(pos.coords)
      const city = geo.city || geo.subregion || ''
      const country = geo.country || ''
      setInputValue([city, country].filter(Boolean).join(', '))
    } catch {
      Alert.alert('Error', 'Could not get location.')
    } finally {
      setLocating(false)
    }
  }

  const saveAll = () => {
    profileStore.name = values.name
    profileStore.location = values.location
    profileStore.instagram = values.instagram
    profileStore.spotify = values.spotify
    profileStore.avatarUri = avatarUri
    router.back()
  }

  const pickImage = async (useCamera: boolean) => {
    const { status } = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow access in Settings.'); return }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
    if (!result.canceled) setAvatarUri(result.assets[0].uri)
  }

  const onEditPhoto = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: 'Edit Profile Photo', options: ['Cancel', 'Remove Profile Photo', 'Take Photo', 'Choose from Library'], destructiveButtonIndex: 1, cancelButtonIndex: 0 },
        idx => { if (idx === 1) setAvatarUri(null); if (idx === 2) pickImage(true); if (idx === 3) pickImage(false) }
      )
    } else {
      Alert.alert('Edit Profile Photo', '', [
        { text: 'Remove', style: 'destructive', onPress: () => setAvatarUri(null) },
        { text: 'Take Photo', onPress: () => pickImage(true) },
        { text: 'Choose from Library', onPress: () => pickImage(false) },
        { text: 'Cancel', style: 'cancel' },
      ])
    }
  }

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable onPress={saveAll} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      {/* Avatar */}
      <Pressable style={styles.avatarWrap} onPress={onEditPhoto}>
        <View style={styles.avatarClip}>
          <Image
            source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.pencilBadge}><IconPencil /></View>
      </Pressable>

      {/* Field rows */}
      <View style={styles.section}>
        {FIELDS.map((field, i) => (
          <View key={field.key}>
            <Pressable style={styles.fieldRow} onPress={() => openSheet(field)}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{values[field.key]}</Text>
              <IconChevron />
            </Pressable>
            {i < FIELDS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Bottom sheet */}
      {activeField && (
        <>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} pointerEvents="box-none">
            <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
          </Animated.View>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }], bottom: sheetBottom }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit {activeField.label}</Text>
              <Pressable onPress={closeSheet} style={styles.sheetClose}><IconX /></Pressable>
            </View>
            <View style={styles.sheetLabelRow}>
              <Text style={styles.sheetFieldLabel}>{activeField.label}</Text>
              {activeField.key === 'location' && (
                <Pressable style={styles.locateBtn} onPress={autoLocate} disabled={locating}>
                  <IconPin />
                  <Text style={styles.locateBtnText}>{locating ? 'Locating...' : 'Use current location'}</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.sheetInputWrap}>
              <TextInput
                style={styles.sheetInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={activeField.placeholder}
                placeholderTextColor="#aaa"
                autoFocus
                autoCapitalize={activeField.key === 'name' ? 'words' : 'none'}
                returnKeyType="done"
                onSubmitEditing={saveField}
              />
            </View>
            <Pressable style={styles.sheetSaveBtn} onPress={saveField}>
              <Text style={styles.sheetSaveText}>Save</Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f2f2f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 18, color: '#000' },
  cancelBtn: { width: 70 },
  cancelText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#000' },
  saveBtn: { width: 70, alignItems: 'flex-end' },
  saveText: { fontFamily: 'GCPrometheusDemo-SemiBold', fontSize: 16, color: '#000' },

  avatarWrap: { alignSelf: 'center', marginTop: 16, marginBottom: 28 },
  avatarClip: { width: 100, height: 100, borderRadius: 15, overflow: 'hidden' },
  avatar: { width: 100, height: 100 },
  pencilBadge: {
    position: 'absolute', bottom: -6, right: -6,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#555',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#f2f2f7',
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 10 },
  fieldLabel: { fontFamily: 'GCPrometheusDemo-SemiBold', fontSize: 16, color: '#000', width: 90 },
  fieldValue: { flex: 1, fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#555', textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },

  // Bottom sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 10,
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 11,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  sheetTitle: { fontFamily: 'GCPrometheusDemo-Medium', fontSize: 17, color: '#000' },
  sheetClose: {
    position: 'absolute', right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sheetFieldLabel: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 13, color: '#aaa' },
  locateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locateBtnText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 13, color: '#000' },
  sheetInputWrap: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  sheetInput: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 16, color: '#000' },
  sheetSaveBtn: {
    backgroundColor: '#e8e8e8',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSaveText: { fontFamily: 'GCPrometheusDemo-SemiBold', fontSize: 16, color: '#000' },
})
