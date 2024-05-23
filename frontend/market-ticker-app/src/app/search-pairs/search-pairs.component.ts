import { Component, ViewChild } from '@angular/core';
import { MarketDataService } from '../market-data.service';
import { Chart, ChartOptions, ChartType, ChartData, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-search-pairs',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule],
  templateUrl: './search-pairs.component.html',
  styleUrls: ['./search-pairs.component.css']
})
export class SearchPairsComponent {
  ticker1!: string;
  ticker2!: string;
  startDate!: string;
  endDate!: string;
  marketData1: any;
  marketData2: any;

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Dataset 2',
        data: [],
        borderColor: 'red',
        fill: false,
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartType: ChartType = 'line';

  constructor(private marketDataService: MarketDataService) {
    Chart.register(...registerables);
  }

  searchPair() {
    this.marketDataService.getMarketData(this.ticker1, this.ticker2, this.startDate, this.endDate).subscribe(data => {
      this.marketData1 = data[this.ticker1];
      this.marketData2 = data[this.ticker2];
      this.updateChart();
      console.log('Market Data for Ticker 1:', this.marketData1);
      console.log('Market Data for Ticker 2:', this.marketData2);
    });
  }

  updateChart() {
    const dates1 = this.marketData1.results.map((result: any) => new Date(result.t).toLocaleDateString());
    const prices1 = this.marketData1.results.map((result: any) => result.c);
  
    const dates2 = this.marketData2.results.map((result: any) => new Date(result.t).toLocaleDateString());
    const prices2 = this.marketData2.results.map((result: any) => result.c);
  
    // Normalize prices to start from 100%
    const normalizedPrices1 = prices1.map((price : number) => (price / prices1[0]) * 100);
    const normalizedPrices2 = prices2.map((price : number) => (price / prices2[0]) * 100);
  
    console.log('Dates1:', dates1);
    console.log('Prices1:', prices1);
    console.log('Normalized Prices1:', normalizedPrices1);
    console.log('Dates2:', dates2);
    console.log('Prices2:', prices2);
    console.log('Normalized Prices2:', normalizedPrices2);
    this.lineChartData.datasets[0].label = this.ticker1;
    this.lineChartData.datasets[1].label = this.ticker2;


    this.lineChartData.labels = dates1.length > dates2.length ? dates1 : dates2;
    this.lineChartData.datasets[0].data = normalizedPrices1;
    this.lineChartData.datasets[1].data = normalizedPrices2;
  
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    } else {
      console.error('Chart reference is not available.');
    }
  }
}
