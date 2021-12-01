const BigNumber = web3.BigNumber;
const VixcoinToken = artifacts.require("VixcoinToken");
const VixcoinTokenCrowdsale = artifacts.require("VixcoinTokenCrowdsale");

var chai = require("chai");

chai.use(require("chai-bignumber")(BigNumber));
chai.should();


contract("VixcoinTokenCrowdsale", function([_, wallet]) {
    
    beforeEach(async function () {
        // Token config
        this.name = "Vixcoin";
        this.symbol = "VXCN";
        this.decimals = 18;

        // Deploy Token
        this.token = await VixcoinToken.new(
            this.name,
            this.symbol,
            this.decimals
        );

        // Crowdsale config
        this.rate = 500;
        this.wallet = wallet;

        // Deploy Token
        this.crowdsale = await VixcoinTokenCrowdsale.new(
            this.rate,
            this.wallet,
            this.token.address
        );

    });

    describe("crowdsale attributes", function () {
        it("tracks the wallet", async function () {
            const wallet = await this.crowdsale.wallet();
            wallet.should.equal(this.wallet);
        });

        it("tracks the rate", async function () {
            const rate = await this.crowdsale.rate();
            rate.toNumber().should.be.bignumber.equal(this.rate);
        });

        it("tracks the token", async function () {
            const token = await this.crowdsale.token();
            token.should.equal(this.token.address);
        });
    });

})