import PageHeader from "../lib/Components/PageHeader";
import PageFooter from "../lib/Components/PageFooter";

import DocumentPage from "../lib/Components/PageTypes/Document";
import ImagePage from "../lib/Components/PageTypes/Image";
import PicturePage from "../lib/Components/PageTypes/Picture";
import SectionPage from "../lib/Components/PageTypes/Section";
import SchematicPage from "../lib/Components/PageTypes/Schematic";

import { Image, Document, Section, Schematic, Picture } from "../lib/Content/InterfaceContent";
import { getPaths, getSection } from "../lib/Content/GetContent";
import { document_ext, global_root, image_ext, picture_ext, schematic_ext } from "../lib/globals";
import { resolve, extname } from "path";

type PageProps = {
    type: 'image' | 'document' | 'section' | 'schematic' | 'picture',
    content: Image | Document | Section | Schematic | Picture, 
    path: string
}

export default function Page({type, content, path}: PageProps) {
    let pages = {
        document:  (<DocumentPage  content={(content as Document)} />),
        image:     (<ImagePage     content={(content as Image)} />),
        picture:   (<PicturePage   content={(content as Picture)} />),
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

            let pmatch = (rootSection as Section).picture.filter(i => i.name === v);
            if (pmatch.length != 0) {
                rootSection = pmatch[0];
                contentType = "picture";
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
    let paths_ext = [
        '/', 
        ...getPaths('', global_root)
            .map(v => v.replace(resolve(global_root), ''))
    ];
    let pure = paths_ext.map(v => v.replace(extname(v), ''));
    
    paths_ext = paths_ext
        .map(v => v.replace(document_ext, '.doc'))
        .map(v => v.replace(schematic_ext, '.sc'))
        .map(v => v.replace(picture_ext, '.pic'))
        .map(v => v.replace(image_ext, '.img'));

    let paths = [...pure, ...paths_ext].map(v => ({params: {page: v.split(/\/|\\/).slice(1)}}));
    console.log(paths.map(v => v.params.page));
    return {
        paths,
        fallback: false
    }
}