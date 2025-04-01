# PocketProfits API Documentation

This document describes the API endpoints available for DumbCal integration with PocketProfits.

## Authentication

All API requests must include the `POCKETPROFITS_SECRET` in the request headers:

```
Authorization: Bearer YOUR_POCKETPROFITS_SECRET
```

If the secret is invalid or missing, the API will return a 401 Unauthorized response.

## Endpoints

### GET /api/calendar/transactions

Returns all transactions within a specified date range, including recurring transaction instances.

**Query Parameters:**
- `start_date`: (Required) Start date in ISO format (YYYY-MM-DD)
- `end_date`: (Required) End date in ISO format (YYYY-MM-DD)

**Example Request:**
```
GET /api/calendar/transactions?start_date=2024-03-01&end_date=2024-03-31
Authorization: Bearer YOUR_POCKETPROFITS_SECRET
```

**Response Format:**
```json
{
  "transactions": [
    {
      "type": "income"|"expense",
      "amount": number,
      "description": string,
      "date": string (ISO date),
      "category": string,
      "id": string,
      "recurring": {                // Only present for recurring transactions
        "pattern": string,          // Recurring pattern string
        "until": string|null        // Optional ISO date string for end date
      },
      "isRecurringInstance": boolean,     // True for generated recurring instances
      "recurringParentId": string         // Present only for recurring instances
    }
  ]
}
```

**Recurring Pattern Format:**
The `pattern` field in recurring transactions follows these formats:
```
Regular patterns:
"every {number} {unit} [on {weekday}]"

Monthly day patterns:
"every {number}{suffix} of the month"

Examples:
- "every 1 day"
- "every 2 day"
- "every 1 week on monday"
- "every 2 week on thursday"
- "every 1 month"
- "every 1 year"
- "every 1st of the month"
- "every 15th of the month"
- "every 22nd of the month"
```

**Example Response:**
```json
{
  "transactions": [
    {
      "type": "expense",
      "amount": 500.00,
      "description": "MGM",
      "date": "2024-03-15",
      "category": "Roulette",
      "id": "abc123"
    },
    {
      "type": "expense",
      "amount": 500.00,
      "description": "Commerce Casino",
      "date": "2024-03-22",
      "category": "Poker",
      "id": "abc123-2024-03-22T00:00:00.000Z",
      "isRecurringInstance": true,
      "recurringParentId": "abc123"
    },
    {
      "type": "income",
      "amount": 1500.00,
      "description": "3 way all-in at 500 at the Commerce",
      "date": "2024-03-22",
      "id": "def456"
    }
  ]
}
```

**Error Responses:**
- 400 Bad Request: Invalid date format or missing parameters
- 401 Unauthorized: Invalid or missing POCKETPROFITS_SECRET
- 500 Internal Server Error: Server-side error

## Rate Limiting
To prevent abuse, the API is rate-limited to 100 requests per hour per API key.

## Recurring Transactions
When a transaction is recurring, the API will generate instances based on the pattern and return them in the response. Each instance will have:
- A unique ID formed by combining the parent ID and instance date
- The `isRecurringInstance` flag set to true
- A reference to the parent transaction ID in the `recurringParentId` field
- All other properties from the parent transaction, with the date adjusted according to the pattern

The original transaction will also appear in the results if its date falls within the requested range.

For weekly recurring transactions with a specified weekday:
- The original transaction's date will be adjusted to the first occurrence of the specified weekday
- For example, if you create a transaction on 2/1/2025 (Saturday) that recurs every 2 weeks on Monday:
  - The original transaction will be saved with date 2/3/2025 (first Monday)
  - Recurring instances will be generated for 2/17/2025, 3/3/2025, etc.

For monthly recurring transactions on a specific day:
- The original transaction's date will be adjusted to the first occurrence of the specified day
- For example, if you create a transaction on 2/5/2025 that recurs every 15th of the month:
  - The original transaction will be saved with date 2/15/2025 (first occurrence)
  - Recurring instances will be generated for 3/15/2025, 4/15/2025, etc.

The API handles these recurring patterns:
- Daily: "every N day"
- Weekly: "every N week on {weekday}"
- Monthly: "every N month"
- Yearly: "every N year"
- Monthly day: "every Nth of the month"

Where:
- N is a positive integer
- weekday is lowercase (monday, tuesday, etc.)
- Patterns exactly match DumbCal's format for seamless integration 