--Todos los drops
DROP TABLE MARCAS;

--los copmentarios no se interpetan
--Vamos a crear la tabla MArcas

CREATE TABLE MARCAS(
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL
);

--Insertar datops
INSERT INTO MARCAS(id, nombre) VALUES(1, 'SONY');
COMMIT;

INSERT INTO MARCAS(id, nombre) VALUES(2, 'LG');
COMMIT;

INSERT INTO MARCAS(id) VALUES(3);
COMMIT;