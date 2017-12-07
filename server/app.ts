import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

// Express server
const app: express.Application = express();
const DIST_FOLDER = join(process.cwd(), 'dist');

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/api/menu', menuRouter);
// app.use('/api/authen', authenRouter);

// Server static files from /browser
app.get('*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// This one add it with out ex from angular.io It same express gen. For debug some error. Then we add ./bin/www.ts
// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
