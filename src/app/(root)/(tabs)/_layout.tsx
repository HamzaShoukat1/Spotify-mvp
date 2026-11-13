import { AddMusicModal } from '@/models/AddMusicModal';
import { Tabs, usePathname } from 'expo-router';
import { Home, Library, Search, Plus, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Logo } from "../../../assets/images/index";
import { MediaPlayerBar } from '@/components/Media-Player-bar';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/context/NetworkContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

export default function TabLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const pathname = usePathname();
  const isTrackViewOpen = pathname.endsWith('/Track-View');

  const { isOffline } = useNetwork();
  const insets = useSafeAreaInsets();

  const BASE_TAB_HEIGHT = 60;

  const bottomInset = Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 0);

  const totalTabBarHeight = BASE_TAB_HEIGHT + bottomInset;

  const handleCreatePress = () => {
    if (isOffline) {
      Toast.show({
        type: 'error',
        text1: 'Online access needed',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    setIsModalOpen((prev) => !prev);
  };
  const activeTrack = useActiveTrack();

  // Check whether the active song is stored locally.
  const isLocalTrack =
    typeof activeTrack?.url === 'string' &&
    (
      /^(file|content):\/\//i.test(activeTrack.url) ||
      activeTrack.url.startsWith('/')
    );

  useEffect(() => {
    if (!isOffline) return;

    let cancelled = false;

    const stopOnlineMusic = async () => {
      try {
        const track = await TrackPlayer.getActiveTrack();

        if (cancelled || !track) return;

        const url = typeof track.url === 'string' ? track.url : '';

        const isDownloadedTrack =
          /^(file|content):\/\//i.test(url) ||
          url.startsWith('/');

        if (!isDownloadedTrack) {
          await TrackPlayer.reset();
        }
      } catch (error) {
        console.error('Error stopping online playback:', error);
      }
    };

    stopOnlineMusic();

    return () => {
      cancelled = true;
    };
  }, [isOffline]);

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
            height: totalTabBarHeight,
            paddingTop: 4,
            paddingBottom: bottomInset,
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

          tabBarItemStyle: {
            height: BASE_TAB_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          listeners={{
            tabPress: () => setIsModalOpen(false),
          }}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size - 2} strokeWidth={2.2} />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          listeners={{
            tabPress: () => setIsModalOpen(false),
          }}
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Search color={color} size={size - 2} strokeWidth={2.2} />
            ),
          }}
        />

        <Tabs.Screen
          name="library"
          listeners={{
            tabPress: () => setIsModalOpen(false),
          }}
          options={{
            title: 'Your Library',
            tabBarIcon: ({ color, size }) => (
              <Library color={color} size={size - 2} strokeWidth={2.2} />
            ),
          }}
        />

        <Tabs.Screen
          name="premium"
          listeners={{
            tabPress: () => setIsModalOpen(false),
          }}
          options={{
            title: 'Premium',
            tabBarIcon: ({ color, size }) => (
              <Image
                source={Logo}
                style={{
                  width: size - 2,
                  height: size - 2,
                  resizeMode: 'contain',
                  tintColor: color,
                }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',

            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCreatePress}
                className="flex-1 items-center justify-center"
                style={{
                  height: BASE_TAB_HEIGHT,
                }}
              >
                <MotiView
                  animate={{
                    backgroundColor: isModalOpen ? '#FFFFFF' : 'transparent',
                    borderRadius: isModalOpen ? 9999 : 0,
                    transform: [
                      { rotate: isModalOpen ? '90deg' : '0deg' },
                    ],
                  }}
                  transition={{
                    type: 'timing',
                    duration: 250,
                  } as any}
                  className="w-10 h-10 items-center justify-center rounded-full"
                >
                  {isModalOpen ? (
                    <X
                      color="#000000"
                      size={20}
                      strokeWidth={2.8}
                    />
                  ) : (
                    <Plus
                      color="#B3B3B3"
                      size={22}
                      strokeWidth={2.2}
                    />
                  )}
                </MotiView>
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      {!isTrackViewOpen && (!isOffline || isLocalTrack) && (
        <View
          className="absolute left-0 right-0 z-[50]"
          style={{
            bottom: totalTabBarHeight,
          }}
        >{ }
          <MediaPlayerBar />
        </View>
      )}

      {isModalOpen && (
        <View
          className="absolute inset-x-0 top-0 z-[70]"
          style={{
            bottom: totalTabBarHeight,
          }}
        >
          <AddMusicModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </View>
      )}
    </>
  );
}