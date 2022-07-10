"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingTradingStatus = exports.getLandTitleById = exports.viewlandTitle = void 0;
const GetLandTitleById_1 = require("../fabricNetworkServices/GetLandTitleById");
const SetTradingStatus_1 = require("../fabricNetworkServices/SetTradingStatus");
// handle form response
const viewlandTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // in this instance i'm passing json from file
    const id = req.body.id;
    const responseObj = yield (0, GetLandTitleById_1.connectToGetLanTitleById)(id);
    console.log(responseObj);
    const landData = responseObj;
    res.render('pages/landtitleview', { landData });
});
exports.viewlandTitle = viewlandTitle;
const getLandTitleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // getting the land title by ID and rendering it to the land title view
    const id = req.body.id;
    const responseObj = yield (0, GetLandTitleById_1.connectToGetLanTitleById)(id);
    console.log('result arrived');
    console.log(responseObj);
    const responseJson = JSON.stringify(responseObj);
    //res.render('pages/landtitleview');
    return res.send(responseJson);
});
exports.getLandTitleById = getLandTitleById;
// getting an id and setting trading status
const settingTradingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const result = yield (0, SetTradingStatus_1.connectSetTradingStatus)(id);
});
exports.settingTradingStatus = settingTradingStatus;
