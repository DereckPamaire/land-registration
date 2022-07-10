import { Request, Response } from 'express';
import { connectToGetLandTitleById } from '../fabricNetworkServices/GetLandTitleById';
import { connectToGetLandTitleHistory } from '../fabricNetworkServices/getHistory';

// handle form response
const viewlandTitle = async (req: Request, res: Response) => {
	// in this instance i'm passing json from file
	const id = req.body.id
	const responseObj = await connectToGetLandTitleById(id); 
	console.log(responseObj);
	if (responseObj == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		res.render('pages/landtitleview',{responseObj});
	}
};
const viewlandTitleHistoryApi = async (req: Request, res: Response) => {
	// in this instance i'm passing json from file
	const id = req.body.id
	const responseObj = await connectToGetLandTitleHistory(id); 
	/*console.log(responseObj);
	if (responseObj == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		res.render('pages/landtitlehistory',{responseObj});
	}*/
	res.send(responseObj);
};

const viewlandTitleHistory = async (req: Request, res: Response) => {
	// in this instance i'm passing json from file
	const id = req.body.id
	const result = await connectToGetLandTitleHistory(id); 
	if (result == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		let results = new Array();
		results = [...result]
		res.render('pages/historyview',{results});
	}
};

export {
	viewlandTitle,
	viewlandTitleHistoryApi,
	viewlandTitleHistory
};
