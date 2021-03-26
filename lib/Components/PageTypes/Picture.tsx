import { Picture } from "../../Content/InterfaceContent";

export default function PicturePage({content}: {content: Picture}) {
    return (
        <div>
            {content.name}
            <img src={`${content.root}${content.path}${content.ext}`} />
        </div>
    );
}