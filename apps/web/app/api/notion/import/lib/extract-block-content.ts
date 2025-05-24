interface RichText {
  plain_text: string;
}

interface FileObject {
  url: string;
}

interface ExternalObject {
  url: string;
}

type MediaObject =
  | { type: "external"; external: ExternalObject }
  | { type: "file"; file: FileObject };

interface ParagraphBlock {
  type: "paragraph";
  paragraph: { rich_text: RichText[] };
}

interface Heading1Block {
  type: "heading_1";
  heading_1: { rich_text: RichText[] };
}

interface Heading2Block {
  type: "heading_2";
  heading_2: { rich_text: RichText[] };
}

interface Heading3Block {
  type: "heading_3";
  heading_3: { rich_text: RichText[] };
}

interface BulletedListItemBlock {
  type: "bulleted_list_item";
  bulleted_list_item: { rich_text: RichText[] };
}

interface NumberedListItemBlock {
  type: "numbered_list_item";
  numbered_list_item: { rich_text: RichText[] };
}

interface ToDoBlock {
  type: "to_do";
  to_do: { checked: boolean; rich_text: RichText[] };
}

interface ToggleBlock {
  type: "toggle";
  toggle: { rich_text: RichText[] };
}

interface CodeBlock {
  type: "code";
  code: { language?: string; rich_text: RichText[] };
}

interface QuoteBlock {
  type: "quote";
  quote: { rich_text: RichText[] };
}

interface CalloutBlock {
  type: "callout";
  callout: { rich_text: RichText[] };
}

interface DividerBlock {
  type: "divider";
}

interface TableBlock {
  type: "table";
}

interface TableRowBlock {
  type: "table_row";
  table_row: { cells: RichText[][] };
}

interface ImageBlock {
  type: "image";
  image: { caption?: RichText[] } & MediaObject;
}

interface VideoBlock {
  type: "video";
  video: { caption?: RichText[] } & MediaObject;
}

interface FileBlock {
  type: "file";
  file: { caption?: RichText[] } & MediaObject;
}

interface PdfBlock {
  type: "pdf";
  pdf: { caption?: RichText[] } & MediaObject;
}

interface BookmarkBlock {
  type: "bookmark";
  bookmark: { url: string };
}

interface LinkPreviewBlock {
  type: "link_preview";
  link_preview: { url: string };
}

interface EmbedBlock {
  type: "embed";
  embed: { url: string };
}

interface EquationBlock {
  type: "equation";
  equation: { expression: string };
}

interface SyncedBlock {
  type: "synced_block";
}

interface TemplateBlock {
  type: "template";
  template: { rich_text: RichText[] };
}

interface LinkToPageBlock {
  type: "link_to_page";
}

interface ChildPageBlock {
  type: "child_page";
  child_page: { title?: string };
}

interface ChildDatabaseBlock {
  type: "child_database";
  child_database: { title?: string };
}

interface ColumnListBlock {
  type: "column_list";
}

interface ColumnBlock {
  type: "column";
}

interface TableOfContentsBlock {
  type: "table_of_contents";
}

interface BreadcrumbBlock {
  type: "breadcrumb";
}

interface UnsupportedBlock {
  type: "unsupported";
}

type Block =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | BulletedListItemBlock
  | NumberedListItemBlock
  | ToDoBlock
  | ToggleBlock
  | CodeBlock
  | QuoteBlock
  | CalloutBlock
  | DividerBlock
  | TableBlock
  | TableRowBlock
  | ImageBlock
  | VideoBlock
  | FileBlock
  | PdfBlock
  | BookmarkBlock
  | LinkPreviewBlock
  | EmbedBlock
  | EquationBlock
  | SyncedBlock
  | TemplateBlock
  | LinkToPageBlock
  | ChildPageBlock
  | ChildDatabaseBlock
  | ColumnListBlock
  | ColumnBlock
  | TableOfContentsBlock
  | BreadcrumbBlock
  | UnsupportedBlock;

export const extractBlockContent = (
  block: Block | null | undefined,
): string => {
  if (!block || !block.type) return "";

  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text.map((text) => text.plain_text).join("");
    case "heading_1":
      return `# ${block.heading_1.rich_text.map((text) => text.plain_text).join("")}`;
    case "heading_2":
      return `## ${block.heading_2.rich_text.map((text) => text.plain_text).join("")}`;
    case "heading_3":
      return `### ${block.heading_3.rich_text.map((text) => text.plain_text).join("")}`;
    case "bulleted_list_item":
      return `• ${block.bulleted_list_item.rich_text.map((text) => text.plain_text).join("")}`;
    case "numbered_list_item":
      return `- ${block.numbered_list_item.rich_text.map((text) => text.plain_text).join("")}`;
    case "to_do":
      const checked = block.to_do.checked ? "[x]" : "[ ]";
      return `${checked} ${block.to_do.rich_text.map((text) => text.plain_text).join("")}`;
    case "toggle":
      return block.toggle.rich_text.map((text) => text.plain_text).join("");
    case "code":
      return `\`\`\`${block.code.language || ""}\n${block.code.rich_text.map((text) => text.plain_text).join("")}\n\`\`\``;
    case "quote":
      return `> ${block.quote.rich_text.map((text) => text.plain_text).join("")}`;
    case "callout":
      return `> ${block.callout.rich_text.map((text) => text.plain_text).join("")}`;
    case "divider":
      return "---";
    case "table":
      return "[Table content]";
    case "table_row":
      return block.table_row.cells
        .map((cell) => cell.map((text) => text.plain_text).join(""))
        .join(" | ");
    case "image":
      const imgCaption =
        block.image.caption?.map((text) => text.plain_text).join("") || "";
      const imgUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      return `[Image${imgCaption ? `: ${imgCaption}` : ""}](${imgUrl})`;
    case "video":
      const vidCaption =
        block.video.caption?.map((text) => text.plain_text).join("") || "";
      const vidUrl =
        block.video.type === "external"
          ? block.video.external.url
          : block.video.file.url;
      return `[Video${vidCaption ? `: ${vidCaption}` : ""}](${vidUrl})`;
    case "file":
      const fileCaption =
        block.file.caption?.map((text) => text.plain_text).join("") || "";
      const fileUrl =
        block.file.type === "external"
          ? block.file.external.url
          : block.file.file.url;
      return `[File${fileCaption ? `: ${fileCaption}` : ""}](${fileUrl})`;
    case "pdf":
      const pdfCaption =
        block.pdf.caption?.map((text) => text.plain_text).join("") || "";
      const pdfUrl =
        block.pdf.type === "external"
          ? block.pdf.external.url
          : block.pdf.file.url;
      return `[PDF${pdfCaption ? `: ${pdfCaption}` : ""}](${pdfUrl})`;
    case "bookmark":
      return `[Bookmark: ${block.bookmark.url}](${block.bookmark.url})`;
    case "link_preview":
      return `[Link Preview: ${block.link_preview.url}](${block.link_preview.url})`;
    case "embed":
      return `[Embedded content: ${block.embed.url}](${block.embed.url})`;
    case "equation":
      return `Equation: ${block.equation.expression}`;
    case "synced_block":
      return "[Synced block content]";
    case "template":
      return block.template.rich_text.map((text) => text.plain_text).join("");
    case "link_to_page":
      return "[Link to another page]";
    case "child_page":
      return `[Child page: ${block.child_page.title || "Untitled"}]`;
    case "child_database":
      return `[Child database: ${block.child_database.title || "Untitled"}]`;
    case "column_list":
      return "[Column list]";
    case "column":
      return "[Column]";
    case "table_of_contents":
      return "[Table of contents]";
    case "breadcrumb":
      return "[Breadcrumb]";
    case "unsupported":
      return "[Unsupported content]";
    default:
      // TypeScript will error here if there's an unhandled case
      const _exhaustiveCheck: never = block;
      return `[${(block as { type: string }).type} block]`;
  }
};
