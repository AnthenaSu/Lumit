import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Circle, Path } from 'react-native-svg'

const { height } = Dimensions.get('window')

export default function Username() {
  const [username, setUsername] = useState('')
  const router = useRouter()
  const canSave = username.trim().length >= 2

  return (
    <View style={styles.page}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Choose a Username</Text>
        <Text style={styles.subtitle}>This is how others will find you on Lumit.</Text>
      </View>

      <Text style={styles.label}>USERNAME</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.at}>@</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Ian Lin"
          placeholderTextColor="#b3b3b3"
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />
        {canSave && (
          <View style={styles.checkIcon}>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Circle cx={10} cy={10} r={9} stroke="#000" strokeWidth={1.5} />
              <Path d="M6 10.5l3 3 5-6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.btn,
          canSave ? styles.btnActive : styles.btnDisabled,
          pressed && canSave && { opacity: 0.8 },
        ]}
        onPress={() => canSave && router.push({ pathname: '/welcome', params: { username } })}
        disabled={!canSave}
      >
        <Text style={[styles.btnText, canSave ? styles.btnActiveText : styles.btnDisabledText]}>
          Save
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    position: 'absolute',
    top: height * 0.111,
    left: 34,
    right: 34,
    gap: 6,
  },
  title: {
    fontFamily: 'GCPrometheusDemo-Regular',
    fontSize: 40,
    color: '#000',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
  },
  label: {
    position: 'absolute',
    top: height * 0.243,
    left: '7.5%',
    fontSize: 11,
    color: '#808080',
    letterSpacing: 0.1,
  },
  inputWrapper: {
    position: 'absolute',
    top: height * 0.271,
    left: '7.5%',
    width: '84.6%',
    height: 54,
    backgroundColor: 'rgba(217,217,217,0.5)',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  at: {
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 16,
    color: '#808080',
  },
  input: {
    flex: 1,
    fontFamily: 'GCPrometheusDemo-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  checkIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
