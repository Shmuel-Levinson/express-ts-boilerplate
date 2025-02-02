import React, { useRef, useEffect } from 'react';

interface PieChartProps {
    data: any[];
    color: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !data) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match container size
        canvas.width = canvas.parentElement?.clientWidth || 200;
        canvas.height = canvas.parentElement?.clientHeight || 150;

        // Calculate radius based on the smaller dimension
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8; // 80% of the smaller dimension

        // ... rest of the pie chart drawing logic ...
    }, [data, color]);

    return (
        <div className="chart-container">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default PieChart; 