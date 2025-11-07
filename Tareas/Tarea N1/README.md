Perfecto ✅ Aquí tienes un **README.md** claro y didáctico para tus estudiantes, basado en el modelo del screenshot que enviaste:

---

````markdown
# 🧱 Tarea SQL: Creación de Tablas Base y Relaciones 1 a Muchos

## 🎯 Objetivo
El propósito de esta tarea es **crear las tablas base del modelo ER** (aquellas que **no dependen de ninguna otra**) y también **las tablas que participan en relaciones 1 a muchos (1:N)**, **sin incluir todavía las relaciones muchos a muchos (N:M)**.

Esta actividad les ayudará a entender cómo se construye paso a paso una base de datos relacional, respetando las dependencias y las claves foráneas.

---

## 📋 Instrucciones

1. **Observa el modelo ER** que se entrega en el screenshot.
2. **Identifica las tablas que:**
   - **No dependen de nadie** (no tienen claves foráneas).
   - **Tienen relaciones 1 a muchos**, es decir, poseen una clave foránea que apunta a otra tabla.
3. **Crea únicamente esas tablas** en SQL usando `CREATE TABLE`.
4. **No crear todavía** las tablas intermedias que representan relaciones muchos a muchos (por ejemplo: `Relation_14`, `Relation_13`, `Relation_2`, etc.).

---

## 🧩 Tablas que debes crear

### 🟩 Tablas sin dependencias (no tienen claves foráneas)
Estas se crean primero:

- **PAIS**
- **REGIONES**
- **CIUDADES**
- **COMUNAS**
- **ALMACEN**
- **FAMILIAS**
- **MARCAS**
- **GENERICA**
- **METODO_PAGO**
- **PROVEEDOR_ENVIO**
- **ESTADO_ENVIO**

> 🔹 Todas estas tablas solo tienen sus atributos y su `PRIMARY KEY`.

---

### 🟦 Tablas con relación 1 a muchos (tienen claves foráneas)
Luego, deben crear las que **dependen de una sola tabla**:

- **DIRECCIONES**  
  → depende de `COMUNAS`

- **PRODUCTOS**  
  → depende de `MARCAS`

- **STOCK_ALMACEN**  
  → depende de `PRODUCTOS` y `ALMACEN`

- **PAGO**  
  → depende de `METODO_PAGO`

- **ENVIOS**  
  → depende de `ESTADO_ENVIO` y `PROVEEDOR_ENVIO`

- **REGIONES**  
  → depende de `PAIS`

- **CIUDADES**  
  → depende de `REGIONES`

- **COMUNAS**  
  → depende de `CIUDADES`

> 🔹 En estas tablas deben incluir las **claves foráneas** con la sintaxis `FOREIGN KEY (...) REFERENCES ...(...)`.

---

## ⚙️ Ejemplo de creación

```sql
CREATE TABLE PAIS (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(50)
);

CREATE TABLE REGIONES (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(50),
    PAIS_id NUMBER,
    FOREIGN KEY (PAIS_id) REFERENCES PAIS(id)
);
````

---

## 🧠 Recomendaciones

* Ordena tus sentencias SQL para que las tablas “padre” se creen **antes** que las “hijas”.
* Usa tipos de datos coherentes (`NUMBER`, `VARCHAR2`, `TIMESTAMP`).
* Asegúrate de nombrar las claves foráneas y primarias como se muestra en el modelo (opcional pero recomendado).
* Guarda tu archivo como **`tarea_creacion_tablas.sql`** y pruébalo en tu entorno SQL Developer.

---

## ✅ Entrega

* 📄 Archivo: `tarea_creacion_tablas.sql`
* 📅 Fecha: *(agregar fecha de entrega según el docente)*
* 📥 Medio de entrega: *(por ejemplo: Aula Virtual o correo)*

---

## 💬 Dudas

Si no estás seguro si una tabla pertenece a este grupo, revisa si:

* Tiene **solo una clave foránea** → probablemente sí debes crearla.
* Está nombrada como `Relation_XX` → **no la crees todavía** (esas son N:M).

---

✍️ **Autor:** Profesor
**Curso:** Base de Datos Aplicada
**Institución:** Duoc UC – Sede Puerto Montt

```

