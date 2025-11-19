# 🔹 Stage 1: Build de Angular
FROM node:18-alpine as build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el proyecto
COPY . .

# Build de producción de Angular
RUN npm run build:prod

# 🔹 Stage 2: Servir la app con Nginx
FROM nginx:alpine

# Copiamos los archivos compilados al directorio que Nginx sirve
COPY --from=build /app/dist/inventario-lab-bs/browser /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx si la tenemos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 para servir la app
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]