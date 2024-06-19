// index.ts
import { config } from 'dotenv';
import path from 'path';

// Ensure dotenv reads the correct .env file
config({ path: path.resolve(__dirname, '../.env') });

import app from './routes/userRoutes';

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
});
