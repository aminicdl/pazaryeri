/**
 * Basic page structure tests
 * These tests verify that page files exist and have the expected structure
 * without importing the actual components (to avoid ESM module issues)
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Home page', () => {
  const pagePath = path.join(process.cwd(), 'src/app/[locale]/page.tsx');

  it('page file exists', () => {
    expect(fs.existsSync(pagePath)).toBe(true);
  });

  it('page file contains default export', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toMatch(/export\s+default/);
  });

  it('page file contains metadata export', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    // Check for generateMetadata function or metadata const
    expect(content).toMatch(/export\s+(const\s+metadata|async\s+function\s+generateMetadata)/);
  });
});
