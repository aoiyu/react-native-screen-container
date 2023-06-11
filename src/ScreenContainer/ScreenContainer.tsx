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
} from 'react-native';
import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import { BlurView } from '@react-native-community/blur';

export type ScreenContainerProps = {
  headerComponent?: ReactNode;
  headerBackgroundComponent?: ReactNode;
  footerComponent?: ReactNode;
  footerBackgroundComponent?: ReactNode;
  headerBackground?: 'blurDark' | 'blurLight' | ColorValue | 'none';
  footerBackground?: 'blurDark' | 'blurLight' | ColorValue | 'none';
  fadingRange?: number;
  overScroll?: boolean;
} & ViewProps;

const blurAmount = 32;

export const ScreenContainer = (props: ScreenContainerProps) => {
  const {
    headerComponent,
    footerComponent,
    // headerBackgroundComponent,
    // footerBackgroundComponent,
    headerBackground = 'blurLight',
    footerBackground = 'blurLight',
    overScroll = true,
    children,
  } = props;

  const fadingRange =
    props.fadingRange != null
      ? props.fadingRange > 0
        ? props.fadingRange
        : 0.00001 // value enough to make opacity 1 immediately
      : 8;

  const [scrollViewLayoutHeight, setScrollViewLayoutHeight] = useState(
    Number.MAX_VALUE
  );
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const [scrollViewScrollYOffset, setScrollViewScrollYOffset] = useState(0);

  const [headerBackgroundOpacity, setHeaderBackgroundOpacity] = useState(0);
  const footerBackgroundOpacity = useMemo(
    () =>
      clamp(
        -(
          scrollViewLayoutHeight -
          scrollViewContentHeight -
          -scrollViewScrollYOffset
        ) / fadingRange,
        0,
        1
      ),
    [
      fadingRange,
      scrollViewContentHeight,
      scrollViewLayoutHeight,
      scrollViewScrollYOffset,
    ]
  );

  const headerBackgroundComponent = useMemo(() => {
    switch (headerBackground) {
      case 'blurLight':
      case 'blurDark':
        return (
          <BlurView
            style={[
              styles.headerBackground,
              { opacity: headerBackgroundOpacity },
            ]}
            blurType={headerBackground === 'blurLight' ? 'light' : 'dark'}
            blurAmount={blurAmount}
            overlayColor={'transparent'}
          />
        );
      case 'none':
        return;
      default:
        return (
          <View
            style={[
              styles.headerBackground,
              {
                backgroundColor: headerBackground,
                opacity: headerBackgroundOpacity,
              },
            ]}
          />
        );
    }
  }, [headerBackgroundOpacity, headerBackground]);

  const footerBackgroundComponent = useMemo(() => {
    switch (footerBackground) {
      case 'blurDark':
      case 'blurLight':
        return (
          <BlurView
            style={[
              styles.footerBackground,
              { opacity: footerBackgroundOpacity },
            ]}
            blurType={footerBackground === 'blurLight' ? 'light' : 'dark'}
            blurAmount={blurAmount}
            overlayColor={'transparent'}
          />
        );
      case 'none':
        return;
      default:
        return (
          <View
            style={[
              styles.footerBackground,
              {
                backgroundColor: footerBackground,
                opacity: footerBackgroundOpacity,
              },
            ]}
          />
        );
    }
  }, [footerBackgroundOpacity, footerBackground]);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={'transparent'}
        translucent
      />
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <View style={{ opacity: 0 }} pointerEvents={'none'}>
          {headerComponent}
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={!overScroll ? 'never' : 'auto'}
          alwaysBounceVertical={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const yOffset = event.nativeEvent.contentOffset.y;
            setScrollViewScrollYOffset(yOffset);
            setHeaderBackgroundOpacity(clamp(yOffset / fadingRange, 0, 1));
          }}
          onContentSizeChange={(_, contentHeight) => {
            setScrollViewContentHeight(contentHeight);
          }}
          onLayout={(event) => {
            setScrollViewLayoutHeight(event.nativeEvent.layout.height);
          }}
        >
          <View style={styles.childrenContainer}>{children}</View>
        </ScrollView>
        <View style={styles.headerContainer}>
          {headerBackgroundComponent}
          {headerComponent}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.footerContainer}>
        {footerBackgroundComponent}
        {footerComponent}
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
    overflow: 'visible',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  childrenContainer: {
    flexShrink: 0,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  headerBackground: {
    position: 'absolute',
    top: -100,
    right: -100,
    bottom: 0,
    left: -100,
  },
  footerContainer: {},
  footerBackground: {
    position: 'absolute',
    top: 0,
    right: -100,
    bottom: -100,
    left: -100,
  },
});

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);