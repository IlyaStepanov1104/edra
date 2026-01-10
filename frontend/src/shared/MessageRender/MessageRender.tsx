import {FC} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import styles from "./MessageRenderer.module.css";
import cn from "classnames";

interface IMessageProps {
    className?: string;
    content: string;
}

function normalizeLatex(md: string) {
    return md
        .replace(/\\\[/g, '$$')
        .replace(/\\\]/g, '$$')
        .replace(/\\\(/g, '$')
        .replace(/\\\)/g, '$');
}

export const MessageRender: FC<IMessageProps> = ({content, className}) => {
    return (
        <div
            className={cn(styles.message, className)}
        ><ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
        >{normalizeLatex(content)}</ReactMarkdown></div>);
}