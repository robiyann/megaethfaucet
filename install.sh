#!/bin/bash

set -e

echo "📦 Update & upgrade sistem..."
sudo apt update && sudo apt upgrade -y

pip install -r req.py

echo "📥 Install curl dan Node.js LTS..."
sudo apt install curl -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y
sudo apt install npm -y

echo "🧪 Cek versi Node.js dan npm..."
node -v
npm -v

echo "🧰 Inisialisasi project npm dan install dependensi..."
npm init -y
npm install axios https-proxy-agent

echo " SEMUA SUDAH TERINSTALL YA TOD"
