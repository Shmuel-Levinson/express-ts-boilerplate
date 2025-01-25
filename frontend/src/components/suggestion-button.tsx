
import '../App.css'
export function SuggestionButton({suggestion, clickHandler}: { suggestion: string, clickHandler: Function }) {
    return (
        <button className='suggestion' style={{fontSize: "small",color:"#444",borderRadius:10,padding:4, outline: "none", cursor: "pointer"}}
                onClick={()=>clickHandler(null, suggestion)}>{suggestion}</button>
    )
}