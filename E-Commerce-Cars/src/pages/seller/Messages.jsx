import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Messages = () => {
  const { currentSeller } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState({});


  const fetchMessages = () => {
    try {
      const allKeys = Object.keys(localStorage);
      let allMessages = [];

      // Iterate over all keys in localStorage
      allKeys.forEach((key) => {
        if (key.startsWith("messages_")) {
          const [_, buyerId, productId] = key.split("_"); // Extract buyerId and productId
          const productMessages = JSON.parse(localStorage.getItem(key)) || [];

          // Filter messages for the seller's products
          const sellerMessages = productMessages.filter(
            (msg) => msg.sellerName === currentSeller?.name
          );

          allMessages = [...allMessages, ...sellerMessages];
        }
      });

      setMessages(allMessages);
      console.log("Fetched messages for all products:", allMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Fallback to an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Messages state updated:", messages); // Debugging log
  }, [messages]);

  useEffect(() => {
    console.log("Messages state updated:", messages); // Debugging log
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, [currentSeller]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection established for SellerDashboard");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message on SellerDashboard:", message);

      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed for SellerDashboard:", event);
    };

  }, []);

  const handleReply = (messageId, replyContent) => {
    // Update messages with reply
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, reply: replyContent, repliedAt: new Date().toISOString() };
      }
      return msg;
    });

    setMessages(updatedMessages);
    
    // Update localStorage
    const allMessages = JSON.parse(localStorage.getItem('messages') || []);
    const updatedAllMessages = allMessages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, reply: replyContent, repliedAt: new Date().toISOString() };
      }
      return msg;
    });

    localStorage.setItem('messages', JSON.stringify(updatedAllMessages));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">You have no messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{message.productName}</h3>
                  <p className="text-gray-600">From: {message.buyerName || "Anonymous"}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p>{message.content}</p>
              </div>

              {message.reply ? (
                <div className="mt-2 ml-8 p-3 bg-blue-50 rounded">
                  <p className="font-semibold">Your reply:</p>
                  <p>{message.reply}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.repliedAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  <textarea
                    placeholder="Type your reply..."
                    className="w-full p-2 border rounded"
                    value={replyContent[message.id] || ""}
                    onChange={(e) =>
                      setReplyContent({ ...replyContent, [message.id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleReply(message.id, replyContent[message.id])}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;