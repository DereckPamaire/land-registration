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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSigner = exports.newIdentity = exports.newGrpcConnection = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const crypto = __importStar(require("crypto"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const connection_profile_realtor_json_1 = __importDefault(require("../../../../../fablo-target/fabric-config/connection-profiles/connection-profile-realtor.json"));
const mspId = 'RealtorMSP';
// Path to crypto materials.
// const cryptoPath = path.resolve(__dirname, '..', '..','..','..', '..','fablo-target','fabric-config', 'crypto-config','peerOrganisations','land.registrar.com');
// Path to user private key directory.
const keyDirectoryPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/crypto-config/peerOrganizations/land.realtor.com/users/User1@land.realtor.com/msp/keystore';
// Path to user certificate.
const certPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/crypto-config/peerOrganizations/land.realtor.com/users/User1@land.realtor.com/msp/signcerts/User1@land.realtor.com-cert.pem';
// Path to peer tls certificate.
const tlsCertPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/crypto-config/peerOrganizations/land.realtor.com/peers/peer0.land.realtor.com/tls/ca.crt';
// Gateway peer endpoint.
const peerEndpoint = 'localhost:7061';
/**
 *
 * @returns
 */
function newGrpcConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const tlsRootCert = yield fs_1.promises.readFile(tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': connection_profile_realtor_json_1.default.peers['peer0.land.realtor.com'].grpcOptions['ssl-target-name-override'],
        });
    });
}
exports.newGrpcConnection = newGrpcConnection;
/**
 *
 * @returns
 */
function newIdentity() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield fs_1.promises.readFile(certPath);
        return { mspId, credentials };
    });
}
exports.newIdentity = newIdentity;
/**
 *
 * @returns
 */
function newSigner() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs_1.promises.readdir(keyDirectoryPath);
        const keyPath = path.resolve(keyDirectoryPath, files[0]);
        const privateKeyPem = yield fs_1.promises.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
    });
}
exports.newSigner = newSigner;
