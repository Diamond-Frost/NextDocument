import { Schematic } from "../../Content/InterfaceContent";

export default function SchematicPage({content}: {content: Schematic}) {
    if (content === null) return (<div></div>)
    let xml = new DOMParser().parseFromString(content.content, 'text/xml');
    let schematicProps = xml.getElementsByTagName('schematic').item(0);

    return (
        <div>
            {content.name}
            {content.content}
        </div>
    );
}


function convertSection(section: Element) {
    for (let i = 0; i < section.children.length; i++) {
        const child = section.children.item(i);
        if (child.tagName === "section") {
            convertSection(child)
        }
        if (child.tagName === "property") {
            // 
        }
    }
}