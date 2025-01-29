export function spinner() {
    return (
        <div
            style={{
                width: "20px",
                height: "20px",
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: "10px",
            }}
        ></div>
    )
}

export function Loader({ isLoading }: { isLoading: boolean }) {
    return (
        <div style={{
            display: isLoading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px"
        }}>
            {spinner()}
            <span>Working...</span>
        </div>
    );
} 