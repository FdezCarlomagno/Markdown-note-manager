export const guideContent = `# Guide

## Basic Markdown Syntax

### Headers

Use \`#\` symbols to create headers. The number of \`#\` symbols determines the header level.

# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

### Emphasis

- *Italic*: Surround text with single asterisks or underscores
- **Bold**: Use double asterisks or underscores
- ***Bold and Italic***: Combine both with triple asterisks or underscores

### Lists

#### Unordered Lists

Use \`-\`, \`*\`, or \`+\` for unordered list items:

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

#### Ordered Lists

Use numbers followed by periods for ordered lists:

1. First item
2. Second item
3. Third item

### Links

Create links using square brackets for the text and parentheses for the URL:

[Visit our website](https://fdez-carlomagno.vercel.app)

### Images

Insert images using an exclamation mark, followed by alt text in square brackets, and the image URL in parentheses:

![Alt text for the image](https://example.com/image.jpg)

## Intermediate Markdown

### Code

#### Inline Code

Use backticks (\`) to create inline code: \`console.log('Hello, World!')\`

#### Code Blocks

For multi-line code blocks, use triple backticks:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('User');
\`\`\`

### Blockquotes

Use \`>\` to create blockquotes:

> This is a blockquote.
> It can span multiple lines.

### Horizontal Rules

Create horizontal rules using three or more hyphens, asterisks, or underscores:

---

## Advanced Markdown Features

### Tables

Create tables using pipes and hyphens:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |

### Task Lists

Create task lists using \`- [ ]\` for unchecked items and \`- [x]\` for checked items:

- [x] Completed task
- [ ] Incomplete task

### Strikethrough

Use double tildes to ~~strikethrough~~ text.

### Footnotes

Add footnotes using \`[^1]\` in the text and \`[^1]: Footnote content\` at the bottom of the document[^1].

[^1]: This is a footnote.

### Emoji

Some markdown parsers support emoji shortcodes :smile: :heart: :rocket:

## App-Specific Features

### Tags

Use hashtags to categorize your notes: #work #personal #ideas

### @Mentions

Mention other users or link to other notes using the @ symbol: @john.doe @project-ideas

### Custom Shortcuts

Our app supports custom shortcuts for frequently used markdown elements:

- \`/todo\` - Creates a new todo list
- \`/code\` - Inserts a code block
- \`/table\` - Generates a table template

### Note Linking

Link to other notes in your collection using double square brackets: [[Meeting Notes]]

### Embedded Content

Embed videos, tweets, or other content using special syntax:

!video[YouTube Video Title](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

## Tips and Tricks

1. Use keyboard shortcuts for faster note-taking
2. Organize your notes with a consistent tagging system
3. Regularly review and clean up your notes
4. Experiment with different markdown elements to find what works best for you
5. Use our app's search function to quickly find notes by content, tags, or mentions

Remember, practice makes perfect! The more you use markdown, the more natural it will become. Happy note-taking!`