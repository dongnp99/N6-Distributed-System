package com.example.request_processor.service;

import com.example.request_processor.entity.Tickets;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class RequestProcessorService {
    private final AtomicLong idCounter = new AtomicLong();
    private final List<Tickets> processedRequests = Collections.synchronizedList(new ArrayList<>());

    public void add(String request) {
        Tickets t = new Tickets();
        long id = idCounter.incrementAndGet();
        t.setId(id);
        t.setMessage(request);
        processedRequests.add(t);
    }

    public List<Tickets> getAllDirect() {
        List<Tickets> result = processedRequests.stream()
                .filter(a->a.getMessage().contains("direct"))
                .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                .collect(Collectors.toList());
        return result;
    }

    public List<Tickets> getAllKafka() {
        List<Tickets> result = processedRequests.stream()
                .filter(a->a.getMessage().contains("kafka"))
                .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                .collect(Collectors.toList());
        return result;
    }

    public void clearDirectMessages() { processedRequests.removeIf(ticket -> ticket.getMessage().contains("direct")); }
    public void clearKafkaMessages() { processedRequests.removeIf(ticket -> ticket.getMessage().contains("kafka")); }

    private void simulateCPUIntensiveTask() {
        long sum = 0;
        for (int i = 0; i < 10_000_000; i++) {
            sum += Math.sqrt(i);
        }
    }

    private void simulateIOTask() {
        try {
            Thread.sleep(200); // giả lập gọi DB, HTTP
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public void process(String request){
        this.simulateIOTask();
        this.simulateCPUIntensiveTask();
        Tickets t = new Tickets();
        long id = idCounter.incrementAndGet();
        t.setId(id);
        t.setMessage(request);
        processedRequests.add(t);
    }
}
