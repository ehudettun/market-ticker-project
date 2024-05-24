package com.example.marketticker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface SearchPairRepository extends JpaRepository<SearchPair, Long> {
    @Query("SELECT p FROM SearchPair p WHERE (p.ticker1 = :ticker1 AND p.ticker2 = :ticker2) OR (p.ticker1 = :ticker2 AND p.ticker2 = :ticker1)")
    Optional<SearchPair> findByTickers(String ticker1, String ticker2);

    @Query("SELECT p FROM SearchPair p WHERE p.ticker1 = :ticker OR p.ticker2 = :ticker ORDER BY p.searchCount DESC")
    List<SearchPair> findPopularPairsForTicker(String ticker);
}
