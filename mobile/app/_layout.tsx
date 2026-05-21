import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    'GCPrometheusDemo-Regular': require('../assets/fonts/GCPrometheusDemo-Regular.ttf'),
    'GCPrometheusDemo-Medium': require('../assets/fonts/GCPrometheusDemo-Medium.ttf'),
    'GCPrometheusDemo-SemiBold': require('../assets/fonts/GCPrometheusDemo-SemiBold.ttf'),
    'GCPrometheusDemo-Bold': require('../assets/fonts/GCPrometheusDemo-Bold.ttf'),
    'FigueaGranatae': require('../assets/fonts/FigueaGranatae.ttf'),
    'Alyamama': require('../assets/fonts/Alyamama-Regular.ttf'),
    'PublicSans-Regular': require('../assets/fonts/PublicSans-Regular.ttf'),
    'PublicSans-SemiBold': require('../assets/fonts/PublicSans-SemiBold.ttf'),
    'CormorantSC-Medium': require('../assets/fonts/CormorantSC-Medium.ttf'),
    'CormorantSC-SemiBold': require('../assets/fonts/CormorantSC-SemiBold.ttf'),
    'CormorantSC-Bold': require('../assets/fonts/CormorantSC-Bold.ttf'),
  })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="notification" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="user-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="search-history" options={{ animation: 'fade' }} />
        <Stack.Screen name="new-post" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="new-post-individual" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="post" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  )
}
