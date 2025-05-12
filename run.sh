#!/bin/bash

WALLET_FILE="wallet.txt"
PROXY_FILE="proxy.txt"
MAX_PARALLEL=10

SUCCESS_LOG="success.log"
FAILED_LOG="failed.log"

> "$SUCCESS_LOG"
> "$FAILED_LOG"

if [[ ! -f "$WALLET_FILE" || ! -f "$PROXY_FILE" ]]; then
  echo "wallet.txt atau proxy.txt tidak ditemukan!"
  exit 1
fi

paste "$WALLET_FILE" "$PROXY_FILE" | while IFS=$'\t' read -r wallet proxy; do
  (
    delay=$((RANDOM % 3 + 1))  # Delay acak 1-3 detik
    sleep $delay

    output=$(node run.js "$wallet" "$proxy" 2>&1)
    if echo "$output" | grep -q "🎉"; then
      echo "[✅ SUCCESS] $wallet" >> "$SUCCESS_LOG"
      echo "$output" | grep "🎉"
    else
      echo "[❌ FAILED] $wallet" >> "$FAILED_LOG"
      echo "$output" | grep -E "❌|timeout|Error"
    fi
  ) &

  # Kontrol paralelisme
  while [[ $(jobs -r -p | wc -l) -ge $MAX_PARALLEL ]]; do
    sleep 1
  done
done

wait
echo "✅ Semua klaim selesai. Lihat $SUCCESS_LOG dan $FAILED_LOG"
