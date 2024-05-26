package com.example.marketticker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SearchPairService {
    private static final Logger logger = LoggerFactory.getLogger(SearchPairService.class);

    @Autowired
    private SearchPairRepository searchPairRepository;

    public List<SearchPair> getAllPairs() {
        return searchPairRepository.findAll();
    }

    public SearchPair createPair(SearchPair searchPair) {
        return searchPairRepository.save(searchPair);
    }

    public SearchPair searchPair(String ticker1, String ticker2) {
        logger.debug("Searching for pair: {} and {}", ticker1, ticker2);
        Optional<SearchPair> optionalPair = searchPairRepository.findByTickers(ticker1, ticker2);

        SearchPair pair;
        if (optionalPair.isPresent()) {
            pair = optionalPair.get();
        } else {
            pair = new SearchPair();
            pair.setTicker1(ticker1);
            pair.setTicker2(ticker2);
            pair.setSearchCount(0); // Initialize the search count
            System.out.println("Search Count Initialized");
        }

        pair.incrementSearchCount();
        SearchPair savedPair = searchPairRepository.save(pair);
        logger.debug("Saved pair: {}", savedPair);
        return savedPair;
    }

    public List<String> getSuggestedTickers(String ticker) {
        logger.debug("Getting suggested tickers for: {}", ticker);
        List<SearchPair> pairs = searchPairRepository.findPopularPairsForTicker(ticker);
        List<String> suggestions = pairs.stream()
                .map(pair -> pair.getTicker1().equals(ticker) ? pair.getTicker2() : pair.getTicker1())
                .distinct()
                .collect(Collectors.toList());
        logger.debug("Suggested tickers: {}", suggestions);
        return suggestions;
    }
}
