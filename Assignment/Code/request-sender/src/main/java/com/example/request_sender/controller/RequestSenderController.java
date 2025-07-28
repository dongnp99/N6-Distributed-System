package com.example.request_sender.controller;

import com.example.request_sender.entity.MessageWrapper;
import com.example.request_sender.service.KafkaSenderService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/send")
public class RequestSenderController {
    private final KafkaSenderService kafkaSender;
    private final RestTemplate restTemplate;

    public RequestSenderController(KafkaSenderService kafkaSender) {
        this.kafkaSender = kafkaSender;
        this.restTemplate = new RestTemplate();
    }
    @PostMapping
    public String send(@RequestBody RequestWrapper req) {
        if (req.useKafka) {
            kafkaSender.sendToKafka(req.message);
            return "Sent to Kafka: " + req.message;
        } else {
            // Gửi JSON đến processor
            String url = "http://request-processor:8081/process";

            // Tạo MessageWrapper
            MessageWrapper wrapper = new MessageWrapper();
            wrapper.setMessage(req.message);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MessageWrapper> entity = new HttpEntity<>(wrapper, headers);

            return restTemplate.postForObject(url, entity, String.class);
        }
    }

    public static class RequestWrapper {
        public String message;
        public boolean useKafka;
    }
}