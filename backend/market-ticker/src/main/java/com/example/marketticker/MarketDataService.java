package com.example.marketticker;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class MarketDataService {

    @Value("${polygon.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getMarketData(String ticker, LocalDate startDate, LocalDate endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedStartDate = startDate.format(formatter);
        String formattedEndDate = endDate.format(formatter);
        
        String url = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/" + formattedStartDate + "/" + formattedEndDate + "?apiKey=" + apiKey;
        
         ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        
        return response.getBody();
        
}
public Map<String, Map<String, Object>> getMarketDataForPair(String ticker1, String ticker2, LocalDate startDate, LocalDate endDate) {
    Map<String, Map<String, Object>> result = new HashMap<>();

    Map<String, Object> data1 = getMarketData(ticker1, startDate, endDate);
    Map<String, Object> data2 = getMarketData(ticker2, startDate, endDate);

    result.put(ticker1, data1);
    result.put(ticker2, data2);

    return result;
}
}