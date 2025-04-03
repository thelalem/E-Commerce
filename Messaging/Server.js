import WebSocket, { WebSocketServer } from "ws";
import express from "express";

const app = express();

const clients = {};

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);

    console.log(`Received message: `, parsedMessage);
    const { productId, buyerId, sender, content } = parsedMessage;

    const key = `${buyerId}_${productId}`;
    if (!clients[key]) {
      clients[key] = { buyer: null, seller: null };
    }

    if (sender === "seller") {
      clients[key].seller = ws;
      console.log(`Seller connected for key ${key}`);
    } else if (sender === "buyer") {
      clients[key].buyer = ws;
      console.log(`Buyer connected for key ${key}`);
    }

    // Forward message from buyer to seller
    if (sender === "buyer" && clients[key].seller) {
      const response = {
        productId,
        buyerId,
        sender: "buyer",
        content,
        createdAt: new Date().toISOString(),
      };

      console.log("Forwarding message to seller:", response);
      clients[key].seller.send(JSON.stringify(response));
    }

    // Forward message from seller to buyer
    if (sender === "seller" && clients[key].buyer) {
      const response = {
        productId,
        buyerId,
        sender: "seller",
        content,
        createdAt: new Date().toISOString(),
      };

      console.log("Forwarding message to buyer:", response);
      clients[key].buyer.send(JSON.stringify(response));
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

const server = app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});