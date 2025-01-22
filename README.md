# reservationspy
Proyecto Fullstack React + Ant Designt + Nodejs + Mysql


# Docker (BD) de pruebas
- docker run -d --name mysql-reservationspy \
  -e MYSQL_ROOT_PASSWORD=Pass2025 \
  -e MYSQL_DATABASE=reservationspy \
  -p 3307:3306 \
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


# Docker Compose
- Proyecto dockerizado
- Ejecutar el siguiente comando para levantar el front (React), back(Nodejs) y la base de datos (Mysql).
- - docker-compose up --build

# Backend

mkdir reservationspy-api && cd reservationspy-api

npm init -y

npm install express mysql2 dotenv cors body-parser



# Frontend

mkdir reservationspy-ui && cd reservationspy-ui

npm init -y

npm install react@18 react-dom@18

npm install web-vitals 


