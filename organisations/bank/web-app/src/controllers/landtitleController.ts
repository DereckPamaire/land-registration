import { Request, Response } from 'express';
import { connectToGetLanTitleById } from '../fabricNetworkServices/GetLandTitleById';

// handle form response
const viewlandTitle = async (req: Request, res: Response) => {
	// in this instance i'm passing json from file
	const id = req.body.id
	const responseObj = await connectToGetLanTitleById(id); 
	console.log(responseObj);
	if (responseObj == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		res.render('pages/landtitleview',{responseObj});
	}
};

const getByIdApi = async (req: Request, res: Response) => {
	// getting the land title by id and sending json
	const id = req.body.id; 
	const responseObj = await connectToGetLanTitleById(id); 
	console.log('result arrived');
	console.log(responseObj);
	const responseJson = JSON.stringify(responseObj);
	//res.render('pages/landtitleview'); 
	return res.send(responseJson);
};
const formToGetById = async (req: Request, res: Response) => {
	res.render('pages/landtitlebyid');
};
export {
	viewlandTitle,
	getByIdApi,
	formToGetById
};
