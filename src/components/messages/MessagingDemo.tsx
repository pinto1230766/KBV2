import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useMessagingStore } from '@/stores/messagingStore';
import { MessageSquare, Send, Eye, CheckCircle, Reply, Plus } from 'lucide-react';

// ============================================================================
// COMPOSANT DE DÉMONSTRATION DU SYSTÈME DE MESSAGERIE
// ============================================================================

export const MessagingDemo: React.FC = () => {
  const {
    templates,
    messages,
    stats,
    generateMessage,
    sendMessage,
    trackResponse,
    getSmartSuggestions,
    activeLanguage,
    autoDetectLanguage
  } = useMessagingStore();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState('test-speaker-albufeira');
  const [isGenerating, setIsGenerating] = useState(false);

  // Variables de test pour la génération
  const testVariables = {
    speakerName: 'João Silva',
    visitDate: '15 décembre 2024',
    visitTime: '14h30',
    firstTimeIntroduction: '\n\nJe suis le responsable de l\'accueil pour la congrégation de Lyon.',
    hospitalityOverseer: 'Pierre Martin',
    hospitalityOverseerPhone: '+33 6 12 34 56 78',
    hostName: 'Marie Dupont',
    hostPhone: '+33 6 98 76 54 32',
    hostAddress: '15 rue de la Paix, Lyon'
  };

  const handleGenerateMessage = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const message = await generateMessage(selectedTemplate, recipientId, testVariables);
      console.log('Message generated:', message);
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (messageId: string) => {
    try {
      await sendMessage(messageId, ['whatsapp']);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTrackResponse = (messageId: string) => {
    const reply = prompt('Entrez une réponse de test:');
    if (reply) {
      trackResponse(messageId, reply);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <MessageSquare className="w-4 h-4 text-gray-400" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <Eye className="w-4 h-4 text-orange-500" />;
      case 'read': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'replied': return <Reply className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'sent': return 'blue';
      case 'delivered': return 'orange';
      case 'read': return 'green';
      case 'replied': return 'purple';
      default: return 'gray';
    }
  };

  const smartSuggestions = getSmartSuggestions('speaker');

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🧪 Démonstration du Système de Messagerie Avancé
        </h2>
        <div className="flex gap-2">
          <Badge variant="info">
            Langue: {activeLanguage.toUpperCase()}
          </Badge>
          <Badge variant={autoDetectLanguage ? "success" : "warning"}>
            Détection auto: {autoDetectLanguage ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSent}</div>
            <div className="text-sm text-gray-500">Envoyés</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalDelivered}</div>
            <div className="text-sm text-gray-500">Livrés</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalRead}</div>
            <div className="text-sm text-gray-500">Lus</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalReplied}</div>
            <div className="text-sm text-gray-500">Réponses</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.avgResponseTime > 0 ? `${Math.round(stats.avgResponseTime / 1000 / 60)}min` : '-'}
            </div>
            <div className="text-sm text-gray-500">Temps moyen</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Génération de messages */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">🎯 Génération de Messages</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Destinataire (pour détection langue)</label>
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="test-speaker-albufeira"
              />
              <div className="text-xs text-gray-500 mt-1">
                Essayez: "albufeira" (Portugais), "+238" (Capverdien), "+33" (Français)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Template</label>
              <select
                value={selectedTemplate || ''}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                aria-label="Sélectionner un template de message"
              >
                <option value="">Sélectionner un template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.category})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGenerateMessage}
              disabled={!selectedTemplate || isGenerating}
              isLoading={isGenerating}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Générer Message
            </Button>

            {/* Variables utilisées */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Variables de test utilisées:</h4>
              <div className="text-xs space-y-1">
                {Object.entries(testVariables).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-blue-600">{key}:</span>
                    <span className="truncate ml-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Suggestions intelligentes */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">🧠 Suggestions Intelligentes</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Templates suggérés pour le contexte "speaker" (triés par usage):
              </div>
              {smartSuggestions.map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500">
                      {template.category} • Utilisé {template.usageCount} fois
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
              {smartSuggestions.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Aucune suggestion disponible
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Liste des messages */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">📨 Messages Générés ({messages.length})</h3>
        </CardHeader>
        <CardBody>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun message généré. Utilisez le formulaire ci-dessus pour créer un message.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(message.status)}
                      <div>
                        <div className="font-medium text-sm">
                          Message pour {message.recipientId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {message.language.toUpperCase()} • {message.channels.join(', ')}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(message.status) as any} className="text-xs">
                      {message.status}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {message.content}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>
                      {message.sentAt && (
                        <span>Envoyé: {message.sentAt.toLocaleString()}</span>
                      )}
                      {message.readAt && (
                        <span className="ml-4">Lu: {message.readAt.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {message.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendMessage(message.id)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Envoyer
                        </Button>
                      )}
                      {(message.status === 'sent' || message.status === 'delivered' || message.status === 'read') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTrackResponse(message.id)}
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Répondre
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.reply && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                        Réponse reçue:
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        {message.reply}
                      </div>
                      {message.repliedAt && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {message.repliedAt.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Statistiques détaillées */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">📊 Statistiques Détaillées</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Par canal</h4>
              <div className="space-y-2">
                {Object.entries(stats.byChannel).map(([channel, count]) => (
                  <div key={channel} className="flex justify-between text-sm">
                    <span className="capitalize">{channel}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.byChannel).length === 0 && (
                  <div className="text-gray-500 text-sm">Aucune donnée</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Par langue</h4>
              <div className="space-y-2">
                {Object.entries(stats.byLanguage).map(([lang, count]) => (
                  <div key={lang} className="flex justify-between text-sm">
                    <span className="uppercase">{lang}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.byLanguage).length === 0 && (
                  <div className="text-gray-500 text-sm">Aucune donnée</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Par congrégation</h4>
              <div className="space-y-2">
                {Object.entries(stats.byCongregation).map(([cong, count]) => (
                  <div key={cong} className="flex justify-between text-sm">
                    <span>{cong}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.byCongregation).length === 0 && (
                  <div className="text-gray-500 text-sm">Aucune donnée</div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MessagingDemo;