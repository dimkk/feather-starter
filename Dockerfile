FROM node:9
VOLUME /var/app/db

COPY . /var/app
WORKDIR /var/app

RUN npm i
EXPOSE 3030
ENTRYPOINT [ "node", "app" ]