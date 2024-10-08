import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { DeviceMotion } from "expo-sensors";

export default function Layout() {
  const [orientation, setOrientation] = useState("Portrait");

  useEffect(() => {
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Categories" }} />
      <Stack.Screen name="game" options={{ title: "Game" }} />
    </Stack>
  );
}
