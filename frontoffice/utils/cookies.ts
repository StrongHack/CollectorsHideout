import Cookies from 'js-cookie';

/**
 * Sets cookie 
 * 
 * @param key key of cookie
 * @param value value of cookie
 */
export const setCookie = (key: string, value: any) => {
  Cookies.set(key, value, { expires: 1, path: '/' }); // You can customize the options
};

/**
 * Gets cookie
 * 
 * @param key key of cookie
 * @returns value for given key
 */
export const getCookie = (key: string) => {
  return Cookies.get(key);
};

/**
 * Removes cookie by given key
 * 
 * @param key key of cookie
 */
export const removeCookie = (key: string) => {
  Cookies.remove(key, { path: '/' });
};
