import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ActivityIndicator, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useAI } from '../../hooks/useAI';

// 1. Define the structure for a single message
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function AIScreen() {
  const [prompt, setPrompt] = useState('');
  
  // 2. State to hold the history of all messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  const { loading, error, result, callAI } = useAI();

  // 3. Listen for the AI's response and add it to the list automatically
  useEffect(() => {
    if (result && result.text) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: result.text, sender: 'ai' }
      ]);
    }
  }, [result]);

  const onSubmit = () => {
    if (!prompt.trim()) return;

    const userText = prompt.trim();
    
    // Add the user's message to the screen immediately
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userText, sender: 'user' }
    ]);

    // Clear the input field
    setPrompt('');

    // Send the text to your AI hook
    callAI(userText);
  };

  // 4. Function to style and render each chat bubble
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble, 
      item.sender === 'user' ? styles.userBubble : styles.aiBubble
    ]}>
      <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>SNAP Assistant</Text>

      {/* 5. The scrolling list that displays the conversation */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />

      {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* 6. The input area locked to the bottom */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about benefits..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <Button title="Send" onPress={onSubmit} disabled={loading || !prompt.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  chatList: { paddingBottom: 16 },
  
  // Bubble Styles
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#007AFF', // iOS Blue
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4, // Makes it look like a speech bubble tail
  },
  aiBubble: {
    backgroundColor: '#E5E5EA', // Light Gray
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userText: { color: '#fff', fontSize: 16 },
  aiText: { color: '#000', fontSize: 16 },
  
  // Input Area Styles
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#f9f9f9'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: '#fff'
  },
  error: { color: 'red', textAlign: 'center', marginBottom: 8 },
});