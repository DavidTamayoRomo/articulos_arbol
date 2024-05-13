import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFromObject',
  standalone: true
})
export class TextFromObjectPipe implements PipeTransform {

  transform(value: any): string {
    if (!value || !value.content) {
      return ''; // Retornar cadena vacía si no hay contenido válido
    }

    let text = ''; // Variable para almacenar el texto final

    // Recorrer cada elemento del contenido
    value.content.forEach((element: any) => {
      if (element.type === 'paragraph') {
        text += this.getTextFromParagraph(element);
      } else if (element.type.startsWith('heading')) {
        text += this.getTextFromHeading(element);
      }
      text += '\n\n'; // Agregar saltos de línea entre párrafos o encabezados
    });

    return text.trim(); // Devolver el texto final sin espacios adicionales al final
  }

  private getTextFromParagraph(paragraph: any): string {
    return this.processTextElements(paragraph.content);
  }

  private getTextFromHeading(heading: any): string {
    const level = heading.attrs.level || 1;
    const tag = `h${Math.min(level, 6)}`; // Usar h1-h6, no permitir niveles mayores
    return `<${tag}>${this.processTextElements(heading.content)}</${tag}>`;
  }

  private processTextElements(content: any[]): string {
    let text = ''; // Variable para almacenar el texto procesado

    content.forEach((element: any) => {
      let fragment = element.text || ''; // Texto base

      if (element.marks) {
        element.marks.forEach((mark: any) => {
          switch(mark.type) {
            case 'strong':
              fragment = `<strong>${fragment}</strong>`;
              break;
            case 'em':
              fragment = `<em>${fragment}</em>`;
              break;
            case 'u':
              fragment = `<u>${fragment}</u>`;
              break;
            case 's':
              fragment = `<s>${fragment}</s>`;
              break;
            case 'link':
              fragment = `<a href="${mark.attrs.href}" target="_blank">${fragment}</a>`;
              break;
            case 'text_color':
              fragment = `<span style="color:${mark.attrs.color}">${fragment}</span>`;
              break;
            case 'text_background_color':
              fragment = `<span style="background-color:${mark.attrs.backgroundColor}">${fragment}</span>`;
              break;
            case 'code':
              fragment = `<code>${fragment}</code>`;
              break;
            case 'blockquote':
              fragment = `<blockquote>${fragment}</blockquote>`;
              break;
          }
        });
      }

      text += `${fragment} `; // Agregar un espacio después de cada elemento
    });

    return text.trim(); // Eliminar espacio extra al final
  }
}
