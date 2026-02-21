import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

// 1. Mock Data to match your Figma exactly
const GROCERY_LIST = [
  {
    category: 'Produce',
    items: [{ id: '1', name: 'Item Name', subName: 'Item Name', checked: true }],
  },
  {
    category: 'Meat',
    items: [
      { id: '2', name: 'Item Name', subName: 'Item Name', checked: false },
      { id: '3', name: 'Item Name', subName: 'Item Name', checked: true },
    ],
  },
  {
    category: 'Dairy',
    items: [{ id: '4', name: 'Item Name', subName: 'Item Name', checked: true }],
  },
];

export default function MealPlanScreen() {
  // 2. State to handle the top toggle
  const [activeTab, setActiveTab] = useState<'Grocery' | 'Meal Plan'>('Grocery');

  // 3. Custom Checkbox Component
  const CheckboxItem = ({ item }: { item: any }) => {
    const [isChecked, setIsChecked] = useState(item.checked);

    return (
      <TouchableOpacity 
        style={styles.itemRow} 
        activeOpacity={0.7} 
        onPress={() => setIsChecked(!isChecked)}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSubName}>{item.subName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Top Toggle Switch */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, activeTab === 'Grocery' && styles.activeToggleButton]}
          onPress={() => setActiveTab('Grocery')}
        >
          <Text style={[styles.toggleText, activeTab === 'Grocery' && styles.activeToggleText]}>
            Grocery
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, activeTab === 'Meal Plan' && styles.activeToggleButton]}
          onPress={() => setActiveTab('Meal Plan')}
        >
          <Text style={[styles.toggleText, activeTab === 'Meal Plan' && styles.activeToggleText]}>
            Meal Plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Grocery' ? (
          // RENDER GROCERY LIST
          GROCERY_LIST.map((section) => (
            <View key={section.category} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.category}</Text>
                <View style={styles.itemCountBadge}>
                  <Text style={styles.itemCountText}>{section.items.length} items</Text>
                </View>
              </View>

              {section.items.map((item) => (
                <CheckboxItem key={item.id} item={item} />
              ))}
            </View>
          ))
        ) : (
          // RENDER MEAL PLAN (Placeholder for now)
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Meal Plan UI goes here!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  headerRow: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#1a1a1a' },
  
  // Toggle Switch Styles
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    marginHorizontal: 24,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: { fontSize: 16, fontWeight: '600', color: '#999' },
  activeToggleText: { color: '#1a1a1a' },

  content: { flex: 1, paddingHorizontal: 24 },

  // Grocery Section Styles
  sectionContainer: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  itemCountBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemCountText: { fontSize: 12, color: '#666', fontWeight: '600' },

  // Item Row & Checkbox Styles
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  checkmark: { color: '#1a1a1a', fontSize: 14, fontWeight: 'bold' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  itemSubName: { fontSize: 12, color: '#999' },
});