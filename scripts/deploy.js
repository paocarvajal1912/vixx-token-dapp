const main = async () => {
    const initialSupply = 100;

    const vxcnContractFactory = await hre.ethers.getContractFactory("VixcoinTokenCrowdsaleDeployer");
    const vxcnContract = await vxcnContractFactory.deploy(
        "Vixcoin",
        "VXCN",
        "0xC63a5869c653843f16247149FAE4fab9B65988B1"
    );
    await vxcnContract.deployed();

    const vxcn_token_address = await vxcnContract.getVixcoinTokenAddress();
    const vxcn_crowdsale_address = await vxcnContract.getVixcoinCrowdsaleAddress();

    console.log("VixcoinTokenCrowdsaleDeployer deployed to:", vxcnContract.address);
    console.log("VixcoinToken deployed to:", vxcn_token_address);
    console.log("VixcoinTokenCrowdsale deployed to:", vxcn_crowdsale_address);

    // const mintTxn = await gameContract.mintCharacterNFT(characterId);
    // await mintTxn.wait();
    // console.log("mintTxn:", mintTxn);
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

