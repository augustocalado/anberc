import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RevenueChart = () => {
    return (
        <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">Gráfico de Receita (Placeholder)</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default RevenueChart;
