// index.ts
import app from './routes/userRoutes';

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
