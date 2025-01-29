import React, { useEffect, useRef, useState } from 'react';
import { generateColor } from '../utils/color-utils';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
    category: string;
    paymentMethod: string;
}

interface BarGraphProps {
    transactions: Transaction[];
    groupBy: 'category' | 'paymentMethod' | 'type';
}

function BarGraph({ transactions, groupBy }: BarGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSorted, setIsSorted] = useState(false);

    useEffect(() => {
        drawBarGraph();
    }, [transactions, groupBy, isSorted]);

    const drawBarGraph = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate totals by grouping
        const groupTotals = transactions.reduce((acc, transaction) => {
            const key = transaction[groupBy];
            acc[key] = (acc[key] || 0) + Math.abs(transaction.amount);
            return acc;
        }, {} as Record<string, number>);

        // Sort entries if needed
        let entries = Object.entries(groupTotals);
        if (isSorted) {
            entries.sort((a, b) => b[1] - a[1]); // Sort by amount descending
        }

        // Setup canvas
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60; // Space for labels
        const barPadding = 10;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const maxValue = Math.max(...Object.values(groupTotals));
        const barWidth = (width - padding * 2 - (entries.length - 1) * barPadding) / entries.length;

        // Draw bars
        entries.forEach(([group, amount], index) => {
            const barHeight = (amount / maxValue) * (height - padding * 2);
            const x = padding + index * (barWidth + barPadding);
            const y = height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = generateColor(index);
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value on top of bar
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `$${amount.toFixed(0)}`,
                x + barWidth / 2,
                y - 5
            );

            // Draw label below bar
            ctx.save();
            ctx.translate(x + barWidth / 2, height - padding + 10);
            ctx.rotate(Math.PI / 4); // Rotate 45 degrees
            ctx.fillText(group, 0, 0);
            ctx.restore();
        });
    };

    return (
        <div>
            <button
                onClick={() => setIsSorted(!isSorted)}
                style={{
                    padding: '5px 10px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                }}
            >
                {isSorted ? "Unsort" : "Sort by Amount"}
            </button>
            <canvas 
                ref={canvasRef} 
                width={400} 
                height={400}
                style={{ maxWidth: '100%', height: 'auto' }}
            />
        </div>
    );
}

export default BarGraph; 