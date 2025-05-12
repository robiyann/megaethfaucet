const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const address = process.argv[2];
const proxy = process.argv[3];

if (!address || !proxy) {
  console.error("[❌] Argumen wallet dan proxy wajib diisi: node run.js <wallet> <proxy>");
  process.exit(1);
}

const sitekey = '0x4AAAAAABA4JXCaw9E2Py-9';
const url = 'https://testnet.megaeth.com/';
const claimUrl = 'https://carrot.megaeth.com/claim';

const agent = new HttpsProxyAgent(proxy);

async function solveAndClaim() {
  try {
    const start = await axios.get('http://localhost:6000/turnstile', {
      params: { url, sitekey }
    });

    const taskId = start.data.task_id;
    console.log(`[🔄] ${address} - Request solve task_id: ${taskId}`);

    let token;
    for (let i = 0; i < 30; i++) {
      const res = await axios.get('http://localhost:6000/result', {
        params: { id: taskId }
      });

      if (res.data?.value) {
        token = res.data.value;
        console.log(`[✅] ${address} - Got token: ${token.slice(0, 10)}...`);
        break;
      }

      await new Promise(r => setTimeout(r, 2000));
    }

    if (!token) {
      throw new Error('Token solving timeout or failed');
    }

    const response = await axios.post(claimUrl, {
      addr: address,
      token: token
    }, {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Origin": "https://testnet.megaeth.com",
        "Referer": "https://testnet.megaeth.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
      },
      httpsAgent: agent,
      httpAgent: agent,
    });

    console.log(`[🎉] Claimed ${address}: ${JSON.stringify(response.data)}`);
  } catch (err) {
    console.error(`[❌] Failed ${address}: ${err.response?.data || err.message}`);
  }
}

solveAndClaim();
