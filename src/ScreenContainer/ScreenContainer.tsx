/**
 ScreenContainer

 Copyright (c) 2023 aoiyu

 This software is released under the MIT License.
 http://opensource.org/licenses/mit
 */
import {
  ColorValue,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import type { ReactNode } from "react";
import React, { useMemo, useState } from "react";

export type ScreenContainerProps = {
  headerComponent?: ReactNode | ((opacity: number) => ReactNode);
  footerComponent?: ReactNode | ((opacity: number) => ReactNode);
  headerBackgroundComponent?: ReactNode | ((opacity: number) => ReactNode);
  footerBackgroundComponent?: ReactNode | ((opacity: number) => ReactNode);
  headerBackgroundColor?: ColorValue;
  footerBackgroundColor?: ColorValue;
  disableHeaderPadding?: boolean;
  disableFooterPadding?: boolean;
  headerAnimation?: "none" | "fade";
  footerAnimation?: "none" | "fade";
  headerFadingRange?: number;
  footerFadingRange?: number;
  overScroll?: boolean;
} & ViewProps;

export const ScreenContainer = (props: ScreenContainerProps) => {
  const {
    headerAnimation = "none",
    footerAnimation = "none",
    headerComponent,
    footerComponent,
    headerBackgroundComponent,
    footerBackgroundComponent,
    headerBackgroundColor,
    footerBackgroundColor,
    overScroll = true,
    disableHeaderPadding = false,
    disableFooterPadding = false,
    children,
  } = props;

  const headerFadingRange = useMemo(() => {
    return props.headerFadingRange != null
      ? props.headerFadingRange > 0
        ? props.headerFadingRange
        : 0.00001 // value enough to make opacity 1 immediately
      : 8;
  }, [props.headerFadingRange]);

  const footerFadingRange = useMemo(() => {
    return props.footerFadingRange != null
      ? props.footerFadingRange > 0
        ? props.footerFadingRange
        : 0.00001 // value enough to make opacity 1 immediately
      : 8;
  }, [props.footerFadingRange]);

  const [scrollViewLayoutHeight, setScrollViewLayoutHeight] = useState(
    Number.MAX_SAFE_INTEGER
  );
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const [scrollViewScrollYOffset, setScrollViewScrollYOffset] = useState(0);

  const headerBackgroundOpacity = useMemo(() => {
    switch (headerAnimation) {
      case "none":
        return 1;
      case "fade":
        return clamp(scrollViewScrollYOffset / headerFadingRange, 0, 1);
    }
  }, [
    headerAnimation,
    headerFadingRange,
    scrollViewContentHeight,
    scrollViewLayoutHeight,
    scrollViewScrollYOffset,
  ]);

  const footerBackgroundOpacity = useMemo(() => {
    switch (footerAnimation) {
      case "none":
        return 1;
      case "fade":
        return clamp(
          -(
            scrollViewLayoutHeight -
            scrollViewContentHeight -
            -scrollViewScrollYOffset
          ) / footerFadingRange,
          0,
          1
        );
    }
  }, [
    footerAnimation,
    footerFadingRange,
    scrollViewContentHeight,
    scrollViewLayoutHeight,
    scrollViewScrollYOffset,
  ]);

  const headerBackgroundComponentContainer = useMemo(
    () => (
      <View
        style={[
          styles.headerBackground,
          {
            backgroundColor: headerBackgroundColor,
            opacity: headerBackgroundOpacity,
          },
        ]}
      >
        {typeof headerBackgroundComponent === "function"
          ? headerBackgroundComponent(headerBackgroundOpacity)
          : headerBackgroundComponent}
      </View>
    ),
    [headerBackgroundOpacity, headerBackgroundComponent, headerBackgroundColor]
  );

  const footerBackgroundComponentContainer = useMemo(
    () => (
      <View
        style={[
          styles.footerBackground,
          {
            backgroundColor: footerBackgroundColor,
            opacity: footerBackgroundOpacity,
          },
        ]}
      >
        {typeof footerBackgroundComponent === "function"
          ? footerBackgroundComponent(footerBackgroundOpacity)
          : footerBackgroundComponent}
      </View>
    ),
    [footerBackgroundOpacity, footerBackgroundComponent, footerBackgroundColor]
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent
      />
      <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
        {headerComponent != null && !disableHeaderPadding && (
          <View style={{ opacity: 0 }} pointerEvents={"none"}>
            {typeof headerComponent === "function"
              ? headerComponent(headerBackgroundOpacity)
              : headerComponent}
          </View>
        )}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={!overScroll ? "never" : "auto"}
          alwaysBounceVertical={false}
          scrollEventThrottle={16}
          decelerationRate={"normal"}
          onScroll={(event) => {
            setScrollViewScrollYOffset(event.nativeEvent.contentOffset.y);
          }}
          onContentSizeChange={(_, contentHeight) => {
            setScrollViewContentHeight(contentHeight);
          }}
          onLayout={(event) => {
            setScrollViewLayoutHeight(event.nativeEvent.layout.height);
          }}
        >
          {children}
        </ScrollView>
        <View style={styles.headerBackgroundContainer}>
          {headerBackgroundComponentContainer}
          {typeof headerComponent === "function"
            ? headerComponent(headerBackgroundOpacity)
            : headerComponent}
        </View>
      </KeyboardAvoidingView>
      <View>
        <View
          style={
            disableFooterPadding
              ? styles.footerNonPaddingContainer
              : styles.footerContainer
          }
        >
          {footerBackgroundComponentContainer}
          {typeof footerComponent === "function"
            ? footerComponent(footerBackgroundOpacity)
            : footerComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    overflow: "visible",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerBackgroundContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
  },
  headerBackground: {
    position: "absolute",
    top: -100,
    right: -100,
    bottom: 0,
    left: -100,
  },
  footerContainer: {},
  footerNonPaddingContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
  },
  footerBackground: {
    position: "absolute",
    top: 0,
    right: -100,
    bottom: -100,
    left: -100,
  },
});

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
