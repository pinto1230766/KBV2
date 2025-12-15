import React from 'react';
import { useData } from '@/contexts/DataContext';
import { calculateWorkload } from '@/utils/workload';
import { WorkloadIndicator } from '@/components/workload/WorkloadIndicator';
import { Card, CardBody } from '@/components/ui/Card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export const PlanningWorkloadView: React.FC = () => {
  const { speakers, visits } = useData();
  const [searchTerm, setSearchTerm] = React.useState('');

  const workloadData = React.useMemo(() => 
     speakers.map(speaker => ({
      speaker,
      workload: calculateWorkload(speaker, visits)
    })).sort((a, b) => b.workload.currentLoad - a.workload.currentLoad) // Tri par charge décroissante
  , [speakers, visits]);

  const filteredData = workloadData.filter(({ speaker }) =>
    speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Analyse de la Charge et Disponibilité
        </h3>
        <div className="w-64">
          <Input
            placeholder="Rechercher un orateur..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map(({ speaker, workload }) => (
          <Card key={speaker.id} className="overflow-hidden">
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                    {speaker.nom.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{speaker.nom}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{speaker.congregation}</p>
                  </div>
                </div>
                <WorkloadIndicator workload={workload} />
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Charge actuelle</span>
                    <span className="font-medium text-gray-900 dark:text-white">{workload.currentLoad}%</span>
                  </div>
                  <progress
                    value={workload.currentLoad}
                    max={100}
                    className={`w-full h-2 rounded-full ${
                      workload.workloadScore >= 5 ? '[&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500' :
                      workload.workloadScore >= 4 ? '[&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500' :
                      workload.workloadScore >= 3 ? '[&::-webkit-progress-value]:bg-yellow-500 [&::-moz-progress-bar]:bg-yellow-500' :
                      '[&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500'
                    } [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-bar]:dark:bg-gray-700 [&::-moz-progress-bar]:bg-gray-100 [&::-moz-progress-bar]:dark:bg-gray-700`}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <span>Dernière visite:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {workload.lastVisit 
                      ? new Date(workload.lastVisit).toLocaleDateString() 
                      : 'Aucune'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
