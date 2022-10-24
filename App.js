import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Image, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./theme";

SplashScreen.preventAutoHideAsync();

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const loadImages = (images) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.loadAsync(image);
    }
  });

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    async function prepare() {
      try {
        //초기화 함수 넣으면됨
        const fonts = loadFonts([Ionicons.font]);
        const images = loadImages([
          require("./ddabong.jpg"),
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png",
        ]);
        await Promise.all([...fonts, ...images]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <NavigationContainer>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View onLayout={onLayoutRootView}></View>
        <Root />
      </NavigationContainer>
    </ThemeProvider>
  );
}
