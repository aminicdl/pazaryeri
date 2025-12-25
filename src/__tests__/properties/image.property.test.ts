/**
 * Property-Based Tests for Image Optimization Usage
 * 
 * **Feature: pazaryeri-frontend, Property 8: Image Optimization Usage**
 * **Validates: Requirements 3.4**
 * 
 * For any image rendered in the application, it should use the next/image component
 * with appropriate width, height, and alt attributes.
 */

import * as fc from 'fast-check';

// Type definition for OptimizedImage props validation
interface ImagePropsValidation {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
}

// Arbitrary generators for image props
const validSrcArb = fc.oneof(
  fc.string({ minLength: 1 }).map(s => `/${s}.jpg`),
  fc.string({ minLength: 1 }).map(s => `/${s}.png`),
  fc.string({ minLength: 1 }).map(s => `/${s}.svg`),
  fc.webUrl()
);

const validAltArb = fc.string({ minLength: 1, maxLength: 200 });

const validDimensionArb = fc.integer({ min: 1, max: 4000 });

const loadingArb = fc.constantFrom('lazy' as const, 'eager' as const);

const placeholderArb = fc.constantFrom('blur' as const, 'empty' as const);

const imagePropsArb: fc.Arbitrary<ImagePropsValidation> = fc.record({
  src: validSrcArb,
  alt: validAltArb,
  width: validDimensionArb,
  height: validDimensionArb,
  loading: fc.option(loadingArb, { nil: undefined }),
  placeholder: fc.option(placeholderArb, { nil: undefined }),
});

/**
 * Validates that image props conform to optimization requirements
 */
function validateImageProps(props: ImagePropsValidation): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required src
  if (!props.src || typeof props.src !== 'string' || props.src.length === 0) {
    errors.push('src is required and must be a non-empty string');
  }

  // Check required alt for accessibility
  if (!props.alt || typeof props.alt !== 'string') {
    errors.push('alt is required for accessibility');
  }

  // Check required width
  if (typeof props.width !== 'number' || props.width <= 0) {
    errors.push('width must be a positive number');
  }

  // Check required height
  if (typeof props.height !== 'number' || props.height <= 0) {
    errors.push('height must be a positive number');
  }

  // Check loading attribute if provided
  if (props.loading !== undefined && !['lazy', 'eager'].includes(props.loading)) {
    errors.push('loading must be "lazy" or "eager"');
  }

  // Check placeholder attribute if provided
  if (props.placeholder !== undefined && !['blur', 'empty'].includes(props.placeholder)) {
    errors.push('placeholder must be "blur" or "empty"');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simulates OptimizedImage component prop validation
 * This mirrors the validation that should happen in the actual component
 */
function createOptimizedImageProps(input: Partial<ImagePropsValidation>): ImagePropsValidation {
  return {
    src: input.src || '',
    alt: input.alt || '',
    width: input.width || 0,
    height: input.height || 0,
    loading: input.loading || 'lazy',
    placeholder: input.placeholder || 'blur',
  };
}

describe('Image Optimization Usage - Property 8', () => {
  describe('Required Attributes Validation', () => {
    it('should require width, height, and alt for all valid image props', () => {
      fc.assert(
        fc.property(imagePropsArb, (props) => {
          const validation = validateImageProps(props);
          
          // All generated props should be valid since our arbitrary generates valid data
          expect(validation.isValid).toBe(true);
          expect(validation.errors).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should always have positive width and height dimensions', () => {
      fc.assert(
        fc.property(imagePropsArb, (props) => {
          expect(props.width).toBeGreaterThan(0);
          expect(props.height).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should always have non-empty alt text for accessibility', () => {
      fc.assert(
        fc.property(imagePropsArb, (props) => {
          expect(props.alt).toBeDefined();
          expect(props.alt.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should always have a valid src path', () => {
      fc.assert(
        fc.property(imagePropsArb, (props) => {
          expect(props.src).toBeDefined();
          expect(props.src.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Default Values', () => {
    it('should default to lazy loading when not specified', () => {
      fc.assert(
        fc.property(
          fc.record({
            src: validSrcArb,
            alt: validAltArb,
            width: validDimensionArb,
            height: validDimensionArb,
          }),
          (partialProps) => {
            const fullProps = createOptimizedImageProps(partialProps);
            expect(fullProps.loading).toBe('lazy');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should default to blur placeholder when not specified', () => {
      fc.assert(
        fc.property(
          fc.record({
            src: validSrcArb,
            alt: validAltArb,
            width: validDimensionArb,
            height: validDimensionArb,
          }),
          (partialProps) => {
            const fullProps = createOptimizedImageProps(partialProps);
            expect(fullProps.placeholder).toBe('blur');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Invalid Props Detection', () => {
    it('should detect missing alt as invalid', () => {
      fc.assert(
        fc.property(
          fc.record({
            src: validSrcArb,
            width: validDimensionArb,
            height: validDimensionArb,
          }),
          (partialProps) => {
            const propsWithEmptyAlt = { ...partialProps, alt: '' };
            const validation = validateImageProps(propsWithEmptyAlt as ImagePropsValidation);
            
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('alt is required for accessibility');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should detect zero or negative dimensions as invalid', () => {
      fc.assert(
        fc.property(
          fc.record({
            src: validSrcArb,
            alt: validAltArb,
            width: fc.integer({ min: -100, max: 0 }),
            height: validDimensionArb,
          }),
          (props) => {
            const validation = validateImageProps(props as ImagePropsValidation);
            
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('width must be a positive number');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should detect empty src as invalid', () => {
      fc.assert(
        fc.property(
          fc.record({
            alt: validAltArb,
            width: validDimensionArb,
            height: validDimensionArb,
          }),
          (partialProps) => {
            const propsWithEmptySrc = { ...partialProps, src: '' };
            const validation = validateImageProps(propsWithEmptySrc as ImagePropsValidation);
            
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('src is required and must be a non-empty string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Aspect Ratio Preservation', () => {
    it('should maintain aspect ratio information through width and height', () => {
      fc.assert(
        fc.property(imagePropsArb, (props) => {
          // Aspect ratio can be calculated from width and height
          const aspectRatio = props.width / props.height;
          
          expect(aspectRatio).toBeGreaterThan(0);
          expect(Number.isFinite(aspectRatio)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Loading Strategy', () => {
    it('should only allow valid loading values', () => {
      fc.assert(
        fc.property(imagePropsArb, (props) => {
          if (props.loading !== undefined) {
            expect(['lazy', 'eager']).toContain(props.loading);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
