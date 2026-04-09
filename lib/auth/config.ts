type Config = {
  jwt: JWTConfig;
};

type JWTConfig = {
  defaultDuration: number;
  secret: string;
  issuer: string;
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  jwt: {
    defaultDuration: 60 * 60, // 1 hour in seconds
    secret: envOrThrow("SESSION_SECRET"),
    issuer: "spendi"
  }
};
