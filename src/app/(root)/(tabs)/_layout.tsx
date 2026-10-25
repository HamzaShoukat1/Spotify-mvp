import { AddMusicModal } from '@/models/AddMusicModal';
import { Tabs } from 'expo-router';
import { Home, Library, Search, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MotiView } from 'moti';
import { MediaPlayerBar } from '@/components/Media-Player-bar';
import { Image } from 'react-native';
import { Logo } from "../../../assets/images/index"

export default function TabLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 65,
            paddingBottom: 8,
            paddingTop: 10,
          },
          sceneStyle: {
            backgroundColor: '#121212',
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#737373', 
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
            letterSpacing: -0.2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          listeners={{ tabPress: () => setIsModalOpen(false) }}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size - 2} strokeWidth={2.2} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          listeners={{ tabPress: () => setIsModalOpen(false) }}
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Search color={color} size={size - 2} strokeWidth={2.2} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          listeners={{ tabPress: () => setIsModalOpen(false) }}
          options={{
            title: 'Your Library',
            tabBarIcon: ({ color, size }) => (
              <Library color={color} size={size - 2} strokeWidth={2.2} />
            ),
          }}
        />
        <Tabs.Screen
          name="premium"
          listeners={{ tabPress: () => setIsModalOpen(false) }}
          options={{
            title: 'Premium',
            tabBarIcon: ({ color, size }) => (
              <Image
                source={Logo}
                style={{ 
                  width: size - 2, 
                  height: size - 2, 
                  resizeMode: 'contain', 
                  tintColor: color 
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ size }) =>
              isModalOpen ? (
                <X color="#000000" size={size - 1} strokeWidth={2.5} />
              ) : (
                <Plus color="#FFFFFF" size={size - 1} strokeWidth={2.5} />
              ),
            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsModalOpen(!isModalOpen)}
                className="flex-1 items-center justify-center pt-1"
              >
                <MotiView
                  animate={{
                    backgroundColor: isModalOpen ? '#FFFFFF' : 'transparent',
                    borderRadius: isModalOpen ? 9999 : 0,
                    transform: [{ rotate: isModalOpen ? '90deg' : '0deg' }],
                  }}
                  transition={{
                    type: 'timing',
                    duration: 250,
                  }}
                  className="w-10 h-10 items-center justify-center rounded-full"
                >
                  {isModalOpen ? (
                    <X color="#000000" size={20} strokeWidth={2.8} />
                  ) : (
                    <Plus color="#B3B3B3" size={22} strokeWidth={2.2} />
                  )}
                </MotiView>
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      <View className="absolute bottom-[65px] left-0 right-0 z-[50]">
        <MediaPlayerBar />
      </View>

      {isModalOpen && (
        <View className="absolute inset-x-0 bottom-[65px] top-0 z-[70]">
          <AddMusicModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </View>
      )}
    </>
  );
}