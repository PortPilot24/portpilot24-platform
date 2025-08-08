package com.example;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load(); // .env 로딩
		System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD")); // 시스템 프로퍼티 등록
		SpringApplication.run(MainApplication.class, args);
	}

}
