# Imagen base de Node.js
FROM node:18

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]
