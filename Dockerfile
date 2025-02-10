# Stage 1: Build and Package
FROM node:18.20.5-alpine AS build
RUN npm install -g typescript
LABEL author="Vico Schot"
WORKDIR /ch-frontend

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY . .

RUN npm run build-now

# Stage 2: Production artefact
FROM node:18.20.5-alpine 
ENTRYPOINT ["node", "dist/src/app.js"]
LABEL author="Vico Schot"
EXPOSE 3000
WORKDIR /ch-frontend


COPY ./package-lock.json .
COPY ./package.json .
RUN NODE_ENV=production npm ci --omit=dev

COPY --from=build /ch-frontend/dist/src ./dist/src
COPY --from=build /ch-frontend/dist/Lib ./dist/Lib
COPY public ./public
COPY views ./views


