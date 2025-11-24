-- Script de Base de Datos Tinder (Oracle Style)
-- Autor: Antigravity
-- Proposito: Taller de SQL Avanzado (3FN) - EA3
-- Version: 2.0 (Datos Ampliados)

-- ==========================================
-- 1. ELIMINACION DE TABLAS (DROPS)
-- ==========================================
DROP TABLE MENSAJES CASCADE CONSTRAINT;
DROP TABLE MATCHES CASCADE CONSTRAINT;
DROP TABLE LIKES CASCADE CONSTRAINT;
DROP TABLE FOTOS CASCADE CONSTRAINT;
DROP TABLE USUARIO_INTERESES CASCADE CONSTRAINT;
DROP TABLE USUARIOS CASCADE CONSTRAINT;
DROP TABLE CIUDADES CASCADE CONSTRAINT;
DROP TABLE PAIS CASCADE CONSTRAINT;
DROP TABLE PLANES CASCADE CONSTRAINT;
DROP TABLE INTERESES CASCADE CONSTRAINT;
DROP TABLE GENEROS CASCADE CONSTRAINT;

-- ==========================================
-- 2. CREACION DE TABLAS (CREATES)
-- ==========================================

CREATE TABLE GENEROS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL UNIQUE
);

CREATE TABLE INTERESES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL UNIQUE,
    categoria VARCHAR2(50)
);

CREATE TABLE PLANES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL UNIQUE,
    precio NUMBER(10, 2) NOT NULL,
    descripcion VARCHAR2(200)
);

CREATE TABLE PAIS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL UNIQUE
);

CREATE TABLE CIUDADES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL,
    id_pais NUMBER NOT NULL REFERENCES PAIS(id)
);

CREATE TABLE USUARIOS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password VARCHAR2(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    biografia VARCHAR2(500),
    id_genero NUMBER NOT NULL REFERENCES GENEROS(id),
    id_ciudad NUMBER NOT NULL REFERENCES CIUDADES(id),
    id_plan NUMBER DEFAULT 1 NOT NULL REFERENCES PLANES(id),
    distancia_max_km NUMBER DEFAULT 50,
    fecha_registro TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE TABLE FOTOS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url_foto VARCHAR2(255) NOT NULL,
    es_perfil CHAR(1) DEFAULT '0' CHECK (es_perfil IN ('0', '1')),
    id_usuario NUMBER NOT NULL REFERENCES USUARIOS(id)
);

CREATE TABLE USUARIO_INTERESES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER NOT NULL REFERENCES USUARIOS(id),
    id_interes NUMBER NOT NULL REFERENCES INTERESES(id),
    CONSTRAINT uk_usuario_interes UNIQUE (id_usuario, id_interes)
);

CREATE TABLE LIKES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario_origen NUMBER NOT NULL REFERENCES USUARIOS(id),
    id_usuario_destino NUMBER NOT NULL REFERENCES USUARIOS(id),
    es_superlike CHAR(1) DEFAULT '0' CHECK (es_superlike IN ('0', '1')),
    fecha_like TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT uk_likes UNIQUE (id_usuario_origen, id_usuario_destino),
    CONSTRAINT chk_mismo_usuario CHECK (id_usuario_origen <> id_usuario_destino)
);

CREATE TABLE MATCHES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario_1 NUMBER NOT NULL REFERENCES USUARIOS(id),
    id_usuario_2 NUMBER NOT NULL REFERENCES USUARIOS(id),
    fecha_match TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT uk_matches UNIQUE (id_usuario_1, id_usuario_2),
    CONSTRAINT chk_match_order CHECK (id_usuario_1 < id_usuario_2) 
);

CREATE TABLE MENSAJES (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_match NUMBER NOT NULL REFERENCES MATCHES(id),
    id_usuario_emisor NUMBER NOT NULL REFERENCES USUARIOS(id),
    contenido VARCHAR2(1000) NOT NULL,
    fecha_envio TIMESTAMP DEFAULT SYSTIMESTAMP,
    leido CHAR(1) DEFAULT '0' CHECK (leido IN ('0', '1'))
);

-- ==========================================
-- 3. POBLADO DE DATOS MASIVO (INSERTS)
-- ==========================================

-- --- GENEROS ---
INSERT INTO GENEROS (nombre) VALUES ('Masculino');
INSERT INTO GENEROS (nombre) VALUES ('Femenino');
INSERT INTO GENEROS (nombre) VALUES ('No Binario');
INSERT INTO GENEROS (nombre) VALUES ('Otro');

