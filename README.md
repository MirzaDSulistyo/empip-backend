# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

To have launchd start postgresql now and restart at login:
  brew services start postgresql
Or, if you don't want/need a background service you can just run:
  pg_ctl -D /usr/local/var/postgres start

Run postgres
  psql postgres


npm run migration:generate ...
npm run migration:run

https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4

https://codeburst.io/typeorm-by-example-part-1-6d6da04f9f23

https://typeorm.io/#/select-query-builder


Kill Server

netstat:
sudo lsof -i tcp:3000

then:
kill -9 <PID>
