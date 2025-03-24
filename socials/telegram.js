const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

// Telegram Bot Token from BotFather
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_NAME = process.env.TELEGRAM_CHANNEL;
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME;

// Validate Telegram authentication data
function validateTelegramData(authData) {
  const hash = authData.hash;
  delete authData.hash;
  
  const dataCheckString = Object.keys(authData)
    .sort()
    .map(key => `${key}=${authData[key]}`)
    .join('\n');
  
  const secretKey = crypto.createHash('sha256')
    .update(BOT_TOKEN)
    .digest();
  
  const computedHash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return computedHash === hash;
}

// 1. Handle Telegram authentication
router.post('/auth', (req, res) => {
    console.log('Telegram Auth');
  const authData = req.body;
  
  if (!validateTelegramData(authData)) {
    return res.status(401).json({ error: 'Invalid authentication data' });
  }

  const user = {
    id: authData.id,
    first_name: authData.first_name,
    last_name: authData.last_name || '',
    username: authData.username || '',
    photo_url: authData.photo_url || ''
  };

  res.json({ 
    success: true,
    user 
  });
});

// 2. Verify channel membership
router.post('/verify', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const response = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: CHANNEL_NAME,
          user_id: userId
        }
      }
    );

    const status = response.data.result?.status;
    const isMember = ['member', 'administrator', 'creator'].includes(status);
    
    res.json({ 
      isMember,
      status
    });
    
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to verify membership',
      details: error.response?.data || error.message 
    });
  }
});

// 3. Get bot info (optional)
router.get('/bot-info', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getMe`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bot info' });
  }
});

module.exports = router;