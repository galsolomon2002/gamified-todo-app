import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase'; // ודאי שהנתיב תואם

type Task = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  points: number;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [loading, setLoading] = useState(false);

  const pointsMap = {
    easy: 10,
    medium: 25,
    hard: 50,
  };

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) Alert.alert('שגיאה בשליפת משימות', error.message);
    else setTasks(data as Task[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return;
    const task: Omit<Task, 'id'> = {
      title: newTask,
      difficulty,
      completed: false,
      points: pointsMap[difficulty],
    };

    const { data, error } = await supabase.from('tasks').insert([task]).select();
    if (error) Alert.alert('שגיאה בהוספת משימה', error.message);
    else if (data) setTasks(prev => [...prev, data[0]]);

    setNewTask('');
  };

  const toggleCompleteTask = async (id: string, current: boolean) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !current })
      .eq('id', id)
      .select();

    if (error) Alert.alert('שגיאה בעדכון משימה', error.message);
    else if (data) {
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, completed: !current } : task
        )
      );
    }
  };

  const totalPoints = tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const progressToNextLevel = (totalPoints % 100) / 100;

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>שלב נוכחי: {currentLevel}</Text>
      <Text style={styles.pointsText}>סה״כ נקודות: {totalPoints}</Text>

      <View style={styles.progressWrapper}>
        <View style={[styles.progressFill, { width: `${progressToNextLevel * 100}%` }]} />
      </View>

      <Text style={styles.title}>משימות יומיות</Text>

      <TextInput
        style={styles.input}
        placeholder="הזן משימה חדשה"
        value={newTask}
        onChangeText={setNewTask}
      />

      <View style={styles.difficultyRow}>
        {(['easy', 'medium', 'hard'] as Task['difficulty'][]).map(level => (
          <TouchableOpacity key={level} onPress={() => setDifficulty(level)}>
            <Text style={difficulty === level ? styles.selected : styles.unselected}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="הוסף משימה" onPress={addTask} disabled={loading} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleCompleteTask(item.id, item.completed)}
            style={[styles.taskItem, item.completed && styles.taskCompleted]}
          >
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskPoints}>
              {item.points} נקודות ({item.difficulty})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  levelText: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  pointsText: { fontSize: 16, marginBottom: 12 },
  progressWrapper: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4FD1C5',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  selected: { fontWeight: 'bold', color: '#4FD1C5' },
  unselected: { color: 'gray' },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskCompleted: {
    backgroundColor: '#e0ffe0',
    borderColor: '#a0d0a0',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskPoints: {
    fontSize: 14,
    color: 'gray',
  },
});
