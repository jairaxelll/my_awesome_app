# CRM App - Reorganized Structure

This document describes the new organized structure of the CRM application after refactoring from a single large App.tsx file.

## Directory Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # App header with notifications
│   ├── TabNavigation.tsx # Tab navigation component
│   ├── AddButton.tsx    # Floating add button
│   ├── AddModal.tsx     # Modal for adding new items
│   ├── NotificationModal.tsx # Notifications modal
│   └── tabs/            # Tab content components
│       ├── DashboardTab.tsx
│       ├── CustomersTab.tsx
│       ├── DealsTab.tsx
│       ├── ActivitiesTab.tsx
│       ├── TasksTab.tsx
│       ├── NotesTab.tsx
│       ├── CalendarTab.tsx
│       └── SettingsTab.tsx
├── hooks/               # Custom React hooks
│   ├── useAppData.ts    # Main app data management
│   ├── useFormData.ts   # Form data management
│   └── useModal.ts      # Modal state management
├── services/            # Business logic and data services
│   ├── storage.ts       # AsyncStorage operations
│   ├── sampleData.ts    # Sample data generation
│   └── dashboardService.ts # Dashboard calculations
├── styles/              # StyleSheet definitions
│   ├── index.ts         # Main app styles
│   ├── dashboard.ts     # Dashboard-specific styles
│   ├── cards.ts         # Card component styles
│   ├── modals.ts        # Modal styles
│   ├── calendar.ts      # Calendar styles
│   └── settings.ts      # Settings styles
├── types/               # TypeScript type definitions
│   └── index.ts         # All interface definitions
├── utils/               # Utility functions
│   └── helpers.ts       # Helper functions for formatting, colors, etc.
├── index.ts             # Main export file
└── README.md            # This file
```

## Key Improvements

### 1. **Separation of Concerns**
- **Components**: Pure UI components with clear responsibilities
- **Hooks**: Custom hooks for state management and side effects
- **Services**: Business logic and data operations
- **Utils**: Pure utility functions
- **Types**: Centralized type definitions

### 2. **Reusability**
- Components are now modular and can be easily reused
- Hooks can be shared across components
- Utility functions are pure and testable

### 3. **Maintainability**
- Each file has a single responsibility
- Easy to locate and modify specific functionality
- Clear import/export structure

### 4. **Type Safety**
- All types are centralized in `src/types/index.ts`
- Consistent type usage across the application
- Better IntelliSense and error detection

### 5. **Performance**
- Components are properly separated, enabling better optimization
- Hooks can be optimized independently
- Lazy loading possibilities for tab components

## Usage Examples

### Importing Components
```typescript
import { Header, TabNavigation, DashboardTab } from './src';
```

### Using Hooks
```typescript
import { useAppData, useFormData } from './src/hooks';

const MyComponent = () => {
  const { customers, setCustomers } = useAppData();
  const { formData, updateFormData } = useFormData();
  // ...
};
```

### Using Services
```typescript
import { getDashboardStats } from './src/services/dashboardService';
import { formatCurrency } from './src/utils/helpers';
```

## Benefits of This Structure

1. **Easier Testing**: Each component and hook can be tested in isolation
2. **Better Collaboration**: Multiple developers can work on different parts simultaneously
3. **Code Reuse**: Components and utilities can be easily shared
4. **Scalability**: Easy to add new features without affecting existing code
5. **Debugging**: Issues can be isolated to specific files and components
6. **Documentation**: Each file has a clear purpose and can be documented independently

## Migration Notes

The original App.tsx (2000+ lines) has been broken down into:
- 1 main App.tsx (150 lines)
- 8 tab components (~100 lines each)
- 3 custom hooks (~50 lines each)
- 3 service files (~100 lines each)
- 6 style files (~200 lines each)
- 1 types file (~100 lines)
- 1 utils file (~100 lines)

This results in much more manageable and maintainable code files.
