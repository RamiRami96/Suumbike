# 💕 Suumbike - Dating & Connection Platform

<div align="center">

![Suumbike](./gitImages/image.png)

*Connect hearts through meaningful conversations and video interactions*

[![Next.js](https://img.shields.io/badge/Next.js-13.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-green?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-4.15-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

</div>

> **🚧 Development Status**: This project is currently in active development and production. New features and improvements are being added regularly.

## ✨ Features

### 🎥 **Real-time Video Chat**
- Seamless peer-to-peer video connections
- High-quality video and audio streaming
- Instant room creation and joining

### 👤 **User Profiles**
- Customizable user profiles with avatars
- Age verification and display
- Telegram nickname integration
- Profile privacy controls

### 💝 **Interactive Matching**
- Like system for mutual connections
- Search and filter users by Telegram nickname
- Real-time user discovery
- Room-based interactions

### 🔒 **Secure Authentication**
- NextAuth.js integration
- Secure session management
- Password protection
- Profile verification

### 🎨 **Beautiful UI/UX**
- Modern gradient designs
- Animated heart effects
- Responsive mobile-first design
- Smooth transitions and loading states

## 🚀 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | Full-stack React framework | 13.4 |
| **TypeScript** | Type-safe development | 5.1 |
| **Socket.io** | Real-time communication | 4.7 |
| **Tailwind CSS** | Utility-first styling | 3.3 |
| **Prisma** | Database ORM | 4.15 |
| **NextAuth.js** | Authentication | 4.22 |
| **PostgreSQL** | Primary database | - |
| **WebRTC** | Peer-to-peer video | - |

## 📁 Project Structure

```
app/
├── src/
│   ├── app/                 # Next.js 13 App Router
│   │   ├── auth/           # Authentication pages
│   │   ├── profile/        # User profile pages
│   │   ├── room/           # Video chat rooms
│   │   └── api/            # API routes
│   ├── modules/            # Feature modules
│   │   ├── auth/           # Authentication logic
│   │   ├── index/          # Home page components
│   │   ├── profile/        # Profile management
│   │   ├── room/           # Video room functionality
│   │   └── layout/         # Shared layout components
│   └── shared/             # Shared utilities
│       ├── lib/            # Core libraries
│       └── models/         # TypeScript types
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
└── ws-server/              # WebSocket server
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Suumbike
```

### 2. Install Dependencies
```bash
# Install app dependencies
cd app
npm install

# Install WebSocket server dependencies
cd ../ws-server
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the `app/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/suumbike"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Add other environment variables as needed
```

### 4. Database Setup
```bash
cd app
npx prisma migrate dev
npx prisma generate
```

### 5. Run the Application
```bash
# Terminal 1: Start the WebSocket server
cd ws-server
npm start

# Terminal 2: Start the Next.js app
cd app
npm run dev
```

Visit `http://localhost:3000` to see the application in action!

## 🎯 Usage

### Creating an Account
1. Navigate to `/auth/signup`
2. Fill in your details (name, age, Telegram nickname)
3. Upload a profile avatar
4. Create a secure password

### Finding Connections
1. Use the search bar to find users by Telegram nickname
2. Browse available user rooms
3. Join rooms to start video conversations
4. Like users you're interested in

### Video Chat
1. Create your own room or join existing ones
2. Enable camera and microphone permissions
3. Enjoy real-time video conversations
4. Use like/pass controls during interactions

## 🎯 Future Plans

### 🏗️ **Backend Architecture Migration**
- **Migrate to Firebase**: Transition from PostgreSQL/Prisma to Firebase
  - Real-time database capabilities
  - Built-in authentication and security rules
  - Serverless architecture with automatic scaling
  - Reduced infrastructure complexity
  - Better integration with mobile applications

### 📱 **Mobile Application Development**
- **React Native App**: Create a native mobile application for iOS and Android
  - Cross-platform compatibility
  - Native performance and user experience
  - Push notifications for matches and messages
  - Camera and microphone integration for mobile video calls
  - Offline capabilities and sync
  - App store distribution

### 🚀 **Technical Roadmap**
1. **Phase 0**: Bug fixes and testing foundation
   - Fix bugs with video connection stability
   - Fix bugs with behaviour of second peer
   - Add unit tests for critical components

2. **Phase 1**: NestJS backend migration
   - Set up NestJS project structure
   - Migrate API endpoints from Next.js server actions
   - Database migration from PostgreSQL to Firebase
   - Implement WebSocket gateway for real-time features
   
3. **Phase 2**: React Native development
   - Initialize React Native project
   - Implement authentication and user management
   - Build video calling functionality
   - Create messaging features

4. **Phase 3**: Integration and optimization
   - Connect mobile app with NestJS backend
   - Deployment and distribution
