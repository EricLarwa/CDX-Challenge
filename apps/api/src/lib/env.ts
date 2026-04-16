const fallbackJwtSecret = 'development-jwt-secret-that-should-be-overridden';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? fallbackJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
};
