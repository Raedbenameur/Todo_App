import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskDetailsPage() {
  const route = useRoute(); // Get the route object
  const navigation = useNavigation(); // Get the navigation object
  const { task, mode } = route.params; // Destructure the task and mode from params

  // Logging the task and mode for debugging purposes
  console.log('Task Details:', task, mode);
  
  // Function to handle editing the task
  const handleEdit = () => {
    navigation.navigate('EditTask', { task }); // Navigate to the EditTask page
  };

  // Function to handle deleting the task
  const handleDelete = async () => {
    Alert.alert(
      "Supprimer la tâche",
      "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              // Load current tasks from AsyncStorage
              const storedTasks = await AsyncStorage.getItem('tasks');
              const taskList = storedTasks ? JSON.parse(storedTasks) : [];
  
              // Ensure task and task.title are defined
              if (task && task.title) {
                // Filter out the task to be deleted
                const updatedTasks = taskList.filter(t => t.title !== task.title);
  
                // Save the updated task list back to AsyncStorage
                await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
                // Navigate back after deletion
                navigation.goBack();
              } else {
                Alert.alert("Erreur", "La tâche est introuvable.");
              }
            } catch (error) {
              Alert.alert("Erreur", "Une erreur s'est produite lors de la suppression de la tâche.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Détails </Text>
      
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Titre :</Text>
        <Text style={styles.title}>{task.title}</Text>
        
        <Text style={styles.label}>Catégorie :</Text>
        <Text style={styles.detailText}>{task.categories.join(', ')}</Text>

        <Text style={styles.label}>État :</Text>
        <Text style={styles.detailText}>{task.etat}</Text>

        <Text style={styles.label}>Date limite :</Text>
        <Text style={styles.detailText}>{task.date}</Text>

        <Text style={styles.label}>Heure limite :</Text>
        <Text style={styles.detailText}>{task.time}</Text>
      </View>
      
      {/* Conditionally render Edit and Delete buttons if mode is "edit" */}
      {mode === "edit" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center', // Center the header text
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1B1C1F',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#516171',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#516171',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#0ACF83',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF4500',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
