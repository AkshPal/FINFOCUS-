import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express from "express";
import { db } from './models/index.js';
import userRouter from './routes/users.js';  // Add this import

const PORT = process.env.PORT || 3000;

const app = express();

// Add these middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register the user routes
app.use('/', userRouter);  // Add this line

(async()=>{
    try {
        // Test database connection first
        await db.authenticate();
        console.log('Database connection successful');
        
        // Then sync the models
        await db.sync({alter:true});
        console.log('Database models synchronized');
        
        app.listen(PORT,()=>{
            console.log(`Server for UserDataService is running at port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
})();