// src/routes/userRoutes.ts
import { Elysia } from 'elysia';
import { registerUser, blockUserController, getUserInfo, authenticateUser, bookmarkEmail, deselectEmail, getListOffavoriteEmails } from '../controllers/userController';

// Create a new Elysia app
const app = new Elysia();

// Define the routes for the user actions
app.post('/api/registrar', registerUser);
app.post('/api/bloquear', blockUserController);
app.get('/api/informacion/:correo', getUserInfo);
app.get('/api/listadofavoritos/:correo', getListOffavoriteEmails);
app.post('/api/autenticar', authenticateUser);
app.post('/api/marcarcorreo', bookmarkEmail);
app.delete('/api/desmarcarcorreo', deselectEmail);

export default app;
