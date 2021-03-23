import { blockRegex, inlineRegex, parseInline, sanitizeUrl, unescapeUrl, defaultRules} from 'simple-markdown';
import React from 'react';
import Link from "next/link";

let rules = defaultRules;

type Rule = {
    order: number,
    match: (source) => Array<any>,
    parse: (capture, parse, state) => {[x: string]: any}
    react: (node, output, state) => JSX.Element,
};

let bold: Rule = {
    order: rules.strong.order - 0.5,
    match: (source) =>   /^\*\*([\s\S]+?)\*\*(?!\*)/.exec(source),
    parse: (capture, parse, state) => ({
        content: parse(capture[1], state)
    }),
    react: (node, output, state) => <strong key={state.key}>{output(node.content)}</strong>,
};

let italic: Rule = {
    order: rules.strong.order - 0.5,
    match: (source) =>   /^\*([\s\S]+?)\*(?!\*)/.exec(source),
    parse: (capture, parse, state) => ({
        content: parse(capture[1], state)
    }),
    react: (node, output, state) => <em key={state.key}>{output(node.content)}</em>,
};

let underline: Rule = {
    order: rules.strong.order - 0.5,
    match: (source) =>   /^__([\s\S]+?)__(?!_)/.exec(source),
    parse: (capture, parse, state) => ({
        content: parse(capture[1], state)
    }),
    react: (node, output, state) => <u key={state.key}>{output(node.content)}</u>,
};

let strikethrough: Rule = {
    order: rules.strong.order - 0.5,
    match: (source) =>   /^~~([\s\S]+?)~~(?!~)/.exec(source),
    parse: (capture, parse, state) => ({
        content: parse(capture[1], state)
    }),
    react: (node, output, state) => <s key={state.key}>{output(node.content)}</s>,
};

let newline: Rule = {
    order: rules.newline.order - 0.5,
    match: (source) =>   /^(\.\s*)\n/.exec(source),
    parse: (capture, parse, state) => ({}),
    react: (node, output, state) => <br />,
};

let checkbox: Rule = {
    order: rules.list.order - 0.5,
    match: (source) =>   /^\[( |x)\] ([^\n]+)/.exec(source),
    parse: (capture, parse, state) => ({ 
        value: capture[1] == 'x', 
        label: parse(capture[2], state) 
    }),
    react: (node, output, state) => (
        <span key={state.key}>
            <input type={'checkbox'} checked={node.value} readOnly={true}/>
            <label>{output(node.label)}</label>
        </span>
    ),
};

let locallink: Rule = {
    order: rules.link.order + 0.5,
    match: (source) => /^[^!]\[([^\]\n]+)\]\((\.?(\/([^\/\?]|\.\.\/))+)\)/.exec(source),
    parse: (capture, parse, state) => ({ 
        url: capture[2], 
        content: parse(capture[1], state) 
    }),
    react: (node, output, state) => <Link href={node.url} key={state.key}>{output(node.content)}</Link>,
};


let idheading = {
    order: rules.heading.order - 0.5,
    match: blockRegex(/^ *(#{1,6})([^\n]+?)#* \{#([^\n}]+?)\} *(?:\n *)+\n/),
    parse: (capture, parse, state) => ({
        id: capture[3].trim(),
        level: capture[1].length,
        content: parseInline(parse, capture[2].trim(), state)
    }),
    react: (node, output, state) => {
        let levels = [
            (content, id) => <h1 key={state.key} id={id}>{output(content)}</h1>,
            (content, id) => <h2 key={state.key} id={id}>{output(content)}</h2>,
            (content, id) => <h3 key={state.key} id={id}>{output(content)}</h3>,
            (content, id) => <h4 key={state.key} id={id}>{output(content)}</h4>,
            (content, id) => <h5 key={state.key} id={id}>{output(content)}</h5>,
            (content, id) => <h6 key={state.key} id={id}>{output(content)}</h6>,
        ];

        return levels[node.level-1](node.content, node.id);
    },
};

let image = {
    order: rules.image.order - 0.5,
    match: inlineRegex(/^!\[([^=]+)(?:=(\d+)x(\d+)?)?\]\(\s*<?((?:\([^)]*\)|[^\s\\]|\\.)*?)>?(?:\s+["']([^\s"]+)['"]\s*)?\)/),
    parse: (capture, parse, state) => {
        return {
            alt: capture[1],
            height: parseInt(capture[2]),
            width: parseInt(capture[3]),
            target: unescapeUrl(capture[4]),
            title: capture[5],
        };
    },
        react: (node, output, state) => <img alt={node.alt} src={node.target} title={node.title} height={node.height} width={node.width}/>
};

export default {
    bold, italic, underline, strikethrough,
    //locallink, 
    idheading,
    newline,
    checkbox,
    image,
};