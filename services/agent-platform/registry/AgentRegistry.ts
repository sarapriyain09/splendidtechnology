import { Agent } from "../contracts/agent.types";

/**
 * Registry for platform agents with deterministic lookup by id.
 */
export class AgentRegistry {
  private readonly agents = new Map<string, Agent>();

  public register(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent already registered: ${agent.id}`);
    }

    this.agents.set(agent.id, agent);
  }

  public get(agentId: string): Agent {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    return agent;
  }

  public list(): Agent[] {
    return Array.from(this.agents.values());
  }
}
