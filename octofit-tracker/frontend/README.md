# OctoFit Tracker frontend

The presentation tier uses React 19, Vite, Bootstrap, and React Router. Start it
from the repository root with:

```sh
npm run dev --prefix octofit-tracker/frontend
```

## API configuration

For local development outside Codespaces, the frontend uses
`http://localhost:8000` when `VITE_CODESPACE_NAME` is unset.

When running in Codespaces, define `VITE_CODESPACE_NAME` in
`octofit-tracker/frontend/.env.local` using the Codespace name (not a URL):

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads this variable when it starts, so restart the development server after
changing `.env.local`. The API base URL will then be
`https://your-codespace-name-8000.app.github.dev`.

The resource views accept either plain JSON arrays or paginated responses
containing `results`, `items`, or `data` arrays.
