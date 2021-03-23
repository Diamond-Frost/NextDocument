export interface Section {
    path: string
    root: string
    parent: string | null
    name: string
    document: Document[]
    schematic: Schematic[]
    image: Image[]
    section: Section[]
}

export interface Document {
    path: string
    name: string
    content: string
}

export interface Schematic {
    path: string
    name: string
    content: string
}

export interface Image {
    path: string
    ext: string
    name: string
    root: string
}