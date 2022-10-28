import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { ActivityIndicator, Dimensions, FlatList } from "react-native";
import Swiper from "react-native-swiper";
import Slide from "../component/Slider";
import HMedia from "../component/HMedia";
import VMedia from "../component/VMedia";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { Movie, MovieResponse, moviesApi } from "../api";
import Loader from "../component/Loder";
import HList from "../component/HList";
import { nextPage } from "../utils";

const Container = styled.FlatList`
  background-color: ${(props) => props.theme.mainBgColor};
` as unknown as typeof FlatList;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const ComingSoonTitle = styled(ListTitle)``;

const HSeparator = styled.View`
  height: 10px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNextPage,
    fetchNextPage: upcomingFetchNextPage,
    isFetchingNextPage: upcomingIsFetchingNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "upcoming"],
    moviesApi.upcoming,
    {
      getNextPageParam: nextPage,
    }
  );
  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(["movies", "trending"], moviesApi.trending, {
    getNextPageParam: nextPage,
  });
  const { isLoading: nowPlayingLoading, data: nowPlayingData } =
    useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
  const loadMore = () => {
    if (upcomingHasNextPage) {
      upcomingFetchNextPage();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };

  // api정보 값만 추출 console.log(Object.keys(nowPlayingData?.results[0]).map((v) => typeof v));
  // api정보 키만 추출 console.log(Object.keys(nowPlayingData?.results[0]);

  const renderFooterComponent = (upcomingIsFetchingNextPage: boolean) =>
    upcomingIsFetchingNextPage ? <Loader /> : null;

  if (loading) {
    return <Loader />;
  }
  return upcomingData ? (
    <Container
      onEndReached={loadMore}
      onEndReachedThreshold={5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListFooterComponent={renderFooterComponent(upcomingIsFetchingNextPage)}
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              marginBottom: 40,
              width: "100%",
              height: SCREEN_HEIGHT / 4,
            }}
          >
            {nowPlayingData?.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          {trendingData ? (
            <HList
              title="Trending Movies"
              data={trendingData.pages.map((page) => page.results).flat()}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          ) : null}
          <ComingSoonTitle>Comming soon</ComingSoonTitle>
        </>
      }
      data={upcomingData.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      contentContainerStyle={{ paddingBottom: 10 }}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    ></Container>
  ) : null;
};

export default Movies;

/*{
"pageParams": [undefined],
"pages": [
  {"dates": [Object], "page": 1, "results": [Array], "total_pages": 18, "total_results": 348}
  {"dates": [Object], "page": 2, "results": [Array], "total_pages": 18, "total_results": 348}
  {"dates": [Object], "page": 3, "results": [Array], "total_pages": 18, "total_results": 348}
  {"dates": [Object], "page": 4, "results": [Array], "total_pages": 18, "total_results": 348}
  ]
}*/
