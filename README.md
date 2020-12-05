# Towers Rest APIs

## Project setup

Install npm to add necessary packages for the application.

```
npm install
```
## Sequelize

Install Sequelize Cli to do the migration and seeding of database.

```
$ npm install sequelize-cli -g
```
This will allow us to use the `sequelize`  command line tool that helps to create and manage sequelize files.


## Configuring  database 
   
  Setup database for the project
  
## Database settings

Edit development settings in `config/config.json` to point t database.

**Database Configuration file `config/config.json`**

```
{
  "development": {
    "username": <username>,
    "password": null,
    "database": "test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  ...
}
```
## Mirgrate Database 
```
sequelize db:migrate
```

## Seed Database 
```
sequelize db:seed:all
```

# Redis Setup

Setup redius server and Edit Redis configuration in  `config/app.config.js` to connect to redis.

**Redis Configuration file `config/app.config.js`**

```
{
   REDIS_HOST: "<host server>",
   REDIS_PORT: <port>,
}
```
## Start the server:

```
$ npm start
```
After the server starts, it will be working at port `5000` in development environment!

## API Documentation

**LIST TOWERS - METHOD (GET) `http://localhost:5000/api/towers/`**

Different query parameters accpeted by the List Api:
  - PAGINATE  `size=<value>` and `page=<value>` Eg: `?size=5&page=0`
  - FILTER  `<fields>=<value>` Eg: `&name=Business`
  - SORT   `orderby=<filed> and sort=<type>`  Eg: `orderby=name&sort=asc`

Can use any fied from the tower for filter

LIST Sample APIS endpoints
```
- localhost:5000/api/towers?size=2&page=0
- localhost:5000/api/towers?size=5&page=0&name=Business
- localhost:5000/api/towers?size=5&page=0&orderby=name&sort=asc
```
**FETCH TOWERS - METHOD (GET) `http://localhost:5000/api/towers/:id`**

**REGISTER USER - METHOD (POST) `localhost:5000/api/users/register/`**

REQUEST BODY
```
{
    "first_name":"<value>",
    "last_name":"<value>",
    "user_name":"<value>",
    "password":"<value>"
}
```
**LOGIN USER - METHOD (GET) `http://localhost:5000/api/users/login/`**

REQUEST BODY
```
{
    "user_name":"admin",
    "password":"admin"
}
```
OUTPUT
```
{
    "msg": "sucess",
    "token": "<TOKEN>"
}
```

**UPDATE TOWER - METHOD (PUT) `localhost:5000/api/towers/:id`**

REQUEST BODY
```
{
    "<field>":"<update value>",
    "<field>":"<update value>"
}
```
HEADER  `Authorization  / Bearer <TOKEN>`

**ADD TOWER - METHOD (POST) `localhost:5000/api/towers/`**

INPUT BODY
```
{
    "name":"<value>",
    "location":"<value>",
    "number_of_floors":"<value>",
    "number_of_offices":"<value>",
    "rating":"<value>",
    "latitude":"<value>",
    "longitude":"<value>"

}
```
HEADER  `Authorization  / Bearer <TOKEN>`

**DELETE TOWER - METHOD (DELETE) `localhost:5000/api/towers/:id`**

HEADER  `Authorization  / Bearer <TOKEN>`


**SEARCH TOWERS - METHOD (GET) `http://localhost:5000/api/towers/search`**

Different query parameters accpeted for search Api:
  - Search  `<fields>=<value>` Eg: `&name=Business`

Can use any fied from the tower for search

LIST Sample APIS endpoints
```
- localhost:5000/api/towers/search?name=Business
- localhost:5000/api/towers/search?name=Business&location=dubai
```
