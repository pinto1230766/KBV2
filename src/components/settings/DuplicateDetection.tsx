import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { detectDuplicates, DuplicateGroup } from '@/utils/duplicateDetection';
import { DuplicateCard } from './DuplicateCard';
import { Button } from '@/components/ui/Button';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export const DuplicateDetection: React.FC = () => {
  const { speakers, hosts, visits, mergeDuplicates } = useData();
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    // Simuler un petit délai pour l'UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const detected = detectDuplicates(speakers, hosts, visits);
    // Filtrer les ignorés
    const filtered = detected.filter(d => !ignoredIds.has(d.id));
    
    setDuplicates(filtered);
    setIsScanning(false);
    
    if (filtered.length === 0) {
      addToast('Aucun doublon trouvé', 'success');
    } else {
      addToast(`${filtered.length} groupe(s) de doublons trouvés`, 'info');
    }
  };

  const handleMerge = async (groupId: string, keepId: string, duplicateIds: string[]) => {
    const group = duplicates.find(d => d.id === groupId);
    if (group) {
        mergeDuplicates(group.type, keepId, duplicateIds);
        addToast('Fusion effectuée avec succès', 'success');
        setDuplicates(prev => prev.filter(d => d.id !== groupId));
    }
  };

  const handleIgnore = (groupId: string) => {
    setIgnoredIds(prev => new Set(prev).add(groupId));
    setDuplicates(prev => prev.filter(d => d.id !== groupId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Détection de doublons
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Analysez vos données pour trouver des orateurs, accueillants ou visites en double.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleScan} 
          isLoading={isScanning}
          leftIcon={<RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />}
        >
          Lancer l'analyse
        </Button>
      </div>

      {duplicates.length > 0 ? (
        <div className="grid gap-4">
          {duplicates.map(group => (
            <DuplicateCard
              key={group.id}
              group={group}
              onMerge={handleMerge}
              onIgnore={handleIgnore}
            />
          ))}
        </div>
      ) : (
        !isScanning && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-80" />
            <p className="font-medium">Tout semble en ordre</p>
            <p className="text-sm mt-1">Lancez une analyse pour vérifier vos données</p>
          </div>
        )
      )}
    </div>
  );
};
