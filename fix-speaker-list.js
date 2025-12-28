import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction complète du SpeakerList.tsx...\n');

const speakerListPath = path.join(__dirname, 'src/components/speakers/SpeakerList.tsx');

try {
  let content = fs.readFileSync(speakerListPath, 'utf8');
  
  // Réécrire complètement la structure JSX
  content = content.replace(
    /return \(\s*<div className='space-y-6'>[\s\S]*?<\/div>\s*\);/,
    `return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredAndSortedSpeakers.map((speaker) => {
          const lastTalk = speaker.talkHistory[0];
          const lastVisit = lastTalk
            ? visits.find((v) => v.visitId === lastTalk.visitId)
            : undefined;

          return (
            <Card key={speaker.id} hoverable>
              <CardBody className='p-4'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center gap-3'>
                    <Avatar
                      src={speaker.photoUrl}
                      name={speaker.nom}
                      size='md'
                      fallbackClassName='bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    />
                    <div>
                      <h3 className='font-semibold text-gray-900 dark:text-white'>{speaker.nom}</h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                        {speaker.congregation}
                      </p>
                      <WorkloadIndicator workload={calculateWorkload(speaker, visits)} size='sm' />
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onEdit(speaker)}
                      aria-label="Modifier l'orateur"
                    >
                      <Edit className='w-4 h-4 text-gray-500' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDelete(speaker.id)}
                      aria-label="Supprimer l'orateur"
                    >
                      <Trash2 className='w-4 h-4 text-red-500' />
                    </Button>
                  </div>
                </div>

                <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                  {speaker.telephone && (
                    <div className='flex items-center gap-2'>
                      <Phone className='w-4 h-4 text-gray-400' />
                      <a href={\`tel:\${speaker.telephone}\`} className='hover:text-primary-600'>
                        {speaker.telephone}
                      </a>
                    </div>
                  )}
                  {speaker.email && (
                    <div className='flex items-center gap-2'>
                      <Mail className='w-4 h-4 text-gray-400' />
                      <a
                        href={\`mailto:\${speaker.email}\`}
                        className='hover:text-primary-600 truncate'
                      >
                        {speaker.email}
                      </a>
                    </div>
                  )}
                  {speaker.isVehiculed && (
                    <div className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                      <Car className='w-4 h-4' />
                      <span>Véhiculé</span>
                    </div>
                  )}
                </div>

                {lastTalk && (
                  <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
                    <div className='flex justify-between items-center mb-2'>
                      <p className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                        Dernier discours :
                      </p>
                      {lastVisit && new Date(lastVisit.visitDate) < new Date() && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onFeedback(lastVisit)}
                          leftIcon={<Star className='w-3 h-3' />}
                        >
                          Évaluer
                        </Button>
                      )}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      <p className='font-medium'>
                        N°{lastTalk.talkNo} - {lastTalk.talkTheme}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {new Date(lastTalk.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}
                {speaker.talkHistory.length === 0 && (
                  <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500'>
                    Aucune visite enregistrée
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {filteredAndSortedSpeakers.length === 0 && (
        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
          Aucun orateur trouvé
        </div>
      )}
    </div>
  );`
  );
  
  fs.writeFileSync(speakerListPath, content);
  console.log('✅ SpeakerList.tsx : Structure JSX corrigée');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
}

console.log('\n✨ Correction terminée !');
