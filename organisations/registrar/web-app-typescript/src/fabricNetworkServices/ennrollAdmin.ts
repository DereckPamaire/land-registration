
import * as path from 'path';
import { buildCCPRegistrar, buildWallet } from './utils//AppUtil';
import { buildCAClient, enrollAdmin,} from './utils/CAUtil';


const mspOrg = 'RegistrarMSP';
const walletPath = path.join(__dirname, 'wallet');
const registratUserId = 'appUser';

async function enrollAdminstrator(): Promise<void> {
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccp = buildCCPRegistrar();

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caClient = buildCAClient(ccp, 'ca.land.registrar.com');

	// setup the wallet to hold the credentials of the application user
	const wallet = await buildWallet(walletPath);

	// in a real application this would be done on an administrative flow, and only once
	await enrollAdmin(caClient, wallet, mspOrg);

}
