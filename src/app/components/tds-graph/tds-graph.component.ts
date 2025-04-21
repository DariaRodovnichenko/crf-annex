import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartConfiguration,
  ChartOptions,
  ChartType,
  ScatterDataPoint,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';

const UIElements = [IonCard, IonCardHeader, IonCardTitle, IonCardContent];

@Component({
  selector: 'app-tds-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, ...UIElements],
  templateUrl: './tds-graph.component.html',
  styleUrls: ['./tds-graph.component.css'],
})
export class TDSGraphComponent implements OnChanges {
  @Input() tds: number = 0;
  @Input() yield: number = 0;
  @Input() title = 'TDS Brew Chart';

  scatterChartType: ChartType = 'scatter';

  scatterChartData: ChartConfiguration<'scatter', ScatterDataPoint[]>['data'] =
    {
      datasets: [
        {
          label: 'Gold Cup Zone',
          data: [
            { x: 18, y: 1.15 },
            { x: 22, y: 1.15 },
            { x: 22, y: 1.35 },
            { x: 18, y: 1.35 },
            { x: 18, y: 1.15 }, // close the shape
          ],
          backgroundColor: 'rgba(144, 238, 144, 0.3)', // light green fill
          borderColor: '#81c784', // green border
          fill: true,
          showLine: true,
          pointRadius: 0,
        },
        {
          label: 'Your Brew',
          data: [],
          pointBackgroundColor: '#ff4081',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 7,
          pointHoverRadius: 10,
          showLine: false,
        },
      ],
    };

  scatterChartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#fff' },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Extraction Yield (%)',
          color: '#ccc',
        },
        min: 15,
        max: 25,
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: { color: '#ccc' },
      },
      y: {
        title: {
          display: true,
          text: 'TDS (%)',
          color: '#ccc',
        },
        min: 0.8,
        max: 1.8,
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: {
          color: '#ccc',
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  ngOnChanges() {
    console.log('📊 Updating Scatter Plot:', this.tds, this.yield);

    this.scatterChartData.datasets[1].data = [
      {
        x: this.yield,
        y: this.tds,
      },
    ];
  }
}
