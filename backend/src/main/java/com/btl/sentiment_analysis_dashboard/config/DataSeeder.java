package com.btl.sentiment_analysis_dashboard.config;

import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import com.btl.sentiment_analysis_dashboard.service.SentimentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

// Seed du lieu mau khi khoi dong ung dung, chi chay khi database rong
@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner seedData(
                        UserRepository userRepository,
                        BusinessRepository businessRepository,
                        KeywordRepository keywordRepository,
                        DataSourceRepository dataSourceRepository,
                        ReviewRepository reviewRepository,
                        SentimentResultRepository sentimentResultRepository,
                        SentimentService sentimentService,
                        PasswordEncoder passwordEncoder) {

                return args -> {
                        // Chi seed khi chua co user nao
                        if (userRepository.count() > 0)
                                return;

                        // === Tao 3 user mau (1 cho moi role) ===
                        User admin = User.builder()
                                        .username("admin")
                                        .email("admin@sentiment.com")
                                        .passwordHash(passwordEncoder.encode("admin123"))
                                        .fullName("Quan Tri Vien")
                                        .role(Role.ADMIN)
                                        .build();
                        admin = userRepository.save(admin);

                        User manager = User.builder()
                                        .username("manager")
                                        .email("manager@sentiment.com")
                                        .passwordHash(passwordEncoder.encode("manager123"))
                                        .fullName("Nguyen Van Manager")
                                        .role(Role.MANAGER)
                                        .build();
                        manager = userRepository.save(manager);

                        User analyst = User.builder()
                                        .username("analyst")
                                        .email("analyst@sentiment.com")
                                        .passwordHash(passwordEncoder.encode("analyst123"))
                                        .fullName("Tran Thi Analyst")
                                        .role(Role.ANALYST)
                                        .build();
                        analyst = userRepository.save(analyst);

                        // === Tao 2 businesses mau ===
                        Business business1 = Business.builder()
                                        .name("Nha Hang Pho Viet")
                                        .description("Chuoi nha hang pho truyen thong Viet Nam")
                                        .build();
                        business1 = businessRepository.save(business1);

                        Business business2 = Business.builder()
                                        .name("Cafe Saigon Morning")
                                        .description("Chuoi quan cafe phong cach Sai Gon")
                                        .build();
                        business2 = businessRepository.save(business2);

                        // === Tao keywords mau ===
                        String[][] keywords = {
                                        { "ngon", "FOOD_QUALITY" }, { "do", "FOOD_QUALITY" },
                                        { "tuoi", "FOOD_QUALITY" },
                                        { "nhanh", "SERVICE" }, { "cham", "SERVICE" }, { "than thien", "SERVICE" },
                                        { "re", "PRICE" }, { "dat", "PRICE" }, { "hop ly", "PRICE" },
                                        { "sach se", "ATMOSPHERE" }, { "on ao", "ATMOSPHERE" }
                        };
                        for (String[] kw : keywords) {
                                keywordRepository.save(Keyword.builder().keyword(kw[0]).category(kw[1]).build());
                        }

                        // === Tao data source mau ===
                        DataSource ds1 = DataSource.builder()
                                        .name("Google Reviews - Pho Viet")
                                        .type("CSV")
                                        .description("Du lieu review tu Google Maps cho Pho Viet")
                                        .createdBy(manager)
                                        .business(business1)
                                        .build();
                        ds1 = dataSourceRepository.save(ds1);

                        DataSource ds2 = DataSource.builder()
                                        .name("Facebook Reviews - Cafe Saigon")
                                        .type("CSV")
                                        .description("Du lieu review tu fanpage Facebook")
                                        .createdBy(manager)
                                        .business(business2)
                                        .build();
                        ds2 = dataSourceRepository.save(ds2);

                        // === Tao cac reviews mau va phan tich sentiment ===
                        String[] sampleReviews = {
                                        "Pho rat ngon, nuoc dung dam da, thit bo tuoi. Se quay lai!",
                                        "Dich vu te qua, doi lau ma khong duoc phuc vu. That vong!",
                                        "Gia hop ly cho chat luong nhu vay, nhan vien than thien",
                                        "Khong gian sach se nhung mon an binh thuong, khong co gi noi bat",
                                        "Cafe ngon, gia re, nhan vien nhanh nhen va chuyen nghiep",
                                        "Do an kho an, pho nhat, thit dai. Khong bao gio quay lai",
                                        "Quan dep, do uong ngon, gia hoi dat nhung chap nhan duoc",
                                        "Phuc vu cham, thai do nhan vien khong tot. Can cai thien nhieu",
                                        "Tuyet voi! Mon an chat luong, phuc vu nhanh, gia tot",
                                        "Binh thuong, khong co gi dac biet. Mon an tam duoc",
                                        "Khong gian am cung, cafe thom ngon, se gioi thieu ban be",
                                        "Mat ve sinh, ban do, chen dia khong sach. Khong ung y",
                                        "Xuat sac! Dam da huong vi truyen thong, pho ngon nhat Sai Gon",
                                        "Doi 30 phut moi co mon. Quan dong nhung phuc vu cham",
                                        "Gia re bat ngo, do an tuoi ngon. Dang dong tien",
                                        "Nhan vien nhiet tinh, an tuong voi chat luong phuc vu",
                                        "Mon an lanh, pho khong nong. Kem chat luong so voi gia",
                                        "Khong gian thoang mat, view dep, cafe ngon. Hoan hao",
                                        "Pho bo ngon nhung pho ga binh thuong. Nuoc dung can dam hon",
                                        "That bai hoan toan. Mon an do, phuc vu te, gia dat"
                        };

                        for (int i = 0; i < sampleReviews.length; i++) {
                                // Chia reviews cho 2 data sources
                                DataSource ds = (i < 10) ? ds1 : ds2;
                                Review review = Review.builder()
                                                .content(sampleReviews[i])
                                                .sourceType("CSV")
                                                .dataSource(ds)
                                                // Tao ngay random trong 60 ngay gan day cho Trend Analysis
                                                .createdAt(LocalDateTime.now().minusDays((long) (Math.random() * 60)))
                                                .build();
                                review = reviewRepository.save(review);

                                // Phan tich sentiment bang mock AI service
                                SentimentResult result = sentimentService.analyzeSentiment(review);
                                sentimentResultRepository.save(result);
                        }

                        System.out.println("=== SEED DATA HOAN TAT ===");
                        System.out.println("Users: 3 (admin/manager/analyst - mat khau: [role]123)");
                        System.out.println("Businesses: 2");
                        System.out.println("Keywords: " + keywords.length);
                        System.out.println("Data Sources: 2");
                        System.out.println("Reviews + Sentiment: " + sampleReviews.length);
                };
        }
}
