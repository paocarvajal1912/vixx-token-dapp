const VixcoinToken = artifacts.require("VixcoinToken");

module.exports = function (deployer) {
  const _name = "Vixcoin";
  const _symbol = "VXCN";
  const _decimals = 18;

  deployer.deploy(VixcoinToken, _name, _symbol, _decimals);
};
