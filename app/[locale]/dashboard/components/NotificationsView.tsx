import React from "react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Mail, AlertTriangle, CheckCircle, Info, Radio } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "alert" | "comm";
  sender: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "alert",
    sender: "Sistema de Defensa",
    subject: "INCURSIÓN DETECTADA",
    message: "Sensores de largo alcance han detectado una flota hostil entrando en el sector Sigma-9. Se recomienda elevar nivel de alerta.",
    date: "Hace 2m",
    read: false,
  },
  {
    id: "n2",
    type: "comm",
    sender: "Embajador Kael'Thas",
    subject: "Propuesta de Tratado Comercial",
    message: "La Federación Galáctica extiende una oferta de libre comercio de Deuterio. Solicitamos audiencia inmediata.",
    date: "Hace 15m",
    read: false,
  },
  {
    id: "n3",
    type: "success",
    sender: "Ingeniería",
    subject: "Investigación Completada: Motores de Impulso V",
    message: "Las mejoras en los propulsores sub-lumínicos han sido instaladas. La velocidad de la flota ha aumentado un 15%.",
    date: "Hace 1h",
    read: true,
  },
  {
    id: "n4",
    type: "info",
    sender: "Logística",
    subject: "Llegada de Suministros",
    message: "El convoy de carga N-442 ha arribado a la colonia minera. Descarga de 50,000 unidades de Metal en proceso.",
    date: "Hace 3h",
    read: true,
  },
  {
    id: "n5",
    type: "warning",
    sender: "Sensores Planetarios",
    subject: "Actividad Sísmica",
    message: "Temblores menores detectados en el sector volcánico. La producción de energía podría fluctuar.",
    date: "Hace 5h",
    read: true,
  },
  {
      id: "n6",
      type: "info",
      sender: "Alto Mando",
      subject: "Bienvenida, Comandante",
      message: "Su asignación al sector fronterizo ha sido confirmada. Esperamos grandes cosas de su administración.",
      date: "Hace 1d",
      read: true,
    },
];

const TypeIcon = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  alert: AlertTriangle,
  comm: Radio,
};

const TypeColor = {
  info: "text-blue-400 border-blue-400/20 bg-blue-400/5",
  success: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  warning: "text-amber-400 border-amber-400/20 bg-amber-400/5",
  alert: "text-red-500 border-red-500/20 bg-red-500/5",
  comm: "text-purple-400 border-purple-400/20 bg-purple-400/5",
};

export function NotificationsView() {
  return (
    <div className="h-full flex flex-col px-8 pt-8 pb-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-2 bg-primary shadow-glow animate-pulse" />
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-primary">
          Canales de Comunicación
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="flex items-center gap-3 text-xs font-mono text-primary/40 uppercase tracking-[0.2em]">
          <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 border border-primary/20">
            2
          </span>
          NUEVOS MENSAJES
        </div>
      </div>

      <div className="flex-1 min-h-0 relative -mr-6 pr-6">
        <ScrollArea className="h-full pr-4 pb-4">
            <div className="flex flex-col gap-3">
                {MOCK_NOTIFICATIONS.map((notif) => {
                    const Icon = TypeIcon[notif.type];
                    const colorClass = TypeColor[notif.type];
                    
                    return (
                        <div 
                            key={notif.id} 
                            className={`
                                group relative p-4 border transition-all duration-300
                                ${notif.read ? 'border-primary/10 bg-primary/[0.02] opacity-70 hover:opacity-100' : 'border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:border-primary/50'}
                            `}
                        >
                            {/* Read indicator corner */}
                            {!notif.read && (
                                <div className="absolute top-0 right-0 border-t-[10px] border-r-[10px] border-t-transparent border-r-primary pointer-events-none" />
                            )}

                            <div className="flex gap-4">
                                <div className={`size-10 shrink-0 flex items-center justify-center border ${colorClass} shadow-sm`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${notif.read ? 'text-primary/60' : 'text-primary'}`}>
                                            {notif.sender}
                                        </span>
                                        <span className="text-[10px] font-mono text-primary/40">
                                            {notif.date}
                                        </span>
                                    </div>
                                    <h4 className={`text-sm font-bold font-mono tracking-tight mb-2 ${notif.read ? 'text-primary/80' : 'text-white text-shadow-sm'}`}>
                                        {notif.subject}
                                    </h4>
                                    <p className="text-xs text-primary/70 leading-relaxed font-mono">
                                        {notif.message}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Decorative framing lines */}
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/10" />
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
