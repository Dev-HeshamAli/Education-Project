import Cookies from "universal-cookie";

const cookies = new Cookies();

class CookieService {
  // Get cookie
  getCookie(name) {
    return cookies.get(name);
  }

  // Set cookie
  setCookie(name, value, options) {
    cookies.set(name, value, options);
  }

  // Delete cookie
  removeCookie(name, options) {
    cookies.remove(name, options);
  }
}

export default new CookieService();