-- --- INTERESES (Mas variedad) ---
INSERT INTO INTERESES (nombre, categoria) VALUES ('Trekking', 'Deportes');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Sushi', 'Comida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Netflix', 'Entretenimiento');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Viajar', 'Estilo de Vida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Gatos', 'Mascotas');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Perros', 'Mascotas');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Fotografía', 'Arte');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Programación', 'Tecnología');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Vino', 'Bebida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Astrología', 'Creencias');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Crossfit', 'Deportes');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Gaming', 'Entretenimiento');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Rock', 'Música');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Pop', 'Música');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Reggaeton', 'Música');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Indie', 'Música');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Pizza', 'Comida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Vegana', 'Comida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Asado', 'Comida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Leer', 'Hobbies');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Cine', 'Hobbies');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Bailar', 'Hobbies');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Yoga', 'Deportes');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Cerveza', 'Bebida');
INSERT INTO INTERESES (nombre, categoria) VALUES ('Café', 'Bebida');

-- --- PLANES ---
INSERT INTO PLANES (nombre, precio, descripcion) VALUES ('Tinder Free', 0, 'Plan gratuito');
INSERT INTO PLANES (nombre, precio, descripcion) VALUES ('Tinder Gold', 9990, 'Ver quien te dio like');
INSERT INTO PLANES (nombre, precio, descripcion) VALUES ('Tinder Platinum', 19990, 'Prioridad en mensajes');

-- --- PAIS Y CIUDADES ---
INSERT INTO PAIS (nombre) VALUES ('Chile');
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Santiago', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Valparaíso', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Concepción', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Puerto Montt', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('La Serena', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Antofagasta', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Temuco', 1);
INSERT INTO CIUDADES (nombre, id_pais) VALUES ('Viña del Mar', 1);

-- --- USUARIOS (25 Usuarios para tener masa critica) ---
-- 1-10 (Originales)
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Juan Pérez', 'juan.p@gmail.com', 'pass123', TO_DATE('1995-05-15', 'YYYY-MM-DD'), 'Busco alguien para ir al cajón del maipo.', 1, 1, 2);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('María González', 'maria.g@hotmail.com', 'pass123', TO_DATE('1998-08-20', 'YYYY-MM-DD'), 'Amante de los gatos y el sushi.', 2, 1, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Pedro Pascal', 'pedro.m@gmail.com', 'pass123', TO_DATE('1990-04-02', 'YYYY-MM-DD'), 'Quiero conocer gente.', 1, 2, 3);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Ana Roja', 'ana.red@gmail.com', 'pass123', TO_DATE('2000-12-12', 'YYYY-MM-DD'), 'Estudiante de derecho.', 2, 1, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Alex V', 'alex.v@gmail.com', 'pass123', TO_DATE('1996-03-30', 'YYYY-MM-DD'), 'Fotografía y lluvia.', 3, 4, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Sofía Vergara', 'sofi.v@gmail.com', 'pass123', TO_DATE('1993-07-10', 'YYYY-MM-DD'), 'Me encanta bailar.', 2, 1, 2);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Diego Maradona', 'diego.10@gmail.com', 'pass123', TO_DATE('1999-10-30', 'YYYY-MM-DD'), 'Fútbol y asados.', 1, 3, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Valentina Sol', 'vale.sol@gmail.com', 'pass123', TO_DATE('2001-01-15', 'YYYY-MM-DD'), 'Playa, sol y arena.', 2, 5, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Carlos Gamer', 'carlos.g@gmail.com', 'pass123', TO_DATE('1997-06-25', 'YYYY-MM-DD'), 'Main Yasuo.', 1, 1, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Laura Art', 'laura.art@gmail.com', 'pass123', TO_DATE('1994-11-11', 'YYYY-MM-DD'), 'Artista visual.', 2, 2, 1);

-- 11-25 (Nuevos)
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Roberto Gomez', 'roberto.g@gmail.com', 'pass123', TO_DATE('1988-02-20', 'YYYY-MM-DD'), 'Ingeniero, me gusta el orden y el café.', 1, 1, 2);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Camila Vallejo', 'cami.v@gmail.com', 'pass123', TO_DATE('1992-04-28', 'YYYY-MM-DD'), 'Activista y lectora empedernida.', 2, 1, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Felipe Avello', 'felipe.pez@gmail.com', 'pass123', TO_DATE('1985-05-24', 'YYYY-MM-DD'), 'Comediante, busco alguien con sentido del humor.', 1, 3, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Daniela Vega', 'dani.v@gmail.com', 'pass123', TO_DATE('1989-06-03', 'YYYY-MM-DD'), 'Actriz y cantante lírica.', 2, 1, 3);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Javier Milei', 'javi.libertad@gmail.com', 'pass123', TO_DATE('1970-10-22', 'YYYY-MM-DD'), 'Viva la libertad carajo.', 1, 1, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Andrea P', 'andrea.p@gmail.com', 'pass123', TO_DATE('1995-09-15', 'YYYY-MM-DD'), 'Enfermera de turno, respondo cuando puedo.', 2, 4, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Miguel Bosé', 'miguel.b@gmail.com', 'pass123', TO_DATE('1960-04-03', 'YYYY-MM-DD'), 'Amante bandido.', 1, 8, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Patricia M', 'pati.m@gmail.com', 'pass123', TO_DATE('1998-12-01', 'YYYY-MM-DD'), 'Estudiante de medicina.', 2, 1, 2);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Gabriel B', 'gabo.b@gmail.com', 'pass123', TO_DATE('1986-02-11', 'YYYY-MM-DD'), 'Me gusta leer en el parque.', 1, 2, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Lucía H', 'lucia.h@gmail.com', 'pass123', TO_DATE('2002-07-07', 'YYYY-MM-DD'), 'Recién llegada a la ciudad.', 2, 3, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Fernando G', 'fer.g@gmail.com', 'pass123', TO_DATE('1991-08-30', 'YYYY-MM-DD'), 'Piloto comercial, viajo mucho.', 1, 1, 3);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Isidora J', 'isi.j@gmail.com', 'pass123', TO_DATE('1999-03-14', 'YYYY-MM-DD'), 'Vegana y animalista.', 2, 4, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Hugo S', 'hugo.s@gmail.com', 'pass123', TO_DATE('1994-01-20', 'YYYY-MM-DD'), 'Crossfit es mi pasión.', 1, 1, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Carmen T', 'carmen.t@gmail.com', 'pass123', TO_DATE('1965-11-05', 'YYYY-MM-DD'), 'Disfrutando la vida.', 2, 8, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Lucas R', 'lucas.r@gmail.com', 'pass123', TO_DATE('2003-05-12', 'YYYY-MM-DD'), 'Estudiante de informática.', 1, 2, 1);
INSERT INTO USUARIOS (nombre, email, password, fecha_nacimiento, biografia, id_genero, id_ciudad, id_plan) VALUES ('Gasparín', 'ghost@gmail.com', 'pass123', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'No tengo foto de perfil 👻', 1, 1, 1);

-- --- USUARIO_INTERESES (Asignacion masiva) ---
-- Juan (1)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (1, 1); -- Trekking
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (1, 9); -- Vino
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (1, 24); -- Cerveza

-- Maria (2)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (2, 2); -- Sushi
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (2, 5); -- Gatos
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (2, 21); -- Cine

-- Roberto (11)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (11, 25); -- Cafe
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (11, 20); -- Leer
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (11, 8); -- Programacion

-- Camila (12)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (12, 20); -- Leer
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (12, 16); -- Indie
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (12, 18); -- Vegana

-- Felipe (13)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (13, 3); -- Netflix
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (13, 17); -- Pizza
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (13, 13); -- Rock

-- Daniela (14)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (14, 7); -- Fotografia
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (14, 21); -- Cine
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (14, 9); -- Vino

-- Javier (15)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (15, 19); -- Asado
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (15, 6); -- Perros

-- Isidora (22)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (22, 18); -- Vegana
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (22, 23); -- Yoga
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (22, 5); -- Gatos

-- Hugo (23)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (23, 11); -- Crossfit
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (23, 1); -- Trekking

-- Lucas (25)
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (25, 12); -- Gaming
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (25, 8); -- Programacion
INSERT INTO USUARIO_INTERESES (id_usuario, id_interes) VALUES (25, 17); -- Pizza

