package com.example.marketticker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    @GetMapping("/validate/{ticker}")
    public boolean validateTicker(@PathVariable String ticker) {
        return marketDataService.validateTicker(ticker);
    }

    @GetMapping("/market-data")
    public Map<String, Map<String, Object>> getMarketData(@RequestParam String ticker1,
                                             @RequestParam String ticker2,
                                             @RequestParam String startDate,
                                             @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        searchPairService.searchPair(ticker1, ticker2);
        return marketDataService.getMarketDataForPair(ticker1, ticker2, start, end);
    }

    @GetMapping("/suggested")
    public List<String> getSuggestedTickers(@RequestParam String ticker) {
        return searchPairService.getSuggestedTickers(ticker);
    }
}
