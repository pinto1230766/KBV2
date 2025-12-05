import React, { useState } from 'react';
import { Host } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Edit, Trash2, Phone, Mail, MapPin, Search, Info } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

interface HostListProps {
  hosts: Host[];
  onEdit: (host: Host) => void;
  onDelete: (name: string) => void;
}

export const HostList: React.FC<HostListProps> = ({ hosts, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHosts = hosts.filter(host =>
    host.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (host.address && host.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un contact..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHosts.map((host) => (
          <Card key={host.nom} hoverable>
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                    {host.nom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{host.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Capacité: {host.capacity} pers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(host)}>
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(host.nom)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {host.telephone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${host.telephone}`} className="hover:text-primary-600">
                      {host.telephone}
                    </a>
                  </div>
                )}
                {host.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${host.email}`} className="hover:text-primary-600 truncate">
                      {host.email}
                    </a>
                  </div>
                )}
                {host.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{host.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
                {host.hasPets && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Animaux
                  </span>
                )}
                {host.isSmoker && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    Fumeur
                  </span>
                )}
                {host.notes && (
                  <div className="w-full flex items-start gap-2 mt-2 text-xs text-gray-500 italic">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{host.notes}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredHosts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucun contact trouvé
        </div>
      )}
    </div>
  );
};
