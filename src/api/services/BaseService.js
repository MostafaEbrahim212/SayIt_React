import HttpClient from './HttpClient';

/**
 * Base Service Class
 * All API services extend this class
 */
class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.http = HttpClient;
  }

  /**
   * Build URL with endpoint
   */
  buildUrl(path = '') {
    return path ? `${this.endpoint}/${path}` : this.endpoint;
  }

  /**
   * Generic GET request
   */
  async get(path = '', config = {}) {
    return this.http.get(this.buildUrl(path), config);
  }

  /**
   * Generic POST request
   */
  async post(path = '', data = {}, config = {}) {
    return this.http.post(this.buildUrl(path), data, config);
  }

  /**
   * Generic PUT request
   */
  async put(path = '', data = {}, config = {}) {
    return this.http.put(this.buildUrl(path), data, config);
  }

  /**
   * Generic PATCH request
   */
  async patch(path = '', data = {}, config = {}) {
    return this.http.patch(this.buildUrl(path), data, config);
  }

  /**
   * Generic DELETE request
   */
  async delete(path = '', config = {}) {
    return this.http.delete(this.buildUrl(path), config);
  }

  /**
   * Handle errors consistently
   */
  handleError(error) {
    console.error(`${this.endpoint} Error:`, error);
    throw error;
  }
}

export default BaseService;
