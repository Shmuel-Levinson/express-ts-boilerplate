interface TextWidgetProps {
    text: string;
    onTextChange: (newText: string) => void;
}

export function TextWidget({ text, onTextChange }: TextWidgetProps) {
    return (
        <div style={{
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "default"
        }}>
            <div style={{ 
                height: "100%",
                cursor: "text"
            }}>
                <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        resize: "none",
                        outline: "none",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        cursor: "text",
                        backgroundColor: "transparent"
                    }}
                />
            </div>
        </div>
    );
} 