FROM node:16.13-alpine
WORKDIR /app
COPY package* .
RUN npm ci --production
COPY . .
EXPOSE 80
CMD ["npm", "start"]