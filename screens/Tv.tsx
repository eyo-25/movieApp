import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { useQuery, useQueryClient } from "react-query";
import { tvApi, TVResponse } from "../api";
import { ScrollView } from "react-native";
import Loader from "../component/Loder";
import HList from "../component/HList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Tv: React.FC<NativeStackScreenProps<any, "Tv">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: todayLoding, data: todayData } = useQuery<TVResponse>(
    ["tv", "today"],
    tvApi.airingToday
  );
  const { isLoading: topLoding, data: topData } = useQuery<TVResponse>(
    ["tv", "top"],
    tvApi.topRated
  );
  const { isLoading: trendingLoding, data: trendingData } =
    useQuery<TVResponse>(["tv", "trending"], tvApi.trending);
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
        <HList title="Trending TV" data={trendingData.results} />
      ) : null}
      {todayData ? (
        <HList title="Airing Today" data={todayData.results} />
      ) : null}
      {topData ? <HList title="Top Rated Tv" data={topData.results} /> : null}
    </ScrollView>
  );
};
export default Tv;
