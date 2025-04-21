import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

@Injectable({ providedIn: 'root' })
export class OcrService {
  async recognizeText(imageDataUrl: string): Promise<string> {
    const worker = await createWorker('eng');

    const { data } = await worker.recognize(imageDataUrl);
    await worker.terminate();

    return data.text;
  }
}
