import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { Ionicons } from '@expo/vector-icons';
import { messagingService } from '../../../lib/services/MessagingService';
import { useAuth } from '../../../hooks/useAuth';
import { format } from 'date-fns';

interface ChatProps {
  recipientId: string;
  recipientName: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export function Chat({ recipientId, recipientName }: ChatProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginLeft: theme.spacing.md,
    },
    messagesContainer: {
      flex: 1,
      padding: theme.spacing.md,
    },
    messageWrapper: {
      marginBottom: theme.spacing.md,
      maxWidth: '80%',
    },
    sentMessage: {
      alignSelf: 'flex-end',
    },
    receivedMessage: {
      alignSelf: 'flex-start',
    },
    messageContent: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    sentMessageContent: {
      backgroundColor: theme.colors.primary,
    },
    receivedMessageContent: {
      backgroundColor: theme.colors.background.secondary,
    },
    messageText: {
      fontSize: theme.typography.sizes.body,
    },
    sentMessageText: {
      color: theme.colors.text.light,
    },
    receivedMessageText: {
      color: theme.colors.text.primary,
    },
    timestamp: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    inputContainer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.secondary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
      color: theme.colors.text.primary,
    },
    attachmentPreview: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    },
    attachmentName: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
  });

  useEffect(() => {
    loadMessages();
  }, [recipientId]);

  const loadMessages = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const response = await messagingService.getChatMessages(recipientId, pageToLoad);
      if (pageToLoad === 1) {
        setMessages(response.messages);
      } else {
        setMessages(prev => [...prev, ...response.messages]);
      }
      setHasMore(response.messages.length === 20);
      setPage(pageToLoad);
      
      // Mark received messages as read
      const unreadMessageIds = response.messages
        .filter(m => m.senderId === recipientId && m.status !== 'read')
        .map(m => m.id);
      if (unreadMessageIds.length > 0) {
        await messagingService.markMessagesAsRead(unreadMessageIds);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const message = await messagingService.sendChatMessage({
        senderId: user.id,
        receiverId: recipientId,
        content: newMessage,
      });
      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      scrollViewRef.current?.scrollToEnd();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    if (!user) return null;
    const isSent = message.senderId === user.id;

    return (
      <View
        key={message.id}
        style={[
          styles.messageWrapper,
          isSent ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={[
            styles.messageContent,
            isSent ? styles.sentMessageContent : styles.receivedMessageContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSent ? styles.sentMessageText : styles.receivedMessageText,
            ]}
          >
            {message.content}
          </Text>
          {message.attachments?.map(attachment => (
            <View key={attachment.id} style={styles.attachmentPreview}>
              <Ionicons
                name="document-outline"
                size={20}
                color={isSent ? theme.colors.text.light : theme.colors.text.primary}
              />
              <Text
                style={[
                  styles.attachmentName,
                  isSent ? styles.sentMessageText : styles.receivedMessageText,
                ]}
              >
                {attachment.name}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.timestamp}>
          {format(new Date(message.timestamp), 'MMM d, h:mm a')}
          {isSent && (
            <Ionicons
              name={
                message.status === 'read'
                  ? 'checkmark-done'
                  : message.status === 'delivered'
                  ? 'checkmark-done-outline'
                  : 'checkmark-outline'
              }
              size={16}
              color={theme.colors.text.secondary}
              style={{ marginLeft: theme.spacing.xs }}
            />
          )}
        </Text>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Please log in to use the chat feature.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={32}
          color={theme.colors.text.secondary}
        />
        <Text style={styles.headerTitle}>{recipientName}</Text>
      </View>

      {error && (
        <Text style={{ color: theme.colors.status.error, padding: theme.spacing.md }}>
          {error}
        </Text>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.y === 0 &&
            !loading &&
            hasMore
          ) {
            loadMessages(page + 1);
          }
        }}
        scrollEventThrottle={400}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
        />
        <Button
          title="Send"
          onPress={handleSend}
          disabled={!newMessage.trim()}
          leftIcon="send"
        />
      </View>
    </KeyboardAvoidingView>
  );
} 