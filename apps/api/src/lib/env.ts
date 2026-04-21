const fallbackJwtSecret = 'development-jwt-secret-that-should-be-overridden';

const splitUrlList = (value?: string) =>
  value
    ?.split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0) ?? [];

const frontendLocalUrl = process.env.FRONTEND_LOCAL_URL ?? 'http://localhost:5173';
const frontendProductionUrl =
  process.env.FRONTEND_PRODUCTION_URL ?? 'https://finance-os-six-zeta.vercel.app';
const frontendUrls = Array.from(
  new Set([
    process.env.FRONTEND_URL ?? frontendLocalUrl,
    frontendLocalUrl,
    frontendProductionUrl,
    ...splitUrlList(process.env.FRONTEND_URLS),
  ]),
);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  frontendUrl: process.env.FRONTEND_URL ?? frontendLocalUrl,
  frontendLocalUrl,
  frontendProductionUrl,
  frontendUrls,
  jwtSecret: process.env.JWT_SECRET ?? fallbackJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  aiEnabled: process.env.AI_ENABLED !== 'false',
  jobsEnabled: process.env.ENABLE_JOBS !== 'false' && process.env.NODE_ENV !== 'test',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? 'noreply@financeos.app',
};
