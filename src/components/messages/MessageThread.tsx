import React from 'react';
import { Speaker, Visit } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { CommunicationProgress } from '@/components/messages/CommunicationProgress';
import { Phone, Mail, MessageCircle, Calendar, MapPin, User, Clock } from 'lucide-react';
import { getTalkTitle } from '@/data/talkTitles';

interface MessageThreadProps {
  speaker: Speaker;
  visits: Visit[];
  onAction: (action: string, visit?: Visit) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ speaker, visits, onAction }) => {
  // Trier les visites par date décroissante
  const sortedVisits = [...visits].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg">
            {speaker.nom.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">{speaker.nom}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{speaker.congregation}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {speaker.telephone && (
            <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${speaker.telephone}`)}>
              <Phone className="w-4 h-4" />
            </Button>
          )}
          {speaker.email && (
            <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${speaker.email}`)}>
              <Mail className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sortedVisits.length > 0 ? (
          sortedVisits.map((visit) => (
            <div key={visit.id} className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider justify-center my-4">
                <span className="bg-gray-200 dark:bg-gray-700 h-px w-12"></span>
                {format(new Date(visit.visitDate), 'd MMMM yyyy', { locale: fr })}
                <span className="bg-gray-200 dark:bg-gray-700 h-px w-12"></span>
              </div>

              <Card>
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Discours n°{visit.talkNoOrType}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {visit.talkTheme || getTalkTitle(visit.talkNoOrType)}
                      </p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${visit.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        visit.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {visit.status === 'confirmed' ? 'Confirmé' : 
                       visit.status === 'pending' ? 'En attente' : visit.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {visit.visitTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {visit.locationType === 'physical' ? 'Salle du Royaume' : 'Zoom'}
                    </div>
                    {visit.host && (
                      <div className="flex items-center gap-2 col-span-2">
                        <User className="w-4 h-4 text-gray-400" />
                        Hébergé par {visit.host}
                      </div>
                    )}
                  </div>

                  {/* Barre de progression communication */}
                  <div className="mb-4">
                    <CommunicationProgress visit={visit} showLabels={true} size="md" />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      leftIcon={<MessageCircle className="w-4 h-4" />}
                      onClick={() => onAction('whatsapp', visit)}
                    >
                      WhatsApp
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      leftIcon={<Mail className="w-4 h-4" />}
                      onClick={() => onAction('email', visit)}
                    >
                      Email
                    </Button>
                    {visit.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => onAction('confirm', visit)}
                      >
                        Confirmer
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Aucune visite programmée avec cet orateur</p>
          </div>
        )}
      </div>
    </div>
  );
};
