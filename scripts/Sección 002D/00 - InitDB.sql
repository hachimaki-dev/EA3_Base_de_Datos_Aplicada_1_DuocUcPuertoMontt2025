DROP TABLE MARCAS CASCADE CONSTRAINTS;
DROP TABLE FAMILIA CASCADE CONSTRAINTS;
DROP TABLE ALMACENES CASCADE CONSTRAINTS;
DROP TABLE ESTADO_ENVIO CASCADE CONSTRAINTS;
DROP TABLE PROVEEDOR_ENVIO CASCADE CONSTRAINTS;
DROP TABLE PAIS CASCADE CONSTRAINTS;
DROP TABLE METODO_PAGO CASCADE CONSTRAINTS;
DROP TABLE CLIENTES CASCADE CONSTRAINTS;
DROP TABLE PRODUCTOS CASCADE CONSTRAINTS;

--Esto es un comentario
--Ahora vamos a crear todas las tablas que no dependen de nadie


--Tablas sin dependecias:
-- 1: Marcas            ✔️
-- 2: Familias          ✔️     
-- 3: Almacen           ✔️
-- 4: estado_envio      ✔️
-- 5: Proveedores_envio ✔️
-- 6: Pais              ✔️
-- 7: Clientes          ✔️
-- 8: metodo_pago       ✔️
CREATE TABLE MARCAS(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL
);

CREATE TABLE FAMILIAS(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL
);

CREATE TABLE ALMACENES(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE ESTADO_ENVIO(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE PROVEEDOR_ENVIO(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    telefono NUMBER(11) NOT NULL
);

CREATE TABLE PAIS(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE METODO_PAGO(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE CLIENTES(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    telefono NUMBER(11) NOT NULL
);


--Tablas con dependeica

CREATE TABLE PRODUCTOS(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(250) NOT NULL,
    id_marca NUMBER REFERENCES MARCAS(id)
);


--Insertemos datos a la tabla MARCAS
INSERT INTO MARCAS (id, nombre) VALUES (1, 'Samsung');
INSERT INTO MARCAS (id, nombre) VALUES (2, 'Apple');
INSERT INTO MARCAS (id, nombre) VALUES (3, 'Sony');
INSERT INTO MARCAS (id, nombre) VALUES (4, 'LG');
INSERT INTO MARCAS (id, nombre) VALUES (5, 'Huawei');

--Insertemos FAMILIAS
INSERT INTO FAMILIAS (id, nombre) VALUES (1, 'Smartphones');
INSERT INTO FAMILIAS (id, nombre) VALUES (2, 'Laptops');
INSERT INTO FAMILIAS (id, nombre) VALUES (3, 'Tablets');
INSERT INTO FAMILIAS (id, nombre) VALUES (4, 'Televisores');
INSERT INTO FAMILIAS (id, nombre) VALUES (5, 'Auriculares');

--Insetermos Almacenes
INSERT INTO ALMACENES (id, nombre) VALUES (1, 'Almacén Central Santiago');
INSERT INTO ALMACENES (id, nombre) VALUES (2, 'Almacén Concepción');
INSERT INTO ALMACENES (id, nombre) VALUES (3, 'Almacén Valparaíso');
INSERT INTO ALMACENES (id, nombre) VALUES (4, 'Almacén La Serena');
INSERT INTO ALMACENES (id, nombre) VALUES (5, 'Almacén Puerto Montt');

--insertamos estados de envio:
INSERT INTO ESTADO_ENVIO (id, nombre) VALUES (1, 'Pendiente');
INSERT INTO ESTADO_ENVIO (id, nombre) VALUES (2, 'En Preparación');
INSERT INTO ESTADO_ENVIO (id, nombre) VALUES (3, 'En Tránsito');
INSERT INTO ESTADO_ENVIO (id, nombre) VALUES (4, 'Entregado');
INSERT INTO ESTADO_ENVIO (id, nombre) VALUES (5, 'Cancelado');


--Proveedores
INSERT INTO PROVEEDOR_ENVIO (id, nombre, telefono) VALUES (1, 'Chilexpress', 56226710000);
INSERT INTO PROVEEDOR_ENVIO (id, nombre, telefono) VALUES (2, 'Correos de Chile', 56226904000);
INSERT INTO PROVEEDOR_ENVIO (id, nombre, telefono) VALUES (3, 'Starken', 56226005000);
INSERT INTO PROVEEDOR_ENVIO (id, nombre, telefono) VALUES (4, 'Blue Express', 56226003000);
INSERT INTO PROVEEDOR_ENVIO (id, nombre, telefono) VALUES (5, 'DHL Chile', 56227302000);

--Paises
INSERT INTO PAIS (id, nombre) VALUES (1, 'Chile');
INSERT INTO PAIS (id, nombre) VALUES (2, 'Argentina');
INSERT INTO PAIS (id, nombre) VALUES (3, 'Perú');
INSERT INTO PAIS (id, nombre) VALUES (4, 'Brasil');
INSERT INTO PAIS (id, nombre) VALUES (5, 'Colombia');

--Metodos de pago:
INSERT INTO METODO_PAGO (id, nombre) VALUES (1, 'Tarjeta de Crédito');
INSERT INTO METODO_PAGO (id, nombre) VALUES (2, 'Tarjeta de Débito');
INSERT INTO METODO_PAGO (id, nombre) VALUES (3, 'Transferencia Bancaria');
INSERT INTO METODO_PAGO (id, nombre) VALUES (4, 'WebPay');
INSERT INTO METODO_PAGO (id, nombre) VALUES (5, 'Efectivo');

--Clientes
INSERT INTO CLIENTES (id, nombre, rut, telefono) VALUES (1, 'María González', '12345678-9', 56912345678);
INSERT INTO CLIENTES (id, nombre, rut, telefono) VALUES (2, 'Juan Pérez', '23456789-0', 56923456789);
INSERT INTO CLIENTES (id, nombre, rut, telefono) VALUES (3, 'Ana Silva', '34567890-1', 56934567890);
INSERT INTO CLIENTES (id, nombre, rut, telefono) VALUES (4, 'Carlos Rojas', '45678901-2', 56945678901);
INSERT INTO CLIENTES (id, nombre, rut, telefono) VALUES (5, 'Patricia Muñoz', '56789012-3', 56956789012);


COMMIT;

-- Ahora generemos las tablas que tienen depencias
