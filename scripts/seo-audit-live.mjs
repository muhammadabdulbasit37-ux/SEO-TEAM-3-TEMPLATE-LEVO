import https from 'node:https';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOAudit/1.0)' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () =>
          resolve({ status: res.statusCode, location: res.headers.location, body }),
        );
      })
      .on('error', reject);
  });
}

const urls = [
  'https://eftcheat.net/',
  'https://www.eftcheat.net/',
  'https://eftcheat.net/index.html',
  'https://eftcheat.net/product',
  'https://eftcheat.net/blog',
  'https://eftcheat.net/faq',
];

for (const url of urls) {
  const r = await get(url);
  const canon = r.body.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const title = r.body.match(/<title>([^<]+)<\/title>/)?.[1];
  const desc = r.body.match(/name="description" content="([^"]+)"/)?.[1];
  const h1 = (r.body.match(/<h1[\s>]/g) || []).length;
  console.log(JSON.stringify({ url, status: r.status, location: r.location, canon, h1, titleLen: title?.length, descLen: desc?.length, title, desc }));
}
