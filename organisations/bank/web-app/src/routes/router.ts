import express, { Request, Response } from 'express';
import * as landTitleController from '../controllers/landtitleController';

const indexPage = (app:express.Application) => {
// index age
	app.get('/index', (req: Request, res: Response) => { res.render('pages/index'); });
};


const aboutPage = (app:express.Application) => {
	// about page routing
	app.get('/about', (req: Request, res: Response) => { res.render('pages/about'); } );
};


const landtitleview = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/bank/landtitle/view', landTitleController.viewlandTitle);
};

const getById = (app:express.Application) => {
	// api that receives json data
	app.post('/bank/api/landtitle/id', landTitleController.getByIdApi);
};

const formId = (app: express.Application) => {
	app.get('/bank/landtitle/id', landTitleController.formToGetById);
};

export {
	indexPage,
	aboutPage,
	landtitleview,
	getById,
	formId
};
