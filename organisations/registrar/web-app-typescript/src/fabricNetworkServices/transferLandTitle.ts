import * as grpc from '@grpc/grpc-js';
import { ChaincodeEvent, CloseableAsyncIterable, connect, Contract, GatewayError, Network } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { newGrpcConnection, newIdentity, newSigner } from './connect';
import { sendMail } from './utils/email';

const channelName = 'channel01';
const chaincodeName = 'chaincode-typescript';

const utf8Decoder = new TextDecoder();

async function connectToTransferLandTitle(landTitleId: string): Promise<string> {

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

		const result = await transferLandTitle(contract, landTitleId);
		// await readEvents(events);
		const resultString = utf8Decoder.decode(result);
		console.log(`Message from contract: \t\t ${resultString}`);

		const json = JSON.parse(resultString);

		if(json.email !== undefined)
			sendMail(json.email, json.message);
		
		return resultString;
	} finally {
		events?.close();
		gateway.close();
		client.close();
	}
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

async function transferLandTitle(contract: Contract, landTitleId: string): Promise<any> {
	console.log(`\n--> Transfer Land Title with ID: ${landTitleId}`);
	try
	{
		// use evaluate to query the ledger
		const resultBytes= await contract.submitTransaction('TransferLandTitle',landTitleId ); 
		return resultBytes;       
	} catch(err){
		if (!err){
			console.log(err);
		}
	}

}


export { connectToTransferLandTitle };



