package com.example.request_processor.controller;

import com.example.request_processor.DTO.KafkaMessageDTO;
import com.example.request_processor.entity.MessageWrapper;
import com.example.request_processor.service.KafkaRequestConsumer;
import com.example.request_processor.service.RequestProcessorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/process")
public class RequestProcessorController {
    private final RequestProcessorService processedService;

    @Autowired
    KafkaRequestConsumer kafkaRequestConsumerService;

    public RequestProcessorController(RequestProcessorService processedService) {
        this.processedService = processedService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public String handle(@RequestBody MessageWrapper content) {
        // Xử lý logic ở đây
        System.out.println("Processing: " + content.getMessage());

        // Lưu vào danh sách đã xử lý
        processedService.add(content.getMessage());

        return "Processed: " + content.getMessage();
    }

    @GetMapping("/processed")
    public java.util.List<String> getProcessed() {
        return processedService.getAll();
    }

    @KafkaListener(topics = "requests", groupId = "processor-group")
    public void listen(String rawMessage) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            MessageWrapper msg = mapper.readValue(rawMessage, MessageWrapper.class);
            processedService.add(msg.getMessage());
            System.out.println("📥 Kafka JSON Received: " + msg.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/kafka/messages")
    public List<KafkaMessageDTO> getMessages() {
        return kafkaRequestConsumerService.readMessages(); // Tự implement
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearProcessedMessages() {
        processedService.clearMessages();
        return ResponseEntity.ok("Processed messages cleared.");
    }
}