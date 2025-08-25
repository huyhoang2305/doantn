package vn.student.webbangiay.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import vn.student.webbangiay.model.Banner;
import vn.student.webbangiay.repository.BannerRepository;

import java.util.Date;

@Component
public class BannerDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(BannerDataSeeder.class);

    @Bean
    CommandLineRunner seedBanners(BannerRepository bannerRepository) {
        return args -> {
            if (bannerRepository.count() == 0) { // To prevent duplicate entries

                // Create and save banners for shoe website
                Banner banner1 = new Banner();
                banner1.setTitle("Giày Nike Mới Nhất");
                banner1.setImageUrl("https://picsum.photos/1920/625?random=1001");
                banner1.setLink("http://localhost:3000/products?brand=nike");
                banner1.setIsActive(true);
                banner1.setCreatedAt(new Date());
                banner1.setUpdatedAt(new Date());

                Banner banner2 = new Banner();
                banner2.setTitle("Adidas Sale 50%");
                banner2.setImageUrl("https://picsum.photos/1920/625?random=1002");
                banner2.setLink("http://localhost:3000/products?brand=adidas");
                banner2.setIsActive(true);
                banner2.setCreatedAt(new Date());
                banner2.setUpdatedAt(new Date());

                Banner banner3 = new Banner();
                banner3.setTitle("Giày Thể Thao Nam");
                banner3.setImageUrl("https://picsum.photos/1920/625?random=1003");
                banner3.setLink("http://localhost:3000/products?category=giay-the-thao&gender=male");
                banner3.setIsActive(true);
                banner3.setCreatedAt(new Date());
                banner3.setUpdatedAt(new Date());

                Banner banner4 = new Banner();
                banner4.setTitle("Bộ Sưu Tập Mùa Thu 2024");
                banner4.setImageUrl("https://picsum.photos/1920/625?random=1004");
                banner4.setLink("http://localhost:3000/products?season=autumn");
                banner4.setIsActive(true);
                banner4.setCreatedAt(new Date());
                banner4.setUpdatedAt(new Date());
                
                // Save banners to the database
                bannerRepository.save(banner1);
                bannerRepository.save(banner2);
                bannerRepository.save(banner3);
                bannerRepository.save(banner4);
               
               
                logger.info("Shoe website banners seeded successfully!");
            }
        };
    }
}
