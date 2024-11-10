# from flask import Flask, request, jsonify
# from token import Token
# from protocol import LendingProtocol
# import sys

# # Ensure UTF-8 encoding for special characters
# sys.stdout.reconfigure(encoding='utf-8')

# app = Flask(__name__)

# # Initialize tokens
# usdc = Token('USD Coin', 'USDC')
# eth = Token('Ethereum', 'ETH')
# arbitrum = Token('Arbitrum', 'ARB')
# base = Token('Base Token', 'BASE')

# # Create token map
# token_map = {
#     'USDC': usdc,
#     'ETH': eth,
#     'ARB': arbitrum,
#     'BASE': base
# }

# # Initialize protocol with token_map
# protocol = LendingProtocol(token_map)

# # Function to mint tokens to users


# def mint_tokens(user):
#     usdc.mint(user, 10000)
#     eth.mint(user, 10)
#     arbitrum.mint(user, 5000)
#     base.mint(user, 2000)

# # API route to mint tokens to a user


# @app.route('/mint', methods=['POST'])
# def mint():
#     data = request.get_json()
#     user = data['user']
#     mint_tokens(user)
#     return jsonify({'message': f'Minted tokens to {user}.'})

# # API route for user deposit


# @app.route('/deposit', methods=['POST'])
# def deposit():
#     data = request.get_json()
#     user = data['user']
#     token_symbol = data['token']
#     amount = data['amount']
#     token = token_map.get(token_symbol.upper())

#     if token:
#         protocol.deposit(user, token, amount)
#         return jsonify({'message': f'Deposited {amount} {token_symbol} for {user}.'})
#     else:
#         return jsonify({'error': 'Invalid token symbol.'}), 400

# # API route for user withdrawal


# @app.route('/withdraw', methods=['POST'])
# def withdraw():
#     data = request.get_json()
#     user = data['user']
#     token_symbol = data['token']
#     amount = data['amount']
#     token = token_map.get(token_symbol.upper())

#     if token:
#         protocol.withdraw(user, token, amount)
#         return jsonify({'message': f'Withdrew {amount} {token_symbol} for {user}.'})
#     else:
#         return jsonify({'error': 'Invalid token symbol.'}), 400

# # API route for borrowing tokens


# @app.route('/borrow', methods=['POST'])
# def borrow():
#     data = request.get_json()
#     user = data['user']
#     token_symbol = data['token']
#     amount = data['amount']
#     collateral_symbol = data['collateral_token']
#     collateral_amount = data['collateral_amount']
#     token = token_map.get(token_symbol.upper())
#     collateral_token = token_map.get(collateral_symbol.upper())

#     if token and collateral_token:
#         protocol.borrow(user, token, amount,
#                         collateral_token, collateral_amount)
#         return jsonify({'message': f'{user} borrowed {amount} {token_symbol} with {collateral_amount} {collateral_symbol} as collateral.'})
#     else:
#         return jsonify({'error': 'Invalid token or collateral token symbol.'}), 400

# # API route for repaying loans


# @app.route('/repay', methods=['POST'])
# def repay():
#     data = request.get_json()
#     user = data['user']
#     token_symbol = data['token']
#     amount = data['amount']
#     token = token_map.get(token_symbol.upper())

#     if token:
#         protocol.repay(user, token, amount)
#         return jsonify({'message': f'{user} repaid {amount} {token_symbol}.'})
#     else:
#         return jsonify({'error': 'Invalid token symbol.'}), 400

# # API route to get user balances


# @app.route('/balances', methods=['GET'])
# def balances():
#     user = request.args.get('user')
#     if user:
#         user_balances = {
#             'USDC': usdc.balances.get(user, 0),
#             'ETH': eth.balances.get(user, 0),
#             'ARB': arbitrum.balances.get(user, 0),
#             'BASE': base.balances.get(user, 0)
#         }
#         return jsonify({'user': user, 'balances': user_balances})
#     else:
#         return jsonify({'error': 'User not specified.'}), 400

# # API route to get user deposits


# @app.route('/deposits', methods=['GET'])
# def get_deposits():
#     user = request.args.get('user')
#     if user:
#         deposits = protocol.deposits.get(user, {})
#         return jsonify({'user': user, 'deposits': deposits})
#     else:
#         return jsonify({'error': 'User not specified.'}), 400

# # API route to get user loans


# @app.route('/loans', methods=['GET'])
# def get_loans():
#     user = request.args.get('user')
#     if user:
#         loans = protocol.loans.get(user, {})
#         return jsonify({'user': user, 'loans': loans})
#     else:
#         return jsonify({'error': 'User not specified.'}), 400


# if __name__ == '__main__':
#     app.run(debug=True)





###################### test ############################




import sys
import csv
import os
from token import Token
from protocol import LendingProtocol

# Ensure UTF-8 encoding for special characters
sys.stdout.reconfigure(encoding='utf-8')

# Initialize tokens
usdc = Token('USD Coin', 'USDC')
eth = Token('Ethereum', 'ETH')
arbitrum = Token('Arbitrum', 'ARB')
base = Token('Base Token', 'BASE')

# Create token map
token_map = {
    'USDC': usdc,
    'ETH': eth,
    'ARB': arbitrum,
    'BASE': base
}

# Read wallet addresses from wallets.csv
wallets = []
# Construct the path to wallets.csv relative to current script
wallets_csv_path = os.path.join(os.path.dirname(__file__), '..', 'wallets.csv')

try:
    with open(wallets_csv_path, mode='r', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            wallets.append(row['address'])
except FileNotFoundError:
    print(f"Wallets file not found at path: {wallets_csv_path}")
    sys.exit(1)

# Check if we have at least one wallet
if len(wallets) < 1:
    print("No wallets found in wallets.csv.")
    sys.exit(1)

# Use the first wallet address as the user
user_address = wallets[0]

# Mint some tokens to the user
usdc.mint(user_address, 10000)
eth.mint(user_address, 10)
arbitrum.mint(user_address, 5000)
base.mint(user_address, 2000)

# Initialize protocol with token_map
protocol = LendingProtocol(token_map)

# User deposits tokens
protocol.deposit(user_address, usdc, 5000)
protocol.deposit(user_address, eth, 5)

# User borrows tokens (include collateral parameters)
protocol.borrow(user_address, arbitrum, 1000, collateral_token=usdc, collateral_amount=3000)

# User repays loan
protocol.repay(user_address, arbitrum, 500)

# User withdraws tokens
protocol.withdraw(user_address, usdc, 2000)

# Display balances
print(f"\nBalances for {user_address}:")
print(f"USDC: {usdc.balances.get(user_address, 0)}")
print(f"ETH: {eth.balances.get(user_address, 0)}")
print(f"ARB: {arbitrum.balances.get(user_address, 0)}")
print(f"BASE: {base.balances.get(user_address, 0)}")

print(f"\nDeposits for {user_address}:")
print(protocol.deposits.get(user_address, {}))

print(f"\nLoans for {user_address}:")
print(protocol.loans.get(user_address, {}))