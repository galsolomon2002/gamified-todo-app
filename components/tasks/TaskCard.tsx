import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

type Task = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  points: number;
};

type Props = {
  task: Task;
  onComplete: () => void;
};

export default function TaskCard({ task, onComplete }: Props) {
  return (
    <View style={styles.card}>
      <Text style={task.completed ? styles.completed : styles.text}>
        {task.title} ({task.difficulty}) - {task.points} נקודות
      </Text>
      {!task.completed && (
        <Button title="בוצע" onPress={onComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
