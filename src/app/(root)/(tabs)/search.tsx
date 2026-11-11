import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput, 
  ScrollView, 
  Pressable,
  Image 
} from 'react-native';
import { TopGenre, Album } from "../../../assets/images";
import { Search} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useNetwork } from '@/context/NetworkContext';
import { OfflineStateView } from '@/components/OfflineStateView';

const TOP_GENRES = [
  { id: '1', name: 'Pop', image: TopGenre, color: 'bg-[#9854B2]' },
  { id: '2', name: 'Indie', image: Album, color: 'bg-[#678026]' },
  { id: '3', name: 'Hip-Hop', image: TopGenre, color: 'bg-[#BA5D07]' },
  { id: '4', name: 'Rock', image: Album, color: 'bg-[#E61E32]' },
];

const BROWSE_ALL = [
  { id: '5', name: 'Podcasts', image: Album, color: 'bg-[#006450]' },
  { id: '6', name: 'Made For You', image: TopGenre, color: 'bg-[#1E3264]' },
  { id: '7', name: 'Live Events', image: Album, color: 'bg-[#8400E7]' },
  { id: '8', name: 'Charts', image: TopGenre, color: 'bg-[#8D67AB]' },
];

export default function SearchScreen() {
  const { isOffline } = useNetwork();
  

  if (isOffline) {
    return (
      <OfflineStateView
        title="Search unavailable offline"
        description="Connect to the internet to search millions of songs, artists, and albums."
      />
    );
  }

  const handleGenrePress = (genreName: string) => {
    router.push({
      pathname: '/(root)/(screens)/search-bar',
      params: { query: genreName }
    });
  };


  

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        <ScrollView 
          className="flex-1 px-4" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Section */}
          <View className="flex-row justify-between items-center pt-4 pb-4">
            <Text className="font-black text-[25px] text-white tracking-tight">
              Search
            </Text>
          </View>

          {/* Search Bar Button */}
          <Pressable 
            onPress={() => router.push('/(root)/(screens)/search-bar')} 
            className="flex-row w-full items-center bg-white rounded-md px-3.5 py-3 mb-6 shadow-sm active:opacity-90"
          >
            <Search color="#121212" size={20} strokeWidth={2.5} className="mr-3" />
            <TextInput 
              placeholder="What do you want to listen to?" 
              placeholderTextColor="#535353" 
              className="flex-1 text-black text-[15px] font-bold"
              editable={false} 
              pointerEvents="none" 
            />
          </Pressable>

        

          {/* Top Genres Grid */}
          <Text className="text-white font-bold text-[18px] tracking-tight mb-4">
            Your top genres
          </Text>
          <View className="flex-row flex-wrap justify-between w-full mb-4">
            {TOP_GENRES.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleGenrePress(item.name)}
                className={`w-[48.5%] h-24 ${item.color} rounded-md p-3.5 relative overflow-hidden mb-3.5 active:scale-95 active:opacity-90`}
              >
                <Text className="text-white font-bold text-[16px] tracking-tight leading-5 w-[70%]">
                  {item.name}
                </Text>
                <Image
                  source={item.image}
                  className="absolute bottom-0 right-0 w-16 h-16 translate-x-2 translate-y-1 rotate-[25deg]"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>

          {/* Browse All Section */}
          <Text className="text-white font-bold text-[18px] tracking-tight mb-4">
            Browse all
          </Text>
          <View className="flex-row flex-wrap justify-between w-full">
            {BROWSE_ALL.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleGenrePress(item.name)}
                className={`w-[48.5%] h-24 ${item.color} rounded-md p-3.5 relative overflow-hidden mb-3.5 active:scale-95 active:opacity-90`}
              >
                <Text className="text-white font-bold text-[16px] tracking-tight leading-5 w-[70%]">
                  {item.name}
                </Text>
                <Image
                  source={item.image}
                  className="absolute bottom-0 right-0 w-16 h-16 translate-x-2 translate-y-1 rotate-[25deg]"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}