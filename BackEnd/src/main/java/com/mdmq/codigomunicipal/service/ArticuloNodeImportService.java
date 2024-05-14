package com.mdmq.codigomunicipal.service;

import com.mdmq.codigomunicipal.models.ArticuloNode;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.FileInputStream;
import java.util.*;

@Service
public class ArticuloNodeImportService {

    @Autowired
    private ArticuloNodeService articuloNodeService;

    public void importFromExcel(String excelFilePath) throws Exception {
        FileInputStream inputStream = new FileInputStream(excelFilePath);
        Workbook workbook = WorkbookFactory.create(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        Map<String, ArticuloNode> levelToNodeMap = new HashMap<>();

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row

            String level = getCellAsString(row.getCell(0));
            String name = getCellAsString(row.getCell(1));
            String content = getCellAsString(row.getCell(2));
            String state = getCellAsString(row.getCell(3));
            String referencia = getCellAsString(row.getCell(4));
            String usuarioCreacion = getCellAsString(row.getCell(5));
            String usuarioModificacion = getCellAsString(row.getCell(6));

            ArticuloNode node = new ArticuloNode();
            node.setName(name);
            node.setContent(content);
            node.setState(state);
            node.setReferencia(referencia);
            node.setUsuario_creacion(usuarioCreacion);
            node.setUsuario_modificacion(usuarioModificacion);
            node.setChildren(new ArrayList<>());
            if (level.contains(".")) {
                String parentLevel = level.substring(0, level.lastIndexOf('.'));
                ArticuloNode parentNode = levelToNodeMap.get(parentLevel);
                if (parentNode != null) {
                    node.setId_padre(parentNode.getId());
                    parentNode.getChildren().add(node);
                }
            }

            articuloNodeService.saveChildrent(node);
            levelToNodeMap.put(level, node);
        }

        // Update parent nodes with their children
        levelToNodeMap.values().forEach(node -> {
            articuloNodeService.saveChildrent(node);
        });

        workbook.close();
        inputStream.close();
    }



    public String getCellAsString(Cell cell) {
        if (cell == null) return ""; // Si la celda es null, regresa una cadena vacía.
    
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                // Convertir el valor numérico a String sin perder información.
                // Si el valor es exactamente igual a su parte entera, se convierte eliminando cualquier parte decimal
                double numericValue = cell.getNumericCellValue();
                if ((numericValue == Math.floor(numericValue)) && !Double.isInfinite(numericValue)) {
                    // Es un número entero, convertir sin parte decimal
                    return String.format("%.0f", numericValue);
                } else {
                    // Es un número con decimales, convertir manteniendo la precisión
                    return String.valueOf(numericValue);
                }
            case BOOLEAN:
                // Convertir booleano a String
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                // Evaluar la fórmula y tratar el resultado según su tipo
                switch (cell.getCachedFormulaResultType()) {
                    case STRING:
                        return cell.getStringCellValue();
                    case NUMERIC:
                        double formulaValue = cell.getNumericCellValue();
                        if ((formulaValue == Math.floor(formulaValue)) && !Double.isInfinite(formulaValue)) {
                            return String.format("%.0f", formulaValue);
                        } else {
                            return String.valueOf(formulaValue);
                        }
                    case BOOLEAN:
                        return String.valueOf(cell.getBooleanCellValue());
                    default:
                        return "";
                }
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}
