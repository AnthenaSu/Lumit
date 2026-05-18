import { useEffect } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

const { height } = Dimensions.get('window')

export default function Welcome() {
  const router = useRouter()
  const params = useLocalSearchParams<{ username?: string }>()
  const username = params.username ?? 'Friend'

  useEffect(() => {
    const id = setTimeout(() => router.replace('/main'), 2000)
    return () => clearTimeout(id)
  }, [router])

  return (
    <View style={styles.page}>
      <View style={styles.greeting}>
        <Text style={styles.hello}>Hello</Text>
        <Text style={styles.name}>{username}</Text>
      </View>

      <View style={styles.dogWrapper}>
        <Image
          source={require('../assets/images/dog.png')}
          style={styles.dog}
          resizeMode="contain"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  greeting: {
    position: 'absolute',
    top: height * 0.318,
    left: '50%',
    marginLeft: -106.5,
    width: 213,
    alignItems: 'center',
  },
  hello: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 40,
    color: '#000',
  },
  name: {
    fontFamily: 'FigueaGranatae',
    fontSize: 40,
    color: '#000',
  },
  dogWrapper: {
    position: 'absolute',
    top: height * 0.705,
    left: '50%',
    marginLeft: -71.5,
    width: 143,
    height: 258,
  },
  dog: {
    width: '100%',
    height: '100%',
  },
})
