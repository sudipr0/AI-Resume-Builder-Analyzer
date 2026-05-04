import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes Sentry for application monitoring, error tracking, and performance tracing.
 */
export const initSentry = (app) => {
  if (!process.env.SENTRY_DSN) {
    console.warn('SENTRY_DSN not provided. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    // Tracing options
    tracesSampleRate: 1.0, // Capture 100% of transactions. Lower in production.
    profilesSampleRate: 1.0, // Profile 100% of sampled transactions.
  });

  // RequestHandler creates a separate execution context using domains, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  console.log('Sentry Error Tracking Initialized.');
};

/**
 * Middleware to capture errors at the end of the route pipeline
 */
export const sentryErrorHandler = () => Sentry.Handlers.errorHandler();
