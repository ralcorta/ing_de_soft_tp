Aquí tienes el `README.md` adaptado para ejecutar los scripts traducidos a TypeScript:

# Prevención de Inyección de Código en TypeScript

Este repositorio contiene dos ejemplos de scripts en TypeScript que demuestran cómo manejar consultas a una base de datos SQLite de forma segura y de forma insegura. Los ejemplos muestran cómo prevenir inyecciones de código (inyección SQL) y cómo un manejo incorrecto puede permitir tales ataques.

## Contenido

1. `secure_script_poc.ts`: Ejemplo de consultas seguras utilizando consultas preparadas para prevenir inyecciones SQL.
2. `insecure_script_poc.ts`: Ejemplo de consultas inseguras que son vulnerables a inyecciones SQL.

## Requisitos

- Node.js
- TypeScript
- SQLite3 (módulo npm)

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/ralcorta/ing_de_soft_tp.git
    cd ing_de_soft_tp
    ```

2. Instala las dependencias necesarias:
    ```bash
    npm install
    ```

## Ejecución

### Script Seguro (`secure_script_poc.ts`)

Este script demuestra cómo proteger una aplicación contra inyecciones SQL utilizando consultas preparadas.

#### Cómo Ejecutar

1. Ejecutar directamente codigo Typescript con ts-node:
    ```bash
    # Ejectuar secure_script_poc.ts
    npm run exec:secure
    ```

2. Ejecutar transpilando typescript a javascript:
   1. Transpila el código TypeScript a JavaScript:
       ```bash
       npx tsc secure_script_poc.ts
       ```

   2. Ejecuta el script:
       ```bash
       node secure_script_poc.js
       ```

#### Explicación

El script realiza las siguientes acciones:
- Crea una base de datos SQLite en memoria con dos tablas: `users` y `posts`.
- Inserta datos de ejemplo en ambas tablas.
- Define funciones para realizar consultas de manera segura utilizando consultas preparadas.
- Demuestra el uso seguro de las funciones con entradas válidas e intentos de inyección SQL, los cuales son prevenidos.
- Muestra el estado de las tablas después de los intentos de inyección para verificar que no se realizaron cambios maliciosos.

### Script Inseguro (`insecure_script_poc.ts`)

Este script demuestra cómo las consultas sin preparación son vulnerables a inyecciones SQL.

#### Cómo Ejecutar

1. Ejecutar directamente codigo Typescript con ts-node:
    ```bash
    # Ejectuar insecure_script_poc.ts
    npm run exec:insecure
    ```

2. Ejecutar transpilando typescript a javascript:
   1. Transpila el código TypeScript a JavaScript:
       ```bash
       npx tsc insecure_script_poc.ts
       ```

   2. Ejecuta el script:
       ```bash
       node insecure_script_poc.js
       ```

#### Explicación

El script realiza las siguientes acciones:
- Crea una base de datos SQLite en memoria con dos tablas: `users` y `posts`.
- Inserta datos de ejemplo en ambas tablas.
- Define funciones para realizar consultas de manera insegura, directamente incorporando la entrada del usuario en las consultas SQL.
- Demuestra el uso inseguro de las funciones con entradas válidas e intentos de inyección SQL, los cuales no son prevenidos.
- Intenta ejecutar una inyección SQL para borrar la tabla `users`, lo cual falla debido a las protecciones incorporadas de SQLite.
- Muestra el estado de las tablas después de los intentos de inyección para verificar los efectos de la inyección SQL.

## Nota Importante

**Este repositorio es solo para fines educativos.** No utilices prácticas inseguras en aplicaciones reales. Siempre usa consultas preparadas y sanitiza las entradas del usuario para prevenir inyecciones SQL y otros tipos de ataques.

---

Estos scripts proporcionan una demostración clara de los riesgos de la inyección SQL y la importancia de seguir prácticas de codificación segura.