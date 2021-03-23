import PageHeader from "../lib/Components/PageHeader";
import PageFooter from "../lib/Components/PageFooter";

import DocumentPage from "../lib/Components/PageTypes/Document";
import ImagePage from "../lib/Components/PageTypes/Image";
import SectionPage from "../lib/Components/PageTypes/Section";
import SchematicPage from "../lib/Components/PageTypes/Schematic";

import {Image, Document, Section, Schematic} from "../lib/Content/InterfaceContent";
import { getPaths, getSection } from "../lib/Content/GetContent";
import { global_root } from "../lib/globals";
import { resolve, extname } from "path";

type PageProps = {
    type: 'image' | 'document' | 'section' | 'schematic',
    content: Image | Document | Section | Schematic, 
    path: string
}

export default function Page({type, content, path}: PageProps) {
    let pages = {
        document:  (<DocumentPage  content={(content as Document)} />),
        image:     (<ImagePage     content={(content as Image)} />),
        schematic: (<SchematicPage content={(content as Schematic)} />),
        section:   (<SectionPage   content={(content as Section)} />),
    }
    return (
        <div>
            <PageHeader path={path} />
            {pages[type]}
            <PageFooter />
        </div>
    );
}

export async function getStaticProps({params}: {params: {page: string[]}}) {
    let rootSection: PageProps['content'] = getSection('.', global_root);
    let contentType: PageProps['type'] = 'section';
    let urlSeg = params.page || [];

    console.log(urlSeg);
    urlSeg.forEach(v => {
        let match = (rootSection as Section).section.filter(s => s.name === v);
        if (match.length != 0) rootSection = match[0];
        else {
            let dmatch = (rootSection as Section).document.filter(d => d.name === v);
            if (dmatch.length != 0) {
                rootSection = dmatch[0];
                contentType = "document";
                return;
            }
            
            let smatch = (rootSection as Section).schematic.filter(s => s.name === v);
            if (smatch.length != 0) {
                rootSection = smatch[0];
                contentType = "schematic";
                return;
            }
            
            let imatch = (rootSection as Section).image.filter(i => i.name === v);
            if (imatch.length != 0) {
                rootSection = imatch[0];
                contentType = "image";
                return;
            }
        }
    });

    return {
        props: {
            content: rootSection,
            type: contentType,
            path: global_root
        }
    }
}

export async function getStaticPaths() {
    let paths = [
        '/', 
        ...getPaths('', global_root)
            .map(v => v.replace(resolve(global_root), ''))
    ]
        .map(v => v.replace(extname(v), ''))
        .map(v => ({params: {page: v.split(/\/|\\/).slice(1)}}));
    console.log(paths.map(v => v.params.page));
    return {
        paths,
        fallback: false
    }
}