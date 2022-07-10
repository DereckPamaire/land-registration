

import { Wallet, Wallets } from 'fabric-network';
import * as fs from 'fs';

const buildCCPRegistrar = (): Record<string, any> => {
	// load the common connection configuration file
	const ccpPath = '/home/shingiraid/fabric/land-registration/fablo-target/fabric-config/connection-profiles/connection-profile-realtor.json';
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

const buildWallet = async (walletPath: string): Promise<Wallet> => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet: Wallet;
	if (walletPath) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
};

export {
	buildCCPRegistrar,
	buildWallet,
};
