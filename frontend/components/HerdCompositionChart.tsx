
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ComposicaoRebanhoData } from '../types';
import ChartCard from './ChartCard';

const data: ComposicaoRebanhoData[] = [];

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac'];

const HerdCompositionChart: React.FC = () => {
    if (!data.length) {
        return (
            <ChartCard title="Composição do Rebanho">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum dado de rebanho disponível.</p>
            </ChartCard>
        );
    }

    return (
        <ChartCard title="Composição do Rebanho">
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                         contentStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#374151',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default HerdCompositionChart;
