// Root TypeScript definitions placeholder
// Domain types will be expanded in future phases

export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'recovering';

export interface ServiceNode {
  id: string;
  name: string;
  status: HealthStatus;
  version: string;
  uptime: number;
}
