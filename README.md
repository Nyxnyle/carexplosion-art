# Carexplosion — Art & other things

A personal SvelteKit 5 art portfolio built for GitHub Pages. It includes 15 artworks from the artist's collection, a responsive gallery, category filters, an original-resolution viewer with keyboard navigation and zoom, animation playback controls, and a permanent page for each artwork.

## Run locally

On this Windows workspace, a portable Node.js runtime is already available. Run:

```powershell
.\dev.ps1
```

Open http://localhost:5173. Stop the server with Ctrl+C.

On a fresh checkout, install Node.js 24 LTS, then:

```sh
npm ci
npm run dev
```

## Edit the portfolio

- `src/lib/site.ts`: artist name, introduction, about text, and optional contact/social links. Empty links are hidden. The introduction and biography are editable starter copy.
- `content/artworks.json`: titles, categories, medium, image descriptions, and gallery order. Titles without an obvious source title are editable descriptive labels. The first artwork is featured on the home page.
- `static/art/originals/`: original-quality image files, renamed using artwork IDs. Their image bytes have not been recompressed. Native `.clip` documents, thumbnail duplicates, and a lower-quality duplicate of `Behave` were omitted.
- `src/app.css`: shared colours, typography, and spacing. Page-specific styles live in the Svelte components.

### Add an artwork

1. Add a record to `content/artworks.json` with a unique lowercase `id`, the source `file` name, `title`, `category`, `medium`, and meaningful `alt` text.
2. Copy the image to `static/art/originals/<id>.<extension>` (lowercase extension), or import all catalogued files from a folder:

   ```powershell
   npm run art:import -- "C:\Users\you\Pictures\Art"
   ```

3. Restart the dev server or run `npm run build`. Image previews and artwork data are generated automatically.

The importer never overwrites existing files or alters source images. To replace an artwork, explicitly replace its copy in `static/art/originals/`. To remove an artwork completely from the published site, remove both its catalogue entry and original file.

Responsive WebP previews are generated at up to 480, 960, and 1600 pixels wide, without upscaling. The original files remain available in the viewer and on artwork pages. GIF previews are still images; visitors choose when to play animations. All fonts are hosted with the site, with no third-party font requests.

## Deploy to GitHub Pages

The intended repository is `Nyxnyle/carexplosion-art`. GitHub repositories live directly under an account; `personal-project` can be used as a repository topic.

1. Create a public GitHub repository, then push this project's files to its `main` branch. Commit the original images and `package-lock.json`; previews and build output are generated in CI.
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. Run **Deploy art portfolio to GitHub Pages** from the Actions tab (future pushes to `main` deploy automatically).

The workflow reads the base path from GitHub Pages, so assets and artwork URLs work at `/carexplosion-art/`, an account root site, or a configured custom domain. It checks types, generates previews, prerenders every artwork page, and publishes `build/`. A `404.html` fallback and `.nojekyll` are included.

The expected address, after a successful deployment, is https://nyxnyle.github.io/carexplosion-art/.

Deployment follows the official [SvelteKit static adapter documentation](https://svelte.dev/docs/kit/adapter-static) and [GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Checks

```sh
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite checks desktop and mobile layouts, filters, image loading, original file access, viewer navigation and focus restoration, opt-in animation, direct artwork URLs, and no-JavaScript navigation.

Test the GitHub project subpath locally in PowerShell:

```powershell
$env:BASE_PATH = '/carexplosion-art'
npm run build
npm run test:e2e
Remove-Item Env:BASE_PATH
```

On this workspace, the downloaded browser is in `.cache/ms-playwright`. Set `$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD/.cache/ms-playwright"` before tests to use it. The local runtime, caches, dependencies, generated previews, and test output are ignored by Git.

All artwork remains the artist's property. Publishing the website does not grant a reuse licence for the artwork.
