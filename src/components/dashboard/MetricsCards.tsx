import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MetricsCards = () => {
  const metrics = [
    { label: 'Orcamentos', value: 'R$ 0,00', change: '0%' },
    { label: 'Agendamentos', value: '0', change: '0%' },
    { label: 'Clientes', value: '0', change: '0%' },
    { label: 'Faturamento', value: 'R$ 0,00', change: '0%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {metric.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
