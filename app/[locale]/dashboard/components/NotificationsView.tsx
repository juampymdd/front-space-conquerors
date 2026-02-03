import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { AlertTriangle, CheckCircle, Info, Radio } from "lucide-react";
import { 
  DialogRoot, 
  DialogBackdrop, 
  DialogPositioner, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogCloseTrigger,
  Portal 
} from "@/components/ui/Dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "alert" | "comm";
  sender: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

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
  const t = useTranslations("dashboard.notifications");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const notifications: Notification[] = [
    {
      id: "n1",
      type: "alert",
      sender: t("n1.sender"),
      subject: t("n1.subject"),
      message: t("n1.message"),
      date: "2m",
      read: false,
    },
    {
      id: "n2",
      type: "comm",
      sender: t("n2.sender"),
      subject: t("n2.subject"),
      message: t("n2.message"),
      date: "15m",
      read: false,
    },
    {
      id: "n3",
      type: "success",
      sender: t("n3.sender"),
      subject: t("n3.subject"),
      message: t("n3.message"),
      date: "1h",
      read: true,
    },
    {
      id: "n4",
      type: "info",
      sender: t("n4.sender"),
      subject: t("n4.subject"),
      message: t("n4.message"),
      date: "3h",
      read: true,
    },
    {
      id: "n5",
      type: "warning",
      sender: t("n5.sender"),
      subject: t("n5.subject"),
      message: t("n5.message"),
      date: "5h",
      read: true,
    },
    {
        id: "n6",
        type: "info",
        sender: t("n6.sender"),
        subject: t("n6.subject"),
        message: t("n6.message"),
        date: "1d",
        read: true,
      },
  ];

  const selectedNotification = notifications.find(n => n.id === selectedId) || null;

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
                {notifications.map((notif) => {
                    const Icon = TypeIcon[notif.type];
                    const colorClass = TypeColor[notif.type];
                    
                    return (
                        <div 
                            key={notif.id} 
                            onClick={() => setSelectedId(notif.id)}
                            className={`
                                group relative p-4 border transition-all duration-300 cursor-pointer
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
                                    <p className="text-xs text-primary/70 leading-relaxed font-mono line-clamp-2">
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

      <DialogRoot 
        open={!!selectedNotification} 
        onOpenChange={(details) => !details.open && setSelectedId(null)}
      >
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent className="max-w-xl border-primary/30">
              {selectedNotification && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-primary/20 pb-4">
                    <div className={`size-12 shrink-0 flex items-center justify-center border ${TypeColor[selectedNotification.type]} shadow-glow`}>
                         {React.createElement(TypeIcon[selectedNotification.type], { size: 24 })}
                    </div>
                    <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-primary/60">
                                {selectedNotification.sender}
                            </span>
                            <span className="text-xs font-mono text-primary/40 bg-primary/10 px-2 py-0.5 rounded">
                                {selectedNotification.date}
                            </span>
                         </div>
                         <DialogTitle className="text-xl font-bold font-mono tracking-tight mt-1 text-white">
                           {selectedNotification.subject}
                         </DialogTitle>
                    </div>
                  </div>
                  
                  <ScrollArea className="max-h-[60vh] pr-4">
                    <DialogDescription className="text-sm text-primary/80 leading-relaxed font-mono whitespace-pre-wrap">
                      {selectedNotification.message}
                    </DialogDescription>
                  </ScrollArea>

                  <div className="flex justify-end pt-4 border-t border-primary/10">
                      <Button 
                        onClick={() => setSelectedId(null)}
                        size="sm"
                        className="mb-0"
                      >
                        {t('markAsRead')}
                      </Button>
                  </div>
                </div>
              )}
              <DialogCloseTrigger />
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </div>
  );
}
