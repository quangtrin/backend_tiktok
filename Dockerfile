FROM node:14

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "yarn", "run:dev" ]