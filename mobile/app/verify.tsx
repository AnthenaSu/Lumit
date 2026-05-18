import { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Svg, { Path } from 'react-native-svg'

const { height } = Dimensions.get('window')

function ArrowRight() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M13 6l6 6-6 6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function CodeVerify() {
  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(59)
  const router = useRouter()
  const params = useLocalSearchParams<{ phone?: string; isSignIn?: string }>()
  const phone = params.phone ?? '0432 222 222'
  const isSignIn = params.isSignIn === '1'
  const canVerify = code.trim().length === 6

  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  return (
    <View style={styles.page}>
      <Text style={styles.brand}>Lumit</Text>

      <Pressable style={styles.back} onPress={() => router.back()}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Text style={styles.phoneLabel}>Phone Number</Text>
      <View style={styles.arrowPhone}><ArrowRight /></View>
      <Text style={styles.phoneValue}>{phone}</Text>

      <Text style={styles.codeLabel}>Enter the code</Text>
      <View style={styles.arrowCode}><ArrowRight /></View>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
        placeholder="123456"
        placeholderTextColor="#b3b3b3"
        autoFocus
      />

      {timer > 0 ? (
        <Text style={styles.resend}>Didn't receive? resend in {timer} seconds</Text>
      ) : (
        <Pressable onPress={() => { setTimer(59); setCode('') }}>
          <Text style={[styles.resend, styles.resendActive]}>
            Didn't receive?{' '}
            <Text style={styles.resendAction}>Resend</Text>
          </Text>
        </Pressable>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.btn,
          canVerify ? styles.btnActive : styles.btnDisabled,
          pressed && canVerify && { opacity: 0.8 },
        ]}
        onPress={() => canVerify && router.push(isSignIn ? '/welcome' : '/username')}
        disabled={!canVerify}
      >
        <Text style={[styles.btnText, canVerify ? styles.btnActiveText : styles.btnDisabledText]}>
          Verify
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
  phoneLabel: {
    position: 'absolute',
    top: height * 0.247,
    left: 0,
    right: 0,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  arrowPhone: {
    position: 'absolute',
    top: height * 0.304,
    left: '17.4%',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneValue: {
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
    textAlignVertical: 'center',
  },
  codeLabel: {
    position: 'absolute',
    top: height * 0.366,
    left: 0,
    right: 0,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  arrowCode: {
    position: 'absolute',
    top: height * 0.419,
    left: '17.4%',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    position: 'absolute',
    top: height * 0.408,
    left: '17.4%',
    right: 0,
    height: 41,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    paddingRight: '17.4%',
    letterSpacing: 2,
  },
  resend: {
    position: 'absolute',
    top: height * 0.446,
    left: '50%',
    marginLeft: -124.5,
    width: 249,
    fontSize: 12,
    color: '#d79e59',
    textAlign: 'center',
  },
  resendActive: { color: '#000' },
  resendAction: { fontFamily: 'GCPrometheusDemo-Bold', textDecorationLine: 'underline' },
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
