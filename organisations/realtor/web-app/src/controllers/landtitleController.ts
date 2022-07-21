import { Request, Response } from 'express';
import { connectToGetLanTitleById } from '../fabricNetworkServices/GetLandTitleById';
import { connectSetTradingStatus } from '../fabricNetworkServices/SetTradingStatus';
import {connectToSetNewOwner} from '../fabricNetworkServices/setTransferTo';
import { connectToGetLandTitleHistory } from '../fabricNetworkServices/getHistory';

// handle form response
const viewlandTitle = async (req: Request, res: Response) => {
	
	const id = req.body.id;
	const responseObj = await connectToGetLanTitleById(id); 
	console.log(responseObj);
	if (responseObj == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		res.render('pages/landtitleview',{responseObj});
	}
};
// similar to above but sort os an api
const getLandTitleById = async (req: Request, res: Response) => {
	// getting the land title by ID and rendering it to the land title view
	const id = req.body.id; 
	const responseObj = await connectToGetLanTitleById(id); 
	console.log('result arrived');
	console.log(responseObj);
	const responseJson = JSON.stringify(responseObj);
	//res.render('pages/landtitleview');
	return res.send(responseJson);
};

// getting an id and setting trading status
const settingTradingStatus = async (req: Request, res: Response) => {
	const id = req.body.id;
	const result = await connectSetTradingStatus(id);
	res.send(result);
};
//getting  new owner, id and land title id then setting transfer to fields
const settingNewOwner = async (req: Request, res: Response) => {
	const newOwnerName = req.body.name;
	const newOwnerId = req.body.id;
	const landTitleId = req.body.landTitleId;
	const email = req.body.email;

	const result = await connectToSetNewOwner(newOwnerName, newOwnerId, email, landTitleId);
	res.send(result);
};


const formToGetById = async (req: Request, res: Response) => {
	res.render('pages/landtitlebyid');
};

const viewlandTitleHistory = async (req: Request, res: Response) => {
	// in this instance i'm passing json from file
	const id = req.body.id;
	const result = await connectToGetLandTitleHistory(id); 
	if (result == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		let results= [];
		results = [...result];
		res.render('pages/historyview',{results});
	}
};

export {
	viewlandTitle,
	getLandTitleById,
	settingTradingStatus,
	formToGetById,
	settingNewOwner,
	viewlandTitleHistory
};
