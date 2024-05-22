package com.example.marketticker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/search-pairs")
public class SearchPairController {

    @Autowired
    private SearchPairService searchPairService;

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping
    public List<SearchPair> getAllPairs() {
        return searchPairService.getAllPairs();
    }

    @PostMapping
    public SearchPair createPair(@RequestBody SearchPair searchPair) {
        return searchPairService.createPair(searchPair);
    }

    @GetMapping("/search")
    public SearchPair searchPair(@RequestParam String ticker1, @RequestParam String ticker2) {
        return searchPairService.searchPair(ticker1, ticker2);
    }
    @GetMapping("/market-data")
    public Map<String, Map<String, Object>> getMarketData(@RequestParam String ticker1,
                                             @RequestParam String ticker2,
                                             @RequestParam String startDate,
                                             @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return marketDataService.getMarketDataForPair(ticker1, ticker2, start, end);
        }     
}
