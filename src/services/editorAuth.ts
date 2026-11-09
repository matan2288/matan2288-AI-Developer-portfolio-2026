const AUTH_STORAGE_KEY = 'editor_authenticated';

export function isEditorAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setEditorAuthenticated(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (authenticated) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch { }
}

    export async function verifyEditorCredentials(inputUser: string, inputPass: string): Promise<boolean> {
      try {
        const payload = JSON.stringify({
          username: inputUser,
          password: inputPass,
        });
        const headers = { 'Content-Type': 'application/json' };

        let res = await fetch('/api/editor-auth', {
          method: 'POST',
          headers,
          body: payload,
        });

        if (res.status === 404) {
          try {
            const netlifyRes = await fetch('/.netlify/functions/editor-auth', {
              method: 'POST',
              headers,
              body: payload,
            });
            if (netlifyRes.status !== 404) {
              res = netlifyRes;
            }
          } catch (fallbackErr) {
            console.warn('Netlify editor-auth function fallback error:', fallbackErr);
          }
        }

        if (res.ok) {
          const data = await res.json();
          return !!data.success;
        }
        return false;
      } catch (err) {
        console.error('Editor authentication request failed:', err);
        return false;
      }
    }

    export function logoutEditor(): void {
      setEditorAuthenticated(false);
    }
