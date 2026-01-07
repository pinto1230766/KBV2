import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, Clock, Home, Users } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Host, Visit } from '@/types';

export const HostPortal: React.FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const { hosts, visits } = useData();

  const host = hosts.find((h: Host) => h.nom === hostId);
  const hostVisits = visits.filter((v: Visit) => {
    // Check if host is assigned to this visit
    return v.hostAssignments?.some((assignment: any) => assignment.hostName === hostId);
  });

  if (!host) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="p-6 text-center">
            <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Hôte non trouvé</h2>
            <p className="text-gray-600">
              L'hôte demandé n'existe pas ou a été supprimé.
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{host.nom}</h2>
                {host.telephone && (
                  <p className="text-sm text-gray-500">{host.telephone}</p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Visites */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Mes visites d'accueil</h2>
          
          {hostVisits.length === 0 ? (
            <Card>
              <CardBody className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Aucune visite prévue</h3>
                <p className="text-gray-600">
                  Vous n'avez aucune visite d'accueil prévue pour le moment.
                </p>
              </CardBody>
            </Card>
          ) : (
            hostVisits.map((visit: Visit) => {
              const assignment = visit.hostAssignments?.find((a: any) => a.hostName === hostId);
              return (
                <Card key={visit.visitId}>
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
                            <Users className="w-4 h-4" />
                            <span>{visit.nom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{visit.congregation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{visit.visitTime}</span>
                          </div>
                          {assignment && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-xs">
                              <strong>Rôle:</strong> {assignment.role || 'Accueil général'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};