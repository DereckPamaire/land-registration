/* eslint-disable no-mixed-spaces-and-tabs */

import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'fast-json-stable-stringify';
import sortKeysRecursive from 'sort-keys-recursive';
import {LandTitle} from './landtitle';


@Info({title: 'LandTitle', description: 'Smart contract for trading and creating Land Titles'})
export class LandTitleContract extends Contract {
	constructor(){
		super('LandTitleContract');
 	}

    @Transaction(true)
	public async InitLedger(ctx: Context): Promise<void> {
		const landTitles: LandTitle[] = [
			{
				landTitleId: 'landTitle01',
				landUse: 'farming',
				tradingStatus: 'onSell',
				district: 'Bikita',
				owner: 'Machacha Nelson',
				ownerIdNumber: '04-765895-G-04',
				province: 'Masvingo',
				appraisedValue: 'USD 23 000',
				sizeInSquareMetres: '2 Hacters',
				town: 'null',
				transferToName: 'Wellington Musakwa',
				transferToID: '23-465789-U-67',
				dateOfTitleIssue: ctx.stub.getDateTimestamp().toUTCString(),
				docType: 'landtitle',
				txId: ctx.stub.getTxID(),
				identityOfCreator: ctx.clientIdentity.getID(),
				dateOfEditing: ctx.stub.getDateTimestamp().toUTCString(),
				hashOfIpfsDocs: 'hhjsgkskhgjhijjiertjdbvmdfnsgh',
				ownerEmail: 'owner1@exmple.com',
				transferToEmail: 'null'
			},
			{
				landTitleId: 'landTitle02',
				landUse: 'farming',
				tradingStatus: 'onSell',
				district: 'Gutu',
				owner: 'Wezana  Thomas',
				ownerIdNumber: '27-756389-T-27',
				province: 'Masvingo',
				appraisedValue: 'USD 45 000',
				sizeInSquareMetres: '4.5 Hacters',
				town: 'null',
				transferToName: 'null',
				transferToID: 'null',
				dateOfTitleIssue: ctx.stub.getDateTimestamp().toUTCString(),
				docType: 'landtitle',
				txId: ctx.stub.getTxID(),
				identityOfCreator: ctx.clientIdentity.getID(),
				dateOfEditing: ctx.stub.getDateTimestamp().toUTCString(),
				hashOfIpfsDocs: 'hhjsgkskhgjhikdfjdfjhtjdbvmdfnsgh',
				ownerEmail: 'owner2@exmple.com',
				transferToEmail: 'null'
			},

		];
		for (const landTitle of landTitles) {
			// example of how to write to world state deterministically
			// use convetion of alphabetic order
			// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
			// when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
			await ctx.stub.putState(landTitle.landTitleId, Buffer.from(stringify(sortKeysRecursive(landTitle))));
			ctx.stub.setEvent('Initialised', Buffer.from(stringify(sortKeysRecursive(landTitle))));
			console.log(`Land Title ${landTitle.landTitleId} initialized`);
		}
	}
	// CreatelandTitle issues a new landTitle to the world state with given details.
	@Transaction(true)
	@Returns('string')
    public async CreateNewLandTitle(
    	ctx: Context,
    	district: string, 
    	landTitleId: string,
    	owner: string,
    	ownerIdNumber: string,
    	province: string,
    	town: string,
    	landUse: string,
    	appraisedValue: string,
    	sizeInSquareMetres: string,
    	hashOfIpfsDocs: string,
    	ownerEmail: string
    ): Promise<string> {
    	// make sure the creation of of new new land titles is handled only by Registrar Department staff
    	if('RegistrarMSP'!= ctx.clientIdentity.getMSPID()){
    		console.error('The organisation you are part of is not allowed to create new land titles contact Registrar');
    		return 'The organisation you are part of is not allowed to create new land titles contact Registrar';
    	}
    	// check if land title exists alread in the Data Base
    	const exists = await this.LandTitleExists(ctx, landTitleId);

    	if (exists) {
    		console.error(`The land title ${landTitleId} already exists`);
    		return `The land title ${landTitleId} already exists`;
    	}
    	let newLandTitle = new LandTitle();
	
    	newLandTitle = {
    		landTitleId: landTitleId,
    		landUse: landUse,
    		tradingStatus: 'null',
    		district: district,
    		owner: owner,
    		ownerIdNumber: ownerIdNumber,
    		province: province,
    		appraisedValue: appraisedValue,
    		sizeInSquareMetres: sizeInSquareMetres,
    		town: town,
    		transferToName: 'null',
    		transferToID: 'null',
    		dateOfTitleIssue: ctx.stub.getDateTimestamp().toUTCString(),
    		docType: 'land title',
    		txId: ctx.stub.getTxID(),
    		identityOfCreator: ctx.clientIdentity.getID(),
    		dateOfEditing: ctx.stub.getDateTimestamp().toUTCString(),
    		ownerEmail: ownerEmail,
    		hashOfIpfsDocs: hashOfIpfsDocs,
    		transferToEmail: 'null'
    	};
    	// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    	await ctx.stub.putState(newLandTitle.landTitleId, Buffer.from(stringify(sortKeysRecursive(newLandTitle))));
    	ctx.stub.setEvent('Initialised', Buffer.from(stringify(sortKeysRecursive(newLandTitle))));

    	const result = {
    		email: newLandTitle.ownerEmail,
    		message: `Transaction with land title id ${newLandTitle.landTitleId} committed successfully \n Congrats Mr/Mrs ${newLandTitle.owner}`
    	};

    	return stringify(result);
    }

	// TransferlandTitle updates the owner field of landTitle with given id in the world state, and returns the old owner.
	@Transaction(true)
	@Returns('string')
	public async TransferLandTitle(ctx: Context, landTitleId: string): Promise<string> {
		if('RegistrarMSP'!= ctx.clientIdentity.getMSPID()){
    		console.error('The organisation you are part of is not allowed to transfer land titles contact Registrar');
    		return 'The organisation you are part of is not allowed to transfer land titles contact Registrar';
    	}

		const landTitleString = await 	this.ReadLandTitle(ctx, landTitleId);
		const landTitle = JSON.parse(landTitleString) as LandTitle;

		if (landTitle.tradingStatus !== 'onSell')  // check if property is on sell
			return `The land title with ${landTitle.landTitleId}is not on sell`;

		if (landTitle.transferToName == 'null' && landTitle.transferToID == 'null' && landTitle.transferToEmail == 'null')
			return `The is no enough details of New Owner Designate for ${landTitle.landTitleId}`;

		const oldOwner = landTitle.owner;
		const oldEmail = landTitle.ownerEmail;
		
		landTitle.owner = landTitle.transferToName;
		landTitle.transferToName = 'null';

		landTitle.ownerIdNumber = landTitle.transferToID;
		landTitle.transferToID = 'null';

		landTitle.ownerEmail = landTitle.transferToEmail;
		landTitle.transferToEmail = 'null'; 

		landTitle.dateOfTitleIssue = ctx.stub.getDateTimestamp().toUTCString();
		landTitle.txId = ctx.stub.getTxID();
		landTitle.identityOfCreator = ctx.clientIdentity.getID();

		landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();


		landTitle.tradingStatus = 'owned'; // once transfered it's owned
		// we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
		await ctx.stub.putState(landTitleId, Buffer.from(stringify(sortKeysRecursive(landTitle))));

		const result = {
    		email: oldEmail,
    		message: `The land title ${landTitle.landTitleId} has  been transfered to your buyer\n Congrats Mr/Mrs ${oldOwner}`
    	};

		return stringify(result);
	}
	// transaction to set trading status
	@Transaction(true)
	@Returns('string')
	public async setTradingStatus(ctx: Context, landTitleId: string): Promise<unknown> {
		//check who is editing the land title
		if ('RealtorMSP'!= ctx.clientIdentity.getMSPID())
		{
			console.error('Only a Realtor use can change the Trading Status');
			return 'Only a Realtor use can change the Trading Status';
		}
		// check if land titlte exists
		const exists = await this.LandTitleExists(ctx, landTitleId);
		if (!exists) {
    		console.error(`The land title ${landTitleId} doesn't exists`);
			return  `The land title ${landTitleId} doesn't exists`;
    	}
		// get land title to edit
		const landTitleString = await 	this.ReadLandTitle(ctx, landTitleId);
		const landTitle = JSON.parse(landTitleString) as LandTitle;
		landTitle.tradingStatus = 'onSell';
		landTitle.txId = ctx.stub.getTxID();
		landTitle.identityOfCreator = ctx.clientIdentity.getID();

		landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();

		await ctx.stub.putState(landTitle.landTitleId, Buffer.from(stringify(sortKeysRecursive(landTitle))));

		const result = {
			email: landTitle.ownerEmail,
			message: `Trading Status for ${landTitle.landTitleId} is now on sell`
		};


		return stringify(result);
	}

	// transaction to set transferto
	@Transaction(true)
	@Returns('string')
	public async setTransferTo(ctx: Context, newOwner: string, newOwnerId: string, newOwnerEmail: string, landTitleId: string): Promise<string>{
		// checking who is doing
		if('RealtorMSP' != ctx.clientIdentity.getMSPID()){
			console.error('Only a Realtor can set the new owner designate');
			return 'Only a Realtor can set the new owner designate';
		}
		// check if land title exists
		const exists = await this.LandTitleExists(ctx, landTitleId);
		if (!exists) {
			console.error(`The land title ${landTitleId} doesn't exists`);
			return  `The land title ${landTitleId} doesn't exists`;
		}
		// get land title to edit
		const landTitleString = await 	this.ReadLandTitle(ctx, landTitleId);
		const landTitle = JSON.parse(landTitleString) as LandTitle;

		if('null'== landTitle.tradingStatus){
			console.error(`The land title with Land Title Id ${landTitle.landTitleId} is not on sell`);
			return stringify({massage: `The land title with Land Title Id ${landTitle.landTitleId} is not on sell`});
		}

		landTitle.transferToName = newOwner;
		landTitle.transferToID = newOwnerId;
		landTitle.transferToEmail = newOwnerEmail;

		landTitle.txId = ctx.stub.getTxID();
		landTitle.identityOfCreator = ctx.clientIdentity.getID();

		landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();

		await ctx.stub.putState(landTitle.landTitleId, Buffer.from(stringify(sortKeysRecursive(landTitle))));

		const result = {
			name: landTitle.owner,
			email: landTitle.ownerEmail,
			message: `The land title ${landTitle.landTitleId} is to be transfer check your land title on Public Access`
		};

		return stringify(result);
	} 
	// geting history of a key
	@Transaction(false)
	@Returns('string')
	public async GetLandTitleHistory(ctx: Context, landTitleId: string): Promise<string>{
		const allResults = [];
		const iterator = await ctx.stub.getHistoryForKey(landTitleId);
		let result = await iterator.next();
		while (!result.done) {
			const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
			let record;
			try {
				record = JSON.parse(strValue);
			} catch (err) {
				console.log(err);
				record = strValue;
			}
			allResults.push(record);
			result = await iterator.next();
		}
		return JSON.stringify(allResults);
	}

	// change ipfs doc string
	@Transaction(true)
	@Returns('string')
	public async ChangeIpfsDocString(ctx: Context, landTitleId: string, ipfsString: string): Promise<string>{
		//check who is editing the land title
		if ('RegistrarMSP'!= ctx.clientIdentity.getMSPID())
		{
			console.error('Only a Registrar use can change the documents related to this land title');
			return 'Only a Registrar use can change the documents related to this land title';
		}
		// check if land titlte exists
		const exists = await this.LandTitleExists(ctx, landTitleId);
		if (!exists) {
			console.error(`The land title ${landTitleId} doesn't exists`);
			return  `The land title ${landTitleId} doesn't exists`;
		}
		// get land title to edit
		const landTitleString = await 	this.ReadLandTitle(ctx, landTitleId);
		const landTitle = JSON.parse(landTitleString) as LandTitle;

		landTitle.hashOfIpfsDocs = ipfsString;
		landTitle.txId = ctx.stub.getTxID();
		landTitle.identityOfCreator = ctx.clientIdentity.getID();

		landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();
		await ctx.stub.putState(landTitle.landTitleId, Buffer.from(stringify(sortKeysRecursive(landTitle))));

		const result = {
			name: landTitle.owner,
			email: landTitle.ownerEmail,
			docHash: landTitle.hashOfIpfsDocs,
			message: `The documents related to ${landTitle.landTitleId} have been changed`
		};

		return stringify(result) ;
	}	
	// LandTitleExists returns true when landTitle with given ID exists in world state.
	@Transaction(false)
	@Returns('boolean')
	private async LandTitleExists(ctx: Context, landTitleId: string): Promise<boolean> {
		const landTitleJSON = await ctx.stub.getState(landTitleId);
		return landTitleJSON && landTitleJSON.length > 0;
	}
	// ReadLandTitle returns the landTitle stored in the world state with given id.
	@Transaction(false)
	@Returns('string')
	public async ReadLandTitle(ctx: Context, landTitleID: string): Promise<string> {
		const landTitleJSON = await ctx.stub.getState(landTitleID); // get the landTitle from chaincode state
		if (!landTitleJSON || landTitleJSON.length === 0) {
			console.error(`The land title ${landTitleID} does not exist`);
			return `The land title ${landTitleID} does not exist`;
		}
		return landTitleJSON.toString();
	}
}
