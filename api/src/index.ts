// index.ts
import { config } from 'dotenv';
import path from 'path';

// Ensure dotenv reads the correct .env file
config({ path: path.resolve(__dirname, '../.env') });

import app from './routes/userRoutes';

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
