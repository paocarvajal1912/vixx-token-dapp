import vxcnToken from "./artifacts/contracts/VixcoinToken.sol/VixcoinToken.json";
import vxcnTokenCrowdsale from "./artifacts/contracts/VixcoinTokenCrowdsale.sol/VixcoinTokenCrowdsale.json";


const main = async () => {
    const vxcnContractFactory = await hre.ethers.getContractFactory("VixcoinToken");
    const vxcnContract = await vxcnContractFactory.deploy();
    await vxcnContract.deployed();
    console.log("Contract deployed to:", vxcnContract.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();

