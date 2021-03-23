import { readdirSync, statSync, readFileSync } from "fs";
import { basename } from "path";
import { extname, relative, resolve } from "path";
import { Document, Image, Schematic, Section } from "./InterfaceContent";

export function getSection(path: string, parent: Section | string): Section {
    let local_root = typeof parent === 'string' ? parent : parent.root;
    let absroot = resolve('.');
    let dir = readdirSync(`${local_root}/${path}`).map(v => resolve(`${local_root}/${path}/${v}`).replace(absroot, '.').replace(/\\+/g, '/'));

    let self: Section = {
        path: path,
        root: local_root,
        parent: typeof parent === 'string' ? null : parent.path,
        name: basename(path),
        document: dir.filter(v => extname(v) == ".md").map(v => getDocument(v, local_root)),
        schematic: dir.filter(v => extname(v) == ".xml").map(v => getSchematic(v, local_root)),
        image: dir.filter(v => extname(v).match(/(\.)png|jpe?g|gif/)).map(v => getImage(v, local_root)),
        section: [],
    }

    self.section = dir.filter(v => statSync(v).isDirectory() && !v.endsWith('[sc]')).map(v => getSection(v.replace(local_root, ''), self));
    
    return self;
}

export function getDocument(path, root): Document {
    return {
        path: path.replace(root, '').replace(extname(path), ''),
        name: basename(path).replace('.md', ''),
        content: readFileSync(path, {encoding: 'utf-8'}),
    };
}

export function getImage(path, root): Image {
    return {
        name: basename(path).replace(extname(path), ''),
        path: path.replace(root, '').replace(extname(path), ''),
        ext: extname(path),
        root: root.replace('./public', ''),
    };
}

export function getSchematic(path, root): Schematic {
    return {
        path: path.replace(root, '').replace(extname(path), ''),
        name: basename(path).replace('.xml', ''),
        content: readFileSync(path, {encoding: 'utf-8'}),
    };
}

export function getPaths(path: string, root: string) {
    let abspath = resolve(root, path);
    let dir = readdirSync(abspath).map(v => resolve(abspath, v));
    
    let subdirs = dir.filter(v => statSync(v).isDirectory())
    subdirs.forEach(v => dir.push(...getPaths(basename(v), abspath)));
    return dir;
};