import express, { Request, Response } from 'express';
import * as landTitleController from '../controllers/landtitleController';
import * as exampleController from '../controllers/exampleContoller';


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
	app.get('/landtitle/view', landTitleController.viewlandTitle);
};

const getById = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/id', landTitleController.getLandTitleById);
};
const setStatusToTrading = async (app:express.Application) =>{
	app.post('/api/landtitle/trading', landTitleController.settingTradingStatus);
}

const formId = (app: express.Application) => {
	app.get('/landtitle/id', landTitleController.formToGetById);
};

const newOwnershipDetails = (app: express.Application) => {
	app.post('/api/landtitle/newdetails', landTitleController.settingNewOwner);
}

export {
	indexPage,
	aboutPage,
	landtitleview,
	getById,
	setStatusToTrading,
	formId,
	newOwnershipDetails
};
