package com.example.request_processor.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class RequestProcessorService {
    private final List<String> processedRequests = Collections.synchronizedList(new ArrayList<>());

    public void add(String request) {
        processedRequests.add(request);
    }

    public List<String> getAll() {
        return new ArrayList<>(processedRequests);
    }

    public void clearMessages() { processedRequests.clear(); }
}
