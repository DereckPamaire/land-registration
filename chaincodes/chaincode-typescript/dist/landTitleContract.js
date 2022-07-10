"use strict";
/* eslint-disable no-mixed-spaces-and-tabs */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandTitleContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
const landtitle_1 = require("./landtitle");
let LandTitleContract = class LandTitleContract extends fabric_contract_api_1.Contract {
    constructor() {
        super('LandTitleContract');
    }
    async InitLedger(ctx) {
        const landTitles = [
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
                dateOfEditing: ctx.stub.getDateTimestamp().toUTCString()
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
                dateOfEditing: ctx.stub.getDateTimestamp().toUTCString()
            },
        ];
        for (const landTitle of landTitles) {
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(landTitle.landTitleId, Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(landTitle))));
            ctx.stub.setEvent('Initialised', Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(landTitle))));
            console.log(`Land Title ${landTitle.landTitleId} initialized`);
        }
    }
    // CreatelandTitle issues a new landTitle to the world state with given details.
    async CreateNewLandTitle(ctx, district, landTitleId, owner, ownerIdNumber, province, town, landUse, appraisedValue, sizeInSquareMetres) {
        // make sure the creation of of new new land titles is handled only by Registrar Department staff
        if ('RegistrarMSP' != ctx.clientIdentity.getMSPID()) {
            console.error('The organisation you are part of is not allowed to create new land titles contact Registrar');
            return 'The organisation you are part of is not allowed to create new land titles contact Registrar';
        }
        // check if land title exists alread in the Data Base
        const exists = await this.LandTitleExists(ctx, landTitleId);
        if (exists) {
            console.error(`The land title ${landTitleId} already exists`);
            return `The land title ${landTitleId} already exists`;
        }
        let newLandTitle = new landtitle_1.LandTitle();
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
            dateOfEditing: ctx.stub.getDateTimestamp().toUTCString()
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(newLandTitle.landTitleId, Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(newLandTitle))));
        ctx.stub.setEvent('Initialised', Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(newLandTitle))));
        return `Transaction with land title id ${newLandTitle.landTitleId} committed successfully`;
    }
    // TransferlandTitle updates the owner field of landTitle with given id in the world state, and returns the old owner.
    async TransferLandTitle(ctx, landTitleId) {
        if ('RegistrarMSP' != ctx.clientIdentity.getMSPID()) {
            console.error('The organisation you are part of is not allowed to transfer land titles contact Registrar');
            return 'The organisation you are part of is not allowed to transfer land titles contact Registrar';
        }
        const landTitleString = await this.ReadLandTitle(ctx, landTitleId);
        const landTitle = JSON.parse(landTitleString);
        if (landTitle.tradingStatus !== 'onSell') // check if property is on sell
            return `The land title with ${landTitle.landTitleId}is not on sell`;
        if (landTitle.transferToName == 'null' && landTitle.transferToID == 'null')
            return `The is no details of New Owner Designate for ${landTitle.landTitleId}`;
        const oldOwner = landTitle.owner;
        landTitle.owner = landTitle.transferToName;
        landTitle.transferToName = 'null';
        landTitle.ownerIdNumber = landTitle.transferToID;
        landTitle.transferToID = 'null';
        landTitle.dateOfTitleIssue = ctx.stub.getDateTimestamp().toUTCString();
        landTitle.txId = ctx.stub.getTxID();
        landTitle.identityOfCreator = ctx.clientIdentity.getID();
        landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();
        landTitle.tradingStatus = 'owned'; // once transfered it's owned
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(landTitleId, Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(landTitle))));
        return `Thew old Owner is Mr/Mrs ${oldOwner} of land title id ${landTitle.landTitleId}`;
    }
    // transaction to set trading status
    async setTradingStatus(ctx, landTitleId) {
        //check who is editing the land title
        if ('RealtorMSP' != ctx.clientIdentity.getMSPID()) {
            console.error('Only a Realtor use can change the Trading Status');
            return 'Only a Realtor use can change the Trading Status';
        }
        // check if land titlte exists
        const exists = await this.LandTitleExists(ctx, landTitleId);
        if (!exists) {
            console.error(`The land title ${landTitleId} doesn't exists`);
            return `The land title ${landTitleId} doesn't exists`;
        }
        // get land title to edit
        const landTitleString = await this.ReadLandTitle(ctx, landTitleId);
        const landTitle = JSON.parse(landTitleString);
        landTitle.tradingStatus = 'onSell';
        landTitle.txId = ctx.stub.getTxID();
        landTitle.identityOfCreator = ctx.clientIdentity.getID();
        landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();
        await ctx.stub.putState(landTitle.landTitleId, Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(landTitle))));
        return `Trading Status for ${landTitle.landTitleId} is now on sell`;
    }
    // transaction to set transferto
    async setTransferTo(ctx, newOwner, landTitleId, newOwnerId) {
        // checking who is doing
        if ('RealtorMSP' != ctx.clientIdentity.getMSPID()) {
            console.error('Only a Realtor can set the new owner designate');
            return 'Only a Realtor can set the new owner designate';
        }
        // check if land title exists
        const exists = await this.LandTitleExists(ctx, landTitleId);
        if (!exists) {
            console.error(`The land title ${landTitleId} doesn't exists`);
            return `The land title ${landTitleId} doesn't exists`;
        }
        // get land title to edit
        const landTitleString = await this.ReadLandTitle(ctx, landTitleId);
        const landTitle = JSON.parse(landTitleString);
        landTitle.transferToName = newOwner;
        landTitle.transferToID = newOwnerId;
        landTitle.txId = ctx.stub.getTxID();
        landTitle.identityOfCreator = ctx.clientIdentity.getID();
        landTitle.dateOfEditing = ctx.stub.getDateTimestamp().toUTCString();
        await ctx.stub.putState(landTitle.landTitleId, Buffer.from((0, fast_json_stable_stringify_1.default)((0, sort_keys_recursive_1.default)(landTitle))));
        return `The proposed New Owner: ${landTitle.transferToName} \n`;
    }
    // geting history of a key
    async GetLandTitleHistory(ctx, landTitleId) {
        const allResults = [];
        const iterator = await ctx.stub.getHistoryForKey(landTitleId);
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            }
            catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
    // LandTitleExists returns true when landTitle with given ID exists in world state.
    async LandTitleExists(ctx, landTitleId) {
        const landTitleJSON = await ctx.stub.getState(landTitleId);
        return landTitleJSON && landTitleJSON.length > 0;
    }
    // ReadLandTitle returns the landTitle stored in the world state with given id.
    async ReadLandTitle(ctx, landTitleID) {
        const landTitleJSON = await ctx.stub.getState(landTitleID); // get the landTitle from chaincode state
        if (!landTitleJSON || landTitleJSON.length === 0) {
            console.error(`The land title ${landTitleID} does not exist`);
            return `The land title ${landTitleID} does not exist`;
        }
        return landTitleJSON.toString();
    }
};
__decorate([
    (0, fabric_contract_api_1.Transaction)(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "InitLedger", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(true),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "CreateNewLandTitle", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(true),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "TransferLandTitle", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(true),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "setTradingStatus", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(true),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "setTransferTo", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "GetLandTitleHistory", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "LandTitleExists", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], LandTitleContract.prototype, "ReadLandTitle", null);
LandTitleContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'LandTitle', description: 'Smart contract for trading and creating Land Titles' }),
    __metadata("design:paramtypes", [])
], LandTitleContract);
exports.LandTitleContract = LandTitleContract;
//# sourceMappingURL=landTitleContract.js.map