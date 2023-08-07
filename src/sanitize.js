const ethers = require('ethers');

function sanitize(obj) {
    const numberize = ['number', 'difficulty', 'totalDifficulty', 'size', 'timestamp', 'nonce', 'baseFeePerGas', 'blockNumber', 'cumulativeGasUsed', 'effectiveGasPrice', 'gasUsed', 'logIndex', 'chainId', 'gasLimit', 'gasPrice', 'v', 'value', 'type', 'transactionIndex', 'status']
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v !== null && v !== undefined)
            .map(([_, v]) => {
                if (v && typeof v === 'string' && v.length === 42 && v.startsWith('0x')) {
                    return [_, v.toLowerCase()];
                }
                else if (v && typeof v === 'string' && numberize.indexOf(_) > -1 && v.startsWith('0x')) {
                    return [_, parseInt(v, 16)];
                }
                else if (v && typeof v === 'object' && numberize.indexOf(_) > -1 && v._isBigNumber) {
                    return [_, ethers.toBigInt(v._hex).toString()];
                }
                else {
                    return [_, v];
                }
            })
    );
};

export default sanitize;