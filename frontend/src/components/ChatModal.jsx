import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiX, FiBell } from 'react-icons/fi';
import messageApi from '../api/message.api';
import notificationApi from '../api/notification.api';

export default function ChatModal({ userId, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageApi.getMessages(userId);
        setMessages(Array.isArray(data) ? data : []);
        setError(null);
        
        // Mark messages as read when opening chat
        const unreadMessages = Array.isArray(data) ? data.filter(
          msg => msg.recipient === localStorage.getItem('userId') && !msg.read
        ) : [];
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map(msg => messageApi.markMessageAsRead(msg._id))
          );
          setUnreadCount(0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    const checkNotifications = async () => {
      try {
        const notifications = await notificationApi.getNotifications();
        const unread = notifications.filter(
          n => !n.read && n.type === 'message' && n.relatedItem.sender === userId
        );
        setUnreadCount(unread.length);
        
        // Mark notifications as read
        if (unread.length > 0) {
          await Promise.all(
            unread.map(n => notificationApi.markAsRead(n._id))
          );
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    fetchMessages();
    checkNotifications();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await messageApi.sendMessage(userId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (window.location.pathname !== '/dashboard/messages') {
      window.location.href = `/dashboard/messages?userId=${userId}&name=${encodeURIComponent(user?.name || '')}&new=true`;
    }
  }, [userId]);

  return null;
}