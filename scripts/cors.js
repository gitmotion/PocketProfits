const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';
const NODE_ENV = process.env.NODE_ENV || 'production';
let allowedOrigins = [];

function setupOrigins(baseUrl) {
    if (NODE_ENV === 'development' || ALLOWED_ORIGINS === '*') allowedOrigins = '*';
    else if (ALLOWED_ORIGINS && typeof ALLOWED_ORIGINS === 'string') {
        try {
          allowedOrigins.push(baseUrl);
          const allowed = ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
          allowed.forEach(origin => {
              const normalizedOrigin = normalizeOrigin(origin);
              if (normalizedOrigin !== baseUrl) allowedOrigins.push(normalizedOrigin);
          });
        }
        catch (error) {
            console.error(`Error setting up ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}:`, error);
        }
    }
    console.log("ALLOWED ORIGINS:", allowedOrigins);
    return allowedOrigins;
}

function normalizeOrigin(origin) {
  if (origin) {
      try {
          console.log("Validating Origin:", origin);
          const normalizedOrigin = new URL(origin).origin;
          console.log("Normalized Url:", normalizedOrigin);
          return normalizedOrigin;
      } catch (error) {
          console.error("Error parsing referer URL:", error);
          throw new Error("Error parsing referer URL:", error);
      }
  }
}

function validateOrigin(origin) {
  if (NODE_ENV === 'development' || allowedOrigins === '*') return true;

  try {
      if (origin) origin = normalizeOrigin(origin);
      else {
          console.warn("No origin to validate.");
          return false;
      }

      if (allowedOrigins.includes(origin)) return true; 
      else {
          console.warn("Blocked request from origin:", { origin });
          return false;
      }
  }
  catch (error) {
      console.error(error);
  }
}

function originValidationMiddleware(req, res, next) {
  let origin = `${req.protocol}://${req.headers.host}`;
  const isOriginValid = validateOrigin(origin);

  if (isOriginValid) {
      return next();
  } else {
      console.warn("Blocked request from origin:", { origin });
      res.status(403).json({ error: 'Forbidden' });
  }
}


function getCorsOptions(baseUrl) {
  const allowedOrigins = setupOrigins(baseUrl);
  const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  return corsOptions;
}

module.exports = { getCorsOptions, originValidationMiddleware };