# Product catalog template

This is a reusable, data-driven product listing site. The layout, cards, photo viewer, category filtering, and price sorting are already built. To make it your own, replace the catalog data and product photos.

## Add or edit products

1. Put product images in `public/photos/`.
2. Open `src/data/items.json`.
3. Add an item to the `items` array using the image filenames you uploaded.

Minimal item example:

```json
{
  "id": 100,
  "name": "Ceramic Table Lamp",
  "category": "Furniture",
  "price": 25,
  "status": "available",
  "visible": true,
  "order": 1,
  "photos": ["ceramic-lamp-front.jpg", "ceramic-lamp-side.jpg"]
}
```

Required fields:

- `id`: a unique number
- `name`: the product title
- `category`: any category name; the filter menu is generated from the catalog
- `price`: a number without a currency symbol; use `0` to display **Free**
- `photos`: one or more filenames from `public/photos/`

Common optional fields:

- `retail`: shows the original price with a strikethrough
- `condition`: shows a badge over the image
- `cardDescription`: shows a short detail beneath the product name, such as `Size 10`
- `size`: shows a size badge
- `link`: adds a “View original” link
- `order`: controls the default listing order
- `visible`: set to `false` to keep an old item in the source without showing it
- `status`: use `sold` to display the sold treatment, or `available` for a normal listing

The `shop` section at the top of `items.json` controls:

- `title`: the browser-tab title
- `currency`: the three-letter currency code used for prices, such as `USD` or `CAD`
- `footer`: the contact message shown at the bottom of the catalog
- `categories`: the preferred filter order; any additional product category is appended automatically

The catalog validates required fields, duplicate IDs, prices, and photo lists when the app starts. Invalid entries produce a focused error that points to the listing that needs attention.

## Sorting behavior

The site includes three sorting modes:

- **Default** uses each item's `order`
- **Price: Low to High** puts free items first, then sorts by increasing price
- **Price: High to Low** sorts by decreasing price

Items with the same price retain their default catalog order.

## Run locally

```bash
npm install
npm run dev
```

## Customize the site

- Catalog data: `src/data/items.json`
- Product photos: `public/photos/`
- Colors and typography: `src/index.css`
- Page title and sharing metadata: `index.html`
- Favicon: `public/favicon.png`

## GitHub Pages

The included workflow deploys the site whenever `main` changes. It automatically uses the GitHub repository name as the Pages base path, so the source can be copied into a differently named repository without editing `vite.config.ts`.
