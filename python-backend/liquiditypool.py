import time

from token import Token
from protocol import LendingProtocol
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Mapping for tokens
token_map = {}

# Initialize tokens
usdc = Token('USD Coin', 'USDC')
token_map['USDC'] = usdc
eth = Token('Ethereum', 'ETH')
token_map['ETH'] = eth
arbitrum = Token('Arbitrum', 'ARB')
token_map['ARB'] = arbitrum
base = Token('Base Token', 'BASE')
token_map['BASE'] = base

# Initialize protocol
protocol = LendingProtocol(token_map)

print("\n🚀 Starting Crypto Lending Simulation...\n")
time.sleep(1)

# Mint some tokens to user
print("--- Minting Tokens to User1 ---")
usdc.mint('User1', 10000)
time.sleep(0.5)
eth.mint('User1', 10)
time.sleep(0.5)
arbitrum.mint('User1', 5000)
time.sleep(0.5)
base.mint('User1', 2000)
time.sleep(1)

# User deposits tokens
protocol.deposit('User1', usdc, 5000)
time.sleep(1)
protocol.deposit('User1', eth, 5)
time.sleep(1)

# User borrows tokens
protocol.borrow('User1', arbitrum, 1000, collateral_token=usdc, collateral_amount=3000)
time.sleep(1)

# User repays loan
protocol.repay('User1', arbitrum, 1000)
time.sleep(1)

# User withdraws tokens
protocol.withdraw('User1', usdc, 2000)
time.sleep(1)

# Display balances
print("\n🔎 --- Final Balances ---")
print(f"User1 Balances:")
print(f"    USDC: {usdc.balances.get('User1', 0)}")
print(f"    ETH: {eth.balances.get('User1', 0)}")
print(f"    ARB: {arbitrum.balances.get('User1', 0)}")
print(f"    BASE: {base.balances.get('User1', 0)}")

print("\nUser1 Deposits:")
print(f"    {protocol.deposits.get('User1', {})}")

print("\nUser1 Loans:")
print(f"    {protocol.loans.get('User1', {})}")

print("\n--- Protocol Balances ---")
print(f"    {protocol.protocol_balances}")

print("\n--- Protocol Collaterals ---")
print(f"    {protocol.collaterals}")

print("\n✅ Simulation Complete!")