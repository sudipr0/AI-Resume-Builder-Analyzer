import { Server } from 'socket.io';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

/**
 * Handles WebSockets for Real-time Collaboration using Yjs CRDTs.
 */
export const setupCollaborationSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST']
    }
  });

  // Store documents in memory (in production, use y-redis or database binding)
  const docs = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected to collaboration hub: ${socket.id}`);

    socket.on('join-document', ({ documentId, userId }) => {
      socket.join(documentId);
      
      if (!docs.has(documentId)) {
        docs.set(documentId, new Y.Doc());
      }
      const ydoc = docs.get(documentId);

      console.log(`User ${userId} joined document ${documentId}`);

      // Broadcast to others in the room
      socket.to(documentId).emit('user-joined', { userId });
      
      // In a full y-websocket implementation, we'd sync the state vectors here.
      // E.g. socket.emit('sync-step-1', Y.encodeStateVector(ydoc))
    });

    socket.on('document-update', ({ documentId, updateData }) => {
      // updateData is a Uint8Array encoded by Y.encodeStateAsUpdate
      // Broadcast the update to all OTHER clients in the room
      socket.to(documentId).emit('document-update', updateData);
      
      // Also apply it to our server-side copy
      if (docs.has(documentId)) {
        try {
          const uint8Update = new Uint8Array(updateData);
          Y.applyUpdate(docs.get(documentId), uint8Update);
        } catch (e) {
          console.error("Failed to apply Yjs update on server", e);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
