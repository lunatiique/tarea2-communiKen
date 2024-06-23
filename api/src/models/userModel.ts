// src/models/userModel.ts
import prisma from '../db';

// Función que agrega al usuario a la base de datos.
export const addUser = async (direccion_correo: string, clave: string, nombre: string, descripcion: string, fecha_creacion: Date) => {
    // Agregue el usuario a la base de datos creando una nueva entrada en la tabla de "usuario"
    const newUser = await prisma.usuario.create({
        data: {
            direccion_correo,
            clave,
            nombre,
            descripcion,
            fecha_creacion,
        },
    });
    // Retorna al usuario
    return newUser;
};

// Función que bloquea a un usuario
export const blockUser = async (email: string, clave: string, direccion_bloqueada: string) => {
    // Obtenemos al usuario y al usuario bloqueado de la base de datos para ver si existen y obtener su id
    const user = await getUserByEmail(email);
    const blocked = await getUserByEmail(direccion_bloqueada);
    if (!user || user.clave !== clave) {
        // Si el usuario no existe o la contraseña es erronea entonces arroja un error 
        throw new Error('Invalid email or password');
    }
    if (!blocked) {
        // Si el usuario bloqueado no existe entonces arroja error 
        throw new Error('Invalid blocked email');
    }
    const fecha_bloqueo = new Date();
    // Se bloquea al usuario en la BD agregando una una nueva entrada en la tabla "direccion_bloqueada"
    await prisma.direccion_bloqueada.create({
        data: {
            usuario_id: user.id,
            direccion_bloqueada: blocked.id,
            fecha_bloqueo,
        },
    });
};

// Funcion que obtiene la informacion del usuario por el correo 
export const getUserByEmail = async (direccion_correo: string) => {
    // Obtiene al usuario de la BD buscando la direccion del correo 
    const user = await prisma.usuario.findUnique({
        where: { direccion_correo: direccion_correo },
    });
    // Retorna al usuario
    return user;
};

// Funcion que obtiene la informacion del usuario por la id  
export const getEmailbyUserId = async (id: number) => {
    // Obtiene al usuario de la BD buscando por la id 
    const user = await prisma.usuario.findUnique({
        where: { id },
        select: { direccion_correo: true },
    });
    // Retorna al usuario
    return user;
};

// Funcion que agrega un correo favorito a un usuario 
export const addFavoriteEmail = async (email: string, clave: string, direccion_favorita: string, categoria?: string) => {
    // Obtiene al usuario y el correo favorito de la BD para confirmar si existe y buscar su id 
    const user = await getUserByEmail(email);
    const favorite = await getUserByEmail(direccion_favorita);
    if (!user || user.clave !== clave) {
        // Si el usuario no existe o la contraseña es incorrecta, arroja error
        throw new Error('Invalid email or password');
    }
    if (!favorite) {
        // Si el correo favorito no existe, arroja error 
        throw new Error('Invalid favorite email');
    }
    const fecha_agregado = new Date();
    // Añade el correo favorito al usuario en la BD creando una nuetra entrada en la tabla "direccion_favorita" 
    const favoriteEmail = await prisma.direccion_favorita.create({
        data: {
            usuario_id: user.id,
            direccion_favorita: favorite.id,
            fecha_agregado,
            categoria,
        },
    });
    // Retorna la entrada del correo favorito 
    return favoriteEmail;
};

// Funcion que elimina el correo favorito del usuario 
export const removeFavoriteEmail = async (email: string, clave: string, direccion_favorita: string) => {
    // Obtiene al usuario y el correo favorito de la BD para confirmar si existe y buscar su id 
    const user = await getUserByEmail(email);
    const favorite = await getUserByEmail(direccion_favorita);
    if (!user || user.clave !== clave) {
        // Si el usuario no existe o la contraseña es incorrecta, arroja error 
        throw new Error('Invalid email or password');
    }
    if (!favorite) {
        // Si el correo favorito no existe entonces arroja en error 
        throw new Error('Invalid favorite email');
    }
    // Borra el correo favorito del usuario en la BD borrando la entrada en la tabla "direccion_favorita"
    const removedFavorite = await prisma.direccion_favorita.deleteMany({
        where: {
            usuario_id: user.id,
            direccion_favorita : favorite.id,
        },
    });
    // Retorna la entrada del correo favorito eliminada
    return removedFavorite;
};

// Funcion que obtiene la lista de correos favoritos para el usuario 
export const seeListOffavoriteEmail = async (email: string) => {
    // Obtenemos al usuario de la BD para confirmar si este existe y buscarlo por la id 
    const user = await getUserByEmail(email);
    if (!user) {
        // Si el usuario no existe, arroja error
        throw new Error('Invalid email');
    }
    // Obtiene una lista de los correos favoritos para el usuario de la BD 
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

    // Transforma el id en una direccion de correo para que se comprenda mejor la respuesta 
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
