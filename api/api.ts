import { authConfig } from '../src/auth_config';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE = authConfig.apiOrigin;

export async function fetchContent() {
  const { getAccessTokenSilently } = useAuth0(); // ✅ Destructured from hook

  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: authConfig.audience,
    },
  });

  const res = await fetch(`${API_BASE}/content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Fetch failed: ${res.status} ${error}`);
  }

  return res.json();
}