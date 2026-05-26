const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const url = urlMatch[1].trim();
const key = keyMatch[1].trim();

async function run() {
  console.log('Signing up via REST API...');
  const res = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'namdh09102@gmail.com',
      password: 'admin0910'
    })
  });
  
  const data = await res.json();
  if (!res.ok) {
    console.error('Signup error:', data);
    return;
  }
  
  console.log('Signup success:', data.id || data.user?.id);
  
  const userId = data.id || data.user?.id;
  if (userId) {
    console.log('Inserting into profiles...');
    const pRes = await fetch(`${url}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${data.session?.access_token || key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: userId,
        name: 'Nam (Admin)',
        email: 'namdh09102@gmail.com',
        role: 'admin',
        tier: 'pro',
        grade_level: 'none'
      })
    });
    
    if (!pRes.ok) {
      console.error('Profile error:', await pRes.text());
    } else {
      console.log('Profile created successfully with role admin!');
    }
  }
}
run();
