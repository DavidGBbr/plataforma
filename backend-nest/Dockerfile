# ===============================
# Stage 1: Build
# ===============================
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Buildar o NestJS
RUN npm run build

# ===============================
# Stage 2: Production
# ===============================
FROM node:24-alpine AS production

WORKDIR /app

# Copiar dependências e build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Iniciar a aplicação
CMD ["node", "dist/src/main.js"]
