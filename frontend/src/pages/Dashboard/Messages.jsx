import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useParams } from 'react-router-dom';
import messageApi from '../../api/message.api';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationInterval, setNotificationInterval] = useState(null);
  const { currentUser, isLoading } = useAuth();
  console.log("Messages.jsx: useAuth()", { currentUser, isLoading });
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Function to send messages
  const handleSendMessage = async () => {
    console.log("Messages.jsx: handleSendMessage called", { currentUser, isLoading, activeConversation, messageInput });
    if (isLoading || !currentUser || !currentUser.id) {
      alert('Your profile is still loading.');
      return;
    }
    if (!activeConversation || typeof activeConversation !== 'string' || activeConversation.length !== 24) {
      alert('Select a valid conversation.');
      return;
    }
    if (!messageInput.trim()) {
      alert('Type a message before sending.');
      return;
    }
    console.log("Messages.jsx: activeConversation value before sending", activeConversation);
    console.log("Messages.jsx: Payload sent to backend", {
      recipientId: activeConversation,
      content: messageInput
    });
    try {
      // Send message as a JSON object, not just an ID
      const newMessage = await messageApi.sendMessage({
        recipientId: activeConversation,
        content: messageInput
      });
      console.log('Sent message response:', newMessage);
      setMessages(prevMessages => [...prevMessages, {
        id: newMessage._id || Math.random(),
        text: messageInput, // Always use the input as text for instant display
        sender: 'me',
        timestamp: newMessage.createdAt || new Date().toISOString(),
      }]);
      setMessageInput('');
      // Do NOT reload messages from backend here
    } catch (error) {
      alert('Error sending message.');
      console.error("Messages.jsx: Error sending message", error);
    }
  };
  // All hooks must be called unconditionally at the top
  useEffect(() => {
    console.log('Messages.jsx: Setting up notification polling');
    const interval = setInterval(() => {
      console.log('Messages.jsx: Polling for notifications');
      // Fetch notifications if needed
    }, 10000); // Poll every 10 seconds

    setNotificationInterval(interval);
    return () => {
      console.log('Messages.jsx: Clearing notification polling');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log('Messages.jsx: useEffect [location.search, currentUser?._id, conversations]', { locationSearch: location.search, currentUserId: currentUser?.id, conversations });
    const searchParams = new URLSearchParams(location.search);
    const newChatcurrentUserId = searchParams.get('id');
    const newChatcurrentUserName = searchParams.get('name');

    if (
      newChatcurrentUserId &&
      newChatcurrentUserName &&
      newChatcurrentUserName !== 'na' &&
      currentUser?._id !== newChatcurrentUserId
    ) {
      // Only set activeConversation if it exists in conversations
      if (conversations.some(c => c.id === newChatcurrentUserId)) {
        setActiveConversation(newChatcurrentUserId);
        console.log('Messages.jsx: setActiveConversation', newChatcurrentUserId);
      }
    }
  }, [location.search, currentUser?._id, conversations]);

  useEffect(() => {
    console.log('Messages.jsx: useEffect [location.search, currentUser?._id, conversations] for adding conversation', { locationSearch: location.search, currentUserId: currentUser?.id, conversations });
    const searchParams = new URLSearchParams(location.search);
    const newChatcurrentUserId = searchParams.get('id');
    const newChatcurrentUserName = searchParams.get('name');

    if (
      newChatcurrentUserId &&
      newChatcurrentUserName &&
      newChatcurrentUserName !== 'na' &&
      currentUser?._id !== newChatcurrentUserId
    ) {
      // Only add if not already present (by id)
      setConversations(prev => {
        if (prev.some(c => c.id === newChatcurrentUserId)) {
          return prev;
        }
        const newConv = {
          id: newChatcurrentUserId,
          name: newChatcurrentUserName,
          lastMessage: 'Start a new conversation',
          unread: true,
          timestamp: Date.now()
        };
        console.log('Messages.jsx: Adding new conversation', newConv);
        return [...prev, newConv];
      });
      setActiveConversation(newChatcurrentUserId);
      console.log('Messages.jsx: setActiveConversation (new)', newChatcurrentUserId);
    }
  }, [location.search, currentUser?._id, conversations]);

  useEffect(() => {
    console.log('Messages.jsx: useEffect [activeConversation, currentUser?._id]', { activeConversation, currentUserId: currentUser?.id });
    // Only proceed if currentUser and currentUser._id are defined
    if (!currentUser || !currentUser.id) {
      console.log('Messages.jsx: currentUser not loaded yet, skipping message/conversation fetch');
      return;
    }
    messageApi.getConversations()
      .then(conversations => {
        console.log('Messages.jsx: Raw conversations response from backend:', conversations);
        setConversations(Array.isArray(conversations) ? conversations : []);
        console.log('Messages.jsx: Conversations from backend', conversations);
      })
      .catch(error => {
        setConversations([]);
        console.error('Messages.jsx: Error loading conversations', error);
      });
  
    if (activeConversation) {
      if (!activeConversation || typeof activeConversation !== 'string' || activeConversation.length !== 24) {
        setMessages([]);
        return;
      }
      // Fetch all messages between current user and selected user
      console.log('Messages.jsx: Fetching messages for', activeConversation, 'from user', currentUser._id);
      messageApi.getMessages(activeConversation)
        .then(response => {
          const msgs = Array.isArray(response.data) ? response.data : [];
          // Normalize messages to always have a text field
          const normalizedMsgs = msgs.map(msg => ({
            id: msg._id,
            text: msg.content || msg.text || '',
            sender: (msg.sender?._id || msg.sender) === currentUser.id || (msg.sender?._id || msg.sender) === currentUser._id ? 'me' : 'them',
            timestamp: msg.createdAt,
          }));
          setMessages(normalizedMsgs);
          if (Array.isArray(normalizedMsgs)) {
            normalizedMsgs.forEach(msg => console.log('Messages.jsx: Rendering message:', msg));
          } else {
            console.error('Messages.jsx: messages is not an array', normalizedMsgs);
          }
        })
        .catch(error => {
          setMessages([]);
          console.error('Messages.jsx: Error loading messages', error);
        });
    } else {
      setMessages([]);
    }
  }, [activeConversation, currentUser?._id]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 p-6">Messages</h1>
      <div className="max-w-6xl mx-auto px-6 py-8 flex">
        <div className="w-1/3 bg-white rounded-lg shadow mr-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation, index) => (
              <div 
                key={`${conversation.id}-${index}`}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${activeConversation === conversation.id ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  console.log('Conversation clicked:', conversation);
                  setActiveConversation(conversation.id);
                }}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                    {conversation.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    {conversation.unread && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-2/3 bg-white rounded-lg shadow">
          {activeConversation ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                    {conversations.find(c => c.id === activeConversation)?.name?.charAt(0)}
                  </div>
                </div>
                <h2 className="text-lg font-semibold">
                  {conversations.find(c => c.id === activeConversation)?.name}
                </h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto" id="messages-container">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id || message._id || Math.random()}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                          <p style={{wordBreak: 'break-word'}}>{message.text || message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {activeConversation ? 'No messages yet' : 'Select a conversation to view messages'}
                  </p>
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}