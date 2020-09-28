/// <reference path="all.d.ts" />

'use strict';

import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser"
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";

import * as Index from "./IndexController"
import * as Users from "./UserController"

/**
 * Wrapper on an express application.
 */
class Server {

  // The express application we'll run on the node server.
  app: express.Application;

  // Creates a new instance to pass to the node server.
  static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();
    this.configure();
    // NOTE: Must call out the routes first so they get tried before the error
    // handlers.
    this.configureRoutes();
    this.configureErrors();
  }

  /**
   * General setup.
   */
  configure() {

    // View engine setup.  Using Jade.
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'pug');

    // Uncomment after placing your favicon in /public.
    //this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../static')));
  }

  /**
   * Route setup.
   */
  configureRoutes() {
    let router = express.Router();

    var indexContoller = new Index.IndexController();
    router.get('/', indexContoller.getIndex.bind(indexContoller));

    var indexContoller = new Index.IndexController();
    router.get('/index', indexContoller.getIndex.bind(indexContoller));

    var usersRoute = new Users.UsersController();
    router.get('/users', usersRoute.getUsers.bind(usersRoute));

    this.app.use(router);
  }

  /**
   * Error routing setup.
   */
  configureErrors() {
    // NOTE: Order of the app.use statements matters.
    
    // If we are here, it's a 404. Catch 404 and forward to error handler
    this.app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err['status'] = 404;
      next(err);
    });

    // Error handlers. Either called from the 404 handler above or an
    // internal server error.

    // Development error handler. This will print a stacktrace.
    if (this.app.get('env') === 'development') {
      console.log('Using development error handler.');
      this.app.use(function(err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
          message: res.statusCode + '  ' + err.message,
          error: err
        });
      });
    }

    // Production error handler. No stacktraces leaked to user.
    this.app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
  }
}

// This is where the magic happens to get everything running.
// ./bin/www picks up on the export as 'app'
var server : Server = Server.bootstrap();
export = server.app;