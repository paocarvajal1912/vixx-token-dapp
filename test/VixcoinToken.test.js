const BigNumber = web3.BigNumber;
const VixcoinToken = artifacts.require("VixcoinToken");

var chai = require("chai");

chai.use(require("chai-bignumber")(BigNumber));
chai.should();


contract("VixcoinToken", accounts => {
    const _name = "Vixcoin";
    const _symbol = "VXCN";
    const _decimals = 18;

    beforeEach(async function () {
        this.token = await VixcoinToken.new(
            _name,
            _symbol,
            _decimals
        );
    });

    describe("token attributes", function () {
        it("has the correct name", async function() {
            const name = await this.token.name();
            name.should.equal(_name);
        });
        
        it("has the correct symbol", async function() {
            const symbol = await this.token.symbol();
            symbol.should.equal(_symbol);
        });
        
        it("has the correct decimal", async function() {
            const decimals = await this.token.decimals();
            decimals.toNumber().should.be.bignumber.equal(_decimals);
        });
    });

})