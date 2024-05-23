import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPairsComponent } from './search-pairs.component';

describe('SearchPairsComponent', () => {
  let component: SearchPairsComponent;
  let fixture: ComponentFixture<SearchPairsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPairsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
