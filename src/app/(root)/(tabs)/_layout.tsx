import { HomepageModal } from '@/models/BecameArtistModel';
import { Tabs } from 'expo-router';
import { Home, Library, Search, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';

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
            paddingBottom: 10,
            paddingTop: 8,
          },
          sceneStyle: {
            backgroundColor: '#121212',
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#B3B3B3',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size - 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Search color={color} size={size - 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Your Library',
            tabBarIcon: ({ color, size }) => (
              <Library color={color} size={size - 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            // tabBarIcon: ({ size }) =>
            //   isModalOpen ? (
            //     <X color="#000000" size={size - 1} />
            //   ) : (
            //     <Plus color="#FFFFFF" size={size - 1} />
            //   ),
            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsModalOpen(!isModalOpen)}
                className="flex-1 items-center justify-center"
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
                  className="p-2 items-center justify-center"
                >
                  {isModalOpen ? (
                    <X color="#000000" size={22} />
                  ) : (
                    <Plus color="#B3B3B3" size={22} />

                  )}
                </MotiView>
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
      <HomepageModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
