/**
 * Configuration du Dashboard - Vues personnalisables
 * Permet de configurer quels widgets afficher et leur disposition
 */

import React, { useState } from 'react';
import { 
  Settings, LayoutGrid, Eye, EyeOff, GripVertical,
  BarChart3, PieChart, LineChart, Bell, Calendar, Users,
  Clock, Activity, Save, RotateCcw
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  category: 'stats' | 'charts' | 'lists' | 'actions';
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: Date;
  isDefault?: boolean;
}

interface DashboardConfigState {
  currentLayout: string;
  layouts: DashboardLayout[];
  widgets: WidgetConfig[];
  
  // Actions
  setWidgetVisibility: (widgetId: string, visible: boolean) => void;
  setWidgetOrder: (widgetId: string, order: number) => void;
  setWidgetSize: (widgetId: string, size: WidgetConfig['size']) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  saveLayout: (name: string) => void;
  loadLayout: (layoutId: string) => void;
  resetToDefault: () => void;
}

// ============================================================================
// WIDGETS PAR DÉFAUT
// ============================================================================

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'stats-speakers',
    name: 'Orateurs actifs',
    description: 'Nombre d\'orateurs dans la base',
    icon: Users,
    visible: true,
    order: 0,
    size: 'small',
    category: 'stats'
  },
  {
    id: 'stats-hosts',
    name: 'Contacts d\'accueil',
    description: 'Nombre d\'hôtes disponibles',
    icon: Users,
    visible: true,
    order: 1,
    size: 'small',
    category: 'stats'
  },
  {
    id: 'stats-visits',
    name: 'Visites ce mois',
    description: 'Nombre de visites planifiées',
    icon: Calendar,
    visible: true,
    order: 2,
    size: 'small',
    category: 'stats'
  },
  {
    id: 'stats-actions',
    name: 'Actions requises',
    description: 'Tâches en attente',
    icon: Clock,
    visible: true,
    order: 3,
    size: 'small',
    category: 'stats'
  },
  {
    id: 'chart-monthly',
    name: 'Évolution mensuelle',
    description: 'Graphique des visites par mois',
    icon: BarChart3,
    visible: true,
    order: 4,
    size: 'large',
    category: 'charts'
  },
  {
    id: 'chart-distribution',
    name: 'Répartition',
    description: 'Types de visites',
    icon: PieChart,
    visible: true,
    order: 5,
    size: 'medium',
    category: 'charts'
  },
  {
    id: 'chart-trend',
    name: 'Tendances annuelles',
    description: 'Évolution sur 12 mois',
    icon: LineChart,
    visible: true,
    order: 6,
    size: 'large',
    category: 'charts'
  },
  {
    id: 'list-upcoming',
    name: 'Prochaines visites',
    description: 'Visites à venir',
    icon: Calendar,
    visible: true,
    order: 7,
    size: 'medium',
    category: 'lists'
  },
  {
    id: 'list-actions',
    name: 'Actions requises',
    description: 'Tâches à traiter',
    icon: Activity,
    visible: true,
    order: 8,
    size: 'large',
    category: 'lists'
  },
  {
    id: 'alerts-smart',
    name: 'Alertes intelligentes',
    description: 'Notifications automatiques',
    icon: Bell,
    visible: true,
    order: 9,
    size: 'medium',
    category: 'actions'
  },
  {
    id: 'quick-actions',
    name: 'Accès rapide',
    description: 'Actions fréquentes',
    icon: Activity,
    visible: true,
    order: 10,
    size: 'medium',
    category: 'actions'
  },
  {
    id: 'kpis-advanced',
    name: 'KPIs avancés',
    description: 'Indicateurs de performance',
    icon: Activity,
    visible: false,
    order: 11,
    size: 'full',
    category: 'stats'
  }
];

// ============================================================================
// STORE ZUSTAND
// ============================================================================

export const useDashboardConfig = create<DashboardConfigState>()(
  persist(
    (set, get) => ({
      currentLayout: 'default',
      layouts: [
        {
          id: 'default',
          name: 'Vue par défaut',
          widgets: DEFAULT_WIDGETS,
          createdAt: new Date(),
          isDefault: true
        }
      ],
      widgets: DEFAULT_WIDGETS,
      
      setWidgetVisibility: (widgetId, visible) => {
        set((state) => ({
          widgets: state.widgets.map(w => 
            w.id === widgetId ? { ...w, visible } : w
          )
        }));
      },
      
      setWidgetOrder: (widgetId, order) => {
        set((state) => ({
          widgets: state.widgets.map(w => 
            w.id === widgetId ? { ...w, order } : w
          )
        }));
      },
      
      setWidgetSize: (widgetId, size) => {
        set((state) => ({
          widgets: state.widgets.map(w => 
            w.id === widgetId ? { ...w, size } : w
          )
        }));
      },
      
      reorderWidgets: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.widgets);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            widgets: result.map((w, i) => ({ ...w, order: i }))
          };
        });
      },
      
      saveLayout: (name) => {
        const id = `layout-${Date.now()}`;
        set((state) => ({
          layouts: [
            ...state.layouts,
            {
              id,
              name,
              widgets: [...state.widgets],
              createdAt: new Date()
            }
          ],
          currentLayout: id
        }));
      },
      
      loadLayout: (layoutId) => {
        const layout = get().layouts.find(l => l.id === layoutId);
        if (layout) {
          set({
            widgets: [...layout.widgets],
            currentLayout: layoutId
          });
        }
      },
      
      resetToDefault: () => {
        set({
          widgets: DEFAULT_WIDGETS,
          currentLayout: 'default'
        });
      }
    }),
    {
      name: 'kbv-dashboard-config',
      partialize: (state) => ({
        currentLayout: state.currentLayout,
        layouts: state.layouts,
        widgets: state.widgets
      })
    }
  )
);

// ============================================================================
// COMPOSANT WIDGET ITEM
// ============================================================================

interface WidgetItemProps {
  widget: WidgetConfig;
  onToggle: () => void;
  onSizeChange: (size: WidgetConfig['size']) => void;
  isDragging?: boolean;
}

const WidgetItem: React.FC<WidgetItemProps> = ({
  widget,
  onToggle,
  onSizeChange,
  isDragging
}) => {
  const Icon = widget.icon;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all",
        widget.visible 
          ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" 
          : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60",
        isDragging && "shadow-lg ring-2 ring-primary-500"
      )}
    >
      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className={cn(
        "p-2 rounded-lg",
        widget.visible 
          ? "bg-primary-100 dark:bg-primary-900/20" 
          : "bg-gray-100 dark:bg-gray-800"
      )}>
        <Icon className={cn(
          "w-4 h-4",
          widget.visible 
            ? "text-primary-600 dark:text-primary-400" 
            : "text-gray-400"
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium",
          widget.visible 
            ? "text-gray-900 dark:text-white" 
            : "text-gray-500 dark:text-gray-400"
        )}>
          {widget.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {widget.description}
        </p>
      </div>
      
      <select
        aria-label={`Taille du widget ${widget.name}`}
        title={`Taille du widget ${widget.name}`}
        value={widget.size}
        onChange={(e) => onSizeChange(e.target.value as WidgetConfig['size'])}
        className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        disabled={!widget.visible}
      >
        <option value="small">Petit</option>
        <option value="medium">Moyen</option>
        <option value="large">Grand</option>
        <option value="full">Plein</option>
      </select>
      
      <button
        onClick={onToggle}
        className={cn(
          "p-2 rounded-lg transition-colors",
          widget.visible 
            ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" 
            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        {widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
};

// ============================================================================
// MODAL DE CONFIGURATION
// ============================================================================

interface DashboardConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardConfigModal: React.FC<DashboardConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    widgets, 
    setWidgetVisibility, 
    setWidgetSize, 
    saveLayout, 
    resetToDefault,
    layouts = [],
    currentLayout = 'default',
    loadLayout = () => {}
  } = useDashboardConfig();
  
  const [newLayoutName, setNewLayoutName] = useState('');
  const [activeTab, setActiveTab] = useState('widgets');

  const handleSaveLayout = () => {
    if (newLayoutName.trim()) {
      saveLayout(newLayoutName.trim());
      setNewLayoutName('');
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);
  
  const categories = [
    { id: 'stats', name: 'Statistiques', icon: BarChart3 },
    { id: 'charts', name: 'Graphiques', icon: LineChart },
    { id: 'lists', name: 'Listes', icon: Calendar },
    { id: 'actions', name: 'Actions', icon: Activity }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuration du Dashboard">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('widgets')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'widgets'
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            )}
          >
            <LayoutGrid className="w-4 h-4 inline mr-2" />
            Widgets
          </button>
          <button
            onClick={() => setActiveTab('layouts')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'layouts'
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            )}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Mises en page
          </button>
        </div>

        {activeTab === 'widgets' && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {categories.map((category) => {
              const categoryWidgets = sortedWidgets.filter(w => w.category === category.id);
              if (categoryWidgets.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </h4>
                  <div className="space-y-2">
                    {categoryWidgets.map((widget) => (
                      <WidgetItem
                        key={widget.id}
                        widget={widget}
                        onToggle={() => setWidgetVisibility(widget.id, !widget.visible)}
                        onSizeChange={(size) => setWidgetSize(widget.id, size)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'layouts' && (
          <div className="space-y-4">
            {/* Sauvegarder nouvelle mise en page */}
            <Card>
              <CardBody className="p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Sauvegarder la configuration actuelle
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLayoutName}
                    onChange={(e) => setNewLayoutName(e.target.value)}
                    placeholder="Nom de la mise en page..."
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <Button onClick={handleSaveLayout} disabled={!newLayoutName.trim()}>
                    <Save className="w-4 h-4 mr-1" />
                    Sauvegarder
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Liste des mises en page */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Mises en page enregistrées
              </h4>
              {layouts.map((layout) => (
                <div
                  key={layout.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                    currentLayout === layout.id
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {layout.name}
                      {layout.isDefault && (
                        <span className="ml-2 text-xs text-gray-500">(par défaut)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(layout.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button
                    variant={currentLayout === layout.id ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => loadLayout(layout.id)}
                  >
                    {currentLayout === layout.id ? 'Active' : 'Charger'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={resetToDefault}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={onClose}>
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// HOOK POUR OBTENIR LES WIDGETS VISIBLES
// ============================================================================

export const useVisibleWidgets = () => {
  const { widgets } = useDashboardConfig();
  
  return widgets
    .filter(w => w.visible)
    .sort((a, b) => a.order - b.order);
};

// ============================================================================
// HELPER POUR LA GRILLE CSS
// ============================================================================

export const getWidgetGridClass = (size: WidgetConfig['size']): string => {
  switch (size) {
    case 'small':
      return 'col-span-1 md:col-span-1 lg:col-span-3';
    case 'medium':
      return 'col-span-1 md:col-span-1 lg:col-span-4';
    case 'large':
      return 'col-span-1 md:col-span-2 lg:col-span-8';
    case 'full':
      return 'col-span-1 md:col-span-2 lg:col-span-12';
    default:
      return 'col-span-1 md:col-span-1 lg:col-span-4';
  }
};

export default {
  DashboardConfigModal,
  useDashboardConfig,
  useVisibleWidgets,
  getWidgetGridClass,
  DEFAULT_WIDGETS
};