-- --- FOTOS ---
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/juan.jpg', '1', 1);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/maria.jpg', '1', 2);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/pedro.jpg', '1', 3);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/ana.jpg', '1', 4);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/alex.jpg', '1', 5);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/sofia.jpg', '1', 6);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/diego.jpg', '1', 7);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/vale.jpg', '1', 8);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/carlos.jpg', '1', 9);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/laura.jpg', '1', 10);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/roberto.jpg', '1', 11);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/camila.jpg', '1', 12);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/felipe.jpg', '1', 13);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/daniela.jpg', '1', 14);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/javier.jpg', '1', 15);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/andrea.jpg', '1', 16);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/miguel.jpg', '1', 17);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/patricia.jpg', '1', 18);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/gabriel.jpg', '1', 19);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/lucia.jpg', '1', 20);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/fernando.jpg', '1', 21);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/isidora.jpg', '1', 22);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/hugo.jpg', '1', 23);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/carmen.jpg', '1', 24);
INSERT INTO FOTOS (url_foto, es_perfil, id_usuario) VALUES ('https://fake-tinder.com/lucas.jpg', '1', 25);

-- --- LIKES (Creando la red de interacciones) ---
-- Juan (1) y Maria (2) -> Match
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (1, 2, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (2, 1, '1');

-- Juan (1) y Sofia (6) -> Match
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (6, 1, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (1, 6, '0');

-- Pedro (3) y Laura (10) -> Match
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (3, 10, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (10, 3, '0');

-- Carlos (9) likes Ana (4) -> No match
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (9, 4, '0');

-- Roberto (11) likes Camila (12) -> Match
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (11, 12, '1');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (12, 11, '0');

-- Felipe (13) likes Daniela (14) -> Match
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (13, 14, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (14, 13, '0');

-- Lucas (25) likes everyone (Simp) -> No matches yet
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (25, 2, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (25, 4, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (25, 6, '1');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (25, 8, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (25, 10, '0');

-- Isidora (22) y Alex (5) -> Match (Puerto Montt connection)
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (22, 5, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (5, 22, '0');

-- Hugo (23) likes Juan (1) -> Match (Gym bros?)
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (23, 1, '0');
INSERT INTO LIKES (id_usuario_origen, id_usuario_destino, es_superlike) VALUES (1, 23, '0');

-- --- MATCHES (Consolidando) ---
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (1, 2); -- Juan y Maria
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (1, 6); -- Juan y Sofia
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (3, 10); -- Pedro y Laura
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (11, 12); -- Roberto y Camila
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (13, 14); -- Felipe y Daniela
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (5, 22); -- Alex y Isidora
INSERT INTO MATCHES (id_usuario_1, id_usuario_2) VALUES (1, 23); -- Juan y Hugo

-- --- MENSAJES ---
-- Juan y Maria
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (1, 1, 'Hola María! Vi que te gustan los gatos 🐱');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (1, 2, 'Siii, tengo 3! Y a ti te gusta el trekking?');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (1, 1, 'Me encanta, voy todos los findes al Manquehue.');

-- Juan y Sofia
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (2, 6, 'Hola guapo 😉');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (2, 1, 'Hola Sofía, qué tal tu día?');

-- Pedro y Laura
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (3, 3, 'Hola Laura, vi que te gusta el arte. Has ido al Baburizza?');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (3, 10, 'Hola Pedro! Sii, es hermoso. Vamos algún día?');

-- Roberto y Camila
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (4, 11, 'Hola Camila, que interesante tu biografía.');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (4, 12, 'Hola Roberto! Gracias, tú también te ves interesante.');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (4, 11, 'Te gustaría ir por un café?');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (4, 12, 'Claro, me encanta el café.');

-- Felipe y Daniela
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (5, 13, 'Hola Dani! Eres actriz? Que genial.');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (5, 14, 'Hola Felipe! Sí, y tú comediante? Cuéntame un chiste.');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (5, 13, '¿Qué hace un pez en el cine?');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (5, 14, 'No sé, qué hace?');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (5, 13, 'Nada, porque es un mero espectador. 🐟');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (5, 14, 'Jajajaja malísimo, me encantó.');

-- Alex y Isidora
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (6, 22, 'Hola Alex! Qué lindas tus fotos.');
INSERT INTO MENSAJES (id_match, id_usuario_emisor, contenido) VALUES (6, 5, 'Gracias Isi! Me gusta capturar la lluvia del sur.');

COMMIT;

-- Consultas de prueba
SELECT 'Total Usuarios: ' || COUNT(*) FROM USUARIOS;
SELECT 'Total Matches: ' || COUNT(*) FROM MATCHES;
SELECT 'Total Mensajes: ' || COUNT(*) FROM MENSAJES;
