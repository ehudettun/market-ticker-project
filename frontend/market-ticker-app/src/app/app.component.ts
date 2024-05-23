import { Component } from '@angular/core';
import { SearchPairsComponent } from './search-pairs/search-pairs.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchPairsComponent, HttpClientModule],
  template: `
  <app-search-pairs></app-search-pairs>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'market-ticker-app';
}
