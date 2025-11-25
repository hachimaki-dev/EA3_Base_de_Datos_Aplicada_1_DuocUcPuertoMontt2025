export const modules = [
    {
        title: "MÓDULO 1: INFILTRACIÓN BÁSICA (SELECT & WHERE)",
        theory: "📖 FUNDAMENTOS DE SELECT\n\nSELECT es el comando más básico de SQL. Te permite extraer datos de una tabla.\n\n🔹 Sintaxis básica:\nSELECT columna1, columna2 FROM tabla;\nSELECT * FROM tabla;  -- Todas las columnas\n\n🔹 WHERE filtra filas:\nSELECT * FROM tabla WHERE condicion;\n\n🔹 Operadores de comparación:\n=  (igual)\n!= o <> (diferente)\n<, >, <=, >= (menor, mayor)\n\n🔹 Operadores lógicos:\nAND - Ambas condiciones deben ser verdaderas\nOR  - Al menos una condición debe ser verdadera\nIN  - El valor está en una lista\nLIKE - Coincidencia de patrones\n\n💡 TIPS:\n• Usa * solo para explorar, especifica columnas en producción\n• WHERE va DESPUÉS de FROM\n• Las cadenas de texto van entre comillas simples 'texto'",
        expanded: true,
        levels: [
            {
                shortTitle: "Dump Inicial",
                title: "RECONOCIMIENTO DEL TERRENO",
                icon: "🕵️‍♀️",
                story: "Acabamos de vulnerar el firewall. Necesitamos ver qué hay en la tabla de usuarios antes de que nos detecten.",
                task: "Lista TODOS los datos de la tabla USUARIOS.",
                hint: "Usa el comodín * para traer todas las columnas.",
                solution: "SELECT * FROM USUARIOS;"
            },
            {
                shortTitle: "Lista de Spam",
                title: "EXTRACCIÓN DE CONTACTOS",
                icon: "📧",
                story: "El equipo de marketing quiere enviar una newsletter. No necesitan toda la info, solo nombres y correos.",
                task: "Selecciona solo las columnas 'nombre' y 'email' de la tabla USUARIOS.",
                hint: "Especifica los nombres de las columnas separados por coma en lugar de usar *.",
                solution: "SELECT nombre, email FROM USUARIOS;"
            },
            {
                shortTitle: "Filtro por Zona",
                title: "TARGETING GEOGRÁFICO",
                icon: "📍",
                story: "Queremos lanzar una campaña en Santiago (ID 1). Filtra la base de datos.",
                task: "Muestra todos los usuarios que vivan en la ciudad con id_ciudad = 1.",
                hint: "Usa la cláusula WHERE.",
                solution: "SELECT * FROM USUARIOS WHERE id_ciudad = 1;"
            },
            {
                shortTitle: "Target Específico",
                title: "SEGMENTACIÓN AVANZADA",
                icon: "🎯",
                story: "El cliente pide mujeres (ID 2) que vivan en Santiago (ID 1).",
                task: "Muestra usuarios con id_genero = 2 Y id_ciudad = 1.",
                hint: "Usa el operador AND para combinar condiciones.",
                solution: "SELECT * FROM USUARIOS WHERE id_genero = 2 AND id_ciudad = 1;"
            },
            {
                shortTitle: "Usuarios VIP",
                title: "FILTRANDO LA ÉLITE",
                icon: "💎",
                story: "Necesitamos identificar a los usuarios que pagan. Los planes 2 y 3 son de pago.",
                task: "Muestra los usuarios cuyo id_plan sea 2 O 3.",
                hint: "Puedes usar OR o el operador IN (2, 3).",
                solution: "SELECT * FROM USUARIOS WHERE id_plan IN (2, 3);"
            }
        ]
    },
    {
        title: "MÓDULO 2: ANÁLISIS DE DATOS (FUNCIONES & ORDEN)",
        theory: "📖 FUNCIONES DE AGREGACIÓN\n\nLas funciones de agregación realizan cálculos sobre un conjunto de valores.\n\n🔹 Funciones principales:\nCOUNT(*) - Cuenta todas las filas\nCOUNT(columna) - Cuenta valores no nulos\nAVG(columna) - Promedio\nMAX(columna) - Valor máximo\nMIN(columna) - Valor mínimo\nSUM(columna) - Suma total\n\n🔹 ORDER BY ordena resultados:\nORDER BY columna ASC  -- Ascendente (por defecto)\nORDER BY columna DESC -- Descendente\n\n🔹 LIKE para patrones:\n'A%'  - Empieza con A\n'%A'  - Termina con A\n'%A%' - Contiene A\n'_A%' - Segunda letra es A\n\n💡 TIPS:\n• Para fechas, DESC muestra las más recientes primero\n• COUNT(*) incluye filas con valores NULL\n• Puedes ordenar por múltiples columnas",
        expanded: false,
        levels: [
            {
                shortTitle: "Los Más Jóvenes",
                title: "ORDENAMIENTO TEMPORAL",
                icon: "👶",
                story: "Queremos atraer a la Gen Z. ¿Quiénes son los usuarios más jóvenes?",
                task: "Muestra nombre y fecha de nacimiento, ordenados desde el más joven al más viejo.",
                hint: "Usa ORDER BY fecha_nacimiento DESC (fechas más recientes son 'mayores').",
                solution: "SELECT nombre, fecha_nacimiento FROM USUARIOS ORDER BY fecha_nacimiento DESC;"
            },
            {
                shortTitle: "Conteo de Víctimas",
                title: "MÉTRICAS DE VOLUMEN",
                icon: "🔢",
                story: "El CEO pregunta cuántos usuarios tenemos registrados en total.",
                task: "Cuenta el total de filas en la tabla USUARIOS.",
                hint: "Usa la función de agregación COUNT(*).",
                solution: "SELECT COUNT(*) FROM USUARIOS;"
            },
            {
                shortTitle: "Alcance Promedio",
                title: "ESTADÍSTICAS DE USO",
                icon: "📏",
                story: "¿Qué tan lejos están dispuestos a viajar nuestros usuarios? Calcula el promedio.",
                task: "Calcula el promedio (AVG) de la columna distancia_max_km.",
                hint: "Usa la función AVG().",
                solution: "SELECT AVG(distancia_max_km) FROM USUARIOS;"
            },
            {
                shortTitle: "El Plan Más Caro",
                title: "MAXIMIZANDO REVENUE",
                icon: "💰",
                story: "Finanzas quiere saber cuál es el precio más alto que cobramos.",
                task: "Obtén el precio máximo registrado en la tabla PLANES.",
                hint: "Usa la función MAX().",
                solution: "SELECT MAX(precio) FROM PLANES;"
            },
            {
                shortTitle: "Buscando Patrones",
                title: "BÚSQUEDA DE TEXTO",
                icon: "🔍",
                story: "Por alguna razón, marketing cree que los nombres que empiezan con 'A' son más propensos a comprar.",
                task: "Encuentra todos los usuarios cuyo nombre empiece con la letra 'A'.",
                hint: "Usa el operador LIKE con el comodín % ('A%').",
                solution: "SELECT * FROM USUARIOS WHERE nombre LIKE 'A%';"
            }
        ]
    },
    {
        title: "MÓDULO 3: CONEXIONES DE RED (JOINS)",
        theory: "📖 ¿QUÉ ES UN JOIN?\n\nJOIN combina filas de dos o más tablas basándose en una columna relacionada.\n\n🔹 Tipos de JOIN:\nINNER JOIN - Solo filas que coinciden en AMBAS tablas\nLEFT JOIN  - Todas de la izquierda + coincidencias\nRIGHT JOIN - Todas de la derecha + coincidencias\nFULL JOIN  - Todas las filas de ambas tablas\n\n🔹 Sintaxis:\nSELECT columnas\nFROM tabla1 alias1\nJOIN tabla2 alias2 ON alias1.col = alias2.col\n\n🔹 Alias de tablas:\nU para USUARIOS\nC para CIUDADES\nG para GENEROS\nP para PLANES\nF para FOTOS\n\n💡 TIPS:\n• ON especifica la condición de unión\n• Usa alias para escribir menos\n• Puedes hacer múltiples JOINs en una consulta\n• El orden de los JOINs importa para la legibilidad",
        expanded: false,
        levels: [
            {
                shortTitle: "Ubicando Objetivos",
                title: "ENRIQUECIMIENTO GEOGRÁFICO",
                icon: "🗺️",
                story: "Los IDs de ciudad no nos dicen nada. Queremos ver el NOMBRE de la ciudad.",
                task: "Haz un JOIN entre USUARIOS y CIUDADES para mostrar el nombre del usuario y el nombre de su ciudad.",
                hint: "USUARIOS.id_ciudad se conecta con CIUDADES.id.",
                solution: "SELECT U.nombre, C.nombre AS ciudad \nFROM USUARIOS U \nJOIN CIUDADES C ON U.id_ciudad = C.id;"
            },
            {
                shortTitle: "Identidad de Género",
                title: "DATOS DEMOGRÁFICOS",
                icon: "⚧",
                story: "Igual que antes, queremos ver el nombre del GÉNERO, no su ID.",
                task: "Haz un JOIN entre USUARIOS y GENEROS.",
                hint: "USUARIOS.id_genero se conecta con GENEROS.id.",
                solution: "SELECT U.nombre, G.nombre AS genero \nFROM USUARIOS U \nJOIN GENEROS G ON U.id_genero = G.id;"
            },
            {
                shortTitle: "Verificando Suscripciones",
                title: "AUDITORÍA DE PAGOS",
                icon: "💳",
                story: "Muestra el nombre del usuario y el nombre de su PLAN.",
                task: "JOIN entre USUARIOS y PLANES.",
                hint: "USUARIOS.id_plan = PLANES.id.",
                solution: "SELECT U.nombre, P.nombre AS plan \nFROM USUARIOS U \nJOIN PLANES P ON U.id_plan = P.id;"
            },
            {
                shortTitle: "Perfilado Cruzado",
                title: "MULTI-DIMENSIONAL JOIN",
                icon: "🔗",
                story: "El reporte completo: Nombre Usuario, Nombre Ciudad y Nombre Género.",
                task: "Haz dos JOINs en la misma consulta (Usuarios con Ciudades y con Generos).",
                hint: "Escribe un JOIN después del otro.",
                solution: "SELECT U.nombre, C.nombre AS ciudad, G.nombre AS genero \nFROM USUARIOS U \nJOIN CIUDADES C ON U.id_ciudad = C.id \nJOIN GENEROS G ON U.id_genero = G.id;"
            },
            {
                shortTitle: "Recuperando Evidencia",
                title: "EXTRACCIÓN DE MEDIA",
                icon: "📸",
                story: "Necesitamos ver las fotos de perfil de los usuarios.",
                task: "Muestra el nombre del usuario y la URL de su foto. (JOIN con FOTOS).",
                hint: "Filtra donde es_perfil sea '1' si quieres solo la principal, o trae todas.",
                solution: "SELECT U.nombre, F.url_foto \nFROM USUARIOS U \nJOIN FOTOS F ON U.id = F.id_usuario;"
            }
        ]
    },
    {
        title: "MÓDULO 4: REPORTES DE INTELIGENCIA (GROUP BY)",
        theory: "📖 AGRUPACIÓN DE DATOS\n\nGROUP BY agrupa filas con valores iguales en columnas especificadas.\n\n🔹 Regla de oro:\nSi usas GROUP BY, en SELECT solo puedes poner:\n1. Columnas que están en el GROUP BY\n2. Funciones de agregación (COUNT, AVG, MAX, etc.)\n\n🔹 Sintaxis:\nSELECT columna, COUNT(*)\nFROM tabla\nGROUP BY columna\n\n🔹 HAVING vs WHERE:\nWHERE  - Filtra ANTES de agrupar\nHAVING - Filtra DESPUÉS de agrupar (usa con agregaciones)\n\n🔹 Ejemplo:\nSELECT ciudad, COUNT(*) as total\nFROM usuarios\nGROUP BY ciudad\nHAVING COUNT(*) > 5\n\n💡 TIPS:\n• GROUP BY va después de WHERE y antes de HAVING\n• Puedes agrupar por múltiples columnas\n• HAVING usa funciones de agregación",
        expanded: false,
        levels: [
            {
                shortTitle: "Densidad por Zona",
                title: "MAPA DE CALOR",
                icon: "🔥",
                story: "¿Cuántos usuarios tenemos en cada ciudad?",
                task: "Muestra el nombre de la ciudad y la cantidad de usuarios en ella.",
                hint: "JOIN Ciudades + Usuarios, luego GROUP BY nombre ciudad.",
                solution: "SELECT C.nombre, COUNT(U.id) \nFROM CIUDADES C \nJOIN USUARIOS U ON C.id = U.id_ciudad \nGROUP BY C.nombre;"
            },
            {
                shortTitle: "Demografía",
                title: "DISTRIBUCIÓN DE GÉNERO",
                icon: "🚻",
                story: "¿Cuál es la distribución de géneros en nuestra app?",
                task: "Cuenta cuántos usuarios hay por cada género.",
                hint: "JOIN Generos + Usuarios, GROUP BY nombre genero.",
                solution: "SELECT G.nombre, COUNT(U.id) \nFROM GENEROS G \nJOIN USUARIOS U ON G.id = U.id_genero \nGROUP BY G.nombre;"
            },
            {
                shortTitle: "Comportamiento por Plan",
                title: "ANÁLISIS DE COMPORTAMIENTO",
                icon: "📉",
                story: "¿Los usuarios que pagan configuran distancias más largas?",
                task: "Calcula el promedio de distancia_max_km agrupado por nombre del plan.",
                hint: "AVG(distancia) y GROUP BY plan.nombre.",
                solution: "SELECT P.nombre, AVG(U.distancia_max_km) \nFROM PLANES P \nJOIN USUARIOS U ON P.id = U.id_plan \nGROUP BY P.nombre;"
            },
            {
                shortTitle: "Zonas Calientes",
                title: "FILTRO DE GRUPOS (HAVING)",
                icon: "🌶️",
                story: "Queremos ver solo las ciudades que tienen más de 2 usuarios registrados.",
                task: "Agrupa por ciudad, cuenta usuarios, y filtra los grupos con HAVING COUNT > 2.",
                hint: "HAVING va después del GROUP BY.",
                solution: "SELECT C.nombre, COUNT(U.id) \nFROM CIUDADES C \nJOIN USUARIOS U ON C.id = U.id_ciudad \nGROUP BY C.nombre \nHAVING COUNT(U.id) > 2;"
            },
            {
                shortTitle: "Matriz de Distribución",
                title: "AGRUPACIÓN MULTI-NIVEL",
                icon: "🏗️",
                story: "Desglose total: Usuarios por Ciudad Y por Género.",
                task: "Agrupa por nombre de ciudad Y nombre de género al mismo tiempo.",
                hint: "GROUP BY C.nombre, G.nombre.",
                solution: "SELECT C.nombre, G.nombre, COUNT(U.id) \nFROM USUARIOS U \nJOIN CIUDADES C ON U.id_ciudad = C.id \nJOIN GENEROS G ON U.id_genero = G.id \nGROUP BY C.nombre, G.nombre;"
            }
        ]
    },
    {
        title: "MÓDULO 5: OPERACIONES ESPECIALES (AVANZADO)",
        theory: "📖 TÉCNICAS AVANZADAS\n\n🔹 LEFT JOIN y NULL:\nLEFT JOIN trae TODAS las filas de la tabla izquierda.\nSi no hay coincidencia, las columnas de la derecha son NULL.\nUsa WHERE columna IS NULL para encontrar filas sin coincidencia.\n\n🔹 SUBCONSULTAS:\nUna consulta dentro de otra consulta.\n• Escalar: Retorna UN valor\n  WHERE id = (SELECT id FROM tabla WHERE ...)\n• Lista: Retorna múltiples valores\n  WHERE id IN (SELECT id FROM tabla WHERE ...)\n\n🔹 DISTINCT:\nElimina filas duplicadas del resultado.\nSELECT DISTINCT columna FROM tabla;\n\n🔹 NOT IN:\nExcluye valores de una lista.\nWHERE id NOT IN (SELECT id FROM otra_tabla)\n\n💡 TIPS:\n• Subconsultas van entre paréntesis\n• LEFT JOIN + IS NULL = encontrar ausencias\n• DISTINCT va después de SELECT",
        expanded: false,
        levels: [
            {
                shortTitle: "Usuarios Fantasma",
                title: "DETECCIÓN DE ANOMALÍAS",
                icon: "👻",
                story: "Encuentra usuarios que NO tienen fotos subidas.",
                task: "Usa LEFT JOIN entre Usuarios y Fotos, y filtra donde el ID de foto sea NULL.",
                hint: "WHERE F.id IS NULL.",
                solution: "SELECT U.nombre \nFROM USUARIOS U \nLEFT JOIN FOTOS F ON U.id = F.id_usuario \nWHERE F.id IS NULL;"
            },
            {
                shortTitle: "Forever Alone",
                title: "ANÁLISIS DE SOLEDAD",
                icon: "💔",
                story: "Usuarios que han dado likes pero no tienen matches. Carlos y Lucas están en esta situación.",
                task: "Difícil: Usuarios que están en LIKES pero NO en MATCHES. Usa subconsultas con NOT IN.",
                hint: "Primero encuentra quiénes dieron likes, luego excluye a quienes están en MATCHES (como usuario_1 O usuario_2).",
                solution: "SELECT DISTINCT U.nombre\nFROM USUARIOS U\nWHERE U.id IN (SELECT id_usuario_origen FROM LIKES)\n  AND U.id NOT IN (\n    SELECT id_usuario_1 FROM MATCHES\n    UNION\n    SELECT id_usuario_2 FROM MATCHES\n  );"
            },
            {
                shortTitle: "El VIP Supremo",
                title: "SUBCONSULTA ESCALAR",
                icon: "👑",
                story: "Encuentra al usuario que tiene el plan más caro, usando una subconsulta.",
                task: "SELECT nombre FROM Usuarios WHERE id_plan = (SELECT id del plan mas caro).",
                hint: "WHERE id_plan = (SELECT id FROM PLANES ORDER BY precio DESC FETCH FIRST 1 ROW ONLY).",
                solution: "SELECT nombre FROM USUARIOS \nWHERE id_plan = (SELECT id FROM PLANES ORDER BY precio DESC FETCH FIRST 1 ROWS ONLY);"
            },
            {
                shortTitle: "Red de Contactos",
                title: "SUBCONSULTA CORRELACIONADA",
                icon: "🕸️",
                story: "Encuentra todos los usuarios que viven en la misma ciudad que 'Juan Pérez'.",
                task: "Primero halla la ciudad de Juan, luego busca quiénes viven ahí.",
                hint: "WHERE id_ciudad = (SELECT id_ciudad FROM USUARIOS WHERE nombre = 'Juan Pérez').",
                solution: "SELECT nombre FROM USUARIOS \nWHERE id_ciudad = (SELECT id_ciudad FROM USUARIOS WHERE nombre = 'Juan Pérez');"
            },
            {
                shortTitle: "Interceptando Comms",
                title: "EL GRAN FINAL",
                icon: "🕵️‍♂️",
                story: "El CEO quiere leer los mensajes de los matches exitosos. Muestra: Quién dijo qué, a quién y cuándo.",
                task: "Une MATCHES, MENSAJES y USUARIOS (Emisor).",
                hint: "JOIN Mensajes con Usuarios (para el nombre del emisor).",
                solution: "SELECT U.nombre AS dice, M.contenido, M.fecha_envio \nFROM MENSAJES M \nJOIN USUARIOS U ON M.id_usuario_emisor = U.id \nORDER BY M.fecha_envio ASC;"
            }
        ]
    }
];
