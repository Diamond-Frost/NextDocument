This is a [Next.js](https://nextjs.org/) documentation server.

## Starting the server

Run the development server:

```bash
npm run dev
# or
yarn dev
```

or the production server:

```bash
npm run start
# or 
yarn start
```

## Editing the articles

Everything that's supposed to be displayed is in /public/articles/*

Which has 5 different categories of content: 
- Section (directory)
- Document (default: `.md`)
- Schematic (default: `.xml`)
- Image (default: `.png`)
- Picture (default: `.jpg`)

These extensions can be changed in `/lib/globals.ts`

Schematic content (images, pictures, models, svg, etc) that shouldn't be displayed can be put in a folder in ending in `[sc]` (can be adjusted in `globals.ts`)

### Changing Content Properties
 
Properties of article types are defined in `/lib/Content/`.

`InterfaceContent.ts` holds the TS interfaces defining the properties the different content types have.
`GetContent.tsx` holds the functions which *get* those properties, each with a function following the schema `get[content-type]`.

### Changing Article Displays

Each content type has its own page, all of which are defined in `/lib/Components/PageTypes/`, these are TSX files, exporting their page as a default. This is where to edit the display.

Header and footer are held in `/lib/Compontents/PageHeader.tsx` and `.../PageFooter.tsx` respectively. 

A page always has a header and footer, this basic layout can only be changed in `/pages/[[...page]].tsx`.