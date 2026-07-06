# LLM Gateway

Unified model access for all apps.

Responsibilities:

- provider routing (OpenAI, Anthropic, local models)
- fallback policy and timeout policy
- prompt template management
- token/cost metrics

Keep business logic out of provider adapters.
