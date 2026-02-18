# M-Pesa Integration Guide

## Overview

This document provides comprehensive instructions for integrating M-Pesa payment processing into the print-on-demand system. The implementation supports both mock mode (for development) and production mode (for real payments).

## Architecture

### Payment Flow

```
1. User initiates payment
   ↓
2. POST /api/print-on-demand/payments/mpesa/initiate
   ├─ Create PodPayment record
   ├─ Create PodPaymentTransaction record
   ├─ Call MpesaPaymentGateway.initiatePayment()
   └─ Return transactionId to frontend
   ↓
3. M-Pesa STK Push (user enters PIN)
   ↓
4. M-Pesa sends callback
   ↓
5. POST /api/print-on-demand/payments/mpesa/callback
   ├─ Validate callback
   ├─ Update PodPaymentTransaction
   ├─ Update PodPayment
   ├─ Update PodOrder status
   └─ Trigger fulfillment workflow
```

### Database Schema

#### PodPayment Table
- `id` - Primary key
- `podOrderId` - Foreign key to order
- `userId` - User who made payment
- `amount` - Payment amount in KES
- `status` - UNPAID, PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED
- `mpesaReceiptNumber` - M-Pesa confirmation code
- `mpesaPhoneNumber` - Phone number used for payment
- `failureReason` - Reason for failed payment
- `retryCount` - Number of retry attempts
- `transactions` - Related PodPaymentTransaction records

#### PodPaymentTransaction Table
- `id` - Primary key
- `podPaymentId` - Foreign key to payment
- `transactionId` - M-Pesa CheckoutRequestID
- `phone` - Phone number
- `amount` - Transaction amount
- `status` - INITIATED, PROCESSING, COMPLETED, FAILED, TIMEOUT, CANCELLED
- `mpesaResponseCode` - M-Pesa response code
- `mpesaResponseDesc` - M-Pesa response description
- `callbackData` - Raw callback JSON from M-Pesa

## Setup Instructions

### Step 1: Environment Variables

Add the following to your `.env.local` file:

```env
# M-Pesa Configuration
MPESA_MODE=mock                          # Use 'mock' for development, 'production' for live
MPESA_CONSUMER_KEY=your_consumer_key    # From Daraja portal
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASS_KEY=your_pass_key
MPESA_SHORTCODE=your_shortcode
MPESA_CALLBACK_URL=https://yourdomain.com/api/print-on-demand/payments/mpesa/callback
MPESA_BASE_URL=https://sandbox.safaricom.co.ke  # For sandbox, production uses different URL

# Database
DATABASE_URL=postgresql://user:password@neon-db-url
```

### Step 2: Database Setup

Run Prisma migrations to create tables:

```bash
# Generate Prisma client
pnpm exec prisma generate

# Create migrations
pnpm exec prisma migrate dev --name "add_pod_tables"

# Push schema to database (Neon)
pnpm exec prisma db push
```

### Step 3: Initialize M-Pesa Gateway

The M-Pesa gateway initializes automatically from environment variables on first use. No additional code needed.

## Development Mode (Mock M-Pesa)

### Features

- Simulate payment flows without API calls
- Test success and failure scenarios
- In-memory transaction storage
- Easy manual trigger for testing

### Example Usage

```typescript
import { MpesaPaymentGateway } from '@/shared/utils/mpesa'

// Initialize in mock mode
const config = {
  mode: 'mock',
  consumerKey: 'test',
  consumerSecret: 'test',
  passKey: 'test',
  shortCode: 'test',
  callbackUrl: 'http://localhost:3000/api/callback',
  baseUrl: 'http://localhost:3000'
}

MpesaPaymentGateway.initialize(config)

// Initiate payment
const response = await MpesaPaymentGateway.initiatePayment({
  phone: '254712345678',
  amount: 5000,
  orderId: 'POD-123456',
  description: 'Print Order'
})

// Simulate success
await MpesaPaymentGateway.mockSimulateSuccess(
  response.transactionId,
  'TXN12345678'
)

// Check status
const status = await MpesaPaymentGateway.checkPaymentStatus(
  response.requestId,
  response.transactionId
)
```

### Testing Callback

```typescript
// Create mock callback
const callbackData = MpesaPaymentGateway.mockCreateCallback(
  checkoutRequestId,
  0 // 0 = success, non-zero = failure
)

// Process callback
const result = MpesaPaymentGateway.processCallback(callbackData)
```

## Production Mode (Real M-Pesa)

### Getting Credentials

1. Register for M-Pesa Daraja API: https://developer.safaricom.co.ke/
2. Create an app and get Consumer Key/Secret
3. Generate Pass Key from Daraja portal
4. Use your Business Short Code
5. Set up callback URL in Daraja portal

### Configuration

```env
MPESA_MODE=production
MPESA_CONSUMER_KEY=your_real_consumer_key
MPESA_CONSUMER_SECRET=your_real_consumer_secret
MPESA_PASS_KEY=your_real_pass_key
MPESA_SHORTCODE=your_real_shortcode
MPESA_CALLBACK_URL=https://yourdomain.com/api/print-on-demand/payments/mpesa/callback
MPESA_BASE_URL=https://api.safaricom.co.ke  # Production URL
```

### Testing in Production

Use M-Pesa's test phone numbers and credentials provided in Daraja documentation.

## API Endpoints

### 1. Initiate Payment

```
POST /api/print-on-demand/payments/mpesa/initiate

Request:
{
  "orderId": "cuid-order-id",
  "phone": "254712345678",
  "userId": "cuid-user-id"
}

Response (Success):
{
  "success": true,
  "message": "Payment initiated successfully",
  "paymentId": "cuid-payment-id",
  "transactionId": "checkout-request-id",
  "checkoutUrl": "https://...",
  "customerMessage": "Enter your M-Pesa PIN"
}

Response (Error):
{
  "error": "Failed to initiate M-Pesa payment",
  "message": "Error details"
}
```

### 2. Check Payment Status

```
GET /api/print-on-demand/payments/mpesa/status?paymentId=cuid-payment-id

Response:
{
  "status": "COMPLETED",
  "resultCode": 0,
  "resultDescription": "The service request has been processed successfully",
  "mpesaReceiptNumber": "TXN12345678",
  "amount": 5000,
  "transactionDate": "2024-01-15T10:30:00Z",
  "phoneNumber": "254712345678"
}
```

### 3. Webhook Callback

```
POST /api/print-on-demand/payments/mpesa/callback

Sent by M-Pesa with:
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 5000},
          {"Name": "MpesaReceiptNumber", "Value": "TXN12345678"},
          {"Name": "TransactionDate", "Value": "20240115103045"},
          {"Name": "PhoneNumber", "Value": "254712345678"}
        ]
      }
    }
  }
}
```

## Database Service Usage

### Creating Orders with Cart

```typescript
import { PodOrderService } from '@/shared/db/services/pod-order.service'
import { PodCartService } from '@/shared/db/services/pod-cart.service'

// Get cart items
const cart = await PodCartService.getOrCreateCart(userId)

// Create order
const order = await PodOrderService.createOrder({
  userId,
  cartItems: cart.items,
  shippingMethod: 'express',
  shippingAddress: '123 Main St, Nairobi',
  shippingCost: 1000,
  taxRate: 0.16
})
```

### Processing Payments

```typescript
import { PodPaymentService } from '@/shared/db/services/pod-payment.service'

// Create payment
const payment = await PodPaymentService.createPayment({
  podOrderId: order.id,
  userId,
  amount: order.totalAmount,
  mpesaPhoneNumber: '254712345678'
})

// Update status
await PodPaymentService.updatePaymentStatus(
  payment.id,
  'COMPLETED',
  'TXN12345678'
)

// Get payment history
const { payments, total } = await PodPaymentService.getPaymentsByUserId(
  userId,
  20,
  0
)
```

### Managing Designs

```typescript
import { PodDesignService } from '@/shared/db/services/pod-design.service'

// Create design
const design = await PodDesignService.createDesign({
  userId,
  name: 'My Design',
  productType: 'tshirt',
  designData: {...},
  thumbnail: 'url-to-thumbnail'
})

// Save version
await PodDesignService.saveVersion(
  design.id,
  updatedDesignData,
  'Updated colors'
)

// Get design history
const versions = await PodDesignService.getVersions(design.id)

// Revert to version
await PodDesignService.revertToVersion(design.id, 2)
```

## Error Handling

### Retry Logic

Failed payments are automatically logged for retry:

```typescript
// Get failed payments for retry
const failedPayments = await PodPaymentService.getFailedPaymentsForRetry(10)

// Manually trigger retry
for (const payment of failedPayments) {
  const response = await MpesaPaymentGateway.initiatePayment({
    phone: payment.mpesaPhoneNumber,
    amount: payment.amount,
    orderId: payment.podOrder.orderNumber,
  })
  
  if (response.success) {
    // Update payment with new transaction
    await PodPaymentService.createTransaction({
      podPaymentId: payment.id,
      userId: payment.userId,
      transactionId: response.transactionId,
      phone: payment.mpesaPhoneNumber,
      amount: payment.amount,
      status: 'INITIATED'
    })
  }
}
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Token expired | Token is cached with 1-min buffer, auto-refreshes |
| Invalid phone | Format must be 254XXXXXXXXX |
| Amount too low | Minimum is usually 100 KES |
| Callback not received | Check callback URL in Daraja portal |
| Connection timeout | Check firewall, implement retry logic |

## Migration from Mock to Production

### Step 1: No Code Changes Needed
The same code works in both modes. Simply change environment variables.

### Step 2: Update Environment Variables

```bash
# Change from:
MPESA_MODE=mock

# To:
MPESA_MODE=production
MPESA_CONSUMER_KEY=<your-real-key>
MPESA_CONSUMER_SECRET=<your-real-secret>
MPESA_BASE_URL=https://api.safaricom.co.ke
```

### Step 3: Test Thoroughly
1. Test with M-Pesa sandbox credentials first
2. Verify webhook callback URL is accessible
3. Test error scenarios (failed payment, timeout, etc.)
4. Monitor logs and transaction records

### Step 4: Deploy
Deploy to production with real credentials.

## Monitoring & Debugging

### View Mock Transactions (Development Only)

```typescript
const transactions = MpesaPaymentGateway.mockGetAllTransactions()
console.log(transactions)
```

### Query Payment Statistics

```typescript
const stats = await PodPaymentService.getPaymentStats(userId)
// Returns: totalPayments, totalAmount, statusBreakdown
```

### Check Order Status

```typescript
const order = await PodOrderService.getOrderById(orderId)
console.log(order.fulfillmentTimeline) // Track status changes
```

## Security Considerations

1. Always validate phone numbers before payment
2. Verify callback signature (implement in production)
3. Use HTTPS for all callback URLs
4. Store M-Pesa credentials securely in environment variables
5. Never log sensitive data (receipt numbers, etc.)
6. Implement rate limiting on payment endpoints
7. Use database transactions for payment + order updates

## Support

For M-Pesa API issues, refer to:
- Daraja API Documentation: https://developer.safaricom.co.ke/
- M-Pesa Developer Portal: https://developer.safaricom.co.ke/

For application issues, check logs in database or console output.
