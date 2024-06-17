import sqlite3

# Establecer conexión con la base de datos (base de datos en memoria para fines de demostración)
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Crear tablas de ejemplo
cursor.execute('''CREATE TABLE users (
                    id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL)''')

cursor.execute('''CREATE TABLE posts (
                    post_id INTEGER PRIMARY KEY,
                    user_id INTEGER,
                    content TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id))''')

# Insertar datos de ejemplo en la tabla users
users_data = [
    ('admin', 'admin123'),
    ('user1', 'password1'),
    ('user2', 'password2')
]
cursor.executemany('''INSERT INTO users (username, password) VALUES (?, ?)''', users_data)

# Insertar datos de ejemplo en la tabla posts
posts_data = [
    (1, 'Zapatillas nike'),
    (2, 'Procesador ryzen 5 3600x'),
    (3, 'Auto toyota corolla 2021'),
]
cursor.executemany('''INSERT INTO posts (user_id, content) VALUES (?, ?)''', posts_data)
conn.commit()

# Función insegura para consultas de usuarios
def insecure_query_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)
    result = cursor.fetchone()
    return result

# Función insegura para consultas de posts por usuario
def insecure_query_posts_by_user(username):
    query = f'''SELECT posts.content 
                FROM posts 
                JOIN users ON posts.user_id = users.id 
                WHERE users.username = '{username}' '''
    cursor.execute(query)
    results = cursor.fetchall()
    return results

# Ejemplo de uso inseguro de las funciones
user_input = "admin"  # Simulación de entrada del usuario
result_user = insecure_query_user(user_input)
print("Consulta insegura de usuario:", result_user)

result_posts = insecure_query_posts_by_user(user_input)
print("Consulta insegura de posts del usuario:", result_posts)

# Ejemplo de intento de inyección SQL (se simula la inyección)
user_input_injection = "' OR '1'='1"
result_injection = insecure_query_user(user_input_injection)
print("Intento de inyección en consulta de usuario:", result_injection)

result_injection_posts = insecure_query_posts_by_user(user_input_injection)
print("Intento de inyección en consulta de posts:", result_injection_posts)

# Intento de inyección SQL para borrar tabla (no directamente ejecutable en SQLite)
try:
    cursor.executescript(f"SELECT * FROM users WHERE username = '{user_input_injection}'; DROP TABLE users; --")
except sqlite3.OperationalError as e:
    print("Error de inyección SQL al intentar borrar la tabla:", e)

# Función para mostrar todos los datos de la tabla users (para ver el estado después de los intentos de inyección)
def show_all_users():
    try:
        cursor.execute("SELECT * FROM users")
        all_users = cursor.fetchall()
    except sqlite3.OperationalError as e:
        all_users = str(e)
    return all_users

# Función para mostrar todos los datos de la tabla posts
def show_all_posts():
    cursor.execute("SELECT * FROM posts")
    all_posts = cursor.fetchall()
    return all_posts

# Mostrar todos los usuarios y posts después de los intentos de inyección
print("Todos los usuarios:", show_all_users())
print("Todos los posts:", show_all_posts())

conn.close()
