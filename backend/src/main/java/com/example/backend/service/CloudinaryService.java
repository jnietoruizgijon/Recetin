package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Map upload(MultipartFile multipartFile) throws IOException {
        // Subimos el archivo a Cloudinary
        // ObjectUtils.asMap("resource_type", "auto") detecta si es imagen, video, ...
        return cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.emptyMap());
    }

    public Map delete(String id) throws IOException {
        return cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
    }
}
