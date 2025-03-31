
# JetPack Workflow Backend

This is the backend for the JetPack Workflow application, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the backend directory with the following content:
```
MONGODB_URL=mongodb+srv://laveshvyas20:HYfPIVV7timUKqPN@cluster0.frfboac.mongodb.net/Inshort-DB
PORT=5000
```

3. Start the server:
```
npm run dev
```

## API Endpoints

The API includes endpoints for managing:
- Templates
- Projects
- Clients
- Contacts
- Tasks

All endpoints return JSON responses.

## Database Models

The application uses the following models:
- Template
- Project (including tasks)
- Client
- Contact
- TeamMember
- Comment

## Connection with Frontend

The frontend connects to this backend using axios and React Query for data fetching.
