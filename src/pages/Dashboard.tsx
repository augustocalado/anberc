"use client";

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MetricsCards from '@/components/dashboard/MetricsCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const recentActions: any[] = [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Visão geral do seu negócio</p>
          </div>

          <MetricsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            
            <UpcomingAppointments />
          </div>

          <div className="mt-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-tight font-bold">Atividade Recente</h3>
                <div className="space-y-4">
                  {recentActions.length > 0 ? (
                    recentActions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{item.action}</p>
                          <p className="text-xs text-gray-600">{item.client} • {item.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm font-bold uppercase tracking-widest">Sem atividades recentes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;