import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { View, Text, TouchableOpacity, Share, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Movie, moviesApi, TV, tvApi } from "../api";
import { Dimensions, StyleSheet, Linking } from "react-native";
import Poster from "../component/Poster";
import { makeImgPath } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { BLACK_COLOR } from "../colors";
import { useQuery } from "react-query";
import Loader from "../component/Loder";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Background = styled.Image`
  opacity: 0.5;
`;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;

const Title = styled.Text`
  color: white;
  font-size: 30px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;

const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin: 20px 0px;
`;

const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
`;

const BtnText = styled.Text`
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 24px;
  margin-left: 10px;
`;

const Data = styled.View`
  padding: 0px 20px;
`;

type RootStackParamList = {
  // Stack에서 컴포넌트부르는 이름과 요소 타입 정의
  Detail: Movie | TV;
};

// 어디로 부터 오는지 타입을 지정
type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const Detail: React.FC<DetailScreenProps> = ({
  navigation: { setOptions },
  route: { params },
}) => {
  const isMovie = "original_title" in params;
  const shareMedia = async () => {
    const isAndroid = Platform.OS === "android";
    const homepage =
      isMovie && "imdb_id" in params
        ? `https://www.imdb.com/title/${data.imdb_id}/`
        : data.homepage;
    const title =
      "original_title" in params ? params.original_title : params.original_name;
    if (isAndroid) {
      await Share.share({
        message: `${title}\n티져 보러가기: ${homepage}`,
        title: title,
      });
    } else {
      await Share.share({
        url: homepage,
        title: title,
      });
    }
  };
  const SheareButton = () => {
    return (
      <TouchableOpacity onPress={shareMedia}>
        <Ionicons name="share-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };
  const { isLoading, data } = useQuery(
    [isMovie ? "movies" : "tvs", params.id],
    isMovie ? moviesApi.detail : tvApi.detail
  );

  console.log(params.id);

  useEffect(() => {
    setOptions({
      title: "original_title" in params ? "Movie" : "TvShow",
    });
  }, []);
  // data가 들어왔을때 버튼을 추가해줘야 데이터가 들어온다
  useEffect(() => {
    if (data) {
      setOptions({
        headerRight: () => <SheareButton />,
      });
    }
  }, [data]);

  const openYTLink = async (videoID: string) => {
    const baseUrl = `https://m.youtube.com/watch?v=${videoID}`;
    await Linking.openURL(baseUrl);
    // await WebBrowser.openBrowserAsync(baseUrl);
  };

  return (
    <Container>
      <Header>
        <Background
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(params.backdrop_path || "") }}
        />
        <LinearGradient
          colors={["transparent", BLACK_COLOR]}
          style={StyleSheet.absoluteFill}
        />
        <Column>
          <Poster path={params.poster_path || ""} />
          <Title>
            {"original_title" in params
              ? params.original_title
              : params.original_name}
          </Title>
        </Column>
      </Header>
      <Data>
        <Overview>{params.overview}</Overview>
        {isLoading ? <Loader /> : null}
        {data?.videos?.results?.map((video) => (
          <VideoBtn key={video.id} onPress={() => openYTLink(video.key)}>
            <Ionicons name="logo-youtube" color="white" size={24} />
            <BtnText>{video.name}</BtnText>
          </VideoBtn>
        ))}
      </Data>
    </Container>
  );
};

export default Detail;
