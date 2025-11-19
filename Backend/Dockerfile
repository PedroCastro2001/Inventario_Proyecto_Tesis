# ---- 1. Imagen base oficial y ligera ----
FROM node:20-alpine

# ---- 2. Establecer directorio de trabajo dentro del contenedor ----
WORKDIR /app

# ---- 3. Copiar solo package.json para aprovechar la cache ----
COPY package*.json ./

# ---- 4. Instalar dependencias en modo producción ----
RUN npm install --production

# ---- 5. Copiar el resto del código ----
COPY . .

# ---- 6. Exponer el puerto que usa tu API ----
EXPOSE 3000

# ---- 7. Comando final para iniciar el servidor ----
CMD ["node", "src/index.js"]