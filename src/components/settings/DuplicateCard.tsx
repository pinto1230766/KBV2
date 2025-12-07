import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Merge, User, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { DuplicateGroup } from '@/utils/duplicateDetection';
import { Visit, Speaker, Host } from '@/types';

interface DuplicateCardProps {
  group: DuplicateGroup;
  onMerge: (groupId: string, keepId: string, duplicateIds: string[]) => void;
  onIgnore: (groupId: string) => void;
}


export const DuplicateCard: React.FC<DuplicateCardProps> = ({ group, onMerge, onIgnore }) => {
  if (!group || !group.items || group.items.length === 0) {
    return null;
  }

  const getItemId = (item: any) => group.type === 'host' ? item.nom : (item.id || item.visitId);
  const [selectedId, setSelectedId] = useState<string>(getItemId(group.items[0]));
  const [isExpanded, setIsExpanded] = useState(true);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'speaker': return 'Orateurs';
      case 'host': return 'Accueillants';
      case 'visit': return 'Visites';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speaker': return <User className="w-4 h-4" />;
      case 'host': return <MapPin className="w-4 h-4" />;
      case 'visit': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleMerge = () => {
    const duplicateIds = group.items
      .map(item => getItemId(item))
      .filter(id => id !== selectedId);
    onMerge(group.id, selectedId, duplicateIds);
  };

  const renderItemDetails = (item: any, type: string) => {
    if (type === 'speaker') {
      const s = item as Speaker;
      return (
        <div className="text-sm">
          <p className="font-medium text-gray-900 dark:text-white">{s.nom}</p>
          <p className="text-gray-500 dark:text-gray-400">{s.congregation || 'Aucune congrégation'}</p>
          {s.telephone && <p className="text-gray-500 text-xs">Tel: {s.telephone}</p>}
          <p className="text-xs text-gray-400 mt-1">ID: {s.id?.slice(0, 8)}...</p>
        </div>
      );
    }

    if (type === 'host') {
      const h = item as Host;
      return (
        <div className="text-sm">
          <p className="text-gray-500 dark:text-gray-400">{h.address || 'Aucune adresse'}</p>
          {h.telephone && <p className="text-gray-500 text-xs">Tel: {h.telephone}</p>}
        </div>
      );
    }
    if (type === 'visit') {
      const v = item as Visit;
      return (
        <div className="text-sm">
          <p className="font-medium text-gray-900 dark:text-white">{v.nom}</p>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date(v.visitDate).toLocaleDateString()} à {v.visitTime}
          </p>
          <p className="text-gray-500 text-xs">{v.talkNoOrType || 'Pas de discours'} - {v.congregation}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        <CardHeader className="py-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="warning" className="flex items-center gap-1">
              {getTypeIcon(group.type)}
              {getTypeLabel(group.type)}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
              Similitude: {(group.similarity * 100).toFixed(0)}%
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              {group.reason}
            </span>
          </div>
          <div>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </CardHeader>
      </div>
      
      {isExpanded && (
        <CardBody className="pt-0 pb-4">
          <div className="text-sm text-gray-500 mb-4 px-1">
            Veuillez sélectionner l'élément à conserver. Les données des autres éléments seront fusionnées ou supprimées.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {group.items.map((item) => {
              const itemId = getItemId(item);
              return (
              <div 
                key={itemId}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedId === itemId 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                `}
                onClick={() => setSelectedId(itemId)}
              >
                {selectedId === itemId && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                {renderItemDetails(item, group.type)}
              </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-2 border-t border-gray-100 dark:border-gray-800 pt-4">
            <Button variant="ghost" onClick={() => onIgnore(group.id)}>
              Ignorer
            </Button>
            <Button variant="primary" onClick={handleMerge} leftIcon={<Merge className="w-4 h-4" />}>
              Fusionner la sélection
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  );
};
