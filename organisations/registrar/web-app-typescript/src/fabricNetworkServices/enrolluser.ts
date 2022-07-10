import * as path from 'path';
import { buildCCPRegistrar, buildWallet } from './utils/AppUtil';
import { buildCAClient, registerAndEnrollUser } from './utils/CAUtil';

const mspOrg1 = 'RegistrarMSP';
const walletPath = path.join(__dirname, 'wallet');

export async function regAndEnrolUser (registarUser: string): Promise<void>{
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccp = buildCCPRegistrar();

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caClient = buildCAClient(ccp, 'ca.land.registrar.com');

	// setup the wallet to hold the credentials of the application user
	const wallet = await buildWallet(walletPath);

	// in a real application this would be done only when a new user was required to be added
	// and would be part of an administrative flow
	await registerAndEnrollUser(caClient, wallet, mspOrg1, registarUser, 'registrar.department1');
}
