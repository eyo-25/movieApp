import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { tvApi, TVResponse } from "../api";
import { ScrollView } from "react-native";
import Loader from "../component/Loder";
import HList from "../component/HList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { nextPage } from "../utils";

const Tv: React.FC<NativeStackScreenProps<any, "Tv">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading: todayLoding,
    data: todayData,
    hasNextPage: todayHasNextPage,
    fetchNextPage: todayFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "today"], tvApi.airingToday, {
    getNextPageParam: nextPage,
  });
  const {
    isLoading: topLoding,
    data: topData,
    hasNextPage: topHasNextPage,
    fetchNextPage: topFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "top"], tvApi.topRated, {
    getNextPageParam: nextPage,
  });
  const {
    isLoading: trendingLoding,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "trending"], tvApi.trending, {
    getNextPageParam: nextPage,
  });

  const loading = todayLoding || topLoding || trendingLoding;

  if (loading) {
    return <Loader />;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      {trendingData ? (
        <HList
          title="Trending TV"
          data={trendingData.pages.map((page) => page.results).flat()}
          hasNextPage={trendingHasNextPage}
          fetchNextPage={trendingFetchNextPage}
        />
      ) : null}
      {todayData ? (
        <HList
          title="Airing Today"
          data={todayData.pages.map((page) => page.results).flat()}
          hasNextPage={todayHasNextPage}
          fetchNextPage={todayFetchNextPage}
        />
      ) : null}
      {topData ? (
        <HList
          title="Top Rated Tv"
          data={topData.pages.map((page) => page.results).flat()}
          hasNextPage={topHasNextPage}
          fetchNextPage={topFetchNextPage}
        />
      ) : null}
    </ScrollView>
  );
};
export default Tv;
