# reservationspy
Proyecto Fullstack React + Ant Designt + Nodejs + Mysql


# Docker (BD) de pruebas
- docker run -d --name mysql-reservationspy \
  -e MYSQL_ROOT_PASSWORD=Pass2025 \
  -e MYSQL_DATABASE=reservationspy \
  -p 3306:3306 \
  --restart unless-stopped \
  mysql:latest

# Creación de tablas necesarias:
CREATE TABLE persona (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombrecompleto VARCHAR(255) NOT NULL,
  nrodocumento VARCHAR(50) NOT NULL UNIQUE,
  correo VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL
);

CREATE TABLE habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacionpiso INT NOT NULL CHECK (habitacionpiso > 0 AND habitacionpiso <= 10),
  habitacionnro INT NOT NULL CHECK (habitacionnro > 0 AND habitacionnro <= 20),
  cantcamas INT NOT NULL CHECK (cantcamas >= 1 AND cantcamas <= 4),
  tienetelevision BOOLEAN NOT NULL DEFAULT FALSE,
  tienefrigobar BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fechareserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechaentrada DATE NOT NULL,
  fechasalida DATE NOT NULL,
  habitacionid INT NOT NULL,
  personaid INT NOT NULL,
  montoreserva DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (habitacionid) REFERENCES habitacion(id) ON DELETE CASCADE,
  FOREIGN KEY (personaid) REFERENCES persona(id) ON DELETE CASCADE
);


# Backend y Frontend (Modo desarrollo)

- Para poder encender en modo desarrollo se debe editar el archivo db.js dentro de config de la api, comentar la linea "mysql" que es para trabajar con docker y descomentar la línea "localhost" para trabajar localmente.

  // host: process.env.DB_HOST || 'mysql',
  host: process.env.DB_HOST || 'localhost',

- Los env-example, tanto del front como del back se pueden editar y dejar en .env para que tome las variables de entorno en modo desarrolo. 

- Para el despliegue de docker se debe dejar así como está sin los .env


# Docker Compose
- Proyecto dockerizado

- Ejecutar el siguiente comando para levantar el front (React), back(Nodejs) y la base de datos (Mysql).

- - docker-compose up --build -d

- - Al finalizar, el proyecto desplegará en localhost:3000, se conectará a la api en el puerto 5000 y la api se comunicará con el mysql en el puerto 3308.

- - Para una mejor orientación, leer el docker-compose.yml