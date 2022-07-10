import * as grpc from '@grpc/grpc-js';
import { ChaincodeEvent, CloseableAsyncIterable, connect, Contract, GatewayError, Network } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { newGrpcConnection, newIdentity, newSigner } from './connect';

const channelName = 'channel01';
const chaincodeName = 'chaincode-typescript';

const utf8Decoder = new TextDecoder();

// recieve a land title id
async function connectToGetLanTitleById(landId: string): Promise<unknown> {

	const client = await newGrpcConnection();

	const gateway = connect({
		client,
		identity: await newIdentity(),
		signer: await newSigner(),
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

	let events: CloseableAsyncIterable<ChaincodeEvent> | undefined;
	let search;
	try {
		const network = gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);

		// Listen for events emitted by subsequent transactions
		events = await startEventListening(network);
		// get the result to rertun
		search = await getLandTitleById(contract, landId);
		
	} finally {
		events?.close();
		gateway.close();
		client.close();
	}

	return search;
}

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

// function to get asset by id.
async function getLandTitleById(contract: Contract, landId: string): Promise<unknown>{
	console.log(`\n--> Query the ledger: Read Land Ttle By Id, ${landId}`);
	let result;
	try
	{
		// use evaluate to query the ledger
		const resultBytes = await contract.evaluateTransaction('ReadLandTitle', landId );
		const resultJson = utf8Decoder.decode(resultBytes);
		result = JSON.parse(resultJson);
		console.log(result);
	} catch(err){
		if (!err){
			console.log(err);
			return err;
		}
	}
	return result;
}

export { connectToGetLanTitleById };



