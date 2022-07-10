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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToGetLanTitleById = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const util_1 = require("util");
const connect_1 = require("./connect");
const channelName = 'channel01';
const chaincodeName = 'chaincode-typescript';
const utf8Decoder = new util_1.TextDecoder();
// recieve a land title id
function connectToGetLanTitleById(landId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, connect_1.newGrpcConnection)();
        const gateway = (0, fabric_gateway_1.connect)({
            client,
            identity: yield (0, connect_1.newIdentity)(),
            signer: yield (0, connect_1.newSigner)(),
            evaluateOptions: () => {
                return { deadline: Date.now() + 60000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 600000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 60000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 120000 }; // 1 minute
            },
        });
        let events;
        let search;
        try {
            const network = gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);
            // Listen for events emitted by subsequent transactions
            events = yield startEventListening(network);
            // get the result to rertun
            search = yield getLandTitleById(contract, landId);
        }
        finally {
            events === null || events === void 0 ? void 0 : events.close();
            gateway.close();
            client.close();
        }
        return search;
    });
}
exports.connectToGetLanTitleById = connectToGetLanTitleById;
function startEventListening(network) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n*** Start chaincode event listening');
        const events = yield network.getChaincodeEvents(chaincodeName);
        void readEvents(events); // Don't await - run asynchronously
        return events;
    });
}
function readEvents(events) {
    var events_1, events_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            try {
                for (events_1 = __asyncValues(events); events_1_1 = yield events_1.next(), !events_1_1.done;) {
                    const event = events_1_1.value;
                    const payload = parseJson(event.payload);
                    console.log(`\n<-- Chaincode event received: ${event.eventName} -`, payload);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) yield _a.call(events_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            // Ignore the read error when events.close() is called explicitly
            if (!(error instanceof fabric_gateway_1.GatewayError) || error.code !== grpc.status.CANCELLED) {
                throw error;
            }
        }
    });
}
function parseJson(jsonBytes) {
    const json = utf8Decoder.decode(jsonBytes);
    return JSON.parse(json);
}
// function to get asset by id.
function getLandTitleById(contract, landId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n--> Query the ledger: Read Land Ttle By Id, ${landId}`);
        let result;
        try {
            // use evaluate to query the ledger
            const resultBytes = yield contract.evaluateTransaction('ReadLandTitle', landId);
            const resultJson = utf8Decoder.decode(resultBytes);
            result = JSON.parse(resultJson);
            console.log(result);
        }
        catch (err) {
            if (!err) {
                console.log(err);
                return err;
            }
        }
        return result;
    });
}
