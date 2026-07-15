# Shiva Rudraksha GitHub Catalogue

A React/Vite static catalogue whose product manager commits product images and data directly to GitHub.

See `GITHUB_PRODUCT_MANAGER_SETUP.md` for the complete setup.

## Local development

```bash
npm install
npm run dev
```

Catalogue:

`http://localhost:5173/shiva-rudraksha-react/`

Product Manager:

`http://localhost:5173/shiva-rudraksha-react/#admin`

## Production build

```bash
npm run build
```

## Repository storage

- Product images: `public/images/products/`
- Product data: `public/data/products.json`
- Deployment: `.github/workflows/deploy.yml`
