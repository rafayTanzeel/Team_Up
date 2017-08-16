## Team Up

### Installation

Install [Node Package Manager (NPM)] and [Node.js] to run.

To check if you have Node.js installed correctly, run this command in your terminal:
```sh
$ node -v
```

To confirm that you have npm installed you can run this command in your terminal:
```sh
$ npm -v
```

To install most of the dependencies we will make use of [Yarn] package manager. [Yarn] is a super set of [Node Package Manager (NPM)], which install dependencies in parallel, secure and reliable manner.

Install [Yarn] globally by using the following command:

```sh
$ npm install --global yarn
```

Install [Node.js] dependencies and devDependencies.

```sh
$ yarn
```

Install [Bower] globally by using the following command:

```sh
$ npm install --global bower
```

Install [Bower] dependencies.

```sh
$ bower install
```

Install [MongoDB] in your OS and run the MongoDB Daemon from terminal:

```sh
$ mongod
```

### Server
Start the Server

Here are multiple ways to run the server
```sh
$ npm start -s (Recommended Clean Output And Default Port 8080)
$ npm start (Default Port 8080)
$ node ./bin/www -p 8080 (Pick Any Available Port No)
$ ./start.bat [git bash, windows only]
```

### Pug Globals

**You can now use these global values in your pug files.**
* isAuth
* userData.name
* userData.email
* userData.image
* userData.firstname
* userData.lastname
* userData.facebookId
* userData.twitterId
* userData.googleId
* userData.userID

> Caution : Some of these may be null or undefined, so check before use



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


[//]: # (Reference links used in the doc)

[Node Package Manager (NPM)]: <https://www.npmjs.com/>
[Node.js]: <https://nodejs.org/>
[Yarn]: <https://yarnpkg.com/>
[Bower]: <https://bower.io/>
[MongoDB]: <https://www.mongodb.com/>
