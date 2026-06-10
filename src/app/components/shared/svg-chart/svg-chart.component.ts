import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-svg-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-chart.component.html',
  styleUrls: ['./svg-chart.component.css']
})
export class SvgChartComponent implements OnChanges {
  @Input() data: ChartData[] = [];
  @Input() type: 'bar' | 'pie' = 'bar';
  @Input() title: string = '';

  maxValue = 0;
  totalValue = 0;
  colors = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#222222', '#444444', '#777777', '#aaaaaa', '#dddddd'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.maxValue = Math.max(...this.data.map(d => d.value), 1); // Avoid div by 0
      this.totalValue = this.data.reduce((acc, curr) => acc + curr.value, 0) || 1;
    }
  }

  getBarWidth(value: number): number {
    return (value / this.maxValue) * 100;
  }

  getPercentage(value: number): number {
    return Math.round((value / this.totalValue) * 100);
  }
}
