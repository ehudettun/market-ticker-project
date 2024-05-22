package com.example.marketticker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SearchPairService {

    @Autowired
    private SearchPairRepository searchPairRepository;

    public List<SearchPair> getAllPairs() {
        return searchPairRepository.findAll();
    }

    public SearchPair createPair(SearchPair searchPair) {
        return searchPairRepository.save(searchPair);
    }

    public SearchPair searchPair(String ticker1, String ticker2) {
        Optional<SearchPair> optionalPair = searchPairRepository.findByTicker1AndTicker2(ticker1, ticker2);

        SearchPair pair;
        if (optionalPair.isPresent()) {
            pair = optionalPair.get();
        } else {
            pair = new SearchPair();
            pair.setTicker1(ticker1);
            pair.setTicker2(ticker2);
            pair.setSearchCount(0); // Initialize the search count
        }

        pair.incrementSearchCount();
        return searchPairRepository.save(pair);
    }
}
