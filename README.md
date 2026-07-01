# Circle

A modern real-time communication platform built with the MERN Stack, Socket.IO, Redis, Docker, and AWS.

Circle is designed to provide secure communication with real-time messaging, audio/video calling, presence detection, and scalable deployment using Docker and GitHub Actions.

Developed by **Satyam Sharma**

---

## Live Demo

Frontend

https://circle-ui-pink.vercel.app

Backend API

https://circle-backend-jvaw.onrender.com

---

## Project Demo

### Application Demo

https://your-demo-video-link

### Backend CI/CD Demo

https://your-cicd-demo-video-link

---

## Features

### Authentication

- Secure User Registration
- Secure Login
- Google OAuth Login
- JWT Authentication
- Protected Routes

---

### User Profile

- Upload Profile Picture
- Image Compression using Sharp
- Cloudinary Image Storage
- Fast Image Delivery

---

### Real-Time Chat

- One-to-One Messaging
- Online / Offline Status
- Instant Message Delivery
- Real-Time Socket Communication

---

### Friend System

- Add Friends
- Chat with Friends

---

### Calling

- Audio Calling
- Video Calling
- Busy Status Detection
- Online Presence Detection
- WebRTC Signaling with Socket.IO

---

### Performance

- Redis for Fast Data Access
- Optimized Socket Communication
- Compressed Images
- Cloudinary CDN

---

### Deployment

- Dockerized Backend
- GitHub Actions CI/CD
- AWS EC2 Deployment
- AWS Amplify for Frontend
- Route 53 Domain Configuration

---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Zustand
- React Router
- Axios

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Redis
- Socket.IO
- JWT
- Google OAuth
- Cloudinary
- Sharp

---

## DevOps

- Docker
- Docker Compose
- GitHub Actions
- AWS EC2
- AWS Amplify
- AWS Route 53

---

# Architecture

```
                 React (AWS Amplify)
                        │
                        │
                HTTPS / WebSocket
                        │
                Express + Socket.IO
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       MongoDB        Redis      Cloudinary
```

---

# Project Structure

```
Circle
│
├── circle-ui
│   ├── src
│   ├── public
│   └── package.json
│
├── circle-server
│   ├── src
│   │   ├── config
│   │   ├── modules
│   │   ├── utils
│   │   ├── socket.ts
│   │   ├── app.ts
│   │   └── index.ts
│   │
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
└── .github
    └── workflows
```

---

# Backend Deployment

The backend is fully containerized using Docker.

A multi-stage Docker build is used to reduce the production image size and install only production dependencies.

### Docker Build Process

Stage 1

- Install Dependencies
- Build TypeScript Project

Stage 2

- Install Production Dependencies
- Copy Compiled Files
- Run Production Server

---

# Docker Services

The backend is deployed using Docker Compose.

Services include:

- Circle API
- MongoDB
- Redis

Persistent Docker volumes are used for MongoDB and Redis.

---

# CI/CD Pipeline

The backend deployment is fully automated using GitHub Actions.

Whenever changes are pushed to the **docker-cicd** branch inside the **circle-server** directory, the workflow automatically starts.

Pipeline Steps

1. Checkout Repository
2. Login to Docker Hub
3. Build Docker Image
4. Push Image to Docker Hub
5. Copy docker-compose.yml to AWS EC2
6. Connect to EC2 using SSH
7. Pull Latest Docker Image
8. Restart Containers

This process allows new backend changes to be deployed without manually logging into the server.

---

# Redis Usage

Redis is used for

- Fast Data Access
- User Presence
- Online Status
- Temporary Session Storage
- Real-Time Socket Operations

---

# Image Processing

User profile images are processed before upload.

Workflow

```
Client
   │
Upload Image
   │
Sharp Compression
   │
Cloudinary Upload
   │
Database URL Storage
```

This reduces storage usage and improves loading speed.

---

# Security

- JWT Authentication
- Google OAuth
- Protected APIs
- Environment Variables
- Password Hashing
- Secure Image Upload
- Input Validation

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/circle.git
```

```
cd circle
```

---

## Backend

```bash
cd circle-server

npm install

npm run dev
```

---

## Frontend

```bash
cd circle-ui

npm install

npm run dev
```

---

# Environment Variables

Backend

```env
PORT=

MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

TWILIO_SID=

TWILIO_AUTH_TOKEN=

REDIS_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Frontend

```env
VITE_API_URL=
```

---

# Future Improvements

- Group Chat
- Group Video Calling
- Screen Sharing
- Message Reactions
- Typing Indicators
- Push Notifications
- End-to-End Encryption
- Message Search

---

# Author

**Satyam Sharma**

Computer Science Engineer

MERN Stack | Next.js | Redis | AWS | Docker | DevOps

GitHub

https://github.com/sharmasatyam121104-devloper

LinkedIn

[https://linkedin.com/in/your-profile](https://www.linkedin.com/in/satyam-sharma-dev04/)

---

# License

This project is developed for educational and portfolio purposes.
