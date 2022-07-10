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
const path = __importStar(require("path"));
const AppUtil_1 = require("./utils//AppUtil");
const CAUtil_1 = require("./utils/CAUtil");
const mspOrg = 'RealtorMSP';
const walletPath = path.join(__dirname, 'wallet');
const registratUserId = 'appUser';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = (0, AppUtil_1.buildCCPRegistrar)();
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = (0, CAUtil_1.buildCAClient)(ccp, 'ca.land.realtor.com');
        // setup the wallet to hold the credentials of the application user
        const wallet = yield (0, AppUtil_1.buildWallet)(walletPath);
        // in a real application this would be done on an administrative flow, and only once
        yield (0, CAUtil_1.enrollAdmin)(caClient, wallet, mspOrg);
    });
}
main();
