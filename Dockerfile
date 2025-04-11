# Dockerfile
FROM node:22-alpine

# Ajout pour que le file-watching fonctionne
RUN apk add --no-cache libc6-compat

# Crée le dossier de travail
WORKDIR /usr/src/app

# Copie uniquement les dépendances en premier (cache efficace)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Prisma generate pour l'archi Linux-Musl
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose le port utilisé par Next.js
EXPOSE 3000

# Variables d'env de dev
ENV NODE_ENV=development
ENV WATCHPACK_POLLING=true

# Lance Next.js
CMD ["npm", "run", "dev"]
