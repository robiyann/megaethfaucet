from eth_account import Account
import os

# Aktifkan kemampuan entropy
Account.enable_unaudited_hdwallet_features()

def generate_wallets(count):
    addresses = []
    private_keys = []

    for _ in range(count):
        acct = Account.create()
        addresses.append(acct.address)
        private_keys.append(acct.key.hex())

    return addresses, private_keys

def save_to_file(filename, data):
    with open(filename, 'w') as f:
        for line in data:
            f.write(f"{line}\n")

def main():
    try:
        count = int(input("Berapa address yang ingin kamu buat? "))
        if count <= 0:
            print("Jumlah harus lebih dari 0.")
            return
    except ValueError:
        print("Masukkan angka yang valid.")
        return

    addresses, private_keys = generate_wallets(count)
    save_to_file("wallet.txt", addresses)
    save_to_file("pk.txt", private_keys)

    print(f"\n✅ Berhasil membuat {count} wallet.")
    print("📁 wallet.txt dan pk.txt telah dibuat.")

if __name__ == "__main__":
    main()
