import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Svg, { Path } from 'react-native-svg'

const { height } = Dimensions.get('window')

export default function PhoneInput() {
  const [phone, setPhone] = useState('')
  const router = useRouter()
  const params = useLocalSearchParams<{ isSignIn?: string }>()
  const isSignIn = params.isSignIn === '1'
  const canSend = phone.trim().length >= 6

  return (
    <View style={styles.page}>
      <Text style={styles.brand}>Lumit</Text>

      <Pressable style={styles.back} onPress={() => router.back()}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <Text style={styles.fieldLabel}>Phone Number</Text>

      <View style={styles.arrowWrap}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12h14M13 6l6 6-6 6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>

      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="0432 222 222"
        placeholderTextColor="#b3b3b3"
        autoFocus
      />

      <Pressable
        style={({ pressed }) => [
          styles.btn,
          canSend ? styles.btnActive : styles.btnDisabled,
          pressed && canSend && { opacity: 0.8 },
        ]}
        onPress={() => canSend && router.push({ pathname: '/verify', params: { phone, isSignIn: isSignIn ? '1' : '0' } })}
        disabled={!canSend}
      >
        <Text style={[styles.btnText, canSend ? styles.btnActiveText : styles.btnDisabledText]}>
          Send code
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  brand: {
    position: 'absolute',
    top: height * 0.0915,
    left: 0,
    right: 0,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 54,
    color: '#000',
    textAlign: 'center',
  },
  back: {
    position: 'absolute',
    top: height * 0.1007,
    left: '9.95%',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    position: 'absolute',
    top: height * 0.1373,
    left: 0,
    right: 0,
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
  },
  fieldLabel: {
    position: 'absolute',
    top: height * 0.247,
    left: 0,
    right: 0,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  arrowWrap: {
    position: 'absolute',
    top: height * 0.304,
    left: '17.4%',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    position: 'absolute',
    top: height * 0.294,
    left: '17.4%',
    right: 0,
    height: 41,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    paddingRight: '17.4%',
  },
  btn: {
    position: 'absolute',
    top: height * 0.503,
    left: '50%',
    marginLeft: -132.5,
    width: 265,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: { backgroundColor: '#000' },
  btnDisabled: { backgroundColor: '#e1e1e1' },
  btnText: { fontFamily: 'GCPrometheusDemo-Regular', fontSize: 20 },
  btnActiveText: { color: '#fff' },
  btnDisabledText: { color: '#000' },
})
