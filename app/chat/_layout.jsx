import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

// Create a custom theme
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2457C5',
  },
};

// Fake chat messages data
const fakeChatData = {
  id: '1',
  messages: [
    { user: 'Alice', text: 'Hi there!' }
  ],
};

function ChatScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = React.useState(fakeChatData.messages);
  const [newMessage, setNewMessage] = React.useState({ user: 'Current User', text: '' });

  const handleSendMessage = () => {
    if (newMessage.text.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setNewMessage({ user: 'Current User', text: '' });
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="auto" />
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chat</Text>
        </View>
        <ScrollView style={styles.container}>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>Sem mensagens no momento</Text>
          ) : (
            messages.map((message, index) => (
              <View 
                key={index} 
                style={[
                  styles.messageContainer, 
                  message.user === 'Current User' ? styles.myMessage : styles.otherMessage
                ]}
              >
                <Text style={styles.messageUser}>{message.user}:</Text>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={newMessage.text}
            onChangeText={(text) => setNewMessage({ ...newMessage, text })}
          />
          <Button mode="contained" onPress={handleSendMessage}>
            Send
          </Button>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  messageContainer: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
  },
  messageUser: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 8,
  },
});

export default ChatScreen;
