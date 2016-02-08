# Инструкции по установке, сборке и запуску приложения

ShineApp-3.0 is Node.js app using [Express 4](http://expressjs.com/) для мониторинга хеш-тэгов инстаграмм.

![ShineApp Screenshot](https://dl.dropboxusercontent.com/u/38317632/ShineApp%20screenshot-0.1.png)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/Ivajkin/ShineApp-3.0.git # or clone your own fork
$ cd ShineApp-3.0
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

