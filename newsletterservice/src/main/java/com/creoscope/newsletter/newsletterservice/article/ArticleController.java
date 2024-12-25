package com.creoscope.newsletter.newsletterservice.article;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@RestController
@RequestMapping("/article")
public class ArticleController {

    private static final Logger LOG = LogManager.getLogger(ArticleController.class);

    @GetMapping
    public String getArticle() {
        return "Hello from article";
    }

}
