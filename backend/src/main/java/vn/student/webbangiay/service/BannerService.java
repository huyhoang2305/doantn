package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.student.webbangiay.dto.BannerDto;
import vn.student.webbangiay.exception.FileUploadException;
import vn.student.webbangiay.model.Banner;
import vn.student.webbangiay.repository.BannerRepository;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;

@Service
public class BannerService {

    private static final String BANNER_PATH = "banner/";
    private static final String BASE_URL = "http://localhost:8080/uploads/";  
    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private FileService s3Service;

    public List<Banner> getAllBanners() {
        // Stream through all banners and update image URL to include the full host
        return bannerRepository.findAll().stream()
            .map(banner -> {
                // If the banner has an image URL and doesn't already contain http, prepend the base URL
                if (banner.getImageUrl() != null && !banner.getImageUrl().isEmpty() && 
                    !banner.getImageUrl().startsWith("http://") && !banner.getImageUrl().startsWith("https://")) {
                    banner.setImageUrl(BASE_URL + banner.getImageUrl());
                }
                return banner;
            })
            .collect(Collectors.toList());
    }

    public Banner getBannerById(Integer bannerId) {
        // Find the banner by ID, and if it exists, update the image URL to include the full host
        Banner banner = bannerRepository.findById(bannerId).orElse(null);
        if (banner != null && banner.getImageUrl() != null && !banner.getImageUrl().isEmpty() &&
            !banner.getImageUrl().startsWith("http://") && !banner.getImageUrl().startsWith("https://")) {
            banner.setImageUrl(BASE_URL + banner.getImageUrl());
        }
        return banner;
    }

    public Banner createBanner(BannerDto bannerDto) {
        String imageUrl = null;

        if (bannerDto.getImageFile() != null) {
            try {
                imageUrl = uploadImageToS3(bannerDto.getImageFile(), bannerDto.getTitle());
            } catch (IOException e) {
                throw new FileUploadException("Error uploading image to S3", e);
            }
        }

        Banner banner = new Banner();
        banner.setTitle(bannerDto.getTitle());
        banner.setImageUrl(imageUrl);
        banner.setLink(bannerDto.getLink());
        banner.setIsActive(bannerDto.getIsActive());
        banner.setCreatedAt(new Date());
        banner.setUpdatedAt(new Date());

        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Integer bannerId, BannerDto bannerDto) {
        Banner banner = bannerRepository.findById(bannerId)
            .orElse(null);

        if (bannerDto.getImageFile() != null && !bannerDto.getImageFile().isEmpty()) {
            try {
                String imageUrl = uploadImageToS3(bannerDto.getImageFile(), bannerDto.getTitle());
                banner.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new FileUploadException("Error uploading image to S3", e);
            }
        }

        banner.setTitle(bannerDto.getTitle());
        banner.setLink(bannerDto.getLink());
        banner.setIsActive(bannerDto.getIsActive());
        banner.setUpdatedAt(new Date());

        return bannerRepository.save(banner);
    }

    public void deleteBanner(Integer bannerId) {
        bannerRepository.deleteById(bannerId);
    }

    private String uploadImageToS3(MultipartFile imageFile, String title) throws IOException {
        try {
            return uploadImage(imageFile, title);
        } catch (IOException e) {
            throw new FileUploadException("Error uploading image to S3", e);
        }
    }

    public String uploadImage(MultipartFile imageFile, String title) throws IOException {
        String originalFilename = imageFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        int width, height;

        // Read the image to get width and height
        try (InputStream inputStream = imageFile.getInputStream()) {
            BufferedImage bufferedImage = ImageIO.read(inputStream);
            if (bufferedImage == null) {
                throw new IOException("Invalid image file");
            }
            width = bufferedImage.getWidth();
            height = bufferedImage.getHeight();
        }

        // Format the title and generate a unique file name
        String formattedTitle = title.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String fileName = String.format("%s-%dx%d%s", formattedTitle, width, height, fileExtension);

        // Upload the image to the local folder
        s3Service.uploadFile(BANNER_PATH, fileName, imageFile.getInputStream(), imageFile.getSize(), imageFile.getContentType());

        return BANNER_PATH + fileName;
    }

    public Banner toggleBannerStatus(Integer id) {
        Optional<Banner> optionalBanner = bannerRepository.findById(id);
        if (optionalBanner.isEmpty()) {
            throw new RuntimeException("Banner not found with ID: " + id);
        }

        Banner banner = optionalBanner.get();
        banner.setIsActive(!banner.getIsActive());
        banner.setUpdatedAt(new Date());
        return bannerRepository.save(banner);
    }
}
