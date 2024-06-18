import sqlite3 from "sqlite3";

// Establecer conexión con la base de datos (base de datos en memoria para fines de demostración)
const db = new sqlite3.Database(":memory:");

// Crear tablas de ejemplo
db.serialize(() => {
  db.run(`CREATE TABLE users (
               id INTEGER PRIMARY KEY,
               username TEXT NOT NULL,
               password TEXT NOT NULL)`);

  db.run(`CREATE TABLE posts (
               post_id INTEGER PRIMARY KEY,
               user_id INTEGER,
               content TEXT NOT NULL,
               FOREIGN KEY (user_id) REFERENCES users(id))`);

  // Insertar datos de ejemplo en la tabla users
  const usersData = [
    ["admin", "admin123"],
    ["user1", "password1"],
    ["user2", "password2"],
  ];
  const userStmt = db.prepare(
    `INSERT INTO users (username, password) VALUES (?, ?)`
  );
  for (const user of usersData) {
    userStmt.run(user);
  }
  userStmt.finalize();

  // Insertar datos de ejemplo en la tabla posts
  const postsData = [
    [1, "Zapatillas nike"],
    [2, "Procesador ryzen 5 3600x"],
    [3, "Auto toyota corolla 2021"],
  ];
  const postStmt = db.prepare(
    `INSERT INTO posts (user_id, content) VALUES (?, ?)`
  );
  for (const post of postsData) {
    postStmt.run(post);
  }
  postStmt.finalize();
});

// Función segura para consultas de usuarios
function secureQueryUser(
  username: string,
  callback: (err: Error | null, row?: any) => void
) {
  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], callback);
}

// Función segura para consultas de posts por usuario
function secureQueryPostsByUser(
  username: string,
  callback: (err: Error | null, rows?: any[]) => void
) {
  const query = `SELECT posts.content 
                   FROM posts 
                   JOIN users ON posts.user_id = users.id 
                   WHERE users.username = ?`;
  db.all(query, [username], callback);
}

// Ejemplo de uso seguro de las funciones
const userInput = "admin"; // Simulación de entrada del usuario
secureQueryUser(userInput, (err, resultUser) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Consulta segura de usuario:", resultUser);
  }
});

secureQueryPostsByUser(userInput, (err, resultPosts) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Consulta segura de posts del usuario:", resultPosts);
  }
});

// Ejemplo de intento de inyección SQL (será prevenido)
const userInputInjection = "'; DROP TABLE users; --";
secureQueryUser(userInputInjection, (err, resultInjection) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      "Intento de inyección en consulta de usuario:",
      resultInjection
    );
  }
});

secureQueryPostsByUser(userInputInjection, (err, resultInjectionPosts) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      "Intento de inyección en consulta de posts:",
      resultInjectionPosts
    );
  }
});

// Función para mostrar todos los datos de la tabla users (para ver el estado después de los intentos de inyección)
function showAllUsers(callback: (err: Error | null, rows?: any[]) => void) {
  db.all("SELECT * FROM users", callback);
}

// Función para mostrar todos los datos de la tabla posts
function showAllPosts(callback: (err: Error | null, rows?: any[]) => void) {
  db.all("SELECT * FROM posts", callback);
}

// Mostrar todos los usuarios y posts después de los intentos de inyección
showAllUsers((err, allUsers) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Todos los usuarios:", allUsers);
  }
});

showAllPosts((err, allPosts) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Todos los posts:", allPosts);
  }
});

db.close();
