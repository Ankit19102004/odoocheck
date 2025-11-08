# OneFlow Shared

Shared TypeScript types and interfaces for OneFlow.

## Setup

1. Install dependencies: `npm install`
2. Build: `npm run build`

## Usage

Import shared types in other packages:

```typescript
import { IUser, IProject, ITask } from '@shared';
```

## Development

- `npm run build` - Build TypeScript to JavaScript
- `npm run watch` - Watch mode for development

## Types

All shared types are exported from `src/index.ts`:
- IUser
- IProject
- ITask
- ITimesheetEntry
- ISalesOrder
- IPurchaseOrder
- IInvoice
- IVendorBill
- IExpense
- IProduct
- IAttachment
- IProjectAnalytics

