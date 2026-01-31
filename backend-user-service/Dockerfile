FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Build TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3050

# Santé du container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3050/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrer le service
CMD ["node", "dist/server.js"]
