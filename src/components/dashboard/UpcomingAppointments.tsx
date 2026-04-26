import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            profiles:technician_id (name)
          `)
          .gte('scheduled_date', new Date().toISOString())
          .order('scheduled_date', { ascending: true })
          .limit(5);

        if (error) throw error;
        setAppointments(data || []);
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Em andamento': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
          <CalendarIcon className="text-cyan-600 w-5 h-5" />
          Próximos Agendamentos
        </CardTitle>
        <Link to="/agendamento">
          <Button variant="ghost" size="sm" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 p-0 h-auto">
            Ver Todos <ChevronRight size={14} />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            appointments.map((apt) => (
              <div key={apt.id} className="flex items-start justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                <div className="flex gap-3">
                  <div className="bg-cyan-50 text-cyan-600 p-2.5 rounded-lg group-hover:bg-cyan-600 group-hover:text-white transition-all h-fit">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase truncate max-w-[150px] md:max-w-none">
                      {apt.client_name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
                        <Clock size={10} />
                        {new Date(apt.scheduled_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
                        <User size={10} />
                        {apt.profiles?.name || 'TBC'}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={cn("text-[8px] px-2 py-0.5 rounded-full border shadow-none font-black uppercase tracking-tighter", getStatusColor(apt.status))}>
                  {apt.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-xs font-bold uppercase tracking-widest">Nenhum agendamento futuro</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
