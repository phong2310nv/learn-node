const { filterXSS } = require('xss');

module.exports = function xssMiddleware(options = {}) {
  return (req, res, next) => {
    const sanitize = (obj) => {
      if (!obj) return obj;

      if (typeof obj === 'string') {
        return filterXSS(obj, options);
      }

      if (Array.isArray(obj)) {
        return obj.map((item) => sanitize(item));
      }

      if (typeof obj === 'object') {
        const cleanObj = {};
        for (const key in obj) {
          cleanObj[key] = sanitize(obj[key]);
        }
        return cleanObj;
      }

      return obj;
    };

    ['body', 'query', 'params'].forEach((prop) => {
      if (req[prop]) {
        req[prop] = sanitize(req[prop]);
      }
    });

    next();
  };
};
