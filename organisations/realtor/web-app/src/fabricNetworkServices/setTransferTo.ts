import * as grpc from '@grpc/grpc-js';
import { ChaincodeEvent, CloseableAsyncIterable, connect, Contract, GatewayError, Network } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { newGrpcConnection, newIdentity, newSigner } from './connect';
import { sendMail} from './utils/email';

const channelName = 'channel01';
const chaincodeName = 'chaincode-typescript';

const utf8Decoder = new TextDecoder();

async function connectToSetNewOwner(newOwnerName: string, newOwnerId: string, email: string, landTitleId: string): Promise<unknown> {

	const client = await newGrpcConnection();

	const gateway = connect({
		client,
		identity: await newIdentity(),
		signer: await newSigner(),
		evaluateOptions: () => {
			return { deadline: Date.now() + 5000 }; // 5 seconds
		},
		endorseOptions: () => {
			return { deadline: Date.now() + 15000 }; // 15 seconds
		},
		submitOptions: () => {
			return { deadline: Date.now() + 5000 }; // 5 seconds
		},
		commitStatusOptions: () => {
			return { deadline: Date.now() + 60000 }; // 1 minute
		},
	});

	let events: CloseableAsyncIterable<ChaincodeEvent> | undefined;

	try {
		const network = gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);
		// Listen for events emitted by subsequent transactions
		events = await startEventListening(network);

		const result = await setNewDetails(contract, newOwnerName, newOwnerId, landTitleId, email);
		// await readEvents(events);
		const resultString = utf8Decoder.decode(result);
		console.log(`Message from contract: \t\t ${resultString}`);
		const json = JSON.parse(resultString);

		if(json.email !== undefined)
			sendMail(email, json.message);

		return resultString;

	}finally {
	
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
			return;
		}
	} catch (error: unknown) {
		// Ignore the read error when events.close() is called explicitly
		if (!(error instanceof GatewayError) || error.code !== grpc.status.CANCELLED) {
			throw error;
		}
		return;
	}
}

function parseJson(jsonBytes?: Uint8Array): unknown {
	const json = utf8Decoder.decode(jsonBytes);
	return JSON.parse(json);
}

async function setNewDetails(contract: Contract, owner: string, id: string, landId: string, email: string): Promise<any> {
	console.log(`\n--> Setting New Owner for to get Ready for Transfer: ${landId}`);
	try
	{
		// use evaluate to query the ledger
		const resultBytes = await contract.submitTransaction(
			'setTransferTo',
			owner,
			id,
			email,
			landId
		);
		return resultBytes;
	} catch(err){
		if (err){
			console.log(err);
		}
	}
}

export { connectToSetNewOwner };