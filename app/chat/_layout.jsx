import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

// Create a custom theme
const theme = {
  roundness: 2,
  colors: {
    primary: '#2457C5',
  },
};

function ChatScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { conversatorName, messages: initialMessages } = params;
  const [messages, setMessages] = React.useState(JSON.parse(initialMessages));
  const [newMessage, setNewMessage] = React.useState({ user: 'Você', text: '' });

  const handleSendMessage = () => {
    if (newMessage.text.trim() === '') {
      Alert.alert('Error', 'A Mensagem não pode ser vazia');
      return;
    }

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setNewMessage({ user: 'Você', text: '' });
  };

  React.useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{conversatorName}</Text>
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
                  message.user === 'Você' ? styles.myMessage : styles.otherMessage
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
            placeholder="Digite aqui"
            value={newMessage.text}
            onChangeText={(text) => setNewMessage({ ...newMessage, text })}
          />
          <Button textColor='white' mode="contained" onPress={handleSendMessage}>
            Enviar
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