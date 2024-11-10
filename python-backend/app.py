from flask import Flask, request, jsonify
from flask_cors import CORS
from token_model import Token
from protocol import LendingProtocol
from datetime import datetime
import hashlib
import time
import random

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:5173",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize tokens
usdc = Token('USD Coin', 'USDC')
eth = Token('Ethereum', 'ETH')
arbitrum = Token('Arbitrum', 'ARB')
bitcoin = Token('Bitcoin', 'BTC')  # Added Bitcoin support

# Transaction history list
Transaction_History = []

# Create token map
token_map = {
    'USDC': usdc,
    'ETH': eth,
    'ARB': arbitrum,
    'BTC': bitcoin  # Updated to include Bitcoin instead of Base
}

# Initialize protocol with token_map
protocol = LendingProtocol(token_map)

# Example user address (Replace this with actual user authentication in production)
user_address = 'user_wallet_address_here'

def calculate_dynamic_rate(amount):
    """
    Determines the interest rate based on the loan amount.

    Args:
        amount (float): The principal loan amount.

    Returns:
        float: The applicable interest rate.
    """
    base_rate = 0.03  # 3%
    rate_increment = 0.001  # 0.1% per $10,000
    amount_step = 10000  # $10,000 increments
    max_rate = 0.05  # 5%

    increments = int(amount // amount_step)
    rate = base_rate + (increments * rate_increment)

    if rate > max_rate:
        rate = max_rate

    return rate

def retrieve_crypto_hash():
    # Combine current time and a random number to ensure uniqueness
    unique_string = f"{time.time()}{random.randint(0, 1000000)}"
    # Encode the string to bytes
    unique_bytes = unique_string.encode('utf-8')
    # Generate SHA-256 hash
    crypto_hash = hashlib.sha256(unique_bytes).hexdigest()
    return crypto_hash

@app.route('/lend', methods=['POST'])
def lend():
    data = request.get_json()

    try:
        token_symbol = data.get('token')  # e.g., 'USDC', 'ETH', 'BTC'
        amount = float(data.get('amount', 0))
        time_period = float(data.get('time', 1))  # Time in years
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid input. Please provide valid token, amount, and time.'}), 400

    if not token_symbol or token_symbol.upper() not in token_map:
        return jsonify({'message': f'Token "{token_symbol}" is not supported.'}), 400

    if amount <= 0 or time_period <= 0:
        return jsonify({'message': 'Amount and time must be greater than zero.'}), 400

    token = token_map[token_symbol.upper()]

    # Perform deposit via protocol
    try:
        protocol.deposit(user_address, token, amount)
    except Exception as e:
        return jsonify({'message': f'Error during deposit: {str(e)}'}), 500

    # Calculate dynamic interest rate
    rate = calculate_dynamic_rate(amount)
    interest = amount * rate * time_period
    total = amount + interest

    # Generate transaction hash
    tx_hash = retrieve_crypto_hash()

    # Create transaction record
    transaction = {
        'tx_hash': tx_hash,
        'transaction_type': 'lend',
        'token': token_symbol.upper(),
        'amount': amount,
        'time': time_period,
        'rate': rate,
        'interest': interest,
        'total': total,
        'user_address': user_address,
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }

    # Store transaction
    Transaction_History.append(transaction)
    # print(Transaction_History)

    return jsonify({
        'message': 'Lending successful.',
        'tx_hash': tx_hash,
        'principal': amount,
        'rate': f"{rate * 100:.2f}%",  # Convert to percentage string
        'interest': round(interest, 8),
        'total': round(total, 8)
    }), 200

@app.route('/borrow', methods=['POST'])
def borrow():
    data = request.get_json()

    try:
        token_symbol = data.get('token')  # e.g., 'ARB', 'USDC', 'ETH', 'BTC'
        amount = float(data.get('amount', 0))
        collateral_token_symbol = data.get('collateral_token')  # e.g., 'USDC', 'ETH', 'BTC'
        collateral_amount = float(data.get('collateral_amount', 0))
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid input. Please provide valid tokens and amounts.'}), 400

    if not token_symbol or token_symbol.upper() not in token_map:
        return jsonify({'message': f'Token "{token_symbol}" is not supported.'}), 400

    if not collateral_token_symbol or collateral_token_symbol.upper() not in token_map:
        return jsonify({'message': f'Collateral token "{collateral_token_symbol}" is not supported.'}), 400

    if amount <= 0 or collateral_amount <= 0:
        return jsonify({'message': 'Amounts must be greater than zero.'}), 400

    token = token_map[token_symbol.upper()]
    collateral_token = token_map[collateral_token_symbol.upper()]

    # Perform borrow via protocol
    try:
        protocol.borrow(user_address, token, amount, collateral_token=collateral_token, collateral_amount=collateral_amount)
    except Exception as e:
        return jsonify({'message': f'Error during borrowing: {str(e)}'}), 500

    fee_rate = 0.02  # 2% borrowing fee
    fee = amount * fee_rate
    total_due = amount + fee

    # Generate transaction hash
    tx_hash = retrieve_crypto_hash()

    # Create transaction record
    transaction = {
        'tx_hash': tx_hash,
        'transaction_type': 'borrow',
        'token': token_symbol.upper(),
        'amount': amount,
        'collateral_token': collateral_token_symbol.upper(),
        'collateral_amount': collateral_amount,
        'fee_rate': fee_rate,
        'fee': fee,
        'total_due': total_due,
        'user_address': user_address,
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }

    # Store transaction
    Transaction_History.append(transaction)
    # print(Transaction_History)

    return jsonify({
        'message': 'Borrowing successful.',
        'tx_hash': tx_hash,
        'token': token_symbol.upper(),
        'amount': amount,
        'collateral_token': collateral_token_symbol.upper(),
        'collateral_amount': collateral_amount,
        'fee_rate': f"{fee_rate * 100:.2f}%",  # Convert to percentage string
        'fee': round(fee, 8),
        'total_due': round(total_due, 8)
    }), 200

@app.route('/transactions', methods=['GET'])
def get_transactions():
    # Return the list of all transactions
    return jsonify({'transactions': Transaction_History}), 200

# Ensure to run your Flask app
if __name__ == '__main__':
    app.run(debug=True)