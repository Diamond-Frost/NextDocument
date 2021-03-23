import { Schematic } from "../../Content/InterfaceContent";

export default function SchematicPage({content}: {content: Schematic}) {
    if (content === null) return (<div></div>)
    return (
        <div>
            {content.name}
            {content.content}
        </div>
    );
}