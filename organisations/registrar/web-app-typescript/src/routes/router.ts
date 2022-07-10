import express, { Request, Response } from 'express';
import * as landTitleController from '../controllers/landtitleController';
import * as exampleController from '../controllers/exampleContoller';


const ApiInitialise = (app:express.Application) => {
// api that receives json data
	app.post('/api/initialise', landTitleController.testingApiInitialise);
};

const indexPage = (app:express.Application) => {
// index age
	app.get('/index', (req: Request, res: Response) => { res.render('pages/index'); });
};

const examplePage = (app:express.Application) => {
	// example page
	app.get('/eg', exampleController.eg);
};

const aboutPage = (app:express.Application) => {
	// about page routing
	app.get('/about', (req: Request, res: Response) => { res.render('pages/about'); }  );
};

const landTitlePage = (app:express.Application) => {
	// renders the form to create new land title
	app.get('/landtitleform', landTitleController.landTitleForm );
};

const responseToForm = (app:express.Application) => {
	// the response to a form submission
	app.post('/landtitleform/commit', landTitleController.commitLandtitle);
};

const landtitleJsonApi = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/data', landTitleController.testingApiNew);
};

const landtitleview = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/landtitle/view', landTitleController.viewlandTitle);
};
const formId = (app: express.Application) => {
	app.get('/landtitle/id', landTitleController.formToGetById);
};

const getById = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/id', landTitleController.getLandTitleById);
};

const transfer = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/transfer/id', landTitleController.finalTransfer);
};

export {
	ApiInitialise,
	indexPage,
	examplePage,
	aboutPage,
	landTitlePage,
	responseToForm,
	landtitleJsonApi,
	landtitleview,
	getById,
	formId,
	transfer
};
