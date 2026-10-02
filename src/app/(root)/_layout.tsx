import { Drawer } from 'expo-router/drawer';

import SpotifyProfileMenu from './(screens)/CustomDrawerContent.jsx';

export default function RootLayout() {


  return (
    <>
      <Drawer
        drawerContent={() => (
          <SpotifyProfileMenu
          />
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '90%',
            backgroundColor: '#121212',
          },
          overlayColor: 'rgba(0, 0, 0, 0.72)',
          swipeEnabled: true,
          drawerType: 'slide',
        }}
      />

    </>
  );
}