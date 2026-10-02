import { Stack } from 'expo-router';

export default function ArtistLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
        contentStyle: { backgroundColor: '#0B0B0B' },
        navigationBarColor: '#0B0B0B',
      }}
    />
  );
}