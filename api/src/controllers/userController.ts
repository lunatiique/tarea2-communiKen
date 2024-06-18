// src/controllers/userController.ts
import { Context } from 'elysia';
import { addUser, blockUser, getUserByEmail, addFavoriteEmail, removeFavoriteEmail, seeListOffavoriteEmail } from '../models/userModel';

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
    direccion_favorita: string;
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
            return { status: 200, ...user };
        } else {
            return { status: 400, message: "User not found" };
        }
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};


export const getListOffavoriteEmails = async (ctx: Context) => {
    try {
        const { correo } = await ctx.params;
        const list = await seeListOffavoriteEmail(correo);
        return { status: 200, list };
    } catch (err) {
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
}


export const authenticateUser = async (ctx: Context) => {
    try {
        const { direccion_correo, clave } = await ctx.body as { direccion_correo: string, clave: string };
        const user = await getUserByEmail(direccion_correo);
        if (user && user.clave === clave) {
            return { status: 200, message: "The user is authenticated" };
        } else {
            return { status: 400, message: "Wrong email or password"};
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
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message, code: (err as Error & { code?: string }).code};
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
