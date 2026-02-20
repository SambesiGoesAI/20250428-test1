#!/usr/bin/env node

/**
 * List all available ElevenLabs voices in your account
 * This helps identify which voices are available in your plan tier
 */

import https from 'https';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually (no dotenv dependency needed)
let ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
try {
  const envContent = readFileSync(join(__dirname, '../.env'), 'utf8');
  const match = envContent.match(/VITE_ELEVENLABS_API_KEY=(.+)/);
  if (match) ELEVENLABS_API_KEY = match[1].trim();
} catch {
  // .env not found, fall back to environment variable
}

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
