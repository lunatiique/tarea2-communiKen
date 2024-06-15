// src/controllers/userController.ts
import { Context } from 'elysia';
import { addUser, blockUser, getUserByEmail, addFavoriteEmail, removeFavoriteEmail } from '../models/userModel';

interface RegisterUserBody {
    direccion_correo: string;
    clave: string;
    nombre: string;
    descripcion: string;
}

interface BlockUserBody {
    direccion_correo: string;
    clave: string;
    direccion_bloqueada: number;
}

interface BookmarkEmailBody {
    direccion_correo: string;
    clave: string;    
    direccion_favorita: number;
    categoria: string;
}

interface DeselectEmailBody {
    direccion_correo: string;
    clave: string;
    direccion_favorita: number;
}

export const registerUser = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, nombre, descripcion } = await ctx.body as RegisterUserBody;
        const fecha_creacion = new Date();
        const user = await addUser({ direccion_correo, clave, nombre, descripcion, fecha_creacion });
        return { status: 200, message: "The request was successful", user };
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const blockUserController = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_bloqueada } = await ctx.body as BlockUserBody;
        await blockUser(direccion_correo, clave, direccion_bloqueada);
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const getUserInfo = async (ctx: Context) => {
    try {
        const { correo } = ctx.params;
        const user = await getUserByEmail(correo);
        if (user) {
            // Remove the password and the id from the user object
            delete user.clave;
            delete user.id;
            return { status: 200, ...user };
        } else {
            return { status: 400, message: "User not found" };
        }
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const bookmarkEmail = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_favorita, categoria } = await ctx.body as BookmarkEmailBody;
        await addFavoriteEmail(direccion_correo, clave, direccion_favorita, categoria);
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const deselectEmail = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_favorita } = await ctx.body as DeselectEmailBody;
        await removeFavoriteEmail(direccion_correo, clave, direccion_favorita);
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};