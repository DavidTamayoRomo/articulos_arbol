package com.mdmq.codigomunicipal.service;

import com.mdmq.codigomunicipal.models.ArticuloNode;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
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

            String level = getCellAsFormattedString(row.getCell(0), workbook, false);
            String name = getCellAsFormattedString(row.getCell(1), workbook, false);
            String content = getCellAsFormattedString(row.getCell(2), workbook, true);
            String state = getCellAsFormattedString(row.getCell(3), workbook, false);
            String referencia = getCellAsFormattedString(row.getCell(4), workbook, false);
            String usuarioCreacion = getCellAsFormattedString(row.getCell(5), workbook, false);
            String usuarioModificacion = getCellAsFormattedString(row.getCell(6), workbook, false);

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

    public String getCellAsFormattedString(Cell cell, Workbook workbook, boolean formatContentColumn) {
    if (cell == null) return ""; // Si la celda es null, regresa una cadena vacía.

    StringBuilder cellValue = new StringBuilder();

    // Capturar el valor de la celda
    switch (cell.getCellType()) {
        case STRING:
            if (formatContentColumn && cell.getRichStringCellValue() instanceof XSSFRichTextString) {
                XSSFRichTextString richText = (XSSFRichTextString) cell.getRichStringCellValue();
                for (int i = 0; i < richText.length(); i++) {
                    XSSFFont font = richText.getFontOfFormattingRun(i);
                    String text = richText.getString().substring(i, i + 1);
                    if (font != null && font.getBold()) {
                        text = "<strong>" + text + "</strong>";
                    }
                    if (font != null && font.getItalic()) {
                        text = "<i>" + text + "</i>";
                    }
                    if (font != null && font.getUnderline() != Font.U_NONE) {
                        text = "<u>" + text + "</u>";
                    }
                    cellValue.append(text);
                }
            } else {
                cellValue.append(cell.getStringCellValue());
            }
            break;
        case NUMERIC:
            double numericValue = cell.getNumericCellValue();
            cellValue.append((numericValue == Math.floor(numericValue)) && !Double.isInfinite(numericValue)
                            ? String.format("%.0f", numericValue)
                            : String.valueOf(numericValue));
            break;
        case BOOLEAN:
            cellValue.append(cell.getBooleanCellValue());
            break;
        case FORMULA:
            cellValue.append(handleFormula(cell, workbook));
            break;
        case BLANK:
            return "";
        default:
            return "";
    }

    // Mantener saltos de línea
    String result = cellValue.toString().replace("\n", "<br>");

    // Aplicar alineación si es necesario
    if (formatContentColumn) {
        CellStyle style = cell.getCellStyle();
        switch (style.getAlignment()) {
            case CENTER:
                result = "<p class='ql-align-center'>" + result + "</p>";
                break;
            case LEFT:
                result = "<p class='ql-align-left'>" + result + "</p>";
                break;
            case RIGHT:
                result = "<p class='ql-align-right'>" + result + "</p>";
                break;
            case JUSTIFY:
                result = "<p class='ql-align-justify'>" + result + "</p>";
                break;
            default:
                break;
        }

        // Aplicar indentación
        if (style.getIndention() > 0) {
            result = "<p class='ql-indent-" + style.getIndention() + "'>" + result + "</p>";
        }
    }

    return result;
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