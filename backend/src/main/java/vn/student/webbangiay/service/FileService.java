package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir; // Folder path to store uploaded files

    // Constructor can be omitted if using Spring's @Autowired to inject the dependencies

    public String uploadFile(String folder, String fileName, InputStream inputStream, long contentLength, String contentType) throws IOException {
 
        // Create the folder path if it doesn't exist
        Path folderPath = Paths.get(uploadDir, folder);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath); // Create folder if it doesn't exist
        }

        // Define the full file path within the specific folder
        Path filePath = folderPath.resolve(fileName);

        // Write the input stream to the file
        try (FileOutputStream fileOutputStream = new FileOutputStream(filePath.toFile())) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, bytesRead);
            }
        }

        // Return the file path relative to the static directory (for access)
        return filePath.toString();
    }

    public File downloadFile(String fileName, String folder) {
        Path filePath = Paths.get(uploadDir, folder, fileName);
        File file = filePath.toFile();
        if (!file.exists()) {
            throw new RuntimeException("File not found: " + fileName);
        }
        return file;
    }

    public void deleteFile(String fileName, String folder) {
        Path filePath = Paths.get(uploadDir, folder, fileName);
        File file = filePath.toFile();
        if (file.exists()) {
            file.delete();
        } else {
            throw new RuntimeException("File not found: " + fileName);
        }
    }

    public String getFileUrl(String fileName, String folder) {
        // Construct URL path for accessing the file
        return "/static/" + folder + "/" + fileName; // Assuming static files are served from the "static" folder
    }
}
