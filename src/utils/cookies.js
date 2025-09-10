

import Cookies from "universal-cookie";

const cookies = new Cookies();

class CookieService {
  // Get cookie
  getCookie(name) {
    return cookies.get(name);
  }

  // Set cookie
  setCookie(name, value, options = {}, expiresInSeconds) {
    let finalOptions = { path: "/", ...options };

    if (expiresInSeconds) {
      const expireDate = new Date(Date.now() + (expiresInSeconds - 30) * 1000);
      finalOptions.expires = expireDate;
    }

    cookies.set(name, value, finalOptions);
  }

  // Delete cookie
  removeCookie(name, options) {
    cookies.remove(name, { path: "/", ...options });
  }
}

export default new CookieService();
