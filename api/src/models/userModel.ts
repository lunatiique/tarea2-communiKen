// src/models/userModel.ts
import { query } from '../db';

interface User {
    direccion_correo: string;
    clave: string;
    nombre: string;
    descripcion: string;
    fecha_creacion: Date;
}

interface FavoriteEmail {
    usuario_id: number;
    direccion_favorita: number;
    fecha_agregado: Date;
    categoria: string;
}

interface BlockedEmail {
    usuario_id: number;
    direccion_bloqueada: number;
    fecha_bloqueo: Date;
}

export const addUser = async (user: User) => {
    const { direccion_correo, clave, nombre, descripcion, fecha_creacion } = user;
    const text = 'INSERT INTO usuario(direccion_correo, clave, nombre, descripcion, fecha_creacion) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [direccion_correo, clave, nombre, descripcion, fecha_creacion];
    const res = await query(text, values);
    return res.rows[0];
};

export const blockUser = async (email: string, clave: string, direccion_bloqueada: number): Promise<void> => {
    const user = await getUserByEmail(email);
    if (!user || user.clave !== clave) {
        const showError = 'Invalid email or password '+ email + ' ' + clave + ' ';
        throw new Error(showError);
    }
    const fecha_bloqueo = new Date();
    const text = 'INSERT INTO direccion_bloqueada(usuario_id, direccion_bloqueada, fecha_bloqueo) VALUES($1, $2, $3) RETURNING *';
    const values = [user.id, direccion_bloqueada, fecha_bloqueo];
    const res = await query(text, values);
    return res.rows[0];
};

export const getUserByEmail = async (direccion_correo: string) => {
    const text = 'SELECT id, nombre, clave, direccion_correo, descripcion FROM usuario WHERE direccion_correo = $1'
    const values = [direccion_correo];
    const res = await query(text, values);
    return res.rows[0];
};

export const addFavoriteEmail = async (email: string, clave: string, direccion_favorita: number, categoria: string) => {
    const user = await getUserByEmail(email);
    if (!user || user.clave !== clave) {
        throw new Error('Invalid email or password');
    }
    const fecha_agregado = new Date();
    const text = 'INSERT INTO direccion_favorita(usuario_id, direccion_favorita, fecha_agregado, categoria) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [user.id, direccion_favorita, fecha_agregado, categoria];
    const res = await query(text, values);
    return res.rows[0];
};

export const removeFavoriteEmail = async (email: string, clave: string, direccion_favorita: number) => {
    const user = await getUserByEmail(email);
    if (!user || user.clave !== clave) {
        throw new Error('Invalid email or password');
    }
    const text = 'DELETE FROM direccion_favorita WHERE usuario_id = $1 AND direccion_favorita = $2 RETURNING *';
    const values = [user.id, direccion_favorita];
    const res = await query(text, values);
    return res.rows[0];
};
