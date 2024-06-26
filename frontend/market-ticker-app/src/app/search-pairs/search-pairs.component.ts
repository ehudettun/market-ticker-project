import { Component, ViewChild, AfterViewInit } from '@angular/core';
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
export class SearchPairsComponent implements AfterViewInit {
  ticker1!: string;
  ticker2!: string;
  startDate!: string;
  endDate!: string;
  marketData1: any;
  marketData2: any;
  loading: boolean = false;
  errorMessage: string = '';
  ticker1Valid: boolean = true;
  ticker2Valid: boolean = true;
  suggestedTickers: string[] = [];
  roiTicker1!: number;
  roiTicker2!: number;
  roiDifference!: number;
  includeDividends: boolean = true;

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        borderColor: 'blue',
        fill: false,
        pointStyle: false
      },
      {
        label: 'Dataset 2',
        data: [],
        borderColor: 'red',
        fill: false,
        pointStyle: false
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    
    scales: {
      y: {
        title: {
          display: true,
          text: 'Percentage (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };
  public lineChartType: ChartType = 'line';

  constructor(private marketDataService: MarketDataService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    // Ensure the chart is available after the view has been initialized
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    } else {
      console.error('Chart reference is not available.');
    }
  }

  validateTicker(ticker: string, field: 'ticker1Valid' | 'ticker2Valid') {
    if (!ticker) {
      this[field] = false;
      return;
    }
  
    // Capitalize tickers before submitting
    ticker = ticker.toUpperCase();
    if (field === 'ticker1Valid') {
      this.ticker1 = ticker;
    } else {
      this.ticker2 = ticker;
    }
  
    this.marketDataService.validateTicker(ticker).subscribe({
      next: isValid => {
        this[field] = isValid;
        if (field === 'ticker1Valid' && isValid) {
          this.getSuggestedTickers(ticker);
        }
      },
      error: () => {
        this[field] = false;
      }
    });
  }

  getSuggestedTickers(ticker: string) {
    this.marketDataService.getSuggestedTickers(ticker).subscribe({
      next: suggestedTickers => {
        this.suggestedTickers = suggestedTickers;
      },
      error: () => {
        this.suggestedTickers = [];
      }
    });
  }

  searchPair() {
    
    if (!this.ticker1 || !this.ticker2 || !this.startDate || !this.endDate) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    if (!this.ticker1Valid || !this.ticker2Valid) {
      this.errorMessage = 'One or both tickers are invalid.';
      return;
    }

    const currentDate = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

    if (new Date(this.startDate) > currentDate || new Date(this.endDate) > currentDate) {
      this.errorMessage = 'Dates must not be in the future.';
      return;
    }

    if (new Date(this.startDate) < fiveYearsAgo || new Date(this.endDate) < fiveYearsAgo) {
      this.errorMessage = 'You can only go back five years.';
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.errorMessage = 'Start date must be before end date.';
      return;
    }

    // Capitalize tickers before submitting
    this.ticker1 = this.ticker1.toUpperCase();
    this.ticker2 = this.ticker2.toUpperCase();

    this.loading = true;
    this.errorMessage = '';

    this.marketDataService.getMarketData(this.ticker1, this.ticker2, this.startDate, this.endDate).subscribe({
      next: data => {
        this.marketData1 = data[this.ticker1];
        this.marketData2 = data[this.ticker2];
        this.updateChart();
        this.loading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to fetch market data. Please try again later.';
        this.loading = false;
      }
    });
  }

  updateChart() {
    if (!this.marketData1 || !this.marketData2) {
      return;
    }
  
    const dates1: string[] = this.marketData1.results.map((result: any) => new Date(result.t).toLocaleDateString());
    let prices1: number[] = this.marketData1.results.map((result: any) => result.c);
    const dividends1: any[] = this.marketData1.dividends || [];
  
    const dates2: string[] = this.marketData2.results.map((result: any) => new Date(result.t).toLocaleDateString());
    let prices2: number[] = this.marketData2.results.map((result: any) => result.c);
    const dividends2: any[] = this.marketData2.dividends || [];
  
    // Adjust prices using dividend multipliers
    if (this.includeDividends) {
      dividends1.forEach((dividend: any) => {
        const exDate = new Date(dividend.ex_dividend_date).toLocaleDateString();
        const dateIndex = dates1.findIndex((date: string) => new Date(date).toLocaleDateString() === exDate);
        if (dateIndex !== -1 && dateIndex > 0) {
          const previousPrice = prices1[dateIndex - 1];
          const multiplier = 1 - (dividend.cash_amount / previousPrice);
          for (let i = 0; i <= dateIndex; i++) {
            prices1[i] *= multiplier;
          }
        }
      });
  
      dividends2.forEach((dividend: any) => {
        const exDate = new Date(dividend.ex_dividend_date).toLocaleDateString();
        const dateIndex = dates2.findIndex((date: string) => new Date(date).toLocaleDateString() === exDate);
        if (dateIndex !== -1 && dateIndex > 0) {
          const previousPrice = prices2[dateIndex - 1];
          const multiplier = 1 - (dividend.cash_amount / previousPrice);
          for (let i = 0; i <= dateIndex; i++) {
            prices2[i] *= multiplier;
          }
        }
      });
    }
  
    // Normalize prices to start from 100%
    const normalizedPrices1 = prices1.map((price: number) => (price / prices1[0]) * 100);
    const normalizedPrices2 = prices2.map((price: number) => (price / prices2[0]) * 100);
  
    const finalPrice1 = normalizedPrices1[normalizedPrices1.length - 1]; 
    const finalPrice2 = normalizedPrices2[normalizedPrices2.length - 1];
  
    this.roiTicker1 = finalPrice1 - 100;
    this.roiTicker2 = finalPrice2 - 100;
  
    this.roiDifference = this.roiTicker1 - this.roiTicker2;
  
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

