import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GrinderSpec } from '../interfaces/grinder.model';

@Injectable({
  providedIn: 'root',
})
export class GrindConverterService {
  constructor(private http: HttpClient) {}

  convertGrindSetting(
    fromValue: number,
    fromGrinder: GrinderSpec,
    toGrinder: GrinderSpec
  ): number {
    const fromRange = fromGrinder.maxMicrons - fromGrinder.minMicrons;
    const toRange = toGrinder.maxMicrons - toGrinder.minMicrons;

    // Step 1: convert source grinder value to microns
    const microns =
      (fromValue / fromGrinder.steps) * fromRange + fromGrinder.minMicrons;

    // Step 2: convert microns to target grinder setting
    const converted =
      ((microns - toGrinder.minMicrons) / toRange) * toGrinder.steps;

    // Step 3: handle decimal precision based on grinder type
    return toGrinder.type === 'electric'
      ? Math.round(converted * 10) / 10
      : Math.round(converted * 100) / 100;
  }

  getMicronValue(value: number, grinder: GrinderSpec): number {
    const range = grinder.maxMicrons - grinder.minMicrons;
    return (value / grinder.steps) * range + grinder.minMicrons;
  }
}
