import express from 'express';
import dotenv from 'dotenv';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import * as router from './routes/router';

dotenv.config();
const PORT = process.env.SERVER_PORT;

const app = express();

// setup Layout
app.use(expressEjsLayouts);
app.set('layout', 'layouts/layout');
// setting up the view engine
app.set('view engine', 'ejs');
// setting up the directory for the root path for views directory

app.set('views', path.join(__dirname, './views'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// the routers to variours resources as exported by the router.ts file
router.aboutPage(app);
router.landtitleview(app);
router.formId(app);
router.indexPage(app);
router.getByIdApi(app);
router.formHistory(app);
router.landtitlehistory(app); 


app.listen(PORT, () => { console.log('The app is listening on port  http://localhost:%d', PORT); });
// this is my server program