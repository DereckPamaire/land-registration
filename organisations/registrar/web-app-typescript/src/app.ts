import express from 'express';
import dotenv from 'dotenv';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import * as router from './routes/router';

dotenv.config();
const PORT = process.env.SERVER_PORT;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));
// setup Layout
app.use(expressEjsLayouts);
app.set('layout', 'layouts/layout');
// setting up the view engine
app.set('view engine', 'ejs');
// setting up the directory for the root path for views directory

app.set('views', path.join(__dirname, './views'));

app.use(express.json());

// the routers to variours resources as exported by the router.ts file
router.ApiInitialise(app);
router.indexPage(app);
router.examplePage(app);
router.aboutPage(app);
router.landTitlePage(app);
router.responseToForm(app);
router.landtitleJsonApi(app);
router.landtitleview(app);
router.getById(app);
router.formId(app);
router.transfer(app);

app.listen(PORT, () => { console.log('The app is listening on port  http://localhost:%d', PORT); });
// this is my server program
