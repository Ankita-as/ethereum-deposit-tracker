require('dotenv').config();
console.log(process.env);

const Web3 = require('web3');
const logger = require('./logger');
const { sendTelegramNotification } = require('./notifier');


const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_API_URL));

const contractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

async function trackDeposits() {
    web3.eth.subscribe('logs', {
        address: contractAddress,
        topics: []
    }, async (error, result) => {
        if (!error) {
            const transaction = await web3.eth.getTransaction(result.transactionHash);
            const block = await web3.eth.getBlock(transaction.blockNumber);

            const deposit = {
                blockNumber: transaction.blockNumber,
                blockTimestamp: new Date(block.timestamp * 1000).toISOString(),
                gasFee: web3.utils.fromWei(transaction.gasPrice, 'ether'),
                hash: transaction.hash,
                sender: transaction.from,
                amount: web3.utils.fromWei(transaction.value, 'ether')
            };

            logger.info(`New deposit detected: ${JSON.stringify(deposit)}`);
            await sendTelegramNotification(`New deposit detected: ${JSON.stringify(deposit)}`);

        } else {
            logger.error('Error while tracking deposits:', error);
        }
    });
}

trackDeposits();
