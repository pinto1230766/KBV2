import React, { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import {
  Edit3,
  Save,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Type,
  FileText,
  Eye,
} from 'lucide-react';
import { MessageType, MessageRole, Language } from '@/types';

interface TemplateEditorProps {
  className?: string;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ className }) => {
  const { customTemplates, saveCustomTemplate } = useData();
  const { addToast } = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');
  const [selectedMessageType, setSelectedMessageType] = useState<MessageType>('confirmation');
  const [selectedRole, setSelectedRole] = useState<MessageRole>('speaker');
  const [editingTemplate, setEditingTemplate] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get current template
  const currentTemplate = useMemo(() => {
    return customTemplates?.[selectedLanguage]?.[selectedMessageType]?.[selectedRole] || '';
  }, [customTemplates, selectedLanguage, selectedMessageType, selectedRole]);

  // Initialize editing template when selection changes
  React.useEffect(() => {
    setEditingTemplate(currentTemplate);
    setHasUnsavedChanges(false);
  }, [currentTemplate]);

  const messageTypes: { value: MessageType; label: string; description: string }[] = [
    { value: 'confirmation', label: 'Confirmation orateur', description: 'Message de confirmation envoyé à l\'orateur' },
    { value: 'preparation', label: 'Préparation logistique', description: 'Détails d\'hébergement et transport' },
    { value: 'reminder-7', label: 'Rappel J-7', description: 'Rappel automatique une semaine avant' },
    { value: 'reminder-2', label: 'Rappel J-2', description: 'Rappel automatique deux jours avant' },
    { value: 'thanks', label: 'Remerciements', description: 'Message de remerciements après la visite' },
    { value: 'host_thanks', label: 'Remerciements hôtes', description: 'Remerciements envoyés aux hôtes' },
    { value: 'host_request', label: 'Demande d\'hébergement', description: 'Recherche d\'hôtes pour l\'accueil' },
    { value: 'visit_recap', label: 'Récapitulatif visite', description: 'Résumé complet de la visite' },
  ];

  const roles: { value: MessageRole; label: string }[] = [
    { value: 'speaker', label: 'Orateur' },
    { value: 'host', label: 'Hôte' },
  ];

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'cv', label: 'Cap-Verdien', flag: '🇨🇻' },
    { value: 'pt', label: 'Portugais', flag: '🇵🇹' },
  ];

  const handleSave = () => {
    saveCustomTemplate(selectedLanguage, selectedMessageType, selectedRole, editingTemplate);
    addToast('Modèle de message sauvegardé', 'success');
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setEditingTemplate(currentTemplate);
    setHasUnsavedChanges(false);
    addToast('Modifications annulées', 'info');
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editingTemplate.substring(start, end);

    const newText = editingTemplate.substring(0, start) + before + selectedText + after + editingTemplate.substring(end);
    setEditingTemplate(newText);
    setHasUnsavedChanges(true);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editingTemplate.substring(start, end);

    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
    }

    const newText = editingTemplate.substring(0, start) + formattedText + editingTemplate.substring(end);
    setEditingTemplate(newText);
    setHasUnsavedChanges(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.indexOf(selectedText), start + formattedText.indexOf(selectedText) + selectedText.length);
    }, 0);
  };

  const variables = [
    { key: '{nom}', description: 'Nom de l\'orateur' },
    { key: '{congregation}', description: 'Congrégation d\'origine' },
    { key: '{date}', description: 'Date de la visite' },
    { key: '{heure}', description: 'Heure de la visite' },
    { key: '{hote}', description: 'Nom de l\'hôte' },
    { key: '{adresse}', description: 'Adresse de l\'hôte' },
    { key: '{telephone}', description: 'Numéro de téléphone' },
    { key: '{discours}', description: 'Titre du discours' },
    { key: '{responsable}', description: 'Responsable accueil' },
    { key: '{jour_reunion}', description: 'Jour de réunion' },
    { key: '{heure_reunion}', description: 'Heure de réunion' },
  ];

  return (
    <div className={className}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <Edit3 className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <h3 className='font-bold text-gray-900 dark:text-white text-lg'>Éditeur de Modèles de Messages</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Personnalisez les messages automatiques avec un éditeur WYSIWYG
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Select
            label='Langue'
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            options={languages.map(l => ({ value: l.value, label: `${l.flag} ${l.label}` }))}
          />

          <Select
            label='Type de message'
            value={selectedMessageType}
            onChange={(e) => setSelectedMessageType(e.target.value as MessageType)}
            options={messageTypes.map(m => ({ value: m.value, label: m.label }))}
          />

          <Select
            label='Destinataire'
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as MessageRole)}
            options={roles.map(r => ({ value: r.value, label: r.label }))}
          />
        </div>

        {/* Template Description */}
        <Card className='border-dashed'>
          <CardBody className='p-4'>
            <div className='flex items-start gap-3'>
              <FileText className='w-5 h-5 text-gray-400 mt-0.5' />
              <div>
                <h4 className='font-semibold text-sm text-gray-900 dark:text-white mb-1'>
                  {messageTypes.find(m => m.value === selectedMessageType)?.label}
                </h4>
                <p className='text-xs text-gray-500'>
                  {messageTypes.find(m => m.value === selectedMessageType)?.description}
                </p>
                <p className='text-xs text-gray-400 mt-1'>
                  Destinataire: {roles.find(r => r.value === selectedRole)?.label}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Editor Toolbar */}
        <Card>
          <div className='border-b border-gray-200 dark:border-gray-700 p-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              <div className='flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-3 mr-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => formatText('bold')}
                  className='p-2'
                  title='Gras'
                >
                  <Bold className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => formatText('italic')}
                  className='p-2'
                  title='Italique'
                >
                  <Italic className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => formatText('underline')}
                  className='p-2'
                  title='Souligné'
                >
                  <Underline className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => formatText('code')}
                  className='p-2'
                  title='Code'
                >
                  <Code className='w-4 h-4' />
                </Button>
              </div>

              <div className='flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-3 mr-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => insertText('\n• ', '')}
                  className='p-2'
                  title='Liste à puces'
                >
                  <List className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => insertText('\n1. ', '')}
                  className='p-2'
                  title='Liste numérotée'
                >
                  <ListOrdered className='w-4 h-4' />
                </Button>
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className='p-2'
                title={isPreviewMode ? 'Mode édition' : 'Aperçu'}
              >
                {isPreviewMode ? <Edit3 className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </Button>
            </div>
          </div>

          <CardBody className='p-0'>
            {!isPreviewMode ? (
              <textarea
                id='template-editor'
                value={editingTemplate}
                onChange={(e) => {
                  setEditingTemplate(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className='w-full h-64 p-4 bg-transparent border-none resize-none focus:ring-0 text-sm font-mono'
                placeholder='Tapez votre message personnalisé ici...'
                style={{ minHeight: '200px' }}
              />
            ) : (
              <div className='p-4 min-h-[200px] bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                <div className='prose prose-sm dark:prose-invert max-w-none'>
                  {editingTemplate.split('\n').map((line, index) => (
                    <p key={index} className='mb-2 last:mb-0'>
                      {line || <br />}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Variables Helper */}
        <Card>
          <CardHeader className='pb-3'>
            <h4 className='font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2'>
              <Type className='w-4 h-4' />
              Variables disponibles
            </h4>
            <p className='text-xs text-gray-500 mt-1'>
              Cliquez sur une variable pour l'insérer dans le message
            </p>
          </CardHeader>
          <CardBody className='pt-0'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {variables.map((variable) => (
                <button
                  key={variable.key}
                  onClick={() => insertText(variable.key)}
                  className='text-left p-2 bg-gray-50 dark:bg-gray-800/50 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                >
                  <code className='text-xs font-mono text-blue-600 dark:text-blue-400'>
                    {variable.key}
                  </code>
                  <p className='text-[10px] text-gray-500 mt-0.5'>{variable.description}</p>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-2'>
            {hasUnsavedChanges && (
              <Badge variant='warning' className='text-xs'>
                Modifications non sauvegardées
              </Badge>
            )}
          </div>

          <div className='flex gap-3'>
            <Button
              variant='ghost'
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              leftIcon={<RotateCcw className='w-4 h-4' />}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              leftIcon={<Save className='w-4 h-4' />}
              className='shadow-lg shadow-primary-200 dark:shadow-none'
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};