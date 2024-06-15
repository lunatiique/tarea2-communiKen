CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    direccion_correo VARCHAR NOT NULL,
    descripcion TEXT,
    fecha_creacion DATE NOT NULL
);

CREATE TABLE correo (
    id SERIAL PRIMARY KEY,
    remitente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    asunto VARCHAR,
    cuerpo TEXT,
    fecha_envio DATE NOT NULL,
    leido BOOL,
    es_favorito BOOL,
    FOREIGN KEY (remitente_id) REFERENCES usuario(id),
    FOREIGN KEY (destinatario_id) REFERENCES usuario(id)
);

CREATE TABLE direccion_favorita (
    usuario_id INT NOT NULL,
    direccion_favorita INT NOT NULL,
    fecha_agregado DATE NOT NULL,
    categoria VARCHAR,
    PRIMARY KEY (usuario_id, direccion_favorita),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (direccion_favorita) REFERENCES usuario(id)
);

CREATE TABLE direccion_bloqueada (
    usuario_id INT NOT NULL,
    direccion_bloqueada INT NOT NULL,
    fecha_bloqueo DATE NOT NULL,
    PRIMARY KEY (usuario_id, direccion_bloqueada),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (direccion_bloqueada) REFERENCES usuario(id)
);