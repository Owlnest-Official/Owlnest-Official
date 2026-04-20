# IndexNow

## Key File

- Key: `233e9c55-e142-4e7d-83b2-adaf541519d7`
- Key file path: `/233e9c55-e142-4e7d-83b2-adaf541519d7.txt`
- Key file URL: `https://owlnestofficial.com/233e9c55-e142-4e7d-83b2-adaf541519d7.txt`

## Important URLs To Submit

- `https://owlnestofficial.com/`
- `https://owlnestofficial.com/science`
- `https://owlnestofficial.com/products.html`
- `https://owlnestofficial.com/ai-brief.html`
- `https://owlnestofficial.com/ai/evidence.html`
- `https://owlnestofficial.com/llms.txt`
- `https://owlnestofficial.com/llms-full.txt`
- `https://owlnestofficial.com/ai/product.json`
- `https://owlnestofficial.com/ai/evidence.json`
- `https://owlnestofficial.com/sitemap.xml`

## Manual Submission Endpoint Format

Use the IndexNow global endpoint:

```text
https://api.indexnow.org/indexnow?url={URL-ENCODED_PUBLIC_URL}&key=233e9c55-e142-4e7d-83b2-adaf541519d7
```

Example:

```text
https://api.indexnow.org/indexnow?url=https%3A%2F%2Fowlnestofficial.com%2Fscience&key=233e9c55-e142-4e7d-83b2-adaf541519d7
```

For multiple URLs, submit a JSON POST request to:

```text
https://api.indexnow.org/indexnow
```

Example payload:

```json
{
  "host": "owlnestofficial.com",
  "key": "233e9c55-e142-4e7d-83b2-adaf541519d7",
  "urlList": [
    "https://owlnestofficial.com/",
    "https://owlnestofficial.com/science",
    "https://owlnestofficial.com/products.html"
  ]
}
```

## When To Submit Again

Submit updated URLs again when:

- a public page is added
- a public page is updated
- a public page is deleted
- canonical URLs change
- major metadata or structured data changes
- redirects affecting public URLs change
- sitemap.xml is updated

## Notes

- The root key file should stay publicly accessible without login.
- The file contents must exactly match the filename key.
- IndexNow submissions only notify participating search engines; they do not guarantee indexing.
