const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const url = urlMatch[1].trim();
const key = keyMatch[1].trim();

fetch(url + '/rest/v1/', { headers: { 'apikey': key, 'Accept': 'application/openapi+json' } })
  .then(res => res.json())
  .then(data => {
    console.log("Tables:");
    console.log(Object.keys(data.definitions || data.components?.schemas || {}));
  });
