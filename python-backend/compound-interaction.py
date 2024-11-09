from web3 import Web3
import json

# Sepolia testnet provider URL (Infura example)
provider = 'https://sepolia.infura.io/v3/2c57c0277e0141adbbbe5b061d778b88'
private_key = '0xa8373047457385f4ed50b2503c99eca52cd1996ab96805a7642a83e70759e9d1'
account = '0x43471F4A26087E4faf8e7b0F65199F7F6F887f1c'

web3 = Web3(Web3.HTTPProvider(provider))
web3.eth.default_account = account

# Load cETH ABI
with open('cETH_ABI.json') as f:
    cETH_ABI = json.load(f)

# cETH contract address on Sepolia
cETH_address = '0x2f2b8daa99bbf0b357954217914e9769d50075af'  # Verify this address

cETH = web3.eth.contract(address=cETH_address, abi=cETH_ABI)

# Supplying ETH to the protocol
def supply_eth(amount_in_wei):
    nonce = web3.eth.getTransactionCount(account)
    tx = cETH.functions.mint().buildTransaction({
        'nonce': nonce,
        'gas': 2000000,
        'gasPrice': web3.toWei('20', 'gwei'),
        'value': amount_in_wei
    })
    signed_tx = web3.eth.account.sign_transaction(tx, private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print('Supply transaction hash:', web3.toHex(tx_hash))

# Amount to supply: 0.1 ETH (in wei)
amount_to_supply = web3.toWei(0.1, 'ether')
supply_eth(amount_to_supply)
