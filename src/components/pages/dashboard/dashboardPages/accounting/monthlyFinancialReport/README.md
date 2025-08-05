# Monthly Financial Report

## Overview

This module provides comprehensive financial reporting functionality for monthly financial data. It integrates with real API endpoints to fetch, display, and manage financial information.

## API Endpoints

The module uses the following API endpoints:

1. **`/api/finances/financial-report/`** - Detailed financial report
2. **`/api/finances/financial-reports/`** - Financial reports list
3. **`/api/finances/historical-data/`** - Historical financial data
4. **`/api/finances/financial-records/`** - Financial records with pagination
5. **`/api/finances/extra-expenses/`** - Extra expenses management (CRUD)

## Features

- **Real-time Data**: All data is fetched from live API endpoints
- **Pagination**: Full pagination support for large datasets
- **Filtering**: Advanced filtering and search capabilities
- **CRUD Operations**: Complete Create, Read, Update, Delete for expenses
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error handling and user feedback

## File Structure

```
monthlyFinancialReport/
├── index.tsx                    # Main component
├── FinancialRecordsManager.tsx  # Financial records management
├── ExtraExpensesManager.tsx     # Extra expenses management
├── config.ts                    # Configuration settings
├── types.ts                     # TypeScript interfaces
└── README.md                    # This documentation
```

## Configuration

The module uses a centralized configuration file (`config.ts`) for:

- Pagination settings
- Search debounce delays
- Success/error messages

## Error Handling

All API calls include proper error handling with:

- User-friendly error messages
- Loading states
- Abort controller for request cancellation
- Toast notifications for feedback

## Notes

- All amounts are in تومان (Iranian currency)
- Dates use Persian calendar (solar year/month)
- Timestamps are in ISO 8601 format
- Pagination follows REST API conventions
