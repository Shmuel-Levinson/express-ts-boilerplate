import React, { useEffect, useRef } from 'react';
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

interface PieChartProps {
    transactions: Transaction[];
    groupBy: 'category' | 'paymentMethod' | 'type';
}

function PieChart({ transactions, groupBy }: PieChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawPieChart();
    }, [transactions, groupBy]);

    const drawPieChart = () => {
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

        // Setup canvas
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate total for percentages
        const total = Object.values(groupTotals).reduce((sum, amount) => sum + amount, 0);

        // Draw pie slices
        let startAngle = 0;
        Object.entries(groupTotals).forEach(([group, amount], index) => {
            const sliceAngle = (amount / total) * 2 * Math.PI;
            const color = generateColor(index);

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();

            // Draw label
            const labelAngle = startAngle + sliceAngle / 2;
            const percentage = ((amount / total) * 100).toFixed(1);
            const labelRadius = radius * 1.2;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;

            ctx.font = '12px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText(`${group} (${percentage}%)`, labelX, labelY);

            startAngle += sliceAngle;
        });
    };

    return (
        <canvas 
            ref={canvasRef} 
            width={400} 
            height={400}
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
}

export default PieChart; 