import * as grpc from '@grpc/grpc-js';
import { ChaincodeEvent, CloseableAsyncIterable, connect, Contract, GatewayError, Network } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { newGrpcConnection, newIdentity, newSigner } from './connect';

const channelName = 'channel01';
const chaincodeName = 'chaincode-typescript';

const utf8Decoder = new TextDecoder();
const connectToInitialise = async (): Promise<void> => {

	const client = await newGrpcConnection();

	const gateway = connect({
		client,
		identity: await newIdentity(),
		signer: await newSigner(),
		evaluateOptions: () => {
			return { deadline: Date.now() + 60000 }; // 60 seconds
		},
		endorseOptions: () => {
			return { deadline: Date.now() + 60000 }; // 60 seconds
		},
		submitOptions: () => {
			return { deadline: Date.now() + 60000 }; // 60 seconds
		},
		commitStatusOptions: () => {
			return { deadline: Date.now() + 120000 }; // 2 minute
		},
	});

	let events: CloseableAsyncIterable<ChaincodeEvent> | undefined;

	try {
		const network = gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);
		// Listen for events emitted by subsequent transactions
		events = await startEventListening(network);

		await initializeLedger(contract);
		await readEvents(events);
		
	} finally {
		events?.close();
		gateway.close();
		client.close();
	}
};

async function startEventListening(network: Network): Promise<CloseableAsyncIterable<ChaincodeEvent>> {
	console.log('\n*** Start chaincode event listening');

	const events = await network.getChaincodeEvents(chaincodeName);

	void readEvents(events); // Don't await - run asynchronously
	return events;
}

async function readEvents(events: CloseableAsyncIterable<ChaincodeEvent>): Promise<void> {
	try {
		for await (const event of events) {
			const payload = parseJson(event.payload);
			console.log(`\n<-- Chaincode event received: ${event.eventName} -`, payload);
		}
	} catch (error: unknown) {
		// Ignore the read error when events.close() is called explicitly
		if (!(error instanceof GatewayError) || error.code !== grpc.status.CANCELLED) {
			throw error;
		}
	}
}

function parseJson(jsonBytes: Uint8Array): unknown {
	const json = utf8Decoder.decode(jsonBytes);
	return JSON.parse(json);
}

async function initializeLedger(contract: Contract): Promise<void> {
	console.log('\n--> Initilising the ledger');

	await contract.submitTransaction('InitLedger');

	console.log('*** Transaction committed successfully');
}



export { connectToInitialise };



