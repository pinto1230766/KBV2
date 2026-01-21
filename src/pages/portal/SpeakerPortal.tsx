import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, Clock, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Speaker, Visit } from '@/types';

export const SpeakerPortal: React.FC = () => {
  const { speakerId } = useParams<{ speakerId: string }>();
  const { speakers, visits } = useData();

  const speaker = speakers.find((s: Speaker) => s.id === speakerId);
  const speakerVisits = visits.filter((v: Visit) => v.id === speakerId);

  if (!speaker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Orateur non trouvé</h2>
            <p className="text-gray-600">
              L'orateur demandé n'existe pas ou a été supprimé.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'Planifiée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{speaker.nom}</h2>
                <p className="text-gray-600">{speaker.congregation}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Visites */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Mes visites programmées</h2>
          
          {speakerVisits.length === 0 ? (
            <Card>
              <CardBody className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Aucune visite programmée</h3>
                <p className="text-gray-600">
                  Vous n'avez aucune visite de programmée pour le moment.
                </p>
              </CardBody>
            </Card>
          ) : (
            speakerVisits.map((visit) => (
              <Card key={visit.id}>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(visit.status)}>
                          {getStatusText(visit.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(visit.visitDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{visit.talkTheme}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{visit.congregation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{visit.visitTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};