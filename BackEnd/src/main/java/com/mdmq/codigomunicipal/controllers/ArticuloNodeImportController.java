package com.mdmq.codigomunicipal.controllers;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mdmq.codigomunicipal.service.ArticuloNodeImportService;
import com.mdmq.codigomunicipal.service.ArticuloNodeService;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/importar")
@CrossOrigin("*")
public class ArticuloNodeImportController {

    private final ArticuloNodeImportService service;

    @Autowired
    public ArticuloNodeImportController(ArticuloNodeImportService service) {
        this.service = service;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se proporcionó un archivo para importar.");
        }
        try {
            // Guardar el archivo en una ruta temporal
            Path tempDir = Files.createTempDirectory("excel_uploads");
            File tempFile = tempDir.resolve(file.getOriginalFilename()).toFile();
            file.transferTo(tempFile);

            // Procesar el archivo
            service.importFromExcel(tempFile.getAbsolutePath());

            return ResponseEntity.ok("Importación exitosa");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en la importación: " + e.getMessage());
        }
    }

}
