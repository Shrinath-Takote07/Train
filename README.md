# 🚆 Railoo — Live Train Status & PNR Tracking Micro-Dashboard

A full-stack **MERN application** for real-time railway train tracking and PNR status monitoring. The application provides live train progress, delay information, platform updates, PNR tracking, and saved trip notifications using **REST APIs and WebSockets with Socket.IO**.

---

## 📌 Project Overview

**Railoo** is a real-time train status and PNR tracking dashboard built using the **MERN Stack**.

The application allows users to:

* 🔎 Search and view train information
* 🚆 Track live train progress
* ⏱️ Monitor train delays in real time
* 🚉 View platform updates
* 🎫 Check PNR status using mock data
* 💾 Save trips for quick access
* 🔔 Receive real-time trip notifications
* ⚡ Receive live updates through WebSockets
* 📊 Monitor train status through a responsive dashboard

The backend provides RESTful APIs for train schedules, PNR information, and train status, while **Socket.IO** enables real-time communication between the server and connected clients.

---

## ✨ Key Features

### 🚆 Live Train Tracking

* Displays current train status and progress.
* Shows train route and station information.
* Provides estimated arrival/departure information.
* Displays live delay updates.
* Real-time updates without refreshing the browser.

### 🎫 PNR Tracking

* Search PNR information.
* Display passenger and booking status.
* Support for mock PNR data.
* REST API based PNR lookup.

### 🚉 Platform Updates

* Displays platform information.
* Updates platform status dynamically.
* Supports real-time platform changes.

### 🔔 Saved Trip Notifications

* Save frequently tracked trips.
* View saved journeys from the dashboard.
* Receive updates for saved trips.

### ⚡ Real-Time WebSockets

The application uses **Socket.IO** to establish persistent connections between the React frontend and Node.js backend.

Real-time events can be used for:

* Train delay updates
* Train location/status changes
* Platform changes
* Saved trip notifications

Users connected to the dashboard receive updates without manually refreshing the page.

### 📱 Responsive Dashboard

The frontend is designed to work across:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                    REST API / Socket.IO
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Node.js +         │
                    │      Express        │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │    REST APIs    │         │    Socket.IO    │
        │ Train / PNR     │         │ Real-Time Data  │
        └────────┬────────┘         └────────┬────────┘
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │   Indexed Database   │
                    └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* React Query
* Socket.IO Client
* Lucide React

### Backend

* Node.js
* Express.js
* Socket.IO
* RESTful APIs
* CORS

### Database

* MongoDB
* MongoDB Indexing

### Development & Deployment

* Git
* GitHub
* Vercel
* Postman
* npm

---

## 📂 Project Structure

```text
railoo/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── data/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

> Update the folder names above if your actual repository structure is different.

---

## 🔌 REST API

The backend exposes RESTful APIs for retrieving train and PNR information.

### Train API

```http
GET /api/trains
```

Get available trains.

```http
GET /api/trains?status=all
```

Get trains filtered by status.

### PNR API

```http
GET /api/pnr/:pnr
```

Retrieve PNR information.

### Example Response

```json
{
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani",
  "status": "Running",
  "delay": 15,
  "platform": 4
}
```

> API endpoints may differ depending on the final implementation.

---

## ⚡ WebSocket Architecture

Railoo uses **Socket.IO** for real-time train status communication.

### Connection Flow

```text
React Client
     │
     │ Socket.IO Connection
     ▼
Node.js Server
     │
     │ Train Status Event
     ▼
MongoDB / Mock Data
     │
     ▼
Socket.IO Broadcast
     │
     ▼
All Connected Clients
```

When train information changes, the backend can emit an event to connected clients.

Example event:

```javascript
io.emit("trainUpdate", updatedTrain);
```

The React frontend listens for the event:

```javascript
socket.on("trainUpdate", (data) => {
  // Update train information
});
```

This allows the dashboard to update dynamically without requiring a page refresh.

---

## 🗄️ MongoDB Performance

MongoDB indexes are used for frequently queried fields such as:

* `routeId`
* `pnrNumber`

Example:

```javascript
trainSchema.index({ routeId: 1 });

pnrSchema.index({ pnrNumber: 1 });
```

Indexes help reduce query time when searching large datasets and are designed to support the project's target of **sub-50ms API response times under the intended test workload**.

> Actual response time depends on dataset size, database configuration, network latency, hosting environment, and concurrent load.

---

## 🔄 Application Flow

### Train Tracking

```text
User searches train
        ↓
React sends API request
        ↓
Express API receives request
        ↓
MongoDB / Mock JSON data
        ↓
Train information returned
        ↓
React displays train status
        ↓
Socket.IO pushes live updates
        ↓
Dashboard updates automatically
```

### PNR Tracking

```text
User enters PNR
      ↓
React sends PNR request
      ↓
Express REST API
      ↓
MongoDB / Mock JSON data
      ↓
PNR status returned
      ↓
Dashboard displays passenger status
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

For production deployment, configure the environment variables through your hosting platform rather than committing `.env` files to GitHub.

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd YOUR_REPOSITORY
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create:

```text
backend/.env
```

Add your MongoDB connection string and frontend URL.

### 4. Start Backend

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 🧪 Testing

API endpoints can be tested using:

* Postman
* Browser
* Axios
* React Query

WebSocket functionality can be tested by opening the application in multiple browser tabs and observing real-time train status updates.

---

## 📊 Performance Considerations

The application was designed with performance in mind:

* MongoDB indexes for frequently searched fields
* REST API separation
* Efficient React state updates
* React Query for server-state management
* WebSockets for real-time updates
* Reduced need for continuous HTTP polling
* Responsive UI components
* Environment-based API configuration

---

## 🌐 Deployment

The application can be deployed using:

### Frontend

```text
Vercel
```

### Backend

```text
Vercel / Node.js hosting
```

### Database

```text
MongoDB Atlas
```

Make sure the production frontend communicates with the deployed backend rather than `localhost`.

---

## 📸 Application Screenshots

Add screenshots of your project here:

```text
screenshots/
├── dashboard.png
├── train-status.png
├── pnr-status.png
└── saved-trips.png
```

Example:

```markdown
![Dashboard](screenshots/dashboard.png)
```

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience with:

* MERN Stack development
* RESTful API design
* Node.js and Express.js
* MongoDB database integration
* MongoDB indexing
* React.js dashboard development
* Socket.IO and WebSocket communication
* Real-time application architecture
* API integration using Axios
* React Query
* CORS configuration
* Environment variables
* Full-stack deployment
* Git and GitHub
* Debugging production deployment issues

---

## 🔮 Future Improvements

Possible future enhancements include:

* Integration with a real railway API
* Authentication and user accounts
* Real-time GPS-based train tracking
* Push notifications
* Email/SMS notifications
* Advanced journey history
* Multi-language support
* Dark/light theme
* Advanced analytics dashboard
* Redis caching
* Horizontal scaling for WebSocket connections

---

## 👨‍💻 Developer

**Shrinath Takote**

Full Stack Developer | MERN Stack | Java Full Stack

Interested in building scalable, responsive, and real-time web applications.

---

## ⭐ Project Highlights

```text
✅ MERN Stack
✅ RESTful APIs
✅ MongoDB
✅ MongoDB Indexing
✅ React Dashboard
✅ Socket.IO WebSockets
✅ Real-Time Train Updates
✅ PNR Tracking
✅ Platform Updates
✅ Saved Trips
✅ Responsive UI
✅ Production Deployment Ready
```

---

## 📄 License

This project is developed for educational and portfolio purposes.
