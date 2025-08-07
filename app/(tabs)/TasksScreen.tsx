import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqlmcecwilagtgncglrb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbG1jZWN3aWxhZ3RnbmNnbHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1OTkyNjcsImV4cCI6MjA3MDE3NTI2N30.vyKkD0WJBXDkKALHsVAw03WavSswONWJlsE7sW1gwF0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Task = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  points: number;
  time?: string;
};

const pointsMap = {
  easy: 10,
  medium: 25,
  hard: 50,
};

function analyzeTaskDifficulty(title: string): 'easy' | 'medium' | 'hard' {
  const lowerTitle = title.toLowerCase();
  const wordCount = title.trim().split(/\s+/).length;
  const hardKeywords = ['פרויקט', 'בנק', 'מצגת', 'מבחן', 'טסט', 'פגישה חשובה'];
  const mediumKeywords = ['לתאם', 'לסדר', 'לקנות', 'להתקשר', 'לקבוע'];
  if (hardKeywords.some(word => lowerTitle.includes(word))) return 'hard';
  if (mediumKeywords.some(word => lowerTitle.includes(word)) || wordCount > 5) return 'medium';
  return 'easy';
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [taskTime, setTaskTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) console.error('שגיאה בשליפת משימות:', error);
    else setTasks(data as Task[]);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const difficulty = analyzeTaskDifficulty(newTask);
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: newTask,
        difficulty,
        completed: false,
        points: pointsMap[difficulty],
        time: taskTime.toISOString(),
      })
      .select()
      .single();
    if (error) {
      console.error('שגיאה בהוספת משימה:', error);
      return;
    }
    setTasks([...tasks, data as Task]);
    setNewTask('');
    setTaskTime(new Date());
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    const { error } = await supabase.from('tasks').update(updated).eq('id', id);
    if (error) {
      console.error('שגיאה בעדכון משימה:', error);
      return;
    }
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('שגיאה במחיקת משימה:', error);
      return;
    }
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const totalPoints = tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const progressToNextLevel = (totalPoints % 100) / 100;

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>שלב נוכחי: {currentLevel}</Text>
      <Text style={styles.pointsText}>סה\"כ נקודות: {totalPoints}</Text>

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

      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>
          שעת ביצוע: {taskTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={taskTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event: any, selectedDate?: Date) => {
            setShowTimePicker(false);
            if (selectedDate) setTaskTime(selectedDate);
          }}
        />
      )}

      <Button title="הוסף משימה" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, item.completed && styles.taskCompleted]}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)} style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskPoints}>
                {item.points} נקודות ({item.difficulty})
              </Text>
              {item.time && <Text style={styles.taskTime}>🕒 {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>🗑️</Text>
            </TouchableOpacity>
          </View>
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
  timeButton: {
    marginBottom: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    textAlign: 'center',
    color: '#333',
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
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
  taskTime: {
    fontSize: 12,
    color: 'gray',
  },
});