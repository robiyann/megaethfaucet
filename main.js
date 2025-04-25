const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxy = process.argv[3];
const agent = new HttpsProxyAgent(proxy);

const sitekey = '0x4AAAAAABA4JXCaw9E2Py-9';
const url = 'https://testnet.megaeth.com/';
const claimUrl = 'https://carrot.megaeth.com/claim';
const address = process.argv[2];

async function solveAndClaim() {
  try {
    const start = await axios.get('http://localhost:5000/turnstile', {
      params: { url, sitekey }
    });

    const taskId = start.data.task_id;
    console.log(`[🔄] Request solve with task_id: ${taskId}`);

    let token;
    for (let i = 0; i < 30; i++) {
      const res = await axios.get('http://localhost:5000/result', {
        params: { id: taskId }
      });

      if (res.data?.value) {
        token = res.data.value;
        console.log(`[✅] Got token: ${token.slice(0, 10)}...`);
        break;
      }

      console.log('[⏳] Waiting for CAPTCHA solver...');
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!token) throw new Error('Token solving timeout or failed');

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

    console.log('[🎉] Claim success:', response.data);
  } catch (err) {
    console.error('[❌] Error:', err.response?.data || err.message);
  }
}

solveAndClaim();
