# Use an official Node.js runtime as the base image
FROM node:20.12.2-alpine

ENV NODE_OPTIONS="--max_old_space_size=4096"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]