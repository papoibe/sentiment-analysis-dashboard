package com.btl.sentiment_analysis_dashboard.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// Cau hinh OpenAI - doc tu application.yaml prefix "openai"
// Neu key rong hoac khong set -> he thong tu dong fallback ve mock AI
@Configuration
@ConfigurationProperties(prefix = "openai")
public class OpenAiProperties {

    private Api api = new Api();
    private String baseUrl = "https://api.openai.com/v1";
    private String model = "gpt-3.5-turbo"; // Model mac dinh
    private double temperature = 0.3; // Do "sang tao" cua AI (0.0 = chinh xac, 1.0 = sang tao)

    // Inner class chua api.key
    public static class Api {
        private String key; // Doc tu ${OPENAI_API_KEY} hoac ghi truc tiep

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    // Kiem tra OpenAI co duoc cau hinh (co API key) hay khong
    public boolean isEnabled() {
        return api.getKey() != null && !api.getKey().isBlank();
    }

    public Api getApi() {
        return api;
    }

    public void setApi(Api api) {
        this.api = api;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
}
