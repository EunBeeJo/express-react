import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY
import mongoose from 'mongoose'; // mongodb 데이터 모델링 툴: mongodb data > js obj
import session from 'express-session';
import api from './routes'; // setup routers & static dir

const app = express();
const port = 3000;
const devPort = 4000;

/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log('Connected to mongodb server');});
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb://localhost/codelab');

/* use session */
app.use(session({
  secret: 'CodeLab1$234',
  resave: false,
  saveUninitialized: true
}));

/* handle error */
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Somthing borke!');
});

app.use('/', express.static(path.join(__dirname, './frontend/public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api', api);

app.get('/hello', (res, req) => {
  return res.send('Hello CodeLab');
});

app.listen(port, () => {
  console.log("Express is linstening on port", port);
});


if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  const config = require('../webpack-dev-config');
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(
    devPort, () => {
      console.log('webpack-dev-server is listening on port', devPort);
    }
  )
}
