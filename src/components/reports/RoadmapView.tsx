import React, { useRef } from 'react';
import { Visit, Speaker, Host } from '@/types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Phone, User, Calendar, Truck, Hotel, CheckSquare, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { useReactToPrint } from 'react-to-print';

interface RoadmapViewProps {
  visit: Visit;
  speaker?: Speaker;
  host?: Host;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ visit, speaker, host }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Feuille_de_route_${visit.nom}_${visit.visitDate}`,
  } as any);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE d MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <Button onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
          Imprimer la feuille de route
        </Button>
      </div>

      {/* Printable Content */}
      <div ref={componentRef} className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm print:shadow-none print:w-full print:max-w-none">
        
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-gray-900">Feuille de Route</h1>
          <p className="text-xl text-gray-600">{visit.congregation}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold text-lg">{formatDate(visit.visitDate)}</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="font-semibold">{visit.visitTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-8">
          
          {/* Section 1: Orateur & Discours */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 flex items-center gap-2 text-primary-700 print:text-black">
              <User className="w-5 h-5" /> Orateur & Discours
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:border print:border-gray-200">
               <div className="font-semibold text-lg mb-1">{visit.nom}</div>
               <div className="text-gray-600 mb-2">{speaker?.email || 'Email non renseigné'}</div>
               <div className="text-gray-600 mb-4">{speaker?.telephone || 'Tel non renseigné'}</div>
               
               <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 uppercase font-semibold">Discours</div>
                  <div className="font-medium">N°{visit.talkNoOrType || 'Non défini'}</div>
                  {visit.talkTheme && <div className="text-sm text-gray-600 mt-1">{visit.talkTheme}</div>}
               </div>
            </div>
          </section>

          {/* Section 2: Repas */}
          {visit.meals && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 flex items-center gap-2 text-primary-700 print:text-black">
                <Hotel className="w-5 h-5" /> Repas
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:border print:border-gray-200">
                <div className="text-gray-700">{visit.meals}</div>
              </div>
            </section>
          )}

          {/* Section 3: Hébergement */}
          {(host || visit.logistics?.accommodation?.name) && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 flex items-center gap-2 text-primary-700 print:text-black">
                <Hotel className="w-5 h-5" /> Hébergement
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:border print:border-gray-200">
                {(host && visit.logistics?.accommodation?.type !== 'hotel') ? (
                  <>
                    <div className="font-semibold text-lg mb-1">{host.nom}</div>
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{host.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{host.telephone}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {host.notes && <p className="italic">"{host.notes}"</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-lg mb-1">{visit.logistics?.accommodation?.name}</div>
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{visit.logistics?.accommodation?.address || 'Adresse non renseignée'}</span>
                    </div>
                    {visit.logistics?.accommodation?.bookingReference && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Référence:</strong> {visit.logistics.accommodation.bookingReference}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      {visit.logistics?.accommodation?.notes && <p className="italic">"{visit.logistics.accommodation.notes}"</p>}
                    </div>
                  </>
                )}
                
                {visit.logistics?.accommodation && (
                   <div className="mt-4 pt-4 border-t border-gray-200 text-sm grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500 block">Check-in</span>
                        <span className="font-medium">
                          {visit.logistics.accommodation.checkIn ? format(parseISO(visit.logistics.accommodation.checkIn), 'dd/MM HH:mm') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Check-out</span>
                        <span className="font-medium">
                          {visit.logistics.accommodation.checkOut ? format(parseISO(visit.logistics.accommodation.checkOut), 'dd/MM HH:mm') : '-'}
                        </span>
                      </div>
                   </div>
                )}
              </div>
            </section>
          )}

          {/* Section 4: Itinéraire */}
          {visit.logistics?.itinerary && (
             <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 flex items-center gap-2 text-primary-700 print:text-black">
                <Truck className="w-5 h-5" /> Trajet
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:border print:border-gray-200">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                       <div className="text-sm text-gray-500">Mode</div>
                       <div className="font-medium capitalize">{visit.logistics.itinerary.transportMode}</div>
                    </div>
                    <div>
                       <div className="text-sm text-gray-500">Durée estimée</div>
                       <div className="font-medium">{visit.logistics.itinerary.duration || '-'}</div>
                    </div>
                 </div>
                 {visit.logistics.itinerary.meetingPoint && (
                    <div className="mb-2">
                       <div className="text-sm text-gray-500">Point de RDV</div>
                       <div className="font-medium">{visit.logistics.itinerary.meetingPoint}</div>
                    </div>
                 )}
              </div>
             </section>
          )}

          {/* Section 5: Checklist Importante */}
          {visit.logistics?.checklist && visit.logistics.checklist.length > 0 && (
             <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 flex items-center gap-2 text-primary-700 print:text-black">
                <CheckSquare className="w-5 h-5" /> À ne pas oublier
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:border print:border-gray-200">
                <ul className="space-y-2">
                   {visit.logistics.checklist
                      .filter(item => !item.isCompleted) // Only show what is LEFT to do, or remove filter to show all
                      .map(item => (
                      <li key={item.id} className="flex items-center gap-3">
                         <div className="w-4 h-4 border-2 border-black rounded-sm print:block" />
                         <span>{item.label}</span>
                      </li>
                   ))}
                   {visit.logistics.checklist.every(i => i.isCompleted) && (
                      <li className="text-green-600 italic">Toutes les tâches logistiques sont complétées.</li>
                   )}
                </ul>
              </div>
             </section>
          )}

        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-400 border-t pt-8 print:mt-auto print:absolute print:bottom-8 print:left-0 print:right-0">
           <p>Généré par KBV2 Manager - {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
