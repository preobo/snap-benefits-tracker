import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// Make sure these match the updated types in your useRecommendationEngine hook
import { AIMasterResponse, GroceryItem } from '../hooks/use-recomm';

// --- GROCERY CHECKBOX COMPONENT ---
const CheckboxItem = ({ item }: { item: GroceryItem }) => {
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
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSubName}>{item.subName}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- MAIN SCREEN COMPONENT ---
export default function MealPlanScreen() {
  const [activeTab, setActiveTab] = useState<'Grocery' | 'Meal Plan'>('Meal Plan');
  const [selectedDay, setSelectedDay] = useState<string>('Day 1');
  
  // 1. Catch the AI data passed from the router
  const params = useLocalSearchParams();
  
  // 2. Parse the Master JSON object
  const aiData: AIMasterResponse | null = params.aiData 
    ? JSON.parse(params.aiData as string) 
    : null;

  // Safely extract the arrays, defaulting to empty if loading fails
  const groceryList = aiData?.groceryList || [];
  const mealPlan = aiData?.mealPlan || [];

  // Find the data for the currently selected day
  const currentDayPlan = mealPlan.find(plan => plan.day === selectedDay) || mealPlan[0];

  // Automatically set the first day as active when the component loads
  useEffect(() => {
    if (mealPlan.length > 0) {
      setSelectedDay(mealPlan[0].day);
    }
  }, [mealPlan]);

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
          <Text style={[styles.toggleText, activeTab === 'Grocery' && styles.activeToggleText]}>Grocery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, activeTab === 'Meal Plan' && styles.activeToggleButton]}
          onPress={() => setActiveTab('Meal Plan')}
        >
          <Text style={[styles.toggleText, activeTab === 'Meal Plan' && styles.activeToggleText]}>Meal Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ==========================================
            TAB 1: GROCERY LIST
        ========================================== */}
        {activeTab === 'Grocery' && (
          <View>
            {groceryList.map((section) => (
              <View key={section.category} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.category}</Text>
                  <View style={styles.itemCountBadge}>
                    <Text style={styles.itemCountText}>{section.items.length} items</Text>
                  </View>
                </View>

                {section.items.map((item, index) => (
                  <CheckboxItem key={index} item={item} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ==========================================
            TAB 2: MEAL PLAN
        ========================================== */}
        {activeTab === 'Meal Plan' && currentDayPlan && (
          <View>
            {/* Day Selector Row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
              {mealPlan.map((plan) => (
                <TouchableOpacity 
                  key={plan.day}
                  style={[styles.dayCard, selectedDay === plan.day && styles.activeDayCard]}
                  onPress={() => setSelectedDay(plan.day)}
                >
                  <Text style={[styles.dayLabel, selectedDay === plan.day && styles.activeDayText]}>
                    {plan.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Meals List for Selected Day */}
            <View style={styles.mealsContainer}>
              {currentDayPlan.meals.map((meal, index) => (
                <View key={index} style={styles.mealSection}>
                  
                  {/* Meal Header (e.g. "Breakfast") */}
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealType}>{meal.type}</Text>
                    <TouchableOpacity style={styles.addIconBtn}>
                      <Text style={styles.addIcon}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Meal Card */}
                  <TouchableOpacity style={styles.mealCard} activeOpacity={0.8}>
                    {/* Placeholder for future meal images */}
                    <View style={styles.mealImagePlaceholder} />
                    
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealSubName}>Tap to view details</Text>
                    </View>

                    <TouchableOpacity style={styles.moreIconBtn}>
                      <Text style={styles.moreIcon}>•••</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>

                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  headerRow: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#1a1a1a' },
  
  // Toggle Switch Styles
  toggleContainer: {
    flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 30,
    marginHorizontal: 24, padding: 4, marginBottom: 24,
  },
  toggleButton: { flex: 1, paddingVertical: 12, borderRadius: 26, alignItems: 'center' },
  activeToggleButton: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 16, fontWeight: '600', color: '#999' },
  activeToggleText: { color: '#1a1a1a' },

  content: { flex: 1, paddingHorizontal: 24 },

  // --- GROCERY STYLES ---
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  itemCountBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  itemCountText: { fontSize: 12, color: '#666', fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eaeaea', borderRadius: 16, padding: 16, marginBottom: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#ddd', marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { borderColor: '#1a1a1a', backgroundColor: '#ffffff' },
  checkmark: { color: '#1a1a1a', fontSize: 14, fontWeight: 'bold' },
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  itemSubName: { fontSize: 12, color: '#999' },

  // --- MEAL PLAN STYLES ---
  daySelector: { flexDirection: 'row', marginBottom: 24 },
  dayCard: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, marginRight: 12, backgroundColor: '#f9f9f9', alignItems: 'center', justifyContent: 'center' },
  activeDayCard: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  dayLabel: { fontSize: 16, fontWeight: '600', color: '#999' },
  activeDayText: { color: '#1a1a1a', fontWeight: 'bold' },

  mealsContainer: { paddingBottom: 40 },
  mealSection: { marginBottom: 24 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mealType: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  addIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  addIcon: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: -2 },
  
  mealCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eaeaea', borderRadius: 16, padding: 12 },
  mealImagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#d9d9d9', marginRight: 16 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  mealSubName: { fontSize: 13, color: '#999' },
  moreIconBtn: { padding: 8 },
  moreIcon: { fontSize: 18, color: '#999', letterSpacing: 1 },
});