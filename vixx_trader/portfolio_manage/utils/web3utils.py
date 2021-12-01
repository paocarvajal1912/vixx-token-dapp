import json

from web3        import Web3
from django.conf import settings


def web3backend():
    # Account Credentials
    public_key  = settings.WALLET["PRIMARY_PUBLIC_KEY"]
    private_key = settings.WALLET["PRIMARY_PRIVATE_KEY"]

    # Alchemy KovanApp URL
    url  = settings.CONTRACT["ALCHEMY_URL_KEY"]
    web3 = Web3(Web3.HTTPProvider(url))

    # Contract's Address and ABI
    contract_address = web3.toChecksumAddress(settings.CONTRACT["SMART_CONTRACT_ADDRESS"])
    # abi_path         = settings.ABI_DIR(app="portfolio_manage")

    # with open(abi_path) as f:
    #     abi = json.load(f)

    # contract = web3.eth.contract(address=contract_address, abi=abi)

    return {
        "public_key":       public_key,
        "private_key":      private_key,
        "contract_address": contract_address.lower(),
        # "abi_path":         abi_path,
        # "contract":         contract,
    }
    
    