// components/RewardPicker.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { SUGGESTED_SMALL_REWARDS, SUGGESTED_BIG_REWARDS } from "../constants/gamification";

export default function RewardPicker({
  smallReward,
  bigReward,
  onChangeSmall,
  onChangeBig,
}: {
  smallReward: string;
  bigReward: string;
  onChangeSmall: (v: string) => void;
  onChangeBig: (v: string) => void;
}) {
  // הגנות למקרה של טעינת-יתר/קאש
  const smalls = Array.isArray(SUGGESTED_SMALL_REWARDS) ? SUGGESTED_SMALL_REWARDS : [];
  const bigs = Array.isArray(SUGGESTED_BIG_REWARDS) ? SUGGESTED_BIG_REWARDS : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחרי פרס קטן:</Text>
      {smalls.map((reward) => (
        <View key={`s-${reward}`} style={{ marginVertical: 4 }}>
          <Button title={reward} onPress={() => onChangeSmall(reward)} />
        </View>
      ))}

      <Text style={[styles.title, { marginTop: 12 }]}>בחרי פרס גדול:</Text>
      {bigs.map((reward) => (
        <View key={`b-${reward}`} style={{ marginVertical: 4 }}>
          <Button title={reward} onPress={() => onChangeBig(reward)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 8, textAlign: "right" },
});