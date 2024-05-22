package com.example.marketticker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search-pairs")
public class SearchPairController {

    @Autowired
    private SearchPairService searchPairService;

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
}
