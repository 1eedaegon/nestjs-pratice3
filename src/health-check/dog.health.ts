import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
  HealthIndicatorStatus,
} from '@nestjs/terminus';

export interface Dog {
  name: string;
  type: string;
}

@Injectable()
export class DogHealthIndicator extends HealthIndicator {
  private dogs: Dog[] = [
    { name: 'fido', type: 'goodboy' },
    { name: 'rex', type: 'badboy' },
  ];
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const badboys = this.dogs.filter((dog) => dog.type === 'badboy');
    const isHealthy = badboys.length === 0;
    const result = this.getStatus(key, isHealthy, { badboys: badboys.length });
    if (isHealthy) return result;
    throw new HealthCheckError('DogCheck failed', result);
  }
}
