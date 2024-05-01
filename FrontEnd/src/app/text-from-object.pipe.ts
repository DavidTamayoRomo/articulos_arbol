import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFromObject',
  standalone: true
})
export class TextFromObjectPipe implements PipeTransform {

  transform(value: any): string {
    console.log(value);
    if (!value || !value.content) {
      return ''; // Retornar cadena vacía si no hay contenido válido
    }

    let text = ''; // Variable para almacenar el texto final

    // Recorrer cada elemento del contenido
    value.content.forEach((element: any) => {
      // Verificar el tipo de elemento
      if (element.type === 'paragraph') {
        // Agregar el texto del párrafo
        text += this.getTextFromParagraph(element);
      }
      // Agregar saltos de línea entre párrafos
      text += '\n\n';
    });

    return text; // Devolver el texto final
  }

  // Función para obtener el texto de un párrafo
  private getTextFromParagraph(paragraph: any): string {
    let text = ''; // Variable para almacenar el texto del párrafo

    // Verificar si el párrafo tiene contenido
    if (paragraph.content && paragraph.content.length > 0) {
      // Recorrer cada elemento del contenido del párrafo
      paragraph.content.forEach((element: any) => {
        // Verificar el tipo de elemento
        if (element.type === 'text') {
          // Agregar el texto del elemento
          text += element.text;
        } else if (element.type === 'text_color') {
          // Agregar texto con color de texto
          text += `<span style="color:${element.attrs.color}">${element.text}</span>`;
        } else if (element.type === 'background_color') {
          // Agregar texto con color de fondo
          text += `<span style="background-color:${element.attrs.color}">${element.text}</span>`;
        } else if (element.type === 'bold') {
          // Agregar texto en negrita
          text += `<strong>${element.text}</strong>`;
        } else if (element.type === 'italic') {
          // Agregar texto en cursiva
          text += `<em>${element.text}</em>`;
        } else if (element.type === 'underline') {
          // Agregar texto subrayado
          text += `<u>${element.text}</u>`;
        } else if (element.type === 'strike') {
          // Agregar texto tachado
          text += `<s>${element.text}</s>`;
        } else if (element.type === 'code') {
          // Agregar texto en código
          text += `<code>${element.text}</code>`;
        } else if (element.type === 'blockquote') {
          // Agregar bloque de cita
          text += `<blockquote>${element.text}</blockquote>`;
        } else if (element.type === 'link') {
          // Agregar enlace
          text += `<a href="${element.attrs.href}" target="${element.attrs.target}">${element.text}</a>`;
        }
        // Agregar un espacio después de cada elemento
        text += ' ';
      });
    }

    // Agregar un salto de línea al final del párrafo
    text += '\n';

    return text; // Devolver el texto del párrafo
  }

}
