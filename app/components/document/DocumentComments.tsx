import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { Ionicons } from '@expo/vector-icons';
import { DocumentService } from '../../lib/services/DocumentService';
import { UserService } from '../../lib/services/UserService';
import { DocumentMetadata, DocumentComment } from '../../types/documents';
import { User } from '../../lib/services/UserService';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCommentsProps {
  document: DocumentMetadata | null;
  isVisible: boolean;
  onClose: () => void;
  tenantId: string;
}

interface CommentThread {
  comment: DocumentComment;
  replies: DocumentComment[];
}

export function DocumentComments({
  document,
  isVisible,
  onClose,
  tenantId,
}: DocumentCommentsProps) {
  const theme = useTheme();
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<DocumentComment | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (document && isVisible) {
      loadComments();
      loadCurrentUser();
    }
  }, [document, isVisible]);

  const loadComments = async () => {
    if (!document) return;

    try {
      setLoading(true);
      const data = await DocumentService.getComments(tenantId, document.id);
      
      // Group comments into threads
      const threads = data.reduce<CommentThread[]>((acc: CommentThread[], comment: DocumentComment) => {
        if (!comment.parentId) {
          // This is a top-level comment
          acc.push({
            comment,
            replies: data.filter((c: DocumentComment) => c.parentId === comment.id),
          });
        }
        return acc;
      }, []);

      setComments(threads);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);
    } catch (err: any) {
      console.error('Failed to load current user:', err);
    }
  };

  const handleAddComment = async () => {
    if (!document || !currentUser || !newComment.trim()) return;

    try {
      setLoading(true);
      await DocumentService.addComment(tenantId, document.id, {
        content: newComment.trim(),
        parentId: replyTo?.id,
      });
      setNewComment('');
      setReplyTo(null);
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (comment: DocumentComment, newContent: string) => {
    if (!document) return;

    try {
      setLoading(true);
      await DocumentService.updateComment(tenantId, document.id, comment.id, {
        content: newContent,
      });
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (comment: DocumentComment) => {
    if (!document) return;

    try {
      setLoading(true);
      await DocumentService.deleteComment(tenantId, document.id, comment.id);
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    } as ViewStyle,
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    } as ViewStyle,
    title: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium as TextStyle['fontWeight'],
      flex: 1,
      marginRight: theme.spacing.md,
    } as TextStyle,
    content: {
      flex: 1,
      padding: theme.spacing.md,
    } as ViewStyle,
    commentThread: {
      marginBottom: theme.spacing.md,
    } as ViewStyle,
    comment: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    } as ViewStyle,
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    } as ViewStyle,
    commentAuthor: {
      fontSize: theme.typography.sizes.small,
      fontWeight: theme.typography.weights.medium as TextStyle['fontWeight'],
    } as TextStyle,
    commentTime: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    } as TextStyle,
    commentContent: {
      fontSize: theme.typography.sizes.body,
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    commentActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    } as ViewStyle,
    replies: {
      marginLeft: theme.spacing.xl,
    } as ViewStyle,
    reply: {
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.background.secondary,
      paddingLeft: theme.spacing.md,
    } as ViewStyle,
    inputContainer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.secondary,
    } as ViewStyle,
    replyingTo: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    } as ViewStyle,
    input: {
      borderWidth: 1,
      borderColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      minHeight: 80,
      textAlignVertical: 'top',
    } as TextStyle,
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    } as TextStyle,
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
  });

  const renderComment = (comment: DocumentComment, isReply = false) => (
    <Card
      key={comment.id}
      style={[styles.comment, isReply && styles.reply]}
    >
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.userName}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </Text>
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
      <View style={styles.commentActions}>
        {!isReply && (
          <Button
            title="Reply"
            variant="outline"
            size="sm"
            leftIcon="chatbubble"
            onPress={() => setReplyTo(comment)}
          />
        )}
        {comment.userId === currentUser?.id && (
          <>
            <Button
              title="Edit"
              variant="outline"
              size="sm"
              leftIcon="pencil"
              onPress={() => {
                // TODO: Implement edit UI
              }}
            />
            <Button
              title="Delete"
              variant="outline"
              size="sm"
              leftIcon="trash"
              onPress={() => handleDeleteComment(comment)}
            />
          </>
        )}
      </View>
    </Card>
  );

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <Button
            title="Close"
            variant="outline"
            size="sm"
            leftIcon="close"
            onPress={onClose}
          />
        </View>

        <View style={styles.content}>
          {error && <Text style={styles.error}>{error}</Text>}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text>Loading comments...</Text>
            </View>
          ) : (
            <ScrollView>
              {comments.map(thread => (
                <View key={thread.comment.id} style={styles.commentThread}>
                  {renderComment(thread.comment)}
                  {thread.replies.length > 0 && (
                    <View style={styles.replies}>
                      {thread.replies.map(reply => renderComment(reply, true))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          {replyTo && (
            <View style={styles.replyingTo}>
              <Text>
                Replying to {replyTo.userName}
              </Text>
              <Button
                title="Cancel"
                variant="outline"
                size="sm"
                leftIcon="close"
                onPress={() => setReplyTo(null)}
              />
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <Button
            title={replyTo ? 'Reply' : 'Comment'}
            disabled={!newComment.trim() || loading}
            onPress={handleAddComment}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
} 