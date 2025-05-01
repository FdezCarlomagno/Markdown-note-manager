export const MdBases = {
    // Headers
    h1Base: "# ",
    h2Base: "## ",
    h3Base: "### ",
    h4Base: "#### ",
    h5Base: "##### ",
    h6Base: "###### ",
    
    // Text formatting
    boldBase: "**",
    italicBase: "*",
    strikeBase: "~~",
    underlineBase: "__",
    inlineCodeBase: "`",
    
    // Code blocks
    codeBlockBase: "```",
    codeBlockLangBase: (language: string) => `\`\`\`${language}\n`,
    
    // Block elements
    blockquoteBase: "> ",
    space: "---",
    horizontalRuleBase: "---",
    
    // Lists
    listUnorderedBase: "- ",
    listOrderedBase: "1. ",
    checkboxUncheckedBase: "- [ ] ",
    checkboxCheckedBase: "- [x] ",
    
    // Tables
    tableHeaderSeparator: "| --- ",
    tableColumnSeparator: "| ",
    tableNewRow: "|",
    
    // Links & references
    linkReferenceBase: "link",
    image: "image",
    
    // Comments
    commentBase: "<!-- ",
    commentEndBase: " -->"
};

export class MdBaseCreate {
    // Basic text formatting
    createBold(text: string) {
        return `${MdBases.boldBase}${text}${MdBases.boldBase}`;
    }

    createItalic(text: string) {
        return `${MdBases.italicBase}${text}${MdBases.italicBase}`;
    }

    createStrike(text: string) {
        return `${MdBases.strikeBase}${text}${MdBases.strikeBase}`;
    }

    createInlineCode(text: string) {
        return `${MdBases.inlineCodeBase}${text}${MdBases.inlineCodeBase}`;
    }

    // Code blocks
    createCodeBlock(code: string, language: string = "tsx") {
        return `${MdBases.codeBlockLangBase(language)}${code}\n${MdBases.codeBlockBase}`;
    }

    // Block elements
    createBlockquote(text: string) {
        return text.split("\n").map(line => `${MdBases.blockquoteBase}${line}`).join("\n");
    }

    createHorizontalRule() {
        return `\n${MdBases.horizontalRuleBase}\n`;
    }

    // Lists
    createUnorderedList(items: string[]) {
        return items.map(item => `${MdBases.listUnorderedBase}${item}`).join("\n");
    }

    createOrderedList(items: string[]) {
        return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
    }

    createCheckbox(text: string, checked: boolean = false) {
        return `${checked ? MdBases.checkboxCheckedBase : MdBases.checkboxUncheckedBase}${text}`;
    }

    // Tables
    createMdTableHeader(columns: string[]) {
        return `${columns.join(MdBases.tableColumnSeparator)}${MdBases.tableColumnSeparator}\n` +
               `${columns.map(() => MdBases.tableHeaderSeparator).join('')}|`;
    }

    createTableRow(cells: string[]) {
        return `${MdBases.tableColumnSeparator}${cells.join(MdBases.tableColumnSeparator)}${MdBases.tableColumnSeparator}`;
    }

    // Links & images
    createMdLink(text: string, link: string = "") {
        return `[${text}](${link})`;
    }

    createMdImage(alt: string = "My image", link: string = "") {
        return `![${alt}](${link})`;
    }

    createLinkReference(label: string, url: string) {
        return `[${label}]: ${url}`;
    }

    // Comments
    createComment(text: string) {
        return `${MdBases.commentBase}${text}${MdBases.commentEndBase}`;
    }

    // Utilities
    escapeSpecialChars(text: string) {
        return text.replace(/[\\`*_{}[\]()#+-.!]/g, '\\$&');
    }
}