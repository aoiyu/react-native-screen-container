# react-native-screen-container

Screen container component for React-Native

This library is developed for use with [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
`SafeAreaView` should be used as little as possible, as it will rattle depending on the timing of rendering.
In that case, you would use `SafeAreaView` in an `App` component, for example, but you may want to place headers and footers ignoring safe area.

## Installation

```sh
npm install react-native-screen-container
```

or

```sh
yarn add react-native-screen-container
```

## Usage

```tsx
<ScreenContainer>
  /* Your screen content */
</ScreenContainer>
```

### with additional header / footer component

```tsx
<ScreenContainer
  headerComponent={<SomeHeaderComponent />} {/* <-- Your header component */}
  footerComponent={<SomeFooterComponent />} {/* <-- Your header component */}
  >
  {/* Your screen content here */}
</ScreenContainer>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT



---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
