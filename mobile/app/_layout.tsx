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
  })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </>
  )
}
