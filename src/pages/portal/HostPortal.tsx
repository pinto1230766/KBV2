import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, Clock, Home, Users, Phone, Mail, Sparkles, MapPinned, ChevronsRight } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Card className="max-w-md bg-bento-surface/10 backdrop-blur-bento border-white/10">
          <CardBody className="p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-bento-glass mx-auto flex items-center justify-center">
              <Home className="w-10 h-10 text-bento-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Hôte introuvable</h2>
            <p className="text-bento-muted">
              L'hôte demandé n'existe pas ou a été supprimé. Vérifiez l'URL partagée.
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

  const sortedVisits = [...hostVisits].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );
  const nextVisit = sortedVisits[0];
  const confirmedCount = hostVisits.filter((visit) => visit.status === 'confirmed').length;
  const pendingCount = hostVisits.filter((visit) => visit.status === 'pending').length;

  const infoChips = [
    { label: `${host.capacity || 0} pers.`, icon: Users },
    host.address ? { label: host.address, icon: MapPin } : null,
    host.telephone ? { label: host.telephone, icon: Phone, href: `tel:${host.telephone}` } : null,
    host.email ? { label: host.email, icon: Mail, href: `mailto:${host.email}` } : null,
  ].filter(Boolean) as { label: string; icon: React.ElementType; href?: string }[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_45%)]" />
      <div className="relative max-w-6xl mx-auto px-6 py-12 text-white">
        <div className="flex items-center gap-3 text-bento-muted mb-6 text-sm uppercase tracking-[0.3em]">
          <Sparkles className="w-4 h-4 text-bento-secondary" />
          Portail Hôte Premium
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr] mb-10">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[1.4fr_1fr]">
              <CardHeader className="p-8 flex flex-col gap-6 bg-gradient-to-br from-bento-primary/20 to-bento-glass border-b-0">
                <div className="space-y-4">
                  <div className="text-sm text-bento-muted uppercase tracking-[0.4em]">Hôte attitré</div>
                  <h1 className="text-4xl font-semibold tracking-tight leading-tight">
                    {host.nom}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    {infoChips.map(({ label, icon: Icon, href }) => (
                      href ? (
                        <a
                          key={label}
                          href={href}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-bento-sm bg-white/10 text-sm text-white/80 hover:bg-white/20 transition"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="truncate max-w-[12rem]">{label}</span>
                        </a>
                      ) : (
                        <span
                          key={label}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-bento-sm bg-white/10 text-sm text-white/80"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="truncate max-w-[12rem]">{label}</span>
                        </span>
                      )
                    ))}
                  </div>
                </div>
                {host.photoUrl && (
                  <div className="relative h-60 rounded-bento-lg overflow-hidden shadow-bento-accent">
                    <img
                      src={host.photoUrl}
                      alt={`Photo de ${host.nom}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent" />
                  </div>
                )}
              </CardHeader>

              <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 p-6 bg-bento-surface/40">
                <div className="rounded-bento-md bg-white/5 backdrop-blur-bento border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-bento-muted mb-2">Confirmées</p>
                  <p className="text-3xl font-semibold">{confirmedCount}</p>
                </div>
                <div className="rounded-bento-md bg-white/5 backdrop-blur-bento border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-bento-muted mb-2">En attente</p>
                  <p className="text-3xl font-semibold">{pendingCount}</p>
                </div>
                <div className="rounded-bento-md bg-white/5 backdrop-blur-bento border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-bento-muted mb-2">Capacité</p>
                  <p className="text-3xl font-semibold">
                    {host.capacity || 0}
                    <span className="text-base font-normal text-bento-muted ml-2">personnes</span>
                  </p>
                </div>
                {host.tags && host.tags.length > 0 && (
                  <div className="rounded-bento-md bg-white/5 backdrop-blur-bento border border-white/10 p-4 space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-bento-muted">Caractéristiques</p>
                    <div className="flex flex-wrap gap-2">
                      {host.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {nextVisit ? (
              <Card className="p-0 overflow-hidden">
                <CardBody className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-bento-muted">Prochaine visite</p>
                      <h3 className="text-2xl font-semibold mt-2">
                        {new Date(nextVisit.visitDate).toLocaleDateString('fr-FR', {
                          weekday: 'long', day: 'numeric', month: 'long'
                        })}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(nextVisit.status)}>
                      {getStatusText(nextVisit.status)}
                    </Badge>
                  </div>
                  <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-center gap-3">
                      <MapPinned className="w-4 h-4 text-bento-secondary" />
                      <span>{nextVisit.congregation}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-bento-secondary" />
                      <span>{nextVisit.visitTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-bento-secondary" />
                      <span>{nextVisit.nom}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody className="p-6 text-center space-y-3">
                  <Calendar className="w-10 h-10 mx-auto text-bento-secondary" />
                  <p className="text-sm text-bento-muted">
                    Aucune visite n'est programmée pour le moment.
                  </p>
                </CardBody>
              </Card>
            )}

            <Card className="p-0">
              <CardBody className="p-6 space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-bento-muted">Coordonnées rapides</p>
                <div className="grid gap-3">
                  {infoChips.map(({ label, icon: Icon, href }) => (
                    <a
                      key={`quick-${label}`}
                      {...(href ? { href } : {})}
                      className={`flex items-center justify-between rounded-bento-md border border-white/10 px-4 py-3 bg-white/5 hover:bg-white/10 transition ${href ? '' : 'pointer-events-none'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-bento-secondary" />
                        <span className="text-sm text-white/90 truncate max-w-[12rem]">{label}</span>
                      </div>
                      {href && <ChevronsRight className="w-4 h-4 text-bento-muted" />}
                    </a>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-bento-muted">
            <Calendar className="w-4 h-4" />
            <span>Historique des visites</span>
          </div>

          {sortedVisits.length === 0 ? (
            <Card>
              <CardBody className="p-8 text-center space-y-3 text-white/80">
                <Calendar className="w-10 h-10 mx-auto text-bento-secondary" />
                <h3 className="text-lg font-semibold">Aucune visite prévue</h3>
                <p className="text-bento-muted">Vous serez notifié dès qu'une mission sera assignée.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sortedVisits.map((visit: Visit) => {
                const assignment = visit.hostAssignments?.find((a: any) => a.hostName === hostId);
                return (
                  <Card key={visit.visitId} className="p-0 hover:shadow-bento-lg">
                    <CardBody className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(visit.status)}>
                          {getStatusText(visit.status)}
                        </Badge>
                        <span className="text-sm text-white/70">
                          {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold leading-snug">{visit.talkTheme}</h3>
                      <div className="space-y-2 text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-bento-secondary" />
                          <span>{visit.nom}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-bento-secondary" />
                          <span>{visit.congregation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-bento-secondary" />
                          <span>{visit.visitTime}</span>
                        </div>
                        {assignment && (
                          <div className="mt-3 rounded-bento-md bg-bento-glass px-3 py-2 text-xs text-white/90">
                            <span className="font-semibold">Rôle&nbsp;: </span>
                            {assignment.role || 'Accueil général'}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};