import React from 'react';
import { Host, Visit } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Phone, Mail, MessageSquare, Calendar, MapPin, User, Clock, Home } from 'lucide-react';
import { getTalkTitle } from '@/data/talkTitles';

interface HostMessageThreadProps {
  host: Host;
  visits: Visit[];
  onAction: (action: string, visit?: Visit, host?: Host) => void;
}

export const HostMessageThread: React.FC<HostMessageThreadProps> = ({ host, visits, onAction }) => {
  // Trier les visites par date décroissante
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  return (
    <div className='flex flex-col h-full bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm'>
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg'>
            {host.nom.charAt(0)}
          </div>
          <div>
            <h2 className='font-bold text-gray-900 dark:text-white'>{host.nom}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {host.address || 'Adresse non spécifiée'}
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          {host.telephone && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => window.open(`tel:${host.telephone}`)}
            >
              <Phone className='w-4 h-4' />
            </Button>
          )}
          {host.email && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => window.open(`mailto:${host.email}`)}
            >
              <Mail className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-4 space-y-6'>
        {/* Host Info Card */}
        <Card>
          <CardBody className='p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <Home className='w-5 h-5 text-green-600' />
              <h3 className='font-semibold text-gray-900 dark:text-white'>Informations sur l'hôte</h3>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4 text-gray-400' />
                <span className='text-gray-600 dark:text-gray-300'>
                  {host.gender === 'male' ? 'Homme' : host.gender === 'female' ? 'Femme' : 'Couple'}
                </span>
              </div>

              {host.capacity && (
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-300'>
                    Capacité: {host.capacity} personne{host.capacity > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {host.hasParking && (
                <div className='flex items-center gap-2'>
                  <span className='w-4 h-4 text-gray-400'>🚗</span>
                  <span className='text-gray-600 dark:text-gray-300'>Parking disponible</span>
                </div>
              )}

              {host.hasElevator && (
                <div className='flex items-center gap-2'>
                  <span className='w-4 h-4 text-gray-400'>⬆️</span>
                  <span className='text-gray-600 dark:text-gray-300'>Ascenseur disponible</span>
                </div>
              )}

              {host.notes && (
                <div className='col-span-full mt-2'>
                  <p className='text-xs text-gray-500 dark:text-gray-400 italic'>
                    "{host.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className='flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4'>
              <Button
                size='sm'
                variant='primary'
                leftIcon={<MessageSquare className='w-4 h-4' />}
                onClick={() => onAction('message_host', undefined, host)}
              >
                Envoyer un message
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Visits Section */}
        <div>
          <h3 className='font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
            <Calendar className='w-5 h-5' />
            Visites accueillies ({sortedVisits.length})
          </h3>

          {sortedVisits.length > 0 ? (
            sortedVisits.map((visit) => (
              <div key={visit.visitId} className='mb-4'>
                <div className='flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider justify-center my-4'>
                  <span className='bg-gray-200 dark:bg-gray-700 h-px w-8'></span>
                  {format(new Date(visit.visitDate), 'd MMMM yyyy', { locale: fr })}
                  <span className='bg-gray-200 dark:bg-gray-700 h-px w-8'></span>
                </div>

                <Card>
                  <CardBody className='p-4'>
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <h4 className='font-semibold text-gray-900 dark:text-white'>
                          {visit.nom} - Discours n°{visit.talkNoOrType}
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {visit.talkTheme || getTalkTitle(visit.talkNoOrType)}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>{visit.congregation}</p>
                      </div>
                      <span
                        className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${
                          visit.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            : visit.status === 'pending'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }
                      `}
                      >
                        {visit.status === 'confirmed'
                          ? 'Confirmé'
                          : visit.status === 'pending'
                            ? 'En attente'
                            : visit.status}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300'>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-gray-400' />
                        {visit.visitTime}
                      </div>
                      <div className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4 text-gray-400' />
                        {visit.locationType === 'physical' ? 'Salle du Royaume' : 'Zoom'}
                      </div>
                      {visit.accommodation && (
                        <div className='flex items-center gap-2 col-span-2'>
                          <Home className='w-4 h-4 text-gray-400' />
                          {visit.accommodation}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))
          ) : (
            <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
              <Calendar className='w-12 h-12 mx-auto mb-3 opacity-20' />
              <p>Aucune visite programmée avec cet hôte</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
