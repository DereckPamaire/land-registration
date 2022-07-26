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
	app.get('/realtor/landtitle/view', landTitleController.viewlandTitle);
};

const getById = (app:express.Application) => {
	// api that receives json data
	app.post('/api/landtitle/id', landTitleController.getLandTitleById);
};

// api for testing
const setStatusToTradingApi = async (app:express.Application) =>{
	app.post('/api/landtitle/trading', landTitleController.settingTradingStatus);
};

const setStatusToTrading = async (app:express.Application) =>{
	app.post('/realtor/landtitle/trading', landTitleController.settingTradingStatus);
};

const formId = (app: express.Application) => {
	app.get('/realtor/landtitle/form', (req: Request, res: Response) => res.render('pages/landtitlebyid'));
};

// api for testing
const newOwnershipDetailsApi = (app: express.Application) => {
	app.post('/api/landtitle/newdetails', landTitleController.settingNewOwner);
};

const newOwnershipDetails = (app: express.Application) => {
	app.post('/realtor/landtitle/newdetails', landTitleController.settingNewOwner);
};

//one to give query form for history
const formHistory = (app:express.Application) =>{
	app.get('/realtor/history/id', (req: Request, res: Response) => { res.render('pages/history');});
};

//alternative for the web
const landtitlehistory = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/realtor/landtitle/history', landTitleController.viewlandTitleHistory);
};

const formTrading = (app:express.Application) =>{
	app.get('/realtor/trading/form', (req: Request, res: Response) => { res.render('pages/tradingstatus');});
};
const formNewDetails = (app:express.Application) =>{
	app.get('/realtor/newdetails/form', (req: Request, res: Response) => { res.render('pages/newownership');});
};
export {
	indexPage,
	aboutPage,
	landtitleview,
	getById,
	setStatusToTrading,
	formId,
	newOwnershipDetails,
	formHistory,
	landtitlehistory,
	formTrading,
	formNewDetails
};
