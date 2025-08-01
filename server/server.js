import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import userRoutes from './routes/user.route.js';
import notificationRoutes from './routes/notification.route.js';
import storyRoutes from './routes/story.routes.js';
import messageRoutes from './routes/message.route.js'; // <-- 1. Import message routes
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
     methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const userSocketMap = {}; // Maps { userId: socketId }

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  // Listen for a user to join their personal notification room
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined notification room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let id in userSocketMap) {
      if (userSocketMap[id] === socket.id) {
        delete userSocketMap[id];
        break;
      }
    }
  });
});

// Middleware to attach io and userSocketMap to every request
app.use((req, res, next) => {
  req.io = io;
  req.userSocketMap = userSocketMap; // Make the map available in controllers
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes); // <-- 2. Use message routes

httpServer.listen(process.env.PORT, () => {
  connectDB();
  console.log(`🚀 Server & Socket.IO running on http://localhost:${process.env.PORT}`);
});