import csv
import secrets
from eth_account import Account

############# ONLY RUN ONCE ###############

def create_wallets(num_wallets=5, filename='wallets.csv'):
    """
    Generate Ethereum wallets and save them to a CSV file.

    Parameters:
    - num_wallets (int): Number of wallets to generate.
    - filename (str): Name of the CSV file to save the wallets.
    """
    wallets = []

    for _ in range(num_wallets):
        # Generate a random 32-byte hexadecimal private key
        priv_key = secrets.token_hex(32)
        private_key = "0x" + priv_key
        # Create an account object from the private key
        acct = Account.from_key(private_key)
        # Retrieve the public address
        address = acct.address
        # Append the wallet details to the list
        wallets.append({'address': address, 'private_key': private_key})

    # Define the CSV file column headers
    csv_columns = ['address', 'private_key']

    try:
        # Write the wallet details to the CSV file
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            for wallet in wallets:
                writer.writerow(wallet)
        print(f"Successfully saved {num_wallets} wallets to '{filename}'.")
    except IOError as e:
        print(f"An error occurred while writing to the CSV file: {e}")

if __name__ == "__main__":
    create_wallets()
