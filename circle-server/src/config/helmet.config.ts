import dotenv from "dotenv"
dotenv.config()

const client = process.env.CLIENT_UR;

import helmet from "helmet";

const helmetConfig = helmet({
  crossOriginResourcePolicy: false,

  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),

      "img-src": [
        "'self'",
        "data:",
         client || "http://localhost:8080"
      ],
    },
  },
});

export default helmetConfig;