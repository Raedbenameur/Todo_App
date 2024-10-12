import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [storedCategories, setStoredCategories] = useState([]);
  const navigation = useNavigation();

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];
      setTasks(taskList);
      setFilteredTasks(taskList);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const parsedCategories = storedCategories ? JSON.parse(storedCategories) : [];
      setStoredCategories(parsedCategories);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setSelectedDate(selectedDate || null);
  };

  const applyFilters = () => {
    let updatedTasks = tasks;

    if (selectedCategory) {
      updatedTasks = updatedTasks.filter(task => task.categories.includes(selectedCategory));
    }

    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      updatedTasks = updatedTasks.filter(task => task.date === selectedDateString);
    }

    setFilteredTasks(updatedTasks);
  };

  const viewTaskDetails = (task) => {
    navigation.navigate('taskDetails', { task });
  };

  const editTask = (task) => {
    navigation.navigate('taskDetails', { task, mode: "edit" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Toutes mes tâches</Text>
        <Button title="Filtrer" onPress={applyFilters} color="#516171" />
      </View>

      <View style={styles.filterContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          placeholder={{ label: 'Choisir une catégorie...', value: null }}
          items={storedCategories.map(cat => ({ label: cat.name, value: cat.name }))}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>
            {selectedDate ? selectedDate.toLocaleDateString() : 'Sélectionner une date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <ScrollView style={styles.taskContainer}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <View key={index} style={styles.task}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => viewTaskDetails(task)}>
                    <Entypo name="eye" size={24} color="#007BFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editTask(task)} style={styles.editIcon}>
                    <FontAwesome6 name="edit" size={24} color="#007BFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.taskDetail}>Catégorie: {task.categories.join(', ')}</Text>
              <Text style={styles.taskDetail}>État: {task.etat}</Text>
              <Text style={styles.taskDetail}>Date limite: {task.date}</Text>
              <Text style={styles.taskDetail}>Heure limite: {task.time}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>Aucune tâche trouvée</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#007BFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  datePickerButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  taskContainer: {
    padding: 10,
  },
  task: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDetail: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  editIcon: {
    marginLeft: 15,
  },
  noTasksText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginRight: 1,
  },
});
