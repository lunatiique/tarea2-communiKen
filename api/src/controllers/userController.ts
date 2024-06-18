// src/controllers/userController.ts
import { Context } from 'elysia';
import { addUser, blockUser, getUserByEmail, addFavoriteEmail, removeFavoriteEmail, seeListOffavoriteEmail } from '../models/userModel';

// Interface that defines the body of the request to register a user
interface RegisterUserBody {
    direccion_correo: string;
    clave: string;
    nombre: string;
    descripcion: string;
}

// Interface that defines the body of the request to block a user
interface BlockUserBody {
    direccion_correo: string;
    clave: string;
    direccion_bloqueada: string;
}

// Interface that defines the body of the request to add an email as favorite
interface BookmarkEmailBody {
    direccion_correo: string;
    clave: string;    
    direccion_favorita: string;
    categoria: string;
}

// Interface that defines the body of the request to deselect an email as favorite
interface DeselectEmailBody {
    direccion_correo: string;
    clave: string;
    direccion_favorita: string;
}

// Function that registers a user
export const registerUser = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, nombre, descripcion } = await ctx.body as RegisterUserBody;
        // Get the current date
        const fecha_creacion = new Date();
        // Add the user to the database
        const user = await addUser(direccion_correo, clave, nombre, descripcion, fecha_creacion);
        const date = new Date();
        // Log the user creation
        console.log(`[${date}] : User ${direccion_correo} was created succesfully.`);
        // Return a success message with the user
        return { status: 200, message: "The request was successful", user };
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error creating user: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

// Function that blocks a user
export const blockUserController = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_bloqueada } = await ctx.body as BlockUserBody;
        // Block the user in the database
        await blockUser(direccion_correo, clave, direccion_bloqueada);
        const date = new Date();
        // Log the user blocking
        console.log(`[${date}] : User ${direccion_bloqueada} was blocked succesfully for user ${direccion_correo}.`);
        // Return a success message
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error blocking user: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

// Function that gets the information of a user by email
export const getUserInfo = async (ctx: Context) => {
    try {
        const { correo } = ctx.params;
        // Get the user by email
        const user = await getUserByEmail(correo);
        // If the user exists
        if (user) {
            const date = new Date();
            // Log the user info request
            console.log(`[${date}] : User info requested for user ${correo}.`);
            // Return a success message with the user
            return { status: 200, message: "The request was successful", user };
        } else {
            const date = new Date();
            // Log the user not found
            console.log(`[${date}] : User ${correo} not found.`);
            // Return an error message
            return { status: 400, message: "User not found" };
        }
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error getting user info: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

// Function that gets the list of favorite emails of a user
export const getListOffavoriteEmails = async (ctx: Context) => {
    try {
        const { correo } = await ctx.params;
        // Fetch the list of favorite emails from the database
        const list = await seeListOffavoriteEmail(correo);
        const date = new Date();
        // Log the list of favorite emails request
        console.log(`[${date}] : List of favorite emails requested for user ${correo}.`);
        // Return a success message with the list
        return { status: 200, message: "The request was successful", list };
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error getting list of favorite emails: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
}

// Function that authenticates a user
export const authenticateUser = async (ctx: Context) => {
    try {
        const { direccion_correo, clave } = await ctx.body as { direccion_correo: string, clave: string };
        // Get the user by email
        const user = await getUserByEmail(direccion_correo);
        // If the user exists and the password is correct
        if (user && user.clave === clave) {
            const date = new Date();
            // Log the user authentication
            console.log(`[${date}] : User ${direccion_correo} was authenticated.`);
            // Return a success message
            return { status: 200, message: "The user is authenticated" };
        } else {
            const date = new Date();
            // Log the wrong email or password
            console.log(`[${date}] : Wrong email or password for user ${direccion_correo}.`);
            // Return an error message
            return { status: 400, message: "Wrong email or password"};
        }
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error authenticating user: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};

// Function that adds an email address to the list of favorite emails
export const bookmarkEmail = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_favorita, categoria } = await ctx.body as BookmarkEmailBody;
        // Add the email to the list of favorite emails in the database
        await addFavoriteEmail(direccion_correo, clave, direccion_favorita, categoria);
        const date = new Date();
        // Log the email bookmarking
        console.log(`[${date}] : Email ${direccion_favorita} was added to favorites succesfully for user ${direccion_correo}.`);
        // Return a success message
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error adding to favorite email: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message, code: (err as Error & { code?: string }).code};
    }
};

// Function that deselects an email address from the list of favorite emails
export const deselectEmail = async (ctx: Context) => {
    try {
        const { direccion_correo, clave, direccion_favorita } = await ctx.body as DeselectEmailBody;
        // Remove the email from the list of favorite emails in the database
        await removeFavoriteEmail(direccion_correo, clave, direccion_favorita);
        const date = new Date();
        // Log the email deselection
        console.log(`[${date}] : Email ${direccion_favorita} was removed from favorites succesfully for user ${direccion_correo}.`);
        // Return a success message
        return { status: 200, message: "The request was successful" };
    } catch (err) {
        const date = new Date();
        // Log the error
        console.log(`[${date}] : Error removing from favorite email: ${(err as Error).message}`);
        // Return an error message
        return { status: 400, message: "There was an error in making the request", error: (err as Error).message };
    }
};
