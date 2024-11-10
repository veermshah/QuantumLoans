import time
import hashlib
import random
import sys
sys.stdout.reconfigure(encoding='utf-8')

class LendingProtocol:
    def __init__(self, token_map):
        self.deposits = {}
        self.loans = {}
        self.collaterals = {}
        self.protocol_balances = {}
        self.chain = []
        self.token_map = token_map

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
        print(f"[{block['timestamp']}] Block mined: {block['hash'][:16]}...")
        print(f"    ➜ {transaction}")

    def deposit(self, user, token, amount):
        print(f"\n🔄 Processing deposit for {user}...")
        time.sleep(1)
        token.transfer(user, 'protocol', amount)
        self.deposits.setdefault(user, {}).setdefault(token.symbol, 0)
        self.deposits[user][token.symbol] += amount
        self.protocol_balances[token.symbol] = self.protocol_balances.get(token.symbol, 0) + amount
        transaction = f"{user} deposited {amount} {token.symbol}"
        self._create_block(transaction)

    def withdraw(self, user, token, amount):
        print(f"\n🔄 Processing withdrawal for {user}...")
        time.sleep(1)
        if self.deposits.get(user, {}).get(token.symbol, 0) >= amount:
            token.transfer('protocol', user, amount)
            self.deposits[user][token.symbol] -= amount
            self.protocol_balances[token.symbol] -= amount
            transaction = f"{user} withdrew {amount} {token.symbol}"
            self._create_block(transaction)
        else:
            print(f"❗ Insufficient deposited balance to withdraw {amount} {token.symbol} for {user}.")

    def borrow(self, user, token, amount, collateral_token, collateral_amount):
        print(f"\n🔄 Processing borrow request for {user}...")
        time.sleep(1)
        # Accept collateral
        collateral_token.transfer(user, 'protocol', collateral_amount)
        self.collaterals.setdefault(user, {}).setdefault(collateral_token.symbol, 0)
        self.collaterals[user][collateral_token.symbol] += collateral_amount
        self.protocol_balances[collateral_token.symbol] = self.protocol_balances.get(collateral_token.symbol, 0) + collateral_amount
        collateral_tx = f"{user} provided collateral: {collateral_amount} {collateral_token.symbol}"
        self._create_block(collateral_tx)
        # Issue loan
        token.mint(user, amount)
        self.loans.setdefault(user, {}).setdefault(token.symbol, 0)
        self.loans[user][token.symbol] += amount
        loan_tx = f"{user} borrowed {amount} {token.symbol} against collateral"
        self._create_block(loan_tx)

    def repay(self, user, token, amount):
        print(f"\n🔄 Processing repayment from {user}...")
        time.sleep(1)
        if self.loans.get(user, {}).get(token.symbol, 0) >= amount:
            token.burn(user, amount)
            self.loans[user][token.symbol] -= amount
            transaction = f"{user} repaid {amount} {token.symbol}"
            self._create_block(transaction)
            # If loan is fully repaid, return collateral
            if self.loans[user][token.symbol] == 0:
                for col_token_symbol, col_amount in self.collaterals[user].items():
                    col_token = self.token_map[col_token_symbol]
                    col_token.transfer('protocol', user, col_amount)
                    self.protocol_balances[col_token_symbol] -= col_amount
                    collateral_return_tx = f"{user} retrieved collateral: {col_amount} {col_token_symbol}"
                    self._create_block(collateral_return_tx)
                del self.collaterals[user]
        else:
            print(f"❗ Loan amount is less than the repayment amount for {user}.")