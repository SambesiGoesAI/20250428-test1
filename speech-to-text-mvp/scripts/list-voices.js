#!/usr/bin/env node

/**
 * List all available ElevenLabs voices in your account
 * This helps identify which voices are available in your plan tier
 */

const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('❌ Error: VITE_ELEVENLABS_API_KEY not found in .env file');
  process.exit(1);
}

function listVoices() {
  const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/voices',
    method: 'GET',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('\n🎙️  Available Voices in Your Account:\n');
        console.log('=' .repeat(80));

        response.voices.forEach((voice, index) => {
          console.log(`\n${index + 1}. ${voice.name}`);
          console.log(`   Voice ID: ${voice.voice_id}`);
          console.log(`   Category: ${voice.category || 'N/A'}`);
          console.log(`   Labels: ${JSON.stringify(voice.labels || {})}`);
          console.log(`   Description: ${voice.description || 'No description'}`);

          // Check if it supports Finnish
          if (voice.labels && voice.labels.language) {
            console.log(`   Language: ${voice.labels.language}`);
          }
        });

        console.log('\n' + '='.repeat(80));
        console.log(`\n✅ Total voices available: ${response.voices.length}\n`);

        // Filter Finnish or multilingual voices
        const finnishVoices = response.voices.filter(v =>
          v.labels?.language === 'fi' ||
          v.labels?.language === 'finnish' ||
          v.name.toLowerCase().includes('finnish') ||
          v.description?.toLowerCase().includes('finnish')
        );

        const multilingualVoices = response.voices.filter(v =>
          v.labels?.['use case']?.includes('multilingual') ||
          v.description?.toLowerCase().includes('multilingual')
        );

        if (finnishVoices.length > 0) {
          console.log('\n🇫🇮 Finnish-specific voices:');
          finnishVoices.forEach(v => console.log(`   - ${v.name} (${v.voice_id})`));
        }

        if (multilingualVoices.length > 0) {
          console.log('\n🌍 Multilingual voices (support Finnish):');
          multilingualVoices.forEach(v => console.log(`   - ${v.name} (${v.voice_id})`));
        }

      } else {
        console.error(`❌ API Error: ${res.statusCode}`);
        console.error(data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.end();
}

listVoices();
