const AUTH_STORAGE_KEY = 'editor_authenticated';

export function getEditorCredentials() {
  const username =
    (typeof import.meta !== 'undefined' && import.meta.env?.EDITOR_USERNAME) ||
    'admin';

  const password =
    (typeof import.meta !== 'undefined' && import.meta.env?.EDITOR_PASSWORD) ||
    '';

  return { username: username.trim(), password };
}

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
  } catch {}
}

export function verifyEditorCredentials(inputUser: string, inputPass: string): boolean {
  const { username, password } = getEditorCredentials();
  if (!password) {
    console.warn('EDITOR_PASSWORD is not configured in environment variables.');
    return false;
  }
  return inputUser.trim() === username && inputPass === password;
}

export function logoutEditor(): void {
  setEditorAuthenticated(false);
}

