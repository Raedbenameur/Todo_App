import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert ,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Static IDs for categories (you can expand this list)
  const staticIDs = [1, 2, 3, 4];

  // Load categories from AsyncStorage
  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const categoryList = storedCategories ? JSON.parse(storedCategories) : [];
      setCategories(categoryList);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  // Save categories to AsyncStorage
  const saveCategories = async (updatedCategories) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to save categories', error);
    }
  };

  // Add a new category with a static ID
  const addCategory = () => {
    if (newCategory.trim() === '') {
      alert('Le nom de la catégorie ne peut pas être vide');
      return;
    }
    
    // Get the next available static ID
    const availableID = staticIDs.find(id => !categories.some(cat => cat.id === id));
    
    if (availableID === undefined) {
      alert('Aucune ID disponible pour la nouvelle catégorie.');
      return;
    }
    
    const updatedCategories = [...categories, { id: availableID, name: newCategory }];
    saveCategories(updatedCategories);
    setNewCategory(''); // Reset input field
    console.log('New category added:', newCategory , availableID); // Debugging
  };

  // Edit a category
  const editCategory = (category) => {
    setEditingCategory(category);
    setEditValue(category.name);
  };

  // Save the edited category
  const saveEditedCategory = () => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === editingCategory.id) {
        return { ...cat, name: editValue };
      }
      return cat;
    });
    saveCategories(updatedCategories);
    setEditingCategory(null);
    setEditValue('');
  };

  // Delete a category
  const deleteCategory = (category) => {
    Alert.alert(
      'Supprimer la catégorie',
      `Voulez-vous vraiment supprimer la catégorie "${category.name}"?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => {
            const updatedCategories = categories.filter((cat) => cat.id !== category.id);
            saveCategories(updatedCategories);
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Catégories</Text>

      {/* Add New Category */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ajouter une nouvelle catégorie"
          value={newCategory}
          onChangeText={setNewCategory}
        />
         <TouchableOpacity style={styles.button} onPress={addCategory}>
  <Text style={styles.buttonText}>Ajouter</Text>
</TouchableOpacity>
      </View>

      {/* List of Categories */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()} // Ensure ID is converted to string
        renderItem={({ item }) => (
          <View style={styles.categoryContainer}>
            {editingCategory && editingCategory.id === item.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={editValue}
                  onChangeText={setEditValue}
                />
                <TouchableOpacity style={styles.button} onPress={saveEditedCategory}>
  <Text style={styles.buttonText}>Sauvegarder</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.deleteButton} onPress={() => setEditingCategory(null)}>
  <Text style={styles.buttonText}>Annuler</Text>
</TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.categoryText}>{item.name}</Text>
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => editCategory(item)}>
  <Text style={styles.buttonText}>Modifier</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.deleteButton} onPress={() => deleteCategory(item)}>
  <Text style={styles.buttonText}>Supprimer</Text>
</TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f9fa', // Lighter background for better contrast
    },
    headerText: {
      fontSize: 28, // Increased font size for better visibility
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center', // Center align the header text
      color: '#343a40', // Darker color for the header
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      borderColor: 'grey', // Changed border color to match the theme
      borderWidth: 1,
      padding: 12, // More padding for better touch target
      borderRadius: 8, // More rounded corners for a modern look
      marginRight: 10,
      backgroundColor: '#ffffff', // White background for input
      shadowColor: '#000', // Shadow for depth
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2, // Elevation for Android
    },
    categoryContainer: {
      padding: 15,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2, // Elevation for Android
    },
    categoryText: {
      fontSize: 18,
      color: '#343a40', // Darker text for better visibility
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    editContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      marginLeft: 10, // Spacing between buttons
      backgroundColor: '#3688F2', // Primary button color
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    deleteButton: {
      marginLeft: 10,
      backgroundColor: '#FF4500', // Red for delete button
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    buttonText: {
      color: '#ffffff', // White text for buttons
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
