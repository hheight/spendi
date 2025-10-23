import resetDb from './reset-db';
import { vi, beforeEach } from 'vitest';

vi.mock('server-only', () => ({}));

beforeEach(async () => {
  await resetDb();
});
