import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const Messages = () => {
  const { currentUser } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [replyContentMap, setReplyContentMap] = useState({});
  const socketRef = useRef();

  useEffect(() => {
    const fetchMessages = () => {
      try {
        const allKeys = Object.keys(localStorage);
        let allMessages = [];

        // Retrieve all messages stored in localStorage
        allKeys.forEach((key) => {
          if (key.startsWith("messages_")) {
            const stored = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(stored)) {
              allMessages.push(...stored);
            }
          }
        });

        // Filter messages relevant to the current user
        const userMessages = allMessages.filter(
          msg => msg.recipientId === currentUser?.id || msg.senderId === currentUser?.id
        );

        setMessages(userMessages);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const socketUrl = `ws://localhost:8080?${currentUser.id}`;
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        console.log("Incoming message:", newMessage);

        // Add new incoming message to the state and localStorage
        if (newMessage.recipientId === currentUser.id) {
          setMessages(prev => [...prev, newMessage]);

          const key = `messages_${newMessage.productId}`;
          const existing = JSON.parse(localStorage.getItem(key)) || [];
          localStorage.setItem(key, JSON.stringify([...existing, newMessage]));
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socketRef.current?.close();
  }, [currentUser]);

  const handleReply = (productId, recipientId, key) => {
    const replyContent = replyContentMap[key];
    if (!replyContent?.trim()) return;

    const reply = {
      id: Date.now(),
      productId,
      content: replyContent,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: "seller",
      recipientId,
      createdAt: new Date().toISOString()
    };

    // Send the reply via WebSocket if the connection is open
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(reply));
    }

    // Update the state and localStorage with the new reply
    setMessages(prev => [...prev, reply]);
    setReplyContentMap(prev => ({ ...prev, [key]: '' }));

    const storageKey = `messages_${productId}`;
    const existing = JSON.parse(localStorage.getItem(storageKey)) || [];
    localStorage.setItem(storageKey, JSON.stringify([...existing, reply]));
  };

  // Group messages by senderId and productId
  const groupedConversations = messages.reduce((groups, msg) => {
    const otherPartyId = msg.senderId === currentUser.id ? msg.recipientId : msg.senderId;
    const key = `${otherPartyId}_${msg.productId}`;
    if (!groups[key]) {
      groups[key] = {
        productId: msg.productId,
        productName: msg.productName || `ID: ${msg.productId}`,
        userId: otherPartyId,
        userName: msg.senderId === currentUser.id ? msg.recipientName : msg.senderName,
        messages: []
      };
    }
    groups[key].messages.push(msg);
    return groups;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {Object.keys(groupedConversations).length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        Object.entries(groupedConversations).map(([key, convo]) => (
          <div key={key} className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">
              Conversation with {convo.userName} (Product: {convo.productName} )
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-3 border rounded p-2 bg-gray-50">
              {convo.messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      msg.senderId === currentUser.id ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
                    }`}
                  >
                    <p><strong>{msg.senderName}:</strong> {msg.content}</p>
                    <small className="text-gray-500">{new Date(msg.createdAt).toLocaleString()}</small>
                  </div>
                ))}
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                placeholder="Type your reply..."
                value={replyContentMap[key] || ''}
                onChange={(e) =>
                  setReplyContentMap(prev => ({ ...prev, [key]: e.target.value }))
                }
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleReply(convo.productId, convo.userId, key)}
              >
                Send
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
