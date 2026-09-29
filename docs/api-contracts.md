# API Contracts & Global Error Standards

## Standard Response Format

### Success Response
```json
{
  "status": "ok",
  "data": {}
}
```

### Standard Error Response
```json
{
  "error": {
    "code": "INVALID_DATA",
    "message": "Human-readable explanation of error",
    "details": {},
    "request_id": "c1f7b7cb-8c90-4a88-8208-990e62a12345"
  }
}
```

## Standard Error Codes
- `NETWORK_ERROR`: Upstream network connection failure.
- `AUTH_ERROR`: Authentication failure, token expiration, or insufficient permissions.
- `RATE_LIMITED`: Rate limit exceeded for user or IP.
- `TIMEOUT`: Request exceeded the configured processing threshold.
- `PROVIDER_ERROR`: Third-party provider (e.g., OpenAI, Twilio) returned an unrecoverable failure.
- `INVALID_DATA`: Request validation failed (Zod schema mismatch).
- `POLICY_BLOCKED`: The policy engine refused execution due to safety or permission limits.
- `APPROVAL_REQUIRED`: The requested action requires explicit human confirmation before proceeding.
- `INTEGRATION_DISABLED`: Connected third-party account is inactive or disconnected.
- `CHANNEL_UNAVAILABLE`: Selected communication channel is currently unavailable.
