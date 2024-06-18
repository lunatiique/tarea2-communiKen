// src/models/userModel.ts
import prisma from '../db';

interface User {
    direccion_correo: string;
    clave: string;
    nombre: string;
    descripcion?: string;
    fecha_creacion: Date;
}

interface FavoriteEmail {
    usuario_id: number;
    direccion_favorita: number;
    fecha_agregado: Date;
    categoria?: string;
}

interface BlockedEmail {
    usuario_id: number;
    direccion_bloqueada: number;
    fecha_bloqueo: Date;
}

export const addUser = async (user: User) => {
    const { direccion_correo, clave, nombre, descripcion, fecha_creacion } = user;
    const newUser = await prisma.usuario.create({
        data: {
            direccion_correo,
            clave,
            nombre,
            descripcion,
            fecha_creacion,
        },
    });
    return newUser;
};

export const blockUser = async (email: string, clave: string, direccion_bloqueada: number): Promise<void> => {
    const user = await getUserByEmail(email);
    if (!user || user.clave !== clave) {
        const showError = 'Invalid email or password ' + email + ' ' + clave + ' ';
        throw new Error(showError);
    }
    const fecha_bloqueo = new Date();
    await prisma.direccion_bloqueada.create({
        data: {
            usuario_id: user.id,
            direccion_bloqueada,
            fecha_bloqueo,
        },
    });
};

export const getUserByEmail = async (direccion_correo: string) => {
    const user = await prisma.usuario.findUnique({
        where: { direccion_correo: direccion_correo },
    });
    return user;
};

export const getEmailbyUserId = async (id: number) => {
    const user = await prisma.usuario.findUnique({
        where: { id },
        select: { direccion_correo: true },
    });
    return user;
};

export const addFavoriteEmail = async (email: string, clave: string, direccion_favorita: string, categoria?: string) => {
    const user = await getUserByEmail(email);
    const favorite = await getUserByEmail(direccion_favorita);
    if (!user || user.clave !== clave) {
        throw new Error('Invalid email or password');
    }
    if (!favorite) {
        throw new Error('Invalid favorite email');
    }
    const fecha_agregado = new Date();
    const favoriteEmail = await prisma.direccion_favorita.create({
        data: {
            usuario_id: user.id,
            direccion_favorita: favorite.id,
            fecha_agregado,
            categoria,
        },
    });
    return favoriteEmail;
};

export const removeFavoriteEmail = async (email: string, clave: string, direccion_favorita: number) => {
    const user = await getUserByEmail(email);
    if (!user || user.clave !== clave) {
        throw new Error('Invalid email or password');
    }
    const removedFavorite = await prisma.direccion_favorita.deleteMany({
        where: {
            usuario_id: user.id,
            direccion_favorita,
        },
    });
    return removedFavorite;
};

export const seeListOffavoriteEmail = async (email: string) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email');
    }
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
    return favorites;
};
