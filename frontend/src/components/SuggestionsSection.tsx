interface SuggestionsSectionProps {
    visibleSuggestions: string[];
    allSuggestions: string[];
    handleMoreSuggestions: () => void;
}

export function SuggestionsSection({ visibleSuggestions, allSuggestions, handleMoreSuggestions }: SuggestionsSectionProps) {
    return (
        <>
            {visibleSuggestions.length < allSuggestions.length && (
                <div style={{display: "flex", justifyContent: "center", marginBottom: "20px"}}>
                    <button
                        onClick={handleMoreSuggestions}
                        style={{
                            padding: "5px 10px",
                            fontSize: "14px",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            border: "1px solid #ccc",
                            borderRadius: "3px",
                            cursor: "pointer",
                        }}
                    >
                        More suggestions
                    </button>
                </div>
            )}
        </>
    )
} 