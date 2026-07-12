import fs from 'fs';

const src = fs.readFileSync('src/data/item-images.ts', 'utf8');
const ids = [...new Set([...src.matchAll(/\bp\((\d+)\)/g)].map((m) => Number(m[1])))];
const foodishCalls = [...src.matchAll(/foodish\('([^']+)',\s*'([^']+)'(?:,\s*(\d+))?\)/g)];

function hashSeed(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

const foodishUrls = foodishCalls.map(([, type, seed, maxStr]) => {
  const max = maxStr ? Number(maxStr) : 15;
  const n = (hashSeed(seed) % max) + 1;
  return `https://foodish-api.com/images/${type}/${type}${n}.jpg`;
});

async function check(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

console.log('Pexels IDs to check:', ids.length);
const badPexels = [];
for (const id of ids) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1`;
  if (!(await check(url))) badPexels.push(id);
}
console.log('Bad Pexels:', badPexels.length ? badPexels.join(', ') : 'none');

const uniqueFoodish = [...new Set(foodishUrls)];
console.log('Foodish URLs to check:', uniqueFoodish.length);
const badFoodish = [];
for (const url of uniqueFoodish) {
  if (!(await check(url))) badFoodish.push(url);
}
console.log('Bad Foodish:', badFoodish.length);
badFoodish.forEach((u) => console.log(u));

process.exit(badPexels.length || badFoodish.length ? 1 : 0);
