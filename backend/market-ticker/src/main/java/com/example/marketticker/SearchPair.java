package com.example.marketticker;
import javax.persistence.*;

@Entity
public class SearchPair {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String ticker1;
private String ticker2;
private int searchCount; // New field to store the count of searches

// Getters and setters

public Long getId() {
    return id;
}
public void setId(Long id) {
    this.id = id;
}
public String getTicker1() {
    return ticker1;
}
public void setTicker1(String ticker1) {
    this.ticker1 = ticker1;
}

public String getTicker2() {
    return ticker2;
}

public void setTicker2(String ticker2) {
    this.ticker2 = ticker2;
}

public int getSearchCount() {
    return searchCount;
}

public void setSearchCount(int searchCount) {
    this.searchCount = searchCount;
}

// Method to increment the search count
public void incrementSearchCount() {
    this.searchCount++;
}


}