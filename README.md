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



GITHUB TWO ACCOUNT:
$ git remote add origin https://github.com/MirzaDSulistyo/empip-backend.git
$ git push -u origin master

remote: Repository not found.
fatal: repository 'https://github.com/MirzaDSulistyo/empip-backend.git/' not found

$ git remote set-url origin git@github.com:MirzaDSulistyo/empip-backend.git
$ git push -u origin master


Order is what users buy on the platform. Users can order package, product, service, class, voucher, asset, membership, plan.
Order will generate an invoice number and order number.

Membership is what users are signup for a plan or a memberships.