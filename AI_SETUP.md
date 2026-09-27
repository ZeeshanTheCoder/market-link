# MarketLink AI — Website-Grounded Assistant

The AI assistant is implemented as a grounded website assistant rather than a model that is silently fine-tuned on private user data.

## Website knowledge

`marketlink-server/src/knowledge/marketlinkKnowledge.js` contains a MarketLink-specific knowledge base covering:

- platform purpose and navigation
- products, categories, use cases, freshness, stock, bulk and organic labels
- farmers and market-day guidance
- pickup windows and the order lifecycle
- payment-at-pickup and delivery scope
- favorites, reviews and notifications
- customer, farmer and admin capabilities
- maps, contact/support and platform rules

The assistant also retrieves live products, active markets, approved farmer profiles and active pickup slots from MongoDB when the database is connected.

## How answers are produced

1. The browser sends the current MarketLink catalogue context.
2. The server enriches it from MongoDB when available.
3. A keyword/entity retrieval layer finds relevant products, farmers, markets and knowledge entries.
4. A local grounded answer is returned by default, so the assistant still works without an external AI key.
5. If `OPENAI_API_KEY` and `OPENAI_MODEL` are configured, the same grounded context is sent to the configured provider and the provider answer is used only when the call succeeds.

## Optional provider configuration

```env
OPENAI_API_KEY=
OPENAI_API_URL=https://api.openai.com/v1/responses
OPENAI_MODEL=
```

Do not put an API key in the React client or commit `.env` files.
