import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockProducts } from "../utils/mockProducts";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isBuyer } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const product = mockProducts.find((p) => p.id === parseInt(id));

  // Initialize WebSocket and load messages
  useEffect(() => {
    if (!product) return;

    // Load existing messages from localStorage
    const loadMessages = () => {
      const messageKey = `messages_${product.id}`;
      const storedMessages = JSON.parse(localStorage.getItem(messageKey)) || [];
      setMessages(storedMessages);
    };

    loadMessages();

    // Initialize WebSocket connection with user ID in query params
    const userId = currentUser?.id || 'anonymous';
    socketRef.current = new WebSocket(`ws://localhost:8080?userId=${userId}&productId=${product.id}`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const incomingMessage = JSON.parse(event.data);
        console.log("Received message:", incomingMessage);

        // Only process messages for this product
        if (incomingMessage.productId === product.id) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, incomingMessage];
            
            // Store in localStorage with product ID as key
            const messageKey = `messages_${product.id}`;
            localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
            
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [product, currentUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const message = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: isBuyer ? "buyer" : "seller",
      recipientId: isBuyer ? product.sellerID : null,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending message:", message);

    // Send via WebSocket if connection is open
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection not open");
    }

    // Update local state immediately
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message];
      
      // Store in localStorage
      const messageKey = `messages_${product.id}`;
      localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
      
      return updatedMessages;
    });

    setNewMessage("");
  };

  const toggleChat = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Car not found</h3>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to listings
        </button>

        {/* Car Details Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Image Section - Now takes full width on mobile */}
            <div className="md:w-1/2 relative min-h-64 md:min-h-96">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {product.category}
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-base md:text-lg text-gray-500 mt-1">{product.location}</p>
                </div>
                <span className="text-xl md:text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat("en-ET", {
                    style: "currency",
                    currency: "ETB",
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">DESCRIPTION</h3>
                  <p className="mt-1 text-gray-700">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">SELLER</h3>
                    <p className="mt-1 font-medium">{product.seller}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">CONTACT</h3>
                    <p className="mt-1 font-medium">{product.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button 
            onClick={toggleChat}
            className={`w-full p-4 text-left flex items-center justify-between ${
              isChatOpen ? "bg-gray-100" : "hover:bg-gray-50"
            } transition-colors duration-200`}
          >
            <span className="font-medium">
              {isChatOpen ? "Hide Chat" : `Chat with ${product.seller}`}
            </span>
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${
                isChatOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isChatOpen && (
            <div className="border-t border-gray-200">
              <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Start your conversation with the seller
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex mb-3 ${
                        msg.senderType === "buyer" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderType === "buyer"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderType === "buyer" ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : "Invalid Date"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 bg-white flex p-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message..."
                  autoFocus
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;