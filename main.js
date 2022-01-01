const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(params) {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor(params) {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(params) {
        return new Block(0, "01/01/2022", "Genesis block", "0");
    }

    getLatestBlock(params) {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(params) {
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let ieneCoin = new Blockchain();
ieneCoin.addBlock(new Block(1, "12/03/2022", { amount: 4 }));
ieneCoin.addBlock(new Block(2, "13/03/2022", { amount: 40 }));

console.log('Is blockchain valid? ' + ieneCoin.isChainValid());

ieneCoin.chain[1].data = { amount: 100 };
ieneCoin.chain[1].hash = ieneCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + ieneCoin.isChainValid());

console.log(JSON.stringify(ieneCoin, null, 4));
