import express, { Request, Response } from 'express';
import * as landTitleController from '../controllers/landtitleController'

// one to view
const landtitleview = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/publicaccess/landtitle/view', landTitleController.viewlandTitle);
};
//one to give query form
const formId = (app: express.Application) => {
	app.get('/publicaccess/landtitle/id',(req: Request, res: Response)=>{	res.render('pages/landtitlebyid');})
}

const indexPage = (app:express.Application) => {
	// index age
		app.get('/index', (req: Request, res: Response) => { res.render('pages/index'); });
	};
	
	
const aboutPage = (app:express.Application) => {
		// about page routing
		app.get('/about', (req: Request, res: Response) => { res.render('pages/about'); });
};
//one to give query form for history
const formHistory = (app:express.Application) =>{
	app.get('/publicaccess/history/id', (req: Request, res: Response) => { res.render('pages/history') });
};

// responding to id and rendering history
const landtitlehistoryApi = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/api/publicaccess/landtitle/history', landTitleController.viewlandTitleHistoryApi);
};
//alternative for the web
const landtitlehistory = (app:express.Application) => {
	// gets an id, query the ledger and render a view
	app.post('/publicaccess/landtitle/history', landTitleController.viewlandTitleHistory);
};

export {
	landtitleview,
	formId,
	indexPage,
	aboutPage,
	formHistory,
	landtitlehistoryApi,
	landtitlehistory
}