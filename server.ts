import express from 'express';
import morgan from 'morgan';
import path from 'path';
import indexRoutes from './routes';
import datosRoutes from './routes/datos';
class Applicaction {
    app: express.Application;

    constructor() {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    
    middlewares() {
      this.app.use(morgan('dev'));
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(express.json());
    } 

    settings() {

        // View engine setup.  Using Jade.
        this.app.set('port', 4000);
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'pug'); 
        this.app.use(express.static(path.join(__dirname, '../static')));
           
     
   }   

    routes() {
        this.app.use('/', indexRoutes);
        this.app.use('/tasks', datosRoutes);

        this.app.use(express.static(path.join(__dirname, 'public')));
     }   

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('>>> Server is running at', this.app.get('port'));
        });
    }
}
export default Applicaction; 