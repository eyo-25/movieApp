import React, { useState } from "react";
import styled from "styled-components/native";
import { useQuery } from "react-query";
import { moviesApi, tvApi } from "../api";
import Loader from "../component/Loder";
import HList from "../component/HList";

const Container = styled.ScrollView``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
  margin-bottom: 40px;
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const onChangeText = (text: string) => setQuery(text);
  const {
    isLoading: moviesLoading,
    data: moviesData,
    refetch: searchMovies,
  } = useQuery(["searchMovies", query], moviesApi.search, {
    enabled: false,
  });
  const {
    isLoading: tvLoading,
    data: tvData,
    refetch: searchTv,
  } = useQuery(["searchTv", query], tvApi.search, {
    //enabled로 mount시 실행을 막고 refetch를 통하여 필요할때 fetch
    enabled: false,
  });

  const onSubmit = () => {
    if (query === "") return;
    searchMovies();
    searchTv();
  };

  return (
    <Container>
      <SearchBar
        placeholder="Search for Movie or TV Show"
        placeholderTextColor="grey"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      {moviesLoading || tvLoading ? <Loader /> : null}
      {moviesData ? <HList title="Movies" data={moviesData.results} /> : null}
      {tvData ? <HList title="Tvs" data={tvData.results} /> : null}
    </Container>
  );
};

export default Search;
