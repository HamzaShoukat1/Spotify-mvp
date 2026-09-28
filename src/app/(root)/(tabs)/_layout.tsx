import { router, Tabs } from 'expo-router';
import { Home, Library, Search } from 'lucide-react-native';

export default function TabLayout() {
  return (
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
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size - 2} />,
        }}
  
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Your Library',
          tabBarIcon: ({ color, size }) => <Library color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}
