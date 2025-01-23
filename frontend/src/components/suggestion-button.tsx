import React, {MouseEventHandler} from "react";
import '../App.css'
export function SuggestionButton({suggestion, clickHandler}: { suggestion: string, clickHandler: Function }) {
    return (
        <button className='suggestion' style={{color:"#444",borderRadius:10,padding:10, outline: "none", cursor: "pointer"}}
                onClick={()=>clickHandler(null, suggestion)}>{suggestion}</button>
    )
}