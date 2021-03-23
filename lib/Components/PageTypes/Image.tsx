import { Image } from "../../Content/InterfaceContent";

export default function ImagePage({content}: {content: Image}) {
    return (
        <div>
            {content.name}
            <img src={`${content.root}${content.path}${content.ext}`} />
        </div>
    );
}