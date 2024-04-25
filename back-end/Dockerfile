# setup nodejs version 20.x
FROM node:20-alpine3.18 as builder

# Setting working directory. 
WORKDIR /usr/src/app

# copy file pagkage
COPY libs ./libs/
COPY package*.json ./

# Installing source files nodejs
RUN npm install

# ARG env default dev
ARG ENV_BUILD=dev
ENV ENV_BUILD=${ENV_BUILD}

# Copying source files
COPY . .

# Building app
EXPOSE 3000

# Running the app
CMD  npm run start:${ENV_BUILD}

# docker build --build-arg ENV_BUILD=sit -t tisco-api .