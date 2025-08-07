import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import TaskCard from '../components/tasks/TaskCard';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const pointsMap = {
    easy: 10,
    medium: 25,
    hard: 50,
  };

  const addTask = () => {
    if (!newTask) return;
    const task = {
      id: Date.now().toString(),
      title: newTask,
      difficulty,
      completed: false,
      points: pointsMap[difficulty],
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const completeTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>משימות יומיות</Text>

      <TextInput
        style={styles.input}
        placeholder="הזן משימה חדשה"
        value={newTask}
        onChangeText={setNewTask}
      />

      <View style={styles.difficultyRow}>
        {['easy', 'medium', 'hard'].map(level => (
          <TouchableOpacity key={level} onPress={() => setDifficulty(level as any)}>
            <Text style={difficulty === level ? styles.selected : styles.unselected}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="הוסף משימה" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onComplete={() => completeTask(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  difficultyRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  selected: { fontWeight: 'bold', color: '#4FD1C5' },
  unselected: { color: 'gray' },
});
