# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Git Setup Tips

### Save SSH Key Passphrase

If you use an SSH key with a passphrase and don't want to enter it every time, you can use the SSH agent:

```bash
# Start the SSH agent in the background
eval "$(ssh-agent -s)"

# Add your key to the agent (update path if needed)
ssh-add ~/.ssh/id_ed25519
```

To automatically do this when opening a terminal, add those lines to your shell profile (e.g., `~/.zshrc` or `~/.bashrc`).

---

### Push Changes to CMS Repo

If you're working within a monorepo and your CMS app is located in `apps/cms`, and you've already added a Git remote for it, you can push changes like this:

```bash
# Navigate to the CMS app
cd apps/cms

# Add, commit, and push changes
git add .
git commit -m "Describe your changes"
git push origin main  # or whichever branch you're using
```

If you haven't added the remote yet, you can do so with:

```bash
git remote add origin git@github.com:your-username/your-cms-repo.git
```

Replace `your-username/your-cms-repo` with your actual GitHub repo path.

```bash
cd plantingrootsrealty
git subtree push --prefix=apps/cms cms main 
```
