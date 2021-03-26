export interface Section extends Base {
    parent: string | null;
    document: Document[];
    schematic: Schematic[];
    image: Image[];
    picture: Picture[];
    section: Section[];
}

export interface Document extends Base {
    content: string;
};

export interface Schematic extends Base {
    content: string;
};

export interface Image extends Base {
    ext: string;
};

export interface Picture extends Base {
    ext: string;
};

export interface Base {
    path: string;
    name: string;
    root: string;
    parent: string;
};