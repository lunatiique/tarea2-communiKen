// src/routes/userRoutes.ts
import { Elysia } from 'elysia';
import { registerUser, blockUserController, getUserInfo, authenticateUser, bookmarkEmail, deselectEmail } from '../controllers/userController';

const app = new Elysia();

app.post('/api/registrar', registerUser);
app.post('/api/bloquear', blockUserController);
app.get('/api/informacion/:correo', getUserInfo);
app.post('/api/autenticar', authenticateUser);
app.post('/api/marcarcorreo', bookmarkEmail);
app.delete('/api/desmarcarcorreo', deselectEmail);

export default app;
