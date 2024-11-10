import hashlib
import time
import random
import sys
sys.stdout.reconfigure(encoding='utf-8')

class Token:
    def __init__(self, name, symbol):
        self.name = name
        self.symbol = symbol
        self.balances = {}
        self.total_supply = 0
        self.chain = []

    def _generate_transaction_hash(self, data):
        tx_string = f"{data}{time.time()}{random.randint(0, 100000)}"
        return hashlib.sha256(tx_string.encode()).hexdigest()

    def _create_block(self, transaction):
        block = {
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()),
            'transaction': transaction,
            'previous_hash': self.chain[-1]['hash'] if self.chain else '0'*64,
            'hash': ''
        }
        block_contents = f"{block['timestamp']}{block['transaction']}{block['previous_hash']}"
        block['hash'] = self._generate_transaction_hash(block_contents)
        self.chain.append(block)
        return block

    def mint(self, address, amount):
        self.balances[address] = self.balances.get(address, 0) + amount
        self.total_supply += amount
        transaction = f"Minted {amount} {self.symbol} to {address}"
        block = self._create_block(transaction)
        print(f"[{block['timestamp']}] New block mined: {block['hash'][:16]}...")
        print(f"    ➜ {transaction}")

    def burn(self, address, amount):
        if self.balances.get(address, 0) >= amount:
            self.balances[address] -= amount
            self.total_supply -= amount
            transaction = f"Burned {amount} {self.symbol} from {address}"
            block = self._create_block(transaction)
            print(f"[{block['timestamp']}] New block mined: {block['hash'][:16]}...")
            print(f"    ➜ {transaction}")
        else:
            print(f"❗ Insufficient balance to burn {amount} {self.symbol} from {address}.")

    def transfer(self, from_address, to_address, amount):
        if self.balances.get(from_address, 0) >= amount:
            self.balances[from_address] -= amount
            self.balances[to_address] = self.balances.get(to_address, 0) + amount
            transaction = f"Transferred {amount} {self.symbol} from {from_address} to {to_address}"
            block = self._create_block(transaction)
            print(f"[{block['timestamp']}] New block mined: {block['hash'][:16]}...")
            print(f"    ➜ {transaction}")
        else:
            print(f"❗ Insufficient balance to transfer {amount} {self.symbol} from {from_address} to {to_address}.")