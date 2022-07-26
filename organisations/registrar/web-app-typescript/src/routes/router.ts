import express, { Request, Response } from 'express';
import * as landTitleController from '../controllers/landtitleController';


const ApiInitialise = (app:express.Application) => {
// api that receives json data
	app.post('/api/initialise', landTitleController.testingApiInitialise);
};

const indexPage = (app:express.Application) => {
// index age
	app.get('/index', (req: Request, res: Response) => { res.render('pages/index'); });
};

const aboutPage = (app:express.Application) => {
	// about page routing
	app.get('/about', (req: Request, res: Response) => { res.render('pages/about'); }  );
};

const landTitlePage = (app:express.Application) => {
	// renders the form to create new land title
	app.get('/registrar/landtitle/form', landTitleController.landTitleForm );
};

const responseToForm = (app:express.Application) => {
	// the response to a form submission
	app.post('/registrar/landtitleform/commit', landTitleController.commitLandtitle);
};

const landtitleJsonApi = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/data', landTitleController.testingApiNew);
};

const landtitleview = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/registrar/landtitle/view', landTitleController.viewlandTitle);
};
const formId = (app: express.Application) => {
	app.get('/registrar/landtitle/id', landTitleController.formToGetById);
};

const getById = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/id', landTitleController.getLandTitleById);
};

const transfer = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/transfer/id', landTitleController.finalTransfer);
};

//alternative for the web
const landtitlehistory = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/registrar/landtitle/history', landTitleController.viewlandTitleHistory);
};

//one to give query form for history
const formHistory = (app:express.Application) =>{
	app.get('/registrar/history/id', (req: Request, res: Response) => { res.render('pages/history');});
};

export {
	ApiInitialise,
	indexPage,
	aboutPage,
	landTitlePage,
	responseToForm,
	landtitleJsonApi,
	landtitleview,
	getById,
	formId,
	transfer,
	landtitlehistory,
	formHistory
};
