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

        StringBuilder sb = new StringBuilder();

        for (Row row : sheet) {
            if (row.getRowNum() == 0)
                continue; // Saltar la fila de encabezado

            String level = getCellAsFormattedString(row.getCell(0), workbook);
            String name = getCellAsFormattedString(row.getCell(1), workbook);
            String content = getCellAsFormattedString(row.getCell(2), workbook);
            String state = getCellAsFormattedString(row.getCell(3), workbook);
            String referencia = getCellAsFormattedString(row.getCell(4), workbook);
            String usuarioCreacion = getCellAsFormattedString(row.getCell(5), workbook);
            String usuarioModificacion = getCellAsFormattedString(row.getCell(6), workbook);

            sb.append(level).append(",")
              .append(name).append(",")
              .append(content).append(",")
              .append(state).append(",")
              .append(referencia).append(",")
              .append(usuarioCreacion).append(",")
              .append(usuarioModificacion).append("\n\n");

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

        // Actualizar nodos padres con sus hijos
        levelToNodeMap.values().forEach(node -> {
            articuloNodeService.saveChildrent(node);
        });

        // Guardar el contenido generado en un archivo si es necesario
        // Files.write(Path.of("output.txt"), sb.toString().getBytes());

        workbook.close();
        inputStream.close();
    }

    public String getCellAsFormattedString(Cell cell, Workbook workbook) {
        if (cell == null) return ""; // Si la celda es null, regresa una cadena vacía.

        CellStyle style = cell.getCellStyle();
        Font font = workbook.getFontAt(style.getFontIndex());

        String cellValue = "";
        switch (cell.getCellType()) {
            case STRING:
                cellValue = cell.getStringCellValue();
                break;
            case NUMERIC:
                double numericValue = cell.getNumericCellValue();
                cellValue = (numericValue == Math.floor(numericValue)) && !Double.isInfinite(numericValue)
                            ? String.format("%.0f", numericValue)
                            : String.valueOf(numericValue);
                break;
            case BOOLEAN:
                cellValue = String.valueOf(cell.getBooleanCellValue());
                break;
            case FORMULA:
                cellValue = handleFormula(cell, workbook);
                break;
            case BLANK:
                return "";
            default:
                return "";
        }

        // Agregar etiquetas HTML para negritas y cursivas
        if (font.getBold()) {
            cellValue = "<b>" + cellValue + "</b>";
        }
        if (font.getItalic()) {
            cellValue = "<i>" + cellValue + "</i>";
        }

        return cellValue.replace("\n", "<br>"); // Mantener saltos de línea
    }

    private String handleFormula(Cell cell, Workbook workbook) {
        switch (cell.getCachedFormulaResultType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                double formulaValue = cell.getNumericCellValue();
                return (formulaValue == Math.floor(formulaValue)) && !Double.isInfinite(formulaValue)
                       ? String.format("%.0f", formulaValue)
                       : String.valueOf(formulaValue);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

}
