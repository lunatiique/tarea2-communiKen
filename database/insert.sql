-- Insert users
INSERT INTO usuario (direccion_correo, descripcion, fecha_creacion) VALUES
('alice@example.com', 'Alice Description', '2023-01-01'),
('bob@example.com', 'Bob Description', '2023-01-02'),
('carol@example.com', 'Carol Description', '2023-01-03'),
('dave@example.com', 'Dave Description', '2023-01-04'),
('eve@example.com', 'Eve Description', '2023-01-05');

-- Insert emails
INSERT INTO correo (remitente_id, destinatario_id, asunto, cuerpo, fecha_envio, leido, es_favorito) VALUES
(1, 2, 'Hello Bob', 'Hi Bob, how are you?', '2023-01-06', true, false),
(2, 1, 'Re: Hello Bob', 'I am fine Alice, thank you!', '2023-01-07', true, false),
(3, 4, 'Meeting', 'Hi Dave, can we reschedule the meeting?', '2023-01-06', false, false),
(4, 3, 'Re: Meeting', 'Sure Carol, let me check my calendar.', '2023-01-07', true, true),
(5, 1, 'Project Update', 'Hi Alice, the project is on track.', '2023-01-06', false, false);

-- Insert favorite addresses
INSERT INTO direccion_favorita (usuario_id, direccion_favorita, fecha_agregado, categoria) VALUES
(1, 2, '2023-01-08', 'friend'),
(1, 3, '2023-01-09', 'colleague'),
(2, 1, '2023-01-08', 'friend'),
(3, 4, '2023-01-08', 'colleague'),
(4, 3, '2023-01-08', 'colleague'),
(5, 1, '2023-01-08', 'colleague');

-- Insert blocked addresses
INSERT INTO direccion_bloqueada (usuario_id, direccion_bloqueada, fecha_bloqueo) VALUES
(1, 5, '2023-01-10'),
(2, 4, '2023-01-10'),
(3, 5, '2023-01-10'),
(4, 2, '2023-01-10'),
(5, 3, '2023-01-10');