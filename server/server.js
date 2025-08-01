// server/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { createServer } from "http";
import { Server } from 'socket.io';


import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import notificationRoutes from './routes/notification.route.js';
import storyRoutes from './routes/story.routes.js';
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// --- Configure Socket.IO ---
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// This middleware attaches the io instance to every request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stories", storyRoutes);



// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for a user to join their personal room
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Use httpServer.listen instead of app.listen
httpServer.listen(process.env.PORT, () => {
  connectDB();
  console.log(`🚀 Server & Socket.IO running on http://localhost:${process.env.PORT}`);
});
