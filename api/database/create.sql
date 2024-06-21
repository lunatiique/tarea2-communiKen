CREATE TABLE usuario (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,     --Es el identificador que se generara para cada usuario 
    direccion_correo VARCHAR NOT NULL UNIQUE,                --Direccion del correo del usuario, debe ser el unico
    clave VARCHAR NOT NULL,                                  --Contraseña del usuario
    nombre VARCHAR NOT NULL,                                 --Nombre del usuario
    descripcion TEXT,                                        --Descripcion del usuario 
    fecha_creacion DATE NOT NULL                             --Fecha de creacion del usuario
);

CREATE TABLE correo (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,     --Clave primaria generada para cada correo
    remitente_id INT NOT NULL,                               --Identificador del usuario que envia el correo
    destinatario_id INT NOT NULL,                            --Identificador del usuario que recibe el correo
    asunto VARCHAR,                                          --Asunto del correo
    cuerpo TEXT,                                             --Contenido del correo
    fecha_envio DATE NOT NULL,                               --Fecha de emision del correo
    leido BOOL,                                              --Indica si el correo fue leido
    es_favorito BOOL,                                        --Indica si el correo esta marcado como favorito
    FOREIGN KEY (remitente_id) REFERENCES usuario(id),       --Clave foranea que hace referencia al usuario emisor
    FOREIGN KEY (destinatario_id) REFERENCES usuario(id)     --Clave foranea que hace referencia al usuario receptor
);

CREATE TABLE direccion_favorita (
    usuario_id INT NOT NULL,                                 --Id del usuario que agrega la direccion a favoritos
    direccion_favorita INT NOT NULL,                         --Id de la direccion agregada a favoritos
    fecha_agregado DATE NOT NULL,                            --Fecha en la cual se agrega la direccion a favoritos
    categoria VARCHAR,                                       --categoria de la direccion favorita
    PRIMARY KEY (usuario_id, direccion_favorita),            --Clave primaria compuesta por usuario_id y la direccion_bloqueada
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),         --Clave foranea que referenia al usuario que se bloquea
    FOREIGN KEY (direccion_favorita) REFERENCES usuario(id)  --Clave foranea que referencia a la direccion bloqueada
);

CREATE TABLE direccion_bloqueada (
    usuario_id INT NOT NULL,                                 --identificador del usuario que bloquea la direccion
    direccion_bloqueada INT NOT NULL,                        --identificador de la direccion bloqueada pero del otro usuario
    fecha_bloqueo DATE NOT NULL,                             --Fecha onde se bloqueo la direccion
    PRIMARY KEY (usuario_id, direccion_bloqueada),           -- Clave primaria compuesta por usuario_id y direccion_bloqueada
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),         -- Clave foránea que referencia al usuario que bloquea
    FOREIGN KEY (direccion_bloqueada) REFERENCES usuario(id) -- Clave foránea que referencia a la dirección bloqueada
);
