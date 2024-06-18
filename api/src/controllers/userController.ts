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
        const date = new Date();
        //log the user creation
        console.log(`[${date}] : User ${direccion_correo} was created succesfully.`);
        return { status: 200, message: "The request was successful", user };
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error creating user: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const blockUserController = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_bloqueada } = await ctx.body as BlockUserBody;
        await blockUser(direccion_correo, clave, direccion_bloqueada);
        const date = new Date();
        //log the user blocking
        console.log(`[${date}] : User with ID ${direccion_bloqueada} was blocked succesfully for user ${direccion_correo}.`);
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error blocking user: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const getUserInfo = async (ctx: Context) => {
    try {
        const { correo } = ctx.params;
        const user = await getUserByEmail(correo);
        if (user) {
            const date = new Date();
            //log the user info request
            console.log(`[${date}] : User info requested for user ${correo}.`);
            return { status: 200, ...user };
        } else {
            const date = new Date();
            //log the user not found
            console.log(`[${date}] : User ${correo} not found.`);
            return { status: 400, message: "User not found" };
        }
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error getting user info: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};


export const getListOffavoriteEmails = async (ctx: Context) => {
    try {
        const { correo } = await ctx.params;
        const list = await seeListOffavoriteEmail(correo);
        const date = new Date();
        //log the list of favorite emails request
        console.log(`[${date}] : List of favorite emails requested for user ${correo}.`);
        return { status: 200, list };
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error getting list of favorite emails: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
}


export const authenticateUser = async (ctx: Context) => {
    try {
        const { direccion_correo, clave } = await ctx.body as { direccion_correo: string, clave: string };
        const user = await getUserByEmail(direccion_correo);
        if (user && user.clave === clave) {
            const date = new Date();
            //log the user authentication
            console.log(`[${date}] : User ${direccion_correo} was authenticated.`);
            return { status: 200, message: "The user is authenticated" };
        } else {
            const date = new Date();
            //log the wrong email or password
            console.log(`[${date}] : Wrong email or password for user ${direccion_correo}.`);
            return { status: 400, message: "Wrong email or password"};
        }
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error authenticating user: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

export const bookmarkEmail = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_favorita, categoria } = await ctx.body as BookmarkEmailBody;
        await addFavoriteEmail(direccion_correo, clave, direccion_favorita, categoria);
        const date = new Date();
        //log the email bookmarking
        console.log(`[${date}] : Email ${direccion_favorita} was added to favorites succesfully for user ${direccion_correo}.`);
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error adding to favorite email: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message, code: (err as Error & { code?: string }).code};
    }
};

export const deselectEmail = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_favorita } = await ctx.body as DeselectEmailBody;
        await removeFavoriteEmail(direccion_correo, clave, direccion_favorita);
        const date = new Date();
        //log the email deselection
        console.log(`[${date}] : Email ${direccion_favorita} was removed from favorites succesfully for user ${direccion_correo}.`);
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        const date = new Date();
        //log the error
        console.log(`[${date}] : Error removing from favorite email: ${(err as Error).message}`);
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};
