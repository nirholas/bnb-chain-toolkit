/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Small components, big impact 🎯
 */

import { useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/utils/helpers';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
};

/**
 * Hook for inline notifications in example/demo components.
 * Returns a `notify` function and a `NotificationArea` component to render.
 */
export function useInlineNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = nextId.current++;
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const NotificationArea = useCallback(() => {
    if (notifications.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map(n => {
          const Icon = icons[n.type];
          return (
            <div
              key={n.id}
              role="alert"
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border shadow-lg pointer-events-auto animate-in slide-in-from-right fade-in duration-300',
                styles[n.type]
              )}
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium flex-1">{n.message}</p>
              <button
                onClick={() => dismiss(n.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  }, [notifications, dismiss]);

  return { notify, NotificationArea };
}
