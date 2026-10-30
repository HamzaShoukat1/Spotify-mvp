import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, BarChart3, Users } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';

import {
  AnalyticsRange,
  useDashboardAnalytics,
} from '@/hooks/use-analytics';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 40;

const ranges: { value: AnalyticsRange; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '120d', label: '120D' },
  { value: '360d', label: '1Y' },
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    const decimals = value >= 10_000 ? 0 : 1;
    return `${(value / 1_000).toFixed(decimals)}K`;
  }

  return value.toLocaleString();
}

function getLabelIndexes(length: number) {
  if (length <= 1) {
    return [0];
  }

  const count = Math.min(length, 5);

  return Array.from({ length: count }, (_, index) =>
    Math.round((index * (length - 1)) / (count - 1)),
  );
}

function formatDateLabel(date: string, range: AnalyticsRange) {
  const [year, month, day] = date.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (range === '7d') {
    const weekday = weekdays[parsedDate.getUTCDay()];
    const dayOfMonth = parsedDate.getUTCDate();

    return `${weekday} ${dayOfMonth}`;
  }

  if (range === '30d') {
    const monthName = months[parsedDate.getUTCMonth()];
    const dayOfMonth = parsedDate.getUTCDate();

    return `${monthName} ${dayOfMonth}`;
  }

  const monthName = months[parsedDate.getUTCMonth()];
  const shortYear = String(parsedDate.getUTCFullYear()).slice(-2);

  return `${monthName} '${shortYear}`;
}

export default function Analytics() {
  const [range, setRange] = useState<AnalyticsRange>('7d');

  const {
    data: analytics,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDashboardAnalytics(range);

  const chartData = useMemo(() => {
    const timeline = analytics?.timelineData ?? [];

    const values = timeline.map((item) => item.value);

    const chartValues = values.length > 0 ? values : [0];

    const visibleIndexes = new Set(
      getLabelIndexes(timeline.length),
    );

    const labels = timeline.map((item, index) => {
      if (!visibleIndexes.has(index)) {
        return '';
      }

      return formatDateLabel(item.date, range);
    });

    return {
      labels,
      datasets: [{ data: chartValues }],
    };
  }, [analytics?.timelineData, range]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#101010]">
        <ActivityIndicator size="large" color="#1ed760" />

        <Text className="mt-4 text-sm text-[#a7a7a7]">
          Loading your analytics
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !analytics) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#101010] px-8">
        <BarChart3 color="#1ed760" size={42} />

        <Text className="mt-4 text-center text-xl font-bold text-white">
          Analytics unavailable
        </Text>

        <Text className="mt-2 text-center text-sm leading-5 text-[#a7a7a7]">
          We could not load your performance data.
        </Text>

        <Pressable
          onPress={() => refetch()}
          className="mt-6 rounded-full bg-[#1ed760] px-6 py-3"
        >
          <Text className="font-bold text-black">
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const peakStreams = Math.max(
    ...chartData.datasets[0].data,
    1,
  );

  return (
    <SafeAreaView
      className="flex-1 bg-[#101010]"
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
             tintColor="#1DB954"
              colors={["#1DB954"]}
              progressBackgroundColor="#282828"
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header and date range */}
        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.push("/Artist-hub")}
              hitSlop={12}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#242424]"
            >
              <ArrowLeft color="#ffffff" size={20} />
            </TouchableOpacity>

            <View className="flex-1 px-4">
              <Text className="text-[22px] font-bold text-white">
                Artist analytics
              </Text>

              <Text className="mt-0.5 text-sm text-[#a7a7a7]">
                {analytics.artist.name} performance
              </Text>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#1ed760]">
              Reporting period
            </Text>

            <Text className="mt-1 text-base font-semibold text-white">
              Last {analytics.days} days
            </Text>
          </View>

          <View className="mt-4 flex-row rounded-xl bg-[#1d1d1d] p-1">
            {ranges.map((option) => {
              const isSelected = range === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setRange(option.value)}
                  className={`flex-1 items-center rounded-lg py-2.5 ${
                    isSelected ? 'bg-[#1ed760]' : ''
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-black' : 'text-[#a7a7a7]'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Main statistics */}
        <View className="mt-6 flex-row gap-3 mx-5">
          <MetricCard
            label="Total streams"
            value={formatNumber(analytics.totalStreams)}
            icon={<BarChart3 color="#1ed760" size={20} />}
          />

          <MetricCard
            label="Unique listeners"
            value={formatNumber(analytics.uniqueListeners)}
            icon={<Users color="#f4b860" size={20} />}
          />
        </View>

        {/* Stream activity chart */}
        <View className="mx-5 mt-6 rounded-2xl bg-[#1b1b1b] pb-3 pt-5">
          <View className="flex-row items-center justify-between px-5">
            <View>
              <Text className="text-[17px] font-bold text-white">
                Stream activity
              </Text>

              <Text className="mt-1 text-xs text-[#858585]">
                Daily plays over the selected period
              </Text>
            </View>

            <Text className="text-xs font-semibold text-[#1ed760]">
              Peak {formatNumber(peakStreams)}
            </Text>
          </View>

          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            bezier
            fromZero
            withDots={analytics.days <= 30}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLabels
            withVerticalLabels
            xLabelsOffset={-2}
            chartConfig={{
              backgroundGradientFrom: '#1b1b1b',
              backgroundGradientTo: '#1b1b1b',
              decimalPlaces: 0,
              color: (opacity = 1) =>
                `rgba(30, 215, 96, ${opacity})`,
              labelColor: (opacity = 1) =>
                `rgba(167, 167, 167, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#1ed760',
              },
              propsForBackgroundLines: {
                stroke: '#2b2b2b',
              },
              propsForLabels: {
                fontSize: 10,
                fontWeight: '500',
              },
            }}
            style={{
              marginTop: 12,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Top performing songs */}
        <View className="mx-5 mt-6 rounded-2xl bg-[#1b1b1b] p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[17px] font-bold text-white">
                Top songs
              </Text>

              <Text className="mt-1 text-xs text-[#858585]">
                Your strongest tracks in this period
              </Text>
            </View>

            <Text className="text-xs font-semibold text-[#1ed760]">
              {analytics.topSongs.length} tracks
            </Text>
          </View>

          {analytics.topSongs.length > 0 ? (
            analytics.topSongs.map((song, index) => (
              <View
                key={song._id}
                className="mt-5 flex-row items-center"
              >
                <Text className="w-7 text-center text-sm font-bold text-[#747474]">
                  {index + 1}
                </Text>

                {song.coverUrl ? (
                  <Image
                    source={{ uri: song.coverUrl }}
                    className="ml-2 h-12 w-12 rounded-md"
                  />
                ) : (
                  <View className="ml-2 h-12 w-12 rounded-md bg-[#303030]" />
                )}

                <View className="ml-3 flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-bold text-white"
                  >
                    {song.title}
                  </Text>

                  <Text className="mt-1 text-xs text-[#858585]">
                    Stream performance
                  </Text>
                </View>

                <Text className="text-sm font-bold text-[#d7d7d7]">
                  {formatNumber(song.count)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="mt-6 text-sm text-[#858585]">
              Your top songs will appear after listeners start
              playing your music.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

  function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex-1 rounded-2xl bg-[#1b1b1b] p-4">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-[#292929]">
        {icon}
      </View>

      <Text className="mt-5 text-[11px] font-bold uppercase tracking-[1px] text-[#858585]">
        {label}
      </Text>

      <Text className="mt-1 text-[25px] font-bold text-white">
        {value}
      </Text>
    </View>
  );
}