import SimpleMarkdown from "simple-markdown";
import mdrules from '../md-rules';
import Link from "next/link";
import React from 'react';

let rules = {
    ...SimpleMarkdown.defaultRules,
    ...mdrules
}

let rawBuiltParser = SimpleMarkdown.parserFor(rules);
let parse = function(source) {
    var blockSource = source + "\n\n";
    return rawBuiltParser(blockSource, {inline: false});
};
let reactOut = SimpleMarkdown.outputFor(rules, 'react')

export default function Markdown({children, content, ...rest}) {
    let out = reactOut(parse(content.split('\n').map(v => v+'\n').join('\n')));
    
    return (
        <div {...rest}>
            {out}
            {children}
        </div>
    );
}