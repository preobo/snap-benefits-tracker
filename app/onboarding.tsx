import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRecommendationEngine } from '../hooks/use-recomm';


export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const { getRecommendations, loading, recommendations } = useRecommendationEngine();
  // Listen for the AI to finish, then navigate to the meal plan screen
  useEffect(() => {
    if (recommendations.length > 0) {
      router.push({
        pathname: '/meal-plan' as any,
        params: { aiData: JSON.stringify(recommendations) }
      });
    }
  }, [recommendations]);

  
  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    ebtCard: '', ebtPin: '',
    parentName: '', childrenCount: 1,
    budget: '', reloadTime: '',
    priorities: [] as string[],
    dietaryRestrictions: [] as string[],
  });

  const nextStep = () => setStep((prev) => prev + 1);

  // Helper function for the selectable chips (Priorities and Diet)
  const toggleArrayItem = (field: 'priorities' | 'dietaryRestrictions', value: string) => {
    setFormData((prev) => {
      const array = prev[field];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter((item) => item !== value) };
      }
      return { ...prev, [field]: [...array, value] };
    });
  };

  // 2. The Final Submit Function
  const handleFinish = async () => {
    // This sends all the collected data to your Supabase AI Edge Function
    await getRecommendations({
      parentName: formData.parentName,
      childrenCount: formData.childrenCount,
      budget: formData.budget,
      reloadTime: formData.reloadTime,
      priorities: formData.priorities,
      dietaryRestrictions: formData.dietaryRestrictions,
    });
    // Navigate to your Home/Dashboard screen here!
    console.log("Onboarding Complete! Data sent to AI.");
  };

  // --- UI RENDER BLOCKS ---

  if (step === 1) return (
    <View style={styles.container}>
      <Text style={styles.header}>Link your EBT</Text>
      <Text style={styles.subtext}>Connect your SNAP benefits to get started.</Text>
      
      <Text style={styles.label}>EBT CARD NUMBER</Text>
      <TextInput style={styles.input} placeholder="1234 1234 1234 1234" keyboardType="numeric" 
        onChangeText={(t) => setFormData({...formData, ebtCard: t})} />
      
      <Text style={styles.label}>PIN</Text>
      <TextInput style={styles.input} placeholder="4 digit pin" keyboardType="numeric" secureTextEntry 
        onChangeText={(t) => setFormData({...formData, ebtPin: t})} />

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={nextStep}><Text style={styles.linkText}>Link EBT Later</Text></TouchableOpacity>
    </View>
  );

  if (step === 2) return (
    <View style={styles.centeredContainer}>
      <View style={styles.successCircle}><Text style={styles.check}>✓</Text></View>
      <Text style={styles.header}>EBT Linked</Text>
      <Text style={styles.subtext}>Your EBT card was successfully connected</Text>
      
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
        <Text style={styles.buttonText}>Setup Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={nextStep}>
        <Text style={styles.secondaryButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );

  if (step === 3) return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name</Text>
      <TextInput style={styles.input} placeholder="Enter your name" 
        onChangeText={(t) => setFormData({...formData, parentName: t})} />

      <Text style={styles.label}>Children</Text>
      <TextInput style={styles.input} placeholder="Number of children" keyboardType="numeric" 
        onChangeText={(t) => setFormData({...formData, childrenCount: parseInt(t) || 0})} />

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  if (step === 4) return (
    <View style={styles.container}>
      <Text style={styles.header}>Budget</Text>
      <Text style={styles.subtext}>Select all that apply to you</Text>

      <Text style={styles.label}>HOW MUCH SNAP DO YOU USUALLY GET PER MONTH?</Text>
      <View style={styles.row}>
        {['<$200', '$200-$400', '$400-$600'].map(amt => (
          <TouchableOpacity key={amt} onPress={() => setFormData({...formData, budget: amt})}
            style={[styles.chip, formData.budget === amt && styles.activeChip]}>
            <Text style={formData.budget === amt ? styles.activeChipText : styles.chipText}>{amt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>WHEN DOES YOUR BENEFITS RELOAD EACH MONTH?</Text>
      <View style={styles.row}>
        {['Start', 'Middle', 'End'].map(time => (
          <TouchableOpacity key={time} onPress={() => setFormData({...formData, reloadTime: time})}
            style={[styles.chip, formData.reloadTime === time && styles.activeChip]}>
            <Text style={formData.reloadTime === time ? styles.activeChipText : styles.chipText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}><Text style={styles.buttonText}>Continue</Text></TouchableOpacity>
    </View>
  );

  if (step === 5) return (
    <View style={styles.container}>
      <Text style={styles.header}>What Matters Most to You?</Text>
      <ScrollView>
        {['Low Cost', 'Healthier Options', 'Kid-Friendly', 'Less Planning stress', 'Variety in meals', 'Fast to make'].map(item => (
          <TouchableOpacity key={item} onPress={() => toggleArrayItem('priorities', item)}
            style={[styles.listButton, formData.priorities.includes(item) && styles.activeListButton]}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}><Text style={styles.buttonText}>Continue</Text></TouchableOpacity>
    </View>
  );

  if (step === 6) return (
    <View style={styles.container}>
      <Text style={styles.header}>Any Dietary Restrictions?</Text>
      
      <Text style={styles.label}>COMMON ALLERGENS</Text>
      <View style={styles.rowWrap}>
        {['Dairy', 'Peanut', 'Gluten', 'Soy'].map(item => (
          <TouchableOpacity key={item} onPress={() => toggleArrayItem('dietaryRestrictions', item)}
            style={[styles.chip, formData.dietaryRestrictions.includes(item) && styles.activeChip]}>
            <Text style={formData.dietaryRestrictions.includes(item) ? styles.activeChipText : styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}><Text style={styles.buttonText}>Continue</Text></TouchableOpacity>
    </View>
  );

  if (step === 7) return (
    <View style={styles.centeredContainer}>
      <Text style={{fontSize: 50, marginBottom: 16}}>🎉</Text>
      <Text style={styles.header}>All Done!</Text>
      <Text style={styles.subtext}>Your family's profile is ready. We'll start suggesting meals that fit your budget, schedule, and everyone's tastes.</Text>
      
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={handleFinish} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>View my Meal Plan</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  centeredContainer: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  subtext: { fontSize: 16, color: '#666', marginBottom: 32, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 8 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  
  chip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  activeChip: { backgroundColor: '#3B5998', borderColor: '#3B5998' },
  chipText: { color: '#333' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  
  listButton: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 12 },
  activeListButton: { borderColor: '#3B5998', backgroundColor: '#eef2fa', borderWidth: 2 },
  
  spacer: { flex: 1 },
  
  primaryButton: { backgroundColor: '#3B5998', padding: 18, borderRadius: 12, alignItems: 'center', width: '100%', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#fff', padding: 18, borderRadius: 12, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#ddd' },
  secondaryButtonText: { color: '#3B5998', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#999', textAlign: 'center', fontSize: 14, marginTop: 8 },
  
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  check: { fontSize: 40, color: '#333' }
});