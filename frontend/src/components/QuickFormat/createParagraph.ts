import { MdBaseCreate, MdBases } from "./markdownBase";


const createParagraph = (selectedFormat: string, text: string) => {
  const mdCreator = new MdBaseCreate();
  switch (selectedFormat) {
    // Modificación en createParagraph para encabezados
    case '# ':
    case '## ':
    case '### ':
    case '#### ':
    case '##### ':
    case '###### ':
      return `${selectedFormat}${text}`; // Eliminado el espacio extra

    // Nuevo caso para manejar espacio/regla horizontal
    case '---':
    case 'horizontal-rule':
    case 'hr':
    case 'space':
      return `\n\n${mdCreator.createHorizontalRule()}\n`;

    // Bold
    case '**':
    case 'bold':
      return `\n\n${mdCreator.createBold(text)}\n`;

    // Italic
    case '*':
    case 'italic':
      return `\n\n${mdCreator.createItalic(text)}\n`;

    // Strike-through
    case '~~':
    case 'strike':
      return `\n\n${mdCreator.createStrike(text)}\n`;

    // Underline (usando la base subrayada)
    case '__':
    case 'underline':
      return `\n\n${MdBases.underlineBase}${text}${MdBases.underlineBase}\n`;

    // Inline code
    case '`':
    case 'inline-code':
      return `\n\n${mdCreator.createInlineCode(text)}\n`;

    // Code block
    case 'code-block':
    case '```':
      // Puedes adaptar para incluir el lenguaje si lo deseas
      return `\n\n${mdCreator.createCodeBlock(text)}\n`;

    // Blockquote
    case 'blockquote':
      return `\n\n${mdCreator.createBlockquote(text)}\n`;

    // Horizontal rule
    case 'horizontal-rule':
    case 'hr':
      return `\n\n${mdCreator.createHorizontalRule()}\n`;

    // Unordered list (elementos separados por comas)
    case 'unordered-list':
    case '- ':
    case 'ul': {
      const items = text.split(',').map(item => item.trim());
      console.log(items)
      return `\n\n${mdCreator.createUnorderedList(items)}\n`;
    }

    // Ordered list (elementos separados por comas)
    case 'ordered-list':
    case 'ol': {
      const items = text.split(',').map(item => item.trim());
      return `\n\n${mdCreator.createOrderedList(items)}\n`;
    }

    // Checkbox list (elementos separados por comas, todos sin marcar por defecto)
    case 'checkbox': {
      const items = text.split(',').map(item => item.trim());
      return `\n\n${items.map(item => mdCreator.createCheckbox(item, false)).join('\n')}\n`;
    }

    // Table: ingresa los títulos de las columnas separados por comas
    case 'table': {
      const columns = text.split(',').map(item => item.trim());
      return `\n\n${mdCreator.createMdTableHeader(columns)}\n`;
    }

    // Link: ingresa "Texto del link,https://url.com"
    case 'link': {
      const [linkText, linkUrl] = text.split(',').map(item => item.trim());
      return `\n\n${mdCreator.createMdLink(linkText || 'Link text', linkUrl || 'https://')}\n`;
    }

    // Image: ingresa "Texto alternativo,https://image.url"
    case 'image': {
      const [altText, imgUrl] = text.split(',').map(item => item.trim());
      return `\n\n${mdCreator.createMdImage(altText || 'My image', imgUrl || 'https://')}\n`;
    }

    // Comment
    case 'comment':
      return `\n\n${mdCreator.createComment(text)}\n`;

    // Por defecto, párrafo sin formato
    default:
      return `\n\n${text}\n`;
  }
};

export default createParagraph
