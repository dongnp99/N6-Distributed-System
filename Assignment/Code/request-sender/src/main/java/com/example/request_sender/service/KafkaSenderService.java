package com.example.request_sender.service;

import com.example.request_sender.entity.MessageWrapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaSenderService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaSenderService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendToKafka(String data) {
        ObjectMapper mapper = new ObjectMapper();
        try{
            MessageWrapper wrapper = new MessageWrapper();
            wrapper.setMessage(data);
            String json = mapper.writeValueAsString(wrapper);
            kafkaTemplate.send("requests", json); // "requests" là tên topic
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
