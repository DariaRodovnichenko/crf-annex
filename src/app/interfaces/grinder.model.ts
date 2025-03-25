export interface GrinderSpec {
  brand: string;
  model: string;
  type: 'manual' | 'electric';
  minMicrons: number;
  maxMicrons: number;
  steps: number;
  stepUnit: 'click' | 'step';
}
