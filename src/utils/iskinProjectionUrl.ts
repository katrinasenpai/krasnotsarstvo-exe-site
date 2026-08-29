export const iskinProjectionPath = 'iskin-projection';
export const iskinArPath = 'iskin-ar';
export const bookOraclePath = 'book-oracle';

const localhostNames = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/**
 * Адрес QR можно задать при локальном запуске через VITE_ISKIN_QR_BASE_URL.
 * Без настройки он повторяет адрес, по которому открыта страница: это удобно,
 * когда сайт уже открыт на компьютере по LAN-адресу.
 */
export function getIskinProjectionUrl() {
  const configuredBaseUrl = import.meta.env.VITE_ISKIN_QR_BASE_URL?.trim();
  const baseUrl = configuredBaseUrl || window.location.origin;
  const appBasePath = import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, '');
  const path = [appBasePath, iskinProjectionPath].filter(Boolean).join('/');
  const url = new URL(path, `${baseUrl.replace(/\/$/, '')}/`);

  return {
    url: url.toString(),
    isNetworkAddress: !localhostNames.has(url.hostname.toLowerCase()),
  };
}
