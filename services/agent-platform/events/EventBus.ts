import { AgentEvent, EventHandler } from "../contracts/event.types";

type HandlerRegistry = Map<string, EventHandler[]>;

/**
 * In-memory event bus for initial local runtime and testing.
 * Can be replaced by Redis/BullMQ/Kafka backed implementations.
 */
export class EventBus {
  private readonly handlers: HandlerRegistry = new Map();

  public subscribe(eventName: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventName) ?? [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  public async publish(event: AgentEvent): Promise<void> {
    const subscribers = this.handlers.get(event.name) ?? [];
    for (const handler of subscribers) {
      await handler(event);
    }
  }
}
