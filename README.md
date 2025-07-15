# CMS Repository

This repository contains the CMS application, now separated from the main `plantingrootsrealty` monorepo. It uses `pnpm` as the package manager.

---

## Setup & Development

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

Open your browser to [http://localhost:3000](http://localhost:3000) (or the port shown in the console) to view the app.

---

## Environment Variables

Create a `.env` file in the root of the CMS repo with the following:

```env
VITE_GITHUB_TOKEN=your_github_personal_access_token
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-api-audience # optional
VITE_APP_ORIGIN=http://localhost:3000       # or your production URL
VITE_API_ORIGIN=http://localhost:3000/api   # or your production API URL
```

Replace the placeholders with your actual credentials and URLs.

---

## Git & Deployment

### Save SSH Key Passphrase (Optional)

If your SSH key has a passphrase and you want to avoid entering it every time:

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key (update the path if necessary)
ssh-add ~/.ssh/id_ed25519
```

Add these lines to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.) to automate this on terminal start.

---

### Push Changes to CMS Repository

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Verify your remote:

```bash
git remote -v
```

If the remote is missing or incorrect, add it with:

```bash
git remote add origin git@github.com:your-username/your-cms-repo.git
```

Replace `your-username/your-cms-repo` with your actual GitHub path.

---

## Build & Preview

### Build production-ready files

```bash
pnpm build
```

### Preview the production build locally

```bash
pnpm preview
```

The `build` command outputs the production assets to the `dist/` folder.

---

## Deployment Notes

- When deploying (e.g., on Vercel, Netlify), set the **project root** to this CMS repo folder, **not** the old monorepo root.

- Set environment variables in your deployment platform’s dashboard matching the `.env` keys.

- Serve the `dist/` folder contents in production.

---

## Additional Tips

- Keep `.env` files out of Git to protect secrets.

- Use `.gitignore` to exclude `node_modules/`, `.env`, and other local files.

- For more help, refer to official docs or ask.

---

Happy coding! 🚀
