package com.grievance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // package-visible constructor for testing
    EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        System.out.println("📧 Attempting to send email to: " + to);


        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
message.setFrom("deepthiky39@gmail.com");

            mailSender.send(message);

            System.out.println("✅ Email SENT successfully!");
        } catch (Exception e) {
            System.out.println("❌ Email FAILED!");
            e.printStackTrace();
        }
    }
} 
