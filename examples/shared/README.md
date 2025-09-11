# Shared Examples Utilities

This folder contains utilities shared across all example applications (React, Vue, Angular).

## Dev Mock

The `dev-mock.ts` file provides development-time mock functionality for testing iframe scenarios without needing a separate host application.

### Usage

In any example's main entry file:

```typescript
import { initDevMock, shouldEnableDevMock } from '../shared/dev-mock';

// Initialize dev mock if conditions are met
if (shouldEnableDevMock()) {
  initDevMock();
}
```

### How It Works

1. **Automatic Detection**: Detects when running in development mode and standalone (not in iframe)
2. **Method Interception**: Intercepts core package methods to provide mock responses
3. **Mock Data**: Provides realistic mock user context, theme, and API responses
4. **Dynamic Updates**: Simulates theme and context changes from parent every 10-15 seconds

### Mock Data

- **Context**: Mock user, company, and environment data
- **Theme**: Mock styling configuration with color changes
- **API**: Mock API responses for common endpoints

### Force Enable

Add `?mock` to the URL to force enable mock mode even in iframe scenarios.

### Examples Integration

- **React**: Already integrated in `examples/react/src/main.tsx`
- **Vue**: Add to `examples/vue/src/main.ts`
- **Angular**: Add to `examples/angular/src/main.ts`

This keeps mock functionality separate from production packages while providing consistent development experience across all frameworks.
