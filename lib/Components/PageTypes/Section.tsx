import React from "react";
import Link from 'next/link';
import { Section } from "../../Content/InterfaceContent";

export default function SectionPage({content}: {content: Section}) {
    return (
    <ul>
        {/* (Sub-)Section */}
        {content.section.map(v =>   
            <li>
                <Link href={v.path}>{v.name}</Link>
                <br />
                <SectionPage content={v} />
            </li>
        )}

        {/* Document */}
        {content.document.map(v =>  
            <li>
                <em>
                    {v.name}
                </em>
            </li>
        )}
        
        {/* Schematic */}
        {content.schematic.map(v => 
            <li>
                <strong>
                    {v.name}
                </strong>
            </li>
        )}
        
        {/* Image */}
        {content.image.map(v =>     
            <li>
                <code>
                    <Link href={v.path}>{v.name}</Link>
                </code>
            </li>
        )}
    </ul>
    );
}