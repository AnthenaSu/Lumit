import { createContext, useContext, useState } from 'react'
import { Tabs } from 'expo-router'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'
import Svg, { Path, Circle } from 'react-native-svg'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'

export const TabBarVisibilityContext = createContext<{
  visible: boolean
  setVisible: (v: boolean) => void
}>({ visible: true, setVisible: () => {} })

function IconHome() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V12h6v9" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconSend() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function IconSearch() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke="#000" strokeWidth={1.5} />
      <Path d="M21 21l-4.35-4.35" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

function IconUser() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={7} r={4} stroke="#000" strokeWidth={1.5} />
    </Svg>
  )
}

function CustomTabBar({ navigation }: BottomTabBarProps) {
  const { visible } = useContext(TabBarVisibilityContext)
  if (!visible) return null

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
      <View style={styles.navPillShadow}>
        <BlurView intensity={80} tint="light" style={styles.navPill}>
          <View style={styles.navPillGlass} pointerEvents="none" />
          <Pressable
            style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
            onPress={() => navigation.navigate('main')}
          >
            <IconHome />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
            onPress={() => navigation.navigate('message')}
          >
            <IconSend />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
            <Text style={styles.navBtnTText}>T</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
            onPress={() => navigation.navigate('search')}
          >
            <IconSearch />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}
            onPress={() => navigation.navigate('profile')}
          >
            <IconUser />
          </Pressable>
        </BlurView>
      </View>
    </View>
  )
}

export default function TabsLayout() {
  const [visible, setVisible] = useState(true)

  return (
    <TabBarVisibilityContext.Provider value={{ visible, setVisible }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="main" />
        <Tabs.Screen name="message" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </TabBarVisibilityContext.Provider>
  )
}

const styles = StyleSheet.create({
  navPillShadow: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    marginLeft: -160,
    width: 320,
    height: 50,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  navPill: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navPillGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  navBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnTText: {
    fontFamily: 'GCPrometheusDemo-Bold',
    fontSize: 25,
    color: '#000',
  },
})
