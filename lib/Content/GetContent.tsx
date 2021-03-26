import { readdirSync, statSync, readFileSync } from "fs";
import { basename } from "path";
import { extname, relative, resolve } from "path";
import { document_ext, image_ext, picture_ext, schematic_ext, sch_folder_ext } from "../globals";
import { Document, Image, Schematic, Section, Picture, Base } from "./InterfaceContent";

let sectionPredicate = (v) => statSync(v).isDirectory() && !v.endsWith(sch_folder_ext);

export function getSection(path: string, parent: Section | string): Section {
    let local_root = typeof parent === 'string' ? parent : parent.root;
    let absroot = resolve('.');
    let dir = readdirSync(`${local_root}/${path}`).map(v => resolve(`${local_root}/${path}/${v}`).replace(absroot, '.').replace(/\\+/g, '/'));

    let self: Section = {
        path: path,
        name: basename(path),
        root: local_root,
        parent: typeof parent === 'string' ? null : parent.path,

        document: [],
        schematic: [],
        image: [],
        picture: [],
        section: [],
    };

    self.document  = dir.filter(v => extname(v) ===  document_ext).map(v => getDocument(v, self));
    self.schematic = dir.filter(v => extname(v) === schematic_ext).map(v => getSchematic(v, self));
    self.image     = dir.filter(v => extname(v) ===     image_ext).map(v => getImage(v, self));
    self.picture   = dir.filter(v => extname(v) ===   picture_ext).map(v => getPicture(v, self));
    self.section   = dir.filter(v => sectionPredicate(v)).map(v => getSection(v.replace(local_root, ''), self));
    
    return self;
};

export function getDocument(path: string, parent: Section): Document {
    return {
        ...getBase(path, parent, document_ext),
        content: readFileSync(path, {encoding: 'utf-8'}),
    };
};

export function getSchematic(path: string, parent: Section): Schematic {
    return {
        ...getBase(path, parent, schematic_ext),
        content: readFileSync(path, {encoding: 'utf-8'}),
    };
};

export function getImage(path: string, parent: Section): Image {
    return {
        ...getBase(path, parent, image_ext),
        ext: image_ext,
    };
};

export function getPicture(path: string, parent: Section): Picture {
    return {
        ...getBase(path, parent, picture_ext),
        ext: picture_ext,
    };
};


function getBase(path: string, parent: Section, ext: string): Base {
    return {
        path: path.replace(parent.root, '').replace(ext, ''),
        name: basename(path).replace(ext, ''),
        root: parent.root.replace('./public', ''),
        parent: parent.path,
    };
};


export function getPaths(path: string, root: string) {
    let abspath = resolve(root, path);
    let dir = readdirSync(abspath).map(v => resolve(abspath, v));
    
    let subdirs = dir.filter(v => statSync(v).isDirectory())
    subdirs.forEach(v => dir.push(...getPaths(basename(v), abspath)));
    return dir;
};