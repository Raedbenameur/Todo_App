import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import RNPickerSelect from 'react-native-picker-select';
import { Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

const etat = [
  { label: 'Nouveau', value: 'Nouveau' },
  { label: 'Approuvée', value: 'Approuvée' },
  { label: 'En cours', value: 'Encours' },
  { label: 'Prête', value: 'Prête' },
  { label: 'En test', value: 'Entest' },
  { label: 'Terminée', value: 'Terminée' },
];

export default function EditTaskPage() {
  const navigation = useNavigation();  
  const route = useRoute();  
  const { task } = route.params || {};  // Add a fallback for route.params

  const [description, setDescription] = useState(task.description); 
  const [title, setTitle] = useState(task.title); 
  const [selectedEtat, setSelectedEtat] = useState(task.etat);
  const [selectedCategories, setSelectedCategories] = useState({}); 
  const [storedCategories, setStoredCategories] = useState([]); 
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(task.date)); 
  const [time, setTime] = useState(new Date(`1970-01-01T${task.time}`)); 
  const [isDatePicker, setIsDatePicker] = useState(true); 

  const toggleCategory = (id) => {
    setSelectedCategories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const stored = await AsyncStorage.getItem('categories');
        const parsedCategories = stored ? JSON.parse(stored) : [];
        setStoredCategories(parsedCategories);

        const selected = {};
        task.categories.forEach(category => {
          selected[category.id] = true; 
        });
        setSelectedCategories(selected);
      } catch (error) {
        console.error('Error loading categories', error);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async () => {
    if (!title.trim() || !description.trim() || !selectedEtat || Object.keys(selectedCategories).length === 0) {
      Alert.alert('Error', 'Sil vous plaît remplir tous les champs');
      return;
    }

    const selectedCategoryLabels = Object.keys(selectedCategories)
      .filter((key) => selectedCategories[key])
      .map((key) => storedCategories.find((category) => category.id == key)?.name) // Use optional chaining
      .filter(Boolean); // Ensure no undefined values
  
    const updatedTaskData = {
      title,
      description,
      etat: selectedEtat,
      categories: selectedCategoryLabels,
      date: date.toISOString().split('T')[0], 
      time: time.toTimeString().split(' ')[0],
    };
   
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      const taskIndex = tasks.findIndex(t => t.title.toLowerCase() === task.title.toLowerCase());
      if (taskIndex !== -1) {
        tasks[taskIndex] = updatedTaskData;
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        
        Alert.alert('Success', 'Task updated successfully');
        navigation.navigate('Accueil'); 
      } else {
        Alert.alert('Error', 'Task not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const onChange = (event, selected) => {
    const currentDate = selected || (isDatePicker ? date : time);
    setShow(false); 
    isDatePicker ? setDate(currentDate) : setTime(currentDate); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Modifier la tâche</Text>

      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.row2}>
        <Text style={styles.label}>État:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedEtat(value)}
          placeholder={{ label: 'Sélectionner un état...', value: null }}
          items={etat}
          value={selectedEtat}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false} 
        />
      </View>

      <Text style={styles.categoryTitle}>Catégories:</Text>
      {storedCategories.map((category) => (
        <View key={category.id} style={styles.checkboxContainer}>
          <Checkbox
            status={selectedCategories[category.id] ? 'checked' : 'unchecked'}
            onPress={() => toggleCategory(category.id)}
          />
          <Text style={styles.checkboxLabel}>{category.name}</Text>
        </View>
      ))}

      <View style={styles.row}>
        <Text style={styles.label}>Date limite:</Text>
        <Text style={styles.date}>{date.toLocaleDateString()}</Text>
        <Button title="Saisir date" onPress={() => { setIsDatePicker(true); setShow(true); }} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Heure limite:</Text>
        <Text style={styles.date}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <Button title="Saisir heure" onPress={() => { setIsDatePicker(false); setShow(true); }} />
      </View>

      {show && (
        <DateTimePicker
          value={isDatePicker ? date : time}
          mode={isDatePicker ? 'date' : 'time'}
          display="default"
          onChange={onChange}
        />
      )}

      <Button
        title="Enregistrer"
        onPress={onSubmit}
        color="#007BFF"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f4f8', // A lighter background color for better contrast
    },
    title: {
      fontSize: 28, // Increased font size for better readability
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
      textAlign: 'center', // Center align the title
    },
    input: {
      
      height: 50, // Increased height for better touch target
      borderColor: 'gray', // Changed border color to match theme
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 15, // More padding for comfort
      borderRadius: 10, // Slightly larger border radius for modern look
      backgroundColor: '#ffffff',
      shadowColor: '#000', // Added shadow for depth
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2, // Added elevation for Android
    },
    textArea: {
      height: 120, // Increased height for description input
      textAlignVertical: 'top', 
     // Align text to the top
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      justifyContent: 'space-between',
    },
    row2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20, // Added margin for spacing
    },
    label: {
      fontSize: 18, // Slightly larger font for labels
      fontWeight: 'bold',
      marginRight: 10,
      color: '#555', // Changed label color for better contrast
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      color: '#333',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    checkboxLabel: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '500',
      color: '#333', // Standardized label color
    },
    date: {
      fontSize: 16,
      marginRight: 10,
      color: 'black', // Match date and time color to theme
    },
    button: {
      backgroundColor: '#007BFF', // Primary button color
      padding: 15,
   
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff', // White text for button contrast
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'grey', // Match the border color to theme
      borderRadius: 5,
      color: 'black',
      paddingRight: 30, // Ensure the text is not overlapping the icon
    },
  });
  
