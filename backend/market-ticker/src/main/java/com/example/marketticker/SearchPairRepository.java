package com.example.marketticker;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SearchPairRepository extends JpaRepository<SearchPair, Long> {
    Optional<SearchPair> findByTicker1AndTicker2(String ticker1, String ticker2);
}
