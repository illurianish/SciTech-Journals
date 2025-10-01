# AriesView Backend with RAG Integration !!!

This backend serves as the API for the AriesView platform, with Retrieval-Augmented Generation (RAG) capabilities using Azure OpenAI and Azure AI Search.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```
   cp .env.example .env
   ```

3. Configure the following environment variables in the `.env` file:
   - Database configuration
   - Azure OpenAI configuration (endpoint, API key, deployment names)
   - Azure Search configuration (endpoint, API key, index name)

## Azure Resources Setup

### Azure OpenAI

1. Create an Azure OpenAI service in your Azure portal
2. Deploy the following models:
   - Completion model (e.g., `gpt-35-turbo`) for chat responses
   - Embedding model (e.g., `text-embedding-ada-002`) for vector embeddings

### Azure AI Search

1. Create an Azure AI Search service in your Azure portal
2. Create a search index with the following fields:
   - `id` (String, Key, Retrievable)
   - `content` (String, Retrievable, Searchable)
   - `title` (String, Retrievable, Searchable)
   - `sourcepage` (String, Retrievable)
   - `embedding` (Collection(Float), Dimensions=1536, VectorSearchable)

## Running Locally

Start the server in development mode:

```
npm run dev
```

Or in production mode:

```
npm start
```

The server will run on the port specified in your `.env` file (default: 8080).

## API Endpoints

### RAG Endpoints

- `POST /api/generate-embeddings`: Generate embeddings for a text string
- `POST /api/search-rag`: Search the index with RAG
- `POST /api/chat-rag`: Chat with RAG integration

## Deployment

To deploy this backend to production, you can use:

1. Azure App Service
2. Azure Container Apps
3. Docker container on any container hosting service

Make sure to set all the required environment variables in your hosting environment.

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Contact Form
- POST `/contact` or `/submitform`
- Accepts JSON with: `name`, `email`, `subject`, `message`

#### Job Applications 
- POST `/apply`
- Accepts JSON with: `fullName`, `email`, `phone`, `position`, `linkedinProfile`, `portfolioUrl`, `technicalSkills`, `relevantExperience`, `additionalInfo`

### Protected Endpoints (Authentication Required)

All protected endpoints require a valid Firebase authentication token in the Authorization header:
```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

#### User Profile
- GET `/api/protected/profile` - Get the current user's profile

#### Protected Contact Forms
- POST `/api/protected/contact` - Submit a contact form as an authenticated user
- GET `/api/protected/messages` - Get all messages submitted by the current user

#### Protected Job Applications
- POST `/api/protected/apply` - Submit a job application as an authenticated user
- GET `/api/protected/applications` - Get all job applications submitted by the current user

## Authentication

This API uses Firebase Authentication to verify user identity. To make authenticated requests:

1. Set up Firebase Authentication in your frontend application
2. When a user logs in, get their ID token:
```javascript
// Using Firebase JavaScript SDK
firebase.auth().currentUser.getIdToken()
  .then((token) => {
    // Use this token in your API requests
  });
```

3. Include the token in your API requests:
```javascript
fetch('https://ariesview-backend.example.com/api/protected/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Production Deployment

For production deployment on Azure:
1. Configure the environment variables in Azure App Service
2. Deploy the code to Azure
3. Ensure the database connection is properly set up
4. Configure Firebase Admin SDK credentials as secret environment variables 