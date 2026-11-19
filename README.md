<div align="center">

<img src="public/logo.svg" alt="NextBooks" width="72" height="72" />

# NextBooks

NextBooks is built from a Goodreads dataset of over 2,000,000 books. The live catalog includes books with usable cover images and uses [Next.js 16.3](https://nextjs.org/blog/next-16-3), Drizzle, PostgreSQL, and [Instant Navigations](https://nextjs.org/blog/next-16-3-instant-navigations).

[**Live demo →**](https://www.next-books.dev)

</div>

---

Rebuild of [vercel-labs/book-inventory](https://github.com/vercel-labs/book-inventory), now archived. [Full dataset here](https://mengtingwan.github.io/data/goodreads.html).

## Instant Navigations

See [Ensuring instant navigations](https://nextjs.org/docs/app/guides/instant-navigation).

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache each query with `'use cache'` and `cacheLife`. See [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components).
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches the shared App Shell of links entering the viewport.
- **[Per-link prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching#resolve-url-data-at-prefetch-time)** prioritizes the initial browsing path: book links on the first catalog page and pagination links use `prefetch={true}`, while book links on later pages wait for hover or keyboard focus before resolving their URL-dependent content.
- **[Fast Link](https://github.com/vercel-labs/fast-link)** starts eligible mouse navigation on press for book cards, while preserving hover and focus prefetching. Pagination uses Next.js links so its inline loading indicators still work.

## Run locally

```bash
pnpm install
pnpm dev
```

`POSTGRES_URL` is optional. Without it the app serves a small preview catalog.

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Testing

[`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) with [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant), asserting navigations stay instant. Runs in CI.

```bash
pnpm test:e2e
```

## Database

The original dataset contains more than two million Goodreads books. The schema uses PostgreSQL's `unaccent` extension for accent-insensitive title search:

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

The source dataset is available from the [UCSD Book Graph project](https://mengtingwan.github.io/data/goodreads.html).

Set `POSTGRES_URL`, then create the schema and load the bundled four-book sample:

```bash
pnpm db:setup
```

Optionally generate the cover-image placeholders after seeding:

```bash
pnpm db:seed-thumbhash
```

To import the complete UCSD Goodreads catalog, download the compressed book
and author metadata files into the ignored `data/` directory. The seeders read
gzip files directly, preserve Goodreads IDs, and checkpoint large imports:

```bash
mkdir -p data
curl -L https://mcauleylab.ucsd.edu/public_datasets/gdrive/goodreads/goodreads_book_authors.json.gz -o data/authors.json.gz
curl -L https://mcauleylab.ucsd.edu/public_datasets/gdrive/goodreads/goodreads_books.json.gz -o data/books.json.gz

AUTHORS_DATA_PATH=./data/authors.json.gz TOTAL_AUTHORS=829529 pnpm db:seed-authors
BOOKS_DATA_PATH=./data/books.json.gz TOTAL_BOOKS=2360655 pnpm db:seed-books
```
