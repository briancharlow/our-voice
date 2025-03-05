FROM node
WORKDIR /app
COPY package*.json /app
RUN npm install --force
COPY . /app
EXPOSE 80
CMD ["npm", "start"]