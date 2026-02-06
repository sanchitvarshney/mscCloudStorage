const COOKIE_PATH = "/";
const COOKIE_MAX_AGE_DAYS = 365;

export function setCookie(name: string, value: string, options?: { maxAgeDays?: number }): void {
  const maxAge = (options?.maxAgeDays ?? COOKIE_MAX_AGE_DAYS) * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};path=${COOKIE_PATH};max-age=${maxAge};SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const nameEq = `${encodeURIComponent(name)}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.startsWith(" ")) c = c.slice(1);
    if (c.startsWith(nameEq)) return decodeURIComponent(c.slice(nameEq.length));
  }
  return null;
}

export const BREADCRUMB_COOKIE_NAME = "filemanager_breadcrumb";

export interface BreadcrumbSegment {
  id: string | null;
  name: string;
}

export interface BreadcrumbData {
  view: string;
  segments: BreadcrumbSegment[];
}

export function getBreadcrumbFromCookie(): BreadcrumbData | null {
  const raw = getCookie(BREADCRUMB_COOKIE_NAME);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as BreadcrumbData;
    if (data?.view && Array.isArray(data?.segments)) return data;
  } catch {
    // ignore
  }
  return null;
}

export function setBreadcrumbCookie(data: BreadcrumbData): void {
  setCookie(BREADCRUMB_COOKIE_NAME, JSON.stringify(data));
}
