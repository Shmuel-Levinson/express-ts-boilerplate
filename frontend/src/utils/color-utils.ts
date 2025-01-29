export const generateColor = (index: number) => {
    const hue = (index * 137.5) % 360; // Use golden angle approximation
    return `hsl(${hue}, 80%, 70%)`; 
};

export const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`; // High lightness for pastel effect
}; 