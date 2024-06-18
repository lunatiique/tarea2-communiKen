// src/models/userModel.ts
import prisma from '../db';

// Function that adds a user to the database
export const addUser = async (direccion_correo: string, clave: string, nombre: string, descripcion: string, fecha_creacion: Date) => {
    // Add the user to the database by creating a new entry in the "usuario" table
    const newUser = await prisma.usuario.create({
        data: {
            direccion_correo,
            clave,
            nombre,
            descripcion,
            fecha_creacion,
        },
    });
    // Return the user
    return newUser;
};

// Function that blocks a user
export const blockUser = async (email: string, clave: string, direccion_bloqueada: string) => {
    // Get the user and the blocked user from the database to check if they exist and fetch their id
    const user = await getUserByEmail(email);
    const blocked = await getUserByEmail(direccion_bloqueada);
    if (!user || user.clave !== clave) {
        // If the user does not exist or the password is incorrect, throw an error
        throw new Error('Invalid email or password');
    }
    if (!blocked) {
        // If the blocked user does not exist, throw an error
        throw new Error('Invalid blocked email');
    }
    const fecha_bloqueo = new Date();
    // Block the user in the database by adding a new entry in the "direccion_bloqueada" table
    await prisma.direccion_bloqueada.create({
        data: {
            usuario_id: user.id,
            direccion_bloqueada: blocked.id,
            fecha_bloqueo,
        },
    });
};

// Function that gets the information of a user by email
export const getUserByEmail = async (direccion_correo: string) => {
    // Get the user from the database by searching for the email address
    const user = await prisma.usuario.findUnique({
        where: { direccion_correo: direccion_correo },
    });
    // Return the user
    return user;
};

// Function that gets the information of a user by id
export const getEmailbyUserId = async (id: number) => {
    // Get the user from the database by searching for the id
    const user = await prisma.usuario.findUnique({
        where: { id },
        select: { direccion_correo: true },
    });
    // Return the user
    return user;
};

// Function that adds a favorite email to a user
export const addFavoriteEmail = async (email: string, clave: string, direccion_favorita: string, categoria?: string) => {
    // Get the user and the favorite email from the database to check if they exist and fetch their id
    const user = await getUserByEmail(email);
    const favorite = await getUserByEmail(direccion_favorita);
    if (!user || user.clave !== clave) {
        // If the user does not exist or the password is incorrect, throw an error
        throw new Error('Invalid email or password');
    }
    if (!favorite) {
        // If the favorite email does not exist, throw an error
        throw new Error('Invalid favorite email');
    }
    const fecha_agregado = new Date();
    // Add the favorite email to the user in the database by creating a new entry in the "direccion_favorita" table
    const favoriteEmail = await prisma.direccion_favorita.create({
        data: {
            usuario_id: user.id,
            direccion_favorita: favorite.id,
            fecha_agregado,
            categoria,
        },
    });
    // Return the favorite email entry
    return favoriteEmail;
};

// Function that removes a favorite email from a user
export const removeFavoriteEmail = async (email: string, clave: string, direccion_favorita: string) => {
    // Get the user and the favorite email from the database to check if they exist and fetch their id
    const user = await getUserByEmail(email);
    const favorite = await getUserByEmail(direccion_favorita);
    if (!user || user.clave !== clave) {
        // If the user does not exist or the password is incorrect, throw an error
        throw new Error('Invalid email or password');
    }
    if (!favorite) {
        // If the favorite email does not exist, throw an error
        throw new Error('Invalid favorite email');
    }
    // Remove the favorite email from the user in the database by deleting the entry in the "direccion_favorita" table
    const removedFavorite = await prisma.direccion_favorita.deleteMany({
        where: {
            usuario_id: user.id,
            direccion_favorita : favorite.id,
        },
    });
    // Return the removed favorite email entry
    return removedFavorite;
};

// Function that gets the list of favorite emails for a user
export const seeListOffavoriteEmail = async (email: string) => {
    // Get the user from the database to check if it exists and fetch its id
    const user = await getUserByEmail(email);
    if (!user) {
        // If the user does not exist, throw an error
        throw new Error('Invalid email');
    }
    // Get the list of favorite emails for the user from the database
    const favorites = await prisma.direccion_favorita.findMany({
        where: {
            usuario_id: user.id,
        },
        select: {
            direccion_favorita: true,
            fecha_agregado: true,
            categoria: true,
        },
    });

    // Transform the id in email address for better understanding of the response
    for (let i = 0; i < favorites.length; i++) {
        const userEmail = await getEmailbyUserId(favorites[i].direccion_favorita);
        if (userEmail) {
            favorites[i].direccion_favorita = userEmail.direccion_correo as unknown as number;
        } else {
            throw new Error('Favorite email not found');
        }
    }
    // Return the list of favorite emails
    return favorites;
};
