import WebSocket, { WebSocketServer } from "ws";
import express from "express";

const app = express();
const PORT = 8080;

const wss = new WebSocketServer({ noServer: true });
const activeConnections = new Map();

wss.on("connection", (ws, req) => {
  const userId = req.url.split('?')[1]; // Get user ID from query params
  console.log(`New connection from user: ${userId}`);
  
  // Store connection
  activeConnections.set(userId, ws);

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received message:', parsedMessage);

      // Determine recipient type (seller or buyer)
      const recipientId = parsedMessage.recipientId;
      
      if (activeConnections.has(recipientId)) {
        activeConnections.get(recipientId).send(JSON.stringify(parsedMessage));
        console.log(`Message forwarded to ${recipientId}`);
      } else {
        console.log(`Recipient ${recipientId} not connected`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Connection closed for user: ${userId}`);
    activeConnections.delete(userId);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});