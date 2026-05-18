import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'

const { height } = Dimensions.get('window')

export default function Landing() {
  const router = useRouter()

  return (
    <View style={styles.page}>
      <Text style={styles.brand}>Lumit</Text>
      <Text style={styles.description}>Some Description for the picture</Text>

      <Pressable
        style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.8 }]}
        onPress={() => router.push('/phone')}
      >
        <Text style={styles.btnPrimaryText}>Sign up with Phone</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.btnSecondary, pressed && { backgroundColor: '#f5f5f5' }]}
        onPress={() => router.push({ pathname: '/phone', params: { isSignIn: '1' } })}
      >
        <Text style={styles.btnSecondaryText}>
          Already have an account?{' '}
          <Text style={styles.btnSecondaryBold}>Log in</Text>
        </Text>
      </Pressable>

      <Text style={styles.privacy}>
        By continuing, I confirm that I am 16 or older and agree to the{' '}
        <Text style={styles.privacyLink}>Terms</Text>
        {' '}and{' '}
        <Text style={styles.privacyLink}>Privacy Policy</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  brand: {
    position: 'absolute',
    top: height * 0.384,
    left: 0,
    right: 0,
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 54,
    color: '#000',
    textAlign: 'center',
  },
  description: {
    position: 'absolute',
    top: height * 0.474,
    left: 0,
    right: 0,
    fontFamily: 'GCPrometheusDemo-Medium',
    fontSize: 18,
    color: 'rgba(0,0,0,0.47)',
    textAlign: 'center',
  },
  btnPrimary: {
    position: 'absolute',
    top: height * 0.718,
    left: '10.2%',
    width: '79.6%',
    height: 57,
    backgroundColor: '#000',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 18,
    color: '#fff',
  },
  btnSecondary: {
    position: 'absolute',
    top: height * 0.802,
    left: '10.2%',
    width: '79.6%',
    height: 57,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 18,
    color: '#000',
  },
  btnSecondaryBold: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
  },
  privacy: {
    position: 'absolute',
    top: height * 0.904,
    left: '7.7%',
    right: '7.7%',
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    fontFamily: 'GCPrometheusDemo-Bold',
    textDecorationLine: 'underline',
  },
})
