import { Request, Response } from 'express';
import { connectToCreateLandTitle } from '../fabricNetworkServices/createNewLandTitle';
import { connectToInitialise } from '../fabricNetworkServices/initializeBlockChain';
import { connectToGetLanTitleById } from '../fabricNetworkServices/GetLandTitleById';
import { LandTitleModel } from '../models/landtitlemodel';
import { connectToTransferLandTitle } from '../fabricNetworkServices/transferLandTitle';
import { connectToGetLandTitleHistory } from '../fabricNetworkServices/getHistory';
// working
const landTitleForm = (req: Request, res: Response) => {
	res.render('pages/landtitleform');
};
// handle form response
// this will recieve a Land Title form Registrar users and then commit a new land title on blockchain
const commitLandtitle = async (req: Request, res: Response) => {
	console.log(req.body);
	let landDataClear = new LandTitleModel();
	landDataClear = {
		appraisedValue: req.body.appraisedValue,
		district: req.body.district,
		landTitleId: req.body.landTitleId,
		province: req.body.province,
		landUse: req.body.landUse,
		owner: req.body.owner,
		ownerIdNumber: req.body.ownerIdNumber,
		sizeInSquareMetres: req.body.sizeInSquareMetres,
		town: req.body.town,
		ownerEmail: req.body.email,
		hashOfIpfsDocs: req.body.hash

	};
	const response = await connectToCreateLandTitle(landDataClear);
	const responseObj = JSON.parse(response);
	return res.render('pages/formresponse', {responseObj});

};
// working
const viewlandTitle = async (req: Request, res: Response) => { 

	const id = req.body.id; 
	const responseObj = await connectToGetLanTitleById(id); 
	if (responseObj == undefined|| null){
		const result = `The Land Title with ${id} does not exist`;
		res.render('pages/doesnotexist',{result});
	} else{
		res.render('pages/landtitleview',{responseObj});
	}
};
// working
const formToGetById = async (req: Request, res: Response) => {
	res.render('pages/landtitlebyid');
};
// working
const testingApiInitialise = (req: Request, res: Response) => {
	connectToInitialise();
	return res.sendStatus(200);
};
// working
const testingApiNew = async (req: Request, res: Response) => {
	console.log(req.body);
	const landData = req.body as LandTitleModel;
	console.log(landData);
	let landDataClear = new LandTitleModel();
	landDataClear = {
		appraisedValue: landData.appraisedValue,
		district: landData.district,
		landTitleId: landData.landTitleId,
		province: landData.province,
		landUse: landData.landUse,
		owner: landData.owner,
		ownerIdNumber: landData.ownerIdNumber,
		sizeInSquareMetres: landData.sizeInSquareMetres,
		town: landData.town,
		ownerEmail: landData.ownerEmail,
		hashOfIpfsDocs: landData.hashOfIpfsDocs

	};
	const result = await connectToCreateLandTitle(landDataClear);
	
	return res.send(result);
};
// woking
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

//getting  new owner, id and land title id then setting transfer to fields
const finalTransfer = async (req: Request, res: Response) => {
	const landTitleId = req.body.landTitleId;

	const result = await connectToTransferLandTitle( landTitleId );
	res.send(result);
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
	landTitleForm,
	commitLandtitle,
	viewlandTitle,
	testingApiInitialise,
	testingApiNew,
	getLandTitleById,
	formToGetById,
	finalTransfer,
	viewlandTitleHistory
};
