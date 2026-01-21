/**
 * Système d'alertes et notifications intelligentes
 * KBV Lyon - Phase 6.1.4 Alertes et notifications intelligentes
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  autoExpire?: number; // minutes
}

interface AlertSystemProps {
  className?: string;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ className }) => {
  const { visits, speakers, hosts } = useData();
  const { addToast: _addToast } = useToast();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Générer des alertes intelligentes
  const generateAlerts = useCallback(() => {
    const newAlerts: Alert[] = [];
    const now = new Date();

    // 1. Visites sans accueil dans moins de 7 jours
    const upcomingVisits = visits.filter((visit) => {
      const visitDate = new Date(visit.visitDate);
      const daysDiff = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return (
        daysDiff <= 7 &&
        daysDiff >= 0 &&
        (!visit.host || visit.host === 'À définir') &&
        visit.locationType === 'physical'
      );
    });

    upcomingVisits.forEach((visit) => {
      const speaker = speakers.find((s) => s.id === visit.id);
      if (speaker) {
        newAlerts.push({
          id: `no-host-${visit.id}`,
          type: 'urgent',
          title: 'Accueil manquant',
          message: `${speaker.nom} arrive dans ${Math.ceil((new Date(visit.visitDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} jours sans accueil défini`,
          timestamp: now,
          read: false,
          actionUrl: `/messages?speaker=${speaker.id}`,
          actionLabel: 'Gérer accueil',
          autoExpire: 60, // 1 heure
        });
      }
    });

    // 2. Rappels pour confirmations en attente
    const pendingConfirmations = visits.filter(
      (visit) => visit.status === 'pending' && new Date(visit.visitDate) > now
    );

    pendingConfirmations.forEach((visit) => {
      const speaker = speakers.find((s) => s.id === visit.id);
      const daysUntilVisit = Math.ceil(
        (new Date(visit.visitDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (speaker && daysUntilVisit <= 3) {
        newAlerts.push({
          id: `pending-confirmation-${visit.id}`,
          type: 'warning',
          title: 'Confirmation en attente',
          message: `La visite de ${speaker.nom} (${daysUntilVisit} jours) nécessite une confirmation`,
          timestamp: now,
          read: false,
          actionUrl: `/messages?speaker=${speaker.id}`,
          actionLabel: 'Confirmer',
          autoExpire: 120, // 2 heures
        });
      }
    });

    // 3. Hôtes avec visites rapprochées
    const busyHosts = hosts.filter((host) => {
      const hostVisits = visits.filter((v) => v.host === host.nom && new Date(v.visitDate) > now);
      return hostVisits.length >= 2;
    });

    busyHosts.forEach((host) => {
      const hostVisits = visits.filter((v) => v.host === host.nom && new Date(v.visitDate) > now);
      newAlerts.push({
        id: `busy-host-${host.nom}`,
        type: 'info',
        title: 'Hôte occupé',
        message: `${host.nom} a ${hostVisits.length} visites programmées prochainement`,
        timestamp: now,
        read: false,
        actionUrl: `/messages?host=${encodeURIComponent(host.nom)}`,
        actionLabel: 'Voir planning',
        autoExpire: 1440, // 24 heures
      });
    });

    // 4. Rappels pour visites dans 1 semaine
    const weekAheadVisits = visits.filter((visit) => {
      const daysDiff = Math.ceil(
        (new Date(visit.visitDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff === 7;
    });

    weekAheadVisits.forEach((visit) => {
      const speaker = speakers.find((s) => s.id === visit.id);
      if (speaker) {
        newAlerts.push({
          id: `week-reminder-${visit.id}`,
          type: 'info',
          title: 'Rappel visite',
          message: `${speaker.nom} arrive dans 1 semaine (${visit.talkTheme || 'thème non défini'})`,
          timestamp: now,
          read: false,
          actionUrl: `/messages?speaker=${speaker.id}`,
          actionLabel: 'Préparer',
          autoExpire: 1440, // 24 heures
        });
      }
    });

    // Éviter les doublons
    setAlerts((prevAlerts) => {
      const existingIds = new Set(prevAlerts.map((a) => a.id));
      const uniqueNewAlerts = newAlerts.filter((a) => !existingIds.has(a.id));
      return [...prevAlerts, ...uniqueNewAlerts];
    });
  }, [visits, speakers, hosts]);

  // Générer les alertes au chargement et régulièrement
  useEffect(() => {
    generateAlerts();
    const interval = setInterval(generateAlerts, 5 * 60 * 1000); // Toutes les 5 minutes
    return () => clearInterval(interval);
  }, [generateAlerts]);

  // Calculer le nombre d'alertes non lues
  useEffect(() => {
    setUnreadCount(alerts.filter((a) => !a.read).length);
  }, [alerts]);

  // Supprimer les alertes expirées
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => {
          if (!alert.autoExpire) return true;
          const age = (Date.now() - alert.timestamp.getTime()) / (1000 * 60); // minutes
          return age < alert.autoExpire;
        })
      );
    }, 60 * 1000); // Toutes les minutes

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert))
    );
  };

  const markAllAsRead = () => {
    setAlerts((prevAlerts) => prevAlerts.map((alert) => ({ ...alert, read: true })));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((a) => a.id !== alertId));
  };

  const handleAlertAction = (alert: Alert) => {
    if (alert.actionUrl) {
      window.location.href = alert.actionUrl;
    }
    markAsRead(alert.id);
    setShowPanel(false);
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className='w-4 h-4 text-red-500' />;
      case 'warning':
        return <AlertTriangle className='w-4 h-4 text-orange-500' />;
      case 'success':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      default:
        return <Info className='w-4 h-4 text-blue-500' />;
    }
  };

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de notification */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className='relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
        aria-label={`${unreadCount} alertes non lues`}
      >
        <Bell className='w-5 h-5 text-gray-600 dark:text-gray-400' />
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel des alertes */}
      {showPanel && (
        <div className='absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-2'>
              <Bell className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              <h3 className='font-semibold text-gray-900 dark:text-white'>Alertes intelligentes</h3>
              {unreadCount > 0 && (
                <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                  {unreadCount}
                </span>
              )}
            </div>
            <div className='flex gap-2'>
              {unreadCount > 0 && (
                <Button variant='ghost' size='sm' onClick={markAllAsRead} className='text-xs'>
                  Tout marquer lu
                </Button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                aria-label='Fermer le panneau des alertes'
                title='Fermer le panneau des alertes'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Liste des alertes */}
          <div className='max-h-80 overflow-y-auto'>
            {alerts.length === 0 ? (
              <div className='p-8 text-center text-gray-500'>
                <Bell className='w-8 h-8 mx-auto mb-2 opacity-50' />
                <p className='text-sm'>Aucune alerte pour le moment</p>
              </div>
            ) : (
              alerts
                .sort((a, b) => {
                  // Trier par priorité puis par date
                  const priorityOrder = { urgent: 0, warning: 1, info: 2, success: 3 };
                  if (priorityOrder[a.type] !== priorityOrder[b.type]) {
                    return priorityOrder[a.type] - priorityOrder[b.type];
                  }
                  return b.timestamp.getTime() - a.timestamp.getTime();
                })
                .map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border-l-4 ${getAlertStyle(alert.type)} ${
                      !alert.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 mt-0.5'>{getAlertIcon(alert.type)}</div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-semibold text-sm text-gray-900 dark:text-white truncate'>
                            {alert.title}
                          </h4>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-gray-500'>
                              {alert.timestamp.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <button
                              onClick={() => deleteAlert(alert.id)}
                              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              aria-label='Supprimer cette alerte'
                              title='Supprimer cette alerte'
                            >
                              <X className='w-3 h-3' />
                            </button>
                          </div>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                          {alert.message}
                        </p>
                        {alert.actionLabel && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleAlertAction(alert)}
                            className='mt-2 text-xs'
                          >
                            {alert.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Footer */}
          <div className='p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600'>
            <p className='text-xs text-gray-500 text-center'>
              Alertes mises à jour automatiquement
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook pour déclencher des alertes depuis d'autres composants
export const useAlerts = () => {
  const { addToast } = useToast();

  const createCustomAlert = useCallback(
    (
      type: Alert['type'],
      title: string,
      message: string,
      _options?: {
        actionUrl?: string;
        actionLabel?: string;
        autoExpire?: number;
      }
    ) => {
      // Pour les alertes personnalisées, on utilise le système de toast existant
      // Les vraies alertes intelligentes sont gérées par le composant AlertSystem
      addToast(
        `${title}: ${message}`,
        type === 'urgent' ? 'error' : type === 'warning' ? 'warning' : 'info'
      );
    },
    [addToast]
  );

  return { createCustomAlert };
};

export default AlertSystem;
