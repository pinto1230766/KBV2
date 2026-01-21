// Données complètes chargées depuis KBUP.json
import { AppData } from '@/types';
import kbupData from './KBUP.json';

// Export direct des données depuis KBUP.json avec version mise à jour
export const completeData: AppData = {
  ...(kbupData as unknown as AppData),
  dataVersion: '1.5.0',
};
