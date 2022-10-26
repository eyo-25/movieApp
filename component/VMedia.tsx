import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import Poster from "../component/Poster";
import { TouchableOpacity } from "react-native";
import Votes from "./Votes";
import { Movie, TV } from "../api";

const Container = styled.View`
  align-items: center;
`;

const Title = styled.Text`
  color: white;
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

interface IVMediaProps {
  posterPath: string;
  originalTitle: string;
  voteAverage: number;
  fullData: Movie | TV;
}

const VMedia: React.FC<IVMediaProps> = ({
  posterPath,
  originalTitle,
  voteAverage,
  fullData,
}) => {
  const navigation = useNavigation();
  const goToDetail = () => {
    //@ts-ignore
    navigation.navigate("Stack", {
      screen: "Detail",
      params: {
        ...fullData,
      },
    });
    // 같은 Navigater sceen 이동시
    // navigation.navigate("Stack", {params: {}})
  };
  return (
    <TouchableOpacity onPress={goToDetail}>
      <Container>
        <Poster path={posterPath} />
        <Title>
          {originalTitle.slice(0, 7)}
          {originalTitle.length > 7 ? "..." : null}
        </Title>
        <Votes votes={voteAverage} />
      </Container>
    </TouchableOpacity>
  );
};

export default VMedia;
