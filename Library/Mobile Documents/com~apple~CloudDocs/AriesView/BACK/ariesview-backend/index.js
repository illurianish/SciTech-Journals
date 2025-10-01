import dotenv from 'dotenv';
import express from 'express';
// import bodyParser from 'body-parser'; // No longer needed globally
import corsConfig from './config/corsConfig.js';
import pool from './config/database.js';
// import upload from './config/multerConfig.js'; // Not used directly in index.js
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';
import { runDatabaseMigrations } from './services/migrationScripts/dbMigrationService.js';

// Import routes
import storageRoutes from './routes/storage.js';
import aiRoutes from './routes/ai.js';
import documentRoutes from './routes/document.js';
import searchRoutes from './routes/search.js';
import propertyRoutes from './routes/property.js';
import propertyAddRoutes from './routes/property_add.js'; // Import property_add routes
import propertyFinancialAssumptionsRoutes from './routes/propertyFinancialAssumptions.js';
import contactRoutes from './routes/contact.js';
import applicationRoutes from './routes/application.js';
import unitRoutes from './routes/unit.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(corsConfig);
app.use(express.json());
// app.use(bodyParser.json()); // REMOVED - Apply express.json() specifically on routes needing it, if any
// app.use(bodyParser.urlencoded({ extended: true })); // REMOVED - Multer handles form data for uploads
app.use(requestLogger);

// Use express.json() for routes that ARE expecting JSON payloads
// Example: if aiRoutes expects JSON
app.use('/api/ai', express.json(), aiRoutes);
app.use('/api/contact', express.json(), contactRoutes);
app.use('/api/property', express.json(), propertyRoutes); // Add express.json() for property routes

app.use('/api/property_add', express.json(), propertyAddRoutes); // Add express.json() for property routes
// Add express.json() to other routes as needed

// Routes
app.use('/api/storage', storageRoutes);
// app.use('/api/ai', aiRoutes); // Mounted above with express.json()
app.use('/api/documents', documentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/properties', express.json(), propertyFinancialAssumptionsRoutes);
// app.use('/api/contact', contactRoutes); // Mounted above with express.json()
app.use('/api/application', applicationRoutes); // Keep this without express.json()
app.use('/api/unit', unitRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler - Should be last
app.use(errorHandler);

// Function to start the server after migrations
async function startServer() {
  try {
    console.log('🚀 Starting Ariesview Backend Server...');
    console.log('📊 Running database migrations and table creation...');
    
    await runDatabaseMigrations();
    console.log('✅ Database migrations completed successfully');
    
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('SERVER ERROR:', err);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        pool.end().then(() => {
          console.log('Database pool closed');
        });
      });
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();