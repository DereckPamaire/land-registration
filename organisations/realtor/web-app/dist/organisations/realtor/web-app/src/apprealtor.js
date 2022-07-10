"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const PORT = process.env.SERVER_PORT;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
// setup Layout
app.use(express_ejs_layouts_1.default);
app.set('layout', 'layouts/layout');
// setting up the view engine
app.set('view engine', 'ejs');
// setting up the directory for the root path for views directory
app.set('views', path_1.default.join(__dirname, './views'));
app.use(express_1.default.json());
// the routers to variours resources as exported by the router.ts file
app.listen(PORT, () => { console.log('The app is listening on port  http://localhost:%d', PORT); });
// this is my server program
