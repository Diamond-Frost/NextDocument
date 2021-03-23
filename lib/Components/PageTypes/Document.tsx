import { Document } from "../../Content/InterfaceContent";
import Markdown from "../Markdown";


export default function DocumentPage({content}: {content: Document}) {
    if (content === null) return (<div></div>)
    return (
        <Markdown content={content.content}>
            {content.name}
        </Markdown>
    );
}