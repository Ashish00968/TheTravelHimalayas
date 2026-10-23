#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver)
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs                     # Submits all URLs found in sitemap
 *   node scripts/submit-indexnow.mjs <url1> <url2> ...   # Submits specific URLs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const HOST = 'discoverhimalayantrails.com';
const KEY = '7bc52813ba4a255b326df2be79b9b3b8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BING_ENDPOINT = 'https://www.bing.com/indexnow';

async function getUrls() {
  const customUrls = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  if (customUrls.length > 0) {
    return customUrls.map((u) => (u.startsWith('http') ? u : `https://${HOST}${u.startsWith('/') ? '' : '/'}${u}`));
  }

  // Look for out/sitemap.xml first
  const sitemapPath = path.join(rootDir, 'out', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf-8');
    const matches = [...xml.matchAll(/<loc>(https:\/\/discoverhimalayantrails\.com[^<]*)<\/loc>/g)];
    const urls = matches.map((m) => m[1].trim());
    if (urls.length > 0) {
      return [...new Set(urls)];
    }
  }

  // Fallback: fetch live sitemap
  try {
    console.log('Fetching live sitemap from https://discoverhimalayantrails.com/sitemap.xml ...');
    const res = await fetch(`https://${HOST}/sitemap.xml`);
    if (res.ok) {
      const xml = await res.text();
      const matches = [...xml.matchAll(/<loc>(https:\/\/discoverhimalayantrails\.com[^<]*)<\/loc>/g)];
      const urls = matches.map((m) => m[1].trim());
      if (urls.length > 0) {
        return [...new Set(urls)];
      }
    }
  } catch (err) {
    console.warn('Could not fetch live sitemap:', err.message);
  }

  // Core fallback URLs
  return [
    `https://${HOST}/`,
    `https://${HOST}/explore`,
    `https://${HOST}/map`,
    `https://${HOST}/conditions`,
    `https://${HOST}/safety`,
    `https://${HOST}/plan/trek-finder`,
    `https://${HOST}/explore/himachal-pradesh`,
    `https://${HOST}/explore/uttarakhand`,
    `https://${HOST}/explore/ladakh`,
    `https://${HOST}/explore/jammu-kashmir`,
  ];
}

async function submitBatch(endpoint, endpointName, urls) {
  console.log(`\nSubmitting ${urls.length} URLs to ${endpointName} (${endpoint}) ...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    if (res.status === 200) {
      console.log(`[SUCCESS] ${endpointName} responded with HTTP 200 (OK: Submitted successfully)`);
    } else if (res.status === 202) {
      console.log(`[ACCEPTED] ${endpointName} responded with HTTP 202 (Accepted: Key validation in progress)`);
    } else {
      console.warn(`[STATUS ${res.status}] ${endpointName} responded: ${bodyText || res.statusText}`);
    }
    return { ok: res.ok || res.status === 202, status: res.status };
  } catch (err) {
    console.error(`[ERROR] Failed to connect to ${endpointName}:`, err.message);
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('=== Discover Himalayan Trails — IndexNow Submitter ===');
  console.log(`Host:         ${HOST}`);
  console.log(`Key:          ${KEY}`);
  console.log(`Key Location: ${KEY_LOCATION}`);

  const urls = await getUrls();
  console.log(`Total URLs to submit: ${urls.length}`);

  // IndexNow allows max 10,000 URLs per request
  const BATCH_SIZE = 10000;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await submitBatch(ENDPOINT, 'IndexNow Central (api.indexnow.org)', batch);
    await submitBatch(BING_ENDPOINT, 'Bing IndexNow (bing.com)', batch);
  }

  console.log('\n=== IndexNow Submission Completed ===');
  console.log('Note: If deploying for the first time, Bing will verify the key at:');
  console.log(`  ${KEY_LOCATION}`);
  console.log('Once Cloudflare Pages deployment is live, the key will validate immediately.\n');
}

main().catch((err) => {
  console.error('Fatal error running IndexNow submitter:', err);
  process.exit(1);
});
