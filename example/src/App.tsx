import * as React from "react";

import { Text, TextInput } from "react-native";
import { ScreenContainer } from "react-native-screen-container";

export default function App() {
  return (
    <ScreenContainer>
      {new Array(50).fill(0).map(() => (
        <Text>text</Text>
      ))}
      <TextInput defaultValue={"input here"} />
    </ScreenContainer>
  );
}
