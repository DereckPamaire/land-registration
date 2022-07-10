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
exports.registerAndEnrollUser = exports.enrollAdmin = exports.buildCAClient = void 0;
const FabricCAServices = __importStar(require("fabric-ca-client"));
const adminUserId = 'adminRegistrar';
const adminUserPasswd = 'adminpw';
/**
 *
 * @param {*} ccp
 */
const buildCAClient = (ccp, caHostName) => {
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices.default(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
};
exports.buildCAClient = buildCAClient;
const enrollAdmin = (caClient, wallet, orgMspId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check to see if we've already enrolled the admin user.
        const identity = yield wallet.get(adminUserId);
        if (identity) {
            console.log('An identity for the admin user already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = yield caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        yield wallet.put(adminUserId, x509Identity);
        console.log('Successfully enrolled admin user and imported it into the wallet');
    }
    catch (error) {
        console.error(`Failed to enroll admin user : ${error}`);
    }
});
exports.enrollAdmin = enrollAdmin;
const registerAndEnrollUser = (caClient, wallet, orgMspId, userId, affiliation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check to see if we've already enrolled the user
        const userIdentity = yield wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }
        // Must use an admin to register a new user
        const adminIdentity = yield wallet.get(adminUserId);
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return;
        }
        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = yield provider.getUserContext(adminIdentity, adminUserId);
        // Register the user, enroll the user, and import the new identity into the wallet.
        // if affiliation is specified by client, the affiliation value must be configured in CA
        const secret = yield caClient.register({
            affiliation,
            enrollmentID: userId,
            role: 'client',
        }, adminUser);
        const enrollment = yield caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        yield wallet.put(userId, x509Identity);
        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    }
    catch (error) {
        console.error(`Failed to register user : ${error}`);
    }
});
exports.registerAndEnrollUser = registerAndEnrollUser;
