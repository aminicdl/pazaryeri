/**
 * Property-Based Tests for Theme Switching Consistency
 *
 * **Feature: pazaryeri-frontend, Property 6: Theme Switching Consistency**
 * **Validates: Requirements 5.5**
 *
 * For any theme toggle action, all components should immediately reflect
 * the new theme (light/dark) through appropriate CSS class changes.
 */

import * as fc from 'fast-check';
import { useThemeStore, type Theme } from '@/stores/useThemeStore';

// Helper to reset store state between tests
const resetStore = () => {
  useThemeStore.setState({ theme: 'system' });
};

// Theme arbitrary generator
const themeArb: fc.Arbitrary<Theme> = fc.constantFrom('light', 'dark', 'system');

// Non-system theme arbitrary (for deterministic tests)
const explicitThemeArb: fc.Arbitrary<'light' | 'dark'> = fc.constantFrom(
  'light',
  'dark'
);

describe('Theme Switching Consistency - Property 6', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('setTheme operation', () => {
    it('should update theme state to the specified value', () => {
      fc.assert(
        fc.property(themeArb, (theme) => {
          resetStore();
          const store = useThemeStore.getState();

          store.setTheme(theme);

          const updatedStore = useThemeStore.getState();
          expect(updatedStore.theme).toBe(theme);
        }),
        { numRuns: 100 }
      );
    });

    it('should be idempotent - setting same theme twice should not change state', () => {
      fc.assert(
        fc.property(themeArb, (theme) => {
          resetStore();
          const store = useThemeStore.getState();

          store.setTheme(theme);
          const stateAfterFirst = useThemeStore.getState().theme;

          store.setTheme(theme);
          const stateAfterSecond = useThemeStore.getState().theme;

          expect(stateAfterSecond).toBe(stateAfterFirst);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('getEffectiveTheme operation', () => {
    it('should return the theme directly for non-system themes', () => {
      fc.assert(
        fc.property(explicitThemeArb, (theme) => {
          resetStore();
          const store = useThemeStore.getState();

          store.setTheme(theme);

          const updatedStore = useThemeStore.getState();
          expect(updatedStore.getEffectiveTheme()).toBe(theme);
        }),
        { numRuns: 100 }
      );
    });

    it('should always return light or dark (never system)', () => {
      fc.assert(
        fc.property(themeArb, (theme) => {
          resetStore();
          const store = useThemeStore.getState();

          store.setTheme(theme);

          const updatedStore = useThemeStore.getState();
          const effectiveTheme = updatedStore.getEffectiveTheme();

          expect(['light', 'dark']).toContain(effectiveTheme);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('toggleTheme operation', () => {
    it('should switch between light and dark themes', () => {
      fc.assert(
        fc.property(explicitThemeArb, (initialTheme) => {
          resetStore();
          const store = useThemeStore.getState();

          // Set initial explicit theme
          store.setTheme(initialTheme);
          const effectiveBefore = useThemeStore.getState().getEffectiveTheme();

          // Toggle
          store.toggleTheme();
          const effectiveAfter = useThemeStore.getState().getEffectiveTheme();

          // Should be opposite
          if (effectiveBefore === 'light') {
            expect(effectiveAfter).toBe('dark');
          } else {
            expect(effectiveAfter).toBe('light');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should be its own inverse when toggled twice', () => {
      fc.assert(
        fc.property(explicitThemeArb, (initialTheme) => {
          resetStore();
          const store = useThemeStore.getState();

          // Set initial explicit theme
          store.setTheme(initialTheme);
          const effectiveBefore = useThemeStore.getState().getEffectiveTheme();

          // Toggle twice
          store.toggleTheme();
          store.toggleTheme();
          const effectiveAfter = useThemeStore.getState().getEffectiveTheme();

          // Should return to original
          expect(effectiveAfter).toBe(effectiveBefore);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('theme state transitions', () => {
    it('should handle any sequence of theme changes correctly', () => {
      fc.assert(
        fc.property(fc.array(themeArb, { minLength: 1, maxLength: 20 }), (themes) => {
          resetStore();
          const store = useThemeStore.getState();

          // Apply all theme changes
          themes.forEach((theme) => {
            store.setTheme(theme);
          });

          // Final state should match last theme
          const finalTheme = themes[themes.length - 1];
          expect(useThemeStore.getState().theme).toBe(finalTheme);
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain valid state after mixed setTheme and toggleTheme operations', () => {
      // Generate a sequence of operations
      const operationArb = fc.oneof(
        fc.record({ type: fc.constant('set' as const), theme: themeArb }),
        fc.record({ type: fc.constant('toggle' as const) })
      );

      fc.assert(
        fc.property(
          fc.array(operationArb, { minLength: 1, maxLength: 20 }),
          (operations) => {
            resetStore();
            const store = useThemeStore.getState();

            // Apply all operations
            operations.forEach((op) => {
              if (op.type === 'set' && 'theme' in op) {
                store.setTheme(op.theme);
              } else {
                store.toggleTheme();
              }
            });

            // State should always be valid
            const finalState = useThemeStore.getState();
            expect(['light', 'dark', 'system']).toContain(finalState.theme);
            expect(['light', 'dark']).toContain(finalState.getEffectiveTheme());
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
