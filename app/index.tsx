// @ts-nocheck
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import RewardPicker from "../components/RewardPicker"; // מייבא את הקומפוננטה שבנינו

export default function IndexScreen() {
  // משתנים שישמרו את מה שהמשתמש בחר
  const [smallReward, setSmallReward] = useState("");
  const [bigReward, setBigReward] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>🎯 הגדרות פרסים</Text>

        {/* מציגים את הקומפוננטה */}
        <RewardPicker
          smallReward={smallReward}
          bigReward={bigReward}
          onChangeSmall={setSmallReward}
          onChangeBig={setBigReward}
        />

        {/* מציגים את מה שנבחר כתצוגה מקדימה */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.preview}>
            פרס קטן שנבחר: <Text style={styles.bold}>{smallReward || "—"}</Text>
          </Text>
          <Text style={styles.preview}>
            פרס גדול שנבחר: <Text style={styles.bold}>{bigReward || "—"}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { padding: 16, gap: 12 },
  h1: { fontSize: 22, fontWeight: "800", textAlign: "right" },
  preview: { textAlign: "right", fontSize: 16, marginTop: 4 },
  bold: { fontWeight: "800" },
});
