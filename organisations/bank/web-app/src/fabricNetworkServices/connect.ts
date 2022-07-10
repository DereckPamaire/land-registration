import * as grpc from '@grpc/grpc-js';
import {Identity, Signer, signers} from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import {promises as fs} from 'fs';
import * as path from 'path';
import connectionProfile from '../../../../../fablo-target/fabric-config/connection-profiles/connection-profile-bank.json';

const mspId = 'BankMSP';

// Path to crypto materials.
// const cryptoPath = path.resolve(__dirname, '..', '..','..','..', '..','fablo-target','fabric-config', 'crypto-config','peerOrganisations','land.registrar.com');

// Path to user private key directory.
const keyDirectoryPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/crypto-config/peerOrganizations/land.bank.com/users/User1@land.bank.com/msp/keystore';

// Path to user certificate.
const certPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/crypto-config/peerOrganizations/land.bank.com/users/User1@land.bank.com/msp/signcerts/User1@land.bank.com-cert.pem';
// Path to peer tls certificate.
const tlsCertPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/crypto-config/peerOrganizations/land.bank.com/peers/peer0.land.bank.com/tls/ca.crt';

// Gateway peer endpoint.
const peerEndpoint = 'localhost:7081';
/**
 *
 * @returns
 */
export async function newGrpcConnection(): Promise<grpc.Client> {
	const tlsRootCert = await fs.readFile(tlsCertPath);
	const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
	return new grpc.Client(peerEndpoint, tlsCredentials, {
		'grpc.ssl_target_name_override': connectionProfile.peers['peer0.land.bank.com'].grpcOptions['ssl-target-name-override'],
	});
}

/**
 * 
 * @returns 
 */
export async function newIdentity(): Promise<Identity> {
	const credentials = await fs.readFile(certPath);
	return {mspId, credentials};
}

/**
 * 
 * @returns 
 */
export async function newSigner(): Promise<Signer> {
	const files = await fs.readdir(keyDirectoryPath);
	const keyPath = path.resolve(keyDirectoryPath, files[0]);
	const privateKeyPem = await fs.readFile(keyPath);
	const privateKey = crypto.createPrivateKey(privateKeyPem);
	return signers.newPrivateKeySigner(privateKey);
}