package com.example.request_processor.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaRequestConsumer {

    @KafkaListener(topics = "requests", groupId = "processor-group")
    public void handleMessage(String message) {
        System.out.println("🛠️ [Kafka] Received message: " + message);

        // Giả lập xử lý dữ liệu
        process(message);
    }

    private void process(String data) {
        System.out.println("✅ [Processor] Processing: " + data);
        // Thêm logic xử lý nếu cần
    }
}
