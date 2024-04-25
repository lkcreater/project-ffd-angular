# setup nodejs version 20.x
FROM node:20-alpine3.18 as builder

# Setting working directory. 
WORKDIR /usr/src/app

# Installing angular cli global
RUN npm i -g @angular/cli

# copy file pagkage
COPY package*.json ./

# Installing source files nodejs
RUN npm ci

# ARG env default dev
ARG ENV_BUILD=dev
ENV ENV_BUILD=${ENV_BUILD}

# Copying source files
COPY . .

# run build app
RUN npm run build:${ENV_BUILD}

# run node app
ENTRYPOINT ["node", "./dist/server/server.mjs"]

# docker build --build-arg ENV_BUILD=sit -t tisco-cms-web .
# docker run -p 4001:4000 [container name]
