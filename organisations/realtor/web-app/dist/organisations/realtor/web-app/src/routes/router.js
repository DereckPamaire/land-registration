"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.landtitleview = exports.aboutPage = exports.indexPage = void 0;
const landTitleController = __importStar(require("../controllers/landtitleController"));
const exampleController = __importStar(require("../controllers/exampleContoller"));
const indexPage = (app) => {
    // index age
    app.get('/index', (req, res) => { res.render('pages/index'); });
};
exports.indexPage = indexPage;
const aboutPage = (app) => {
    // about page routing
    app.get('/about', exampleController.about);
};
exports.aboutPage = aboutPage;
const landtitleview = (app) => {
    // gets an id, query the ledger and render a view
    app.get('/landtitleview', landTitleController.viewlandTitle);
};
exports.landtitleview = landtitleview;
const getById = (app) => {
    // api that receives json data
    app.post('/api/landtitle/id', landTitleController.getLandTitleById);
};
exports.getById = getById;
