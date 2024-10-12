import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Categories from '../app/categories';
 function TaskPage() {
  const [taskCounts, setTaskCounts] = useState({
    Nouveau: 0,
    Approuvée: 0,
    EnCours: 0,
    Prête: 0,
    EnTest: 0,
    Terminée: 0,
  });

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const counts = {
        Nouveau: 0,
        Approuvée: 0,
        EnCours: 0,    // Should match 'En cours' from the task data
        Prete: 0,      // Should match 'Prête' from the task data
        EnTest: 0,     // Should match 'En test' from the task data
        Terminee: 0,   // Should match 'Terminée' from the task data
      };

      tasks.forEach((task) => {
        const etat = task.etat;
  
        // Use the correct key in the counts object based on task.etat
        if (etat === 'En cours') {
          counts.EnCours++;
        } else if (etat === 'Prête') {
          counts.Prete++;
        }  else if (etat === 'Entest') {
          counts.EnTest++;
        } else if (etat === 'Terminée') {
          counts.Terminee++;
        } else if (etat === 'Nouveau') {
          counts.Nouveau++;
        } else if (etat === 'Approuvée') {
          counts.Approuvée++;
        }
        else if (etat === 'Encours') {
          counts.EnCours++;
        }
    
       
      });
  
      setTaskCounts(counts);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
        <Link href="/Accueil" >
          <Text style={styles.headerText}>Toutes mes tâches</Text>
        </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/newTask" >
            <Text style={styles.plusIcon}>+</Text> {/* Plus icon */}
          </Link>
        </TouchableOpacity>
      </View>

      {/* Task Status Grid */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Nouveau ({taskCounts.Nouveau})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Approuvée ({taskCounts.Approuvée})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>En cours ({taskCounts.EnCours})</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.button}>
          
            <Text style={styles.buttonText}>Prête ({taskCounts.Prete})</Text>
           
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>En test ({taskCounts.EnTest})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
        
            <Text style={styles.buttonText}>Terminée ({taskCounts.Terminee})</Text>
          
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}




// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#2980b9', // Background color of the header for each screen
        },
        headerTintColor: '#fff', // White color for the header text and icons
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 28

        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#4a90e2', // Blue color for active icons
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: '#ffffff', // White background for the bottom tab bar
          borderTopColor: '#ddd', // Subtle border for separation
          paddingBottom: 5, // Add padding for a more spacious layout
        },
      }}
    >
      <Tab.Screen name="Home" component={TaskPage} />
      <Tab.Screen name="Categories" component={Categories} />
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f8fc', // Lighter background color for a modern look
  },
  plusIcon: {
    fontSize: 30,
    color: '#333', // Darker text color for contrast
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a90e2', // Primary color for the header text
  },
  grid: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#6495ED',
    borderRadius: 8,
    padding: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
