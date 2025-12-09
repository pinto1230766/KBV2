import React, { useState } from 'react';
import { Utensils, AlertCircle, Plus, X, Clock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Visit } from '@/types';

interface MealPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  onSave: (mealPlan: MealPlan) => void;
}

export interface MealPlan {
  visitId: string;
  meals: Meal[];
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: string[];
  notes?: string;
}

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  location: string;
  host?: string;
  attendees: number;
  menu?: string;
  cost?: number;
}

const MEAL_TYPES = [
  { value: 'breakfast' as const, label: 'Petit-déjeuner', icon: '🌅', defaultTime: '08:00' },
  { value: 'lunch' as const, label: 'Déjeuner', icon: '🍽️', defaultTime: '12:30' },
  { value: 'dinner' as const, label: 'Dîner', icon: '🌙', defaultTime: '19:00' },
  { value: 'snack' as const, label: 'Collation', icon: '☕', defaultTime: '15:00' },
];

const COMMON_RESTRICTIONS = [
  'Végétarien',
  'Végétalien',
  'Sans gluten',
  'Sans lactose',
  'Halal',
  'Casher',
  'Sans porc',
  'Sans fruits de mer',
];

const COMMON_ALLERGIES = [
  'Arachides',
  'Fruits à coque',
  'Lait',
  'Œufs',
  'Poisson',
  'Crustacés',
  'Soja',
  'Blé',
];

export const MealPlanningModal: React.FC<MealPlanningModalProps> = ({
  isOpen,
  onClose,
  visit,
  onSave
}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [customRestriction, setCustomRestriction] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');

  const addMeal = (type: Meal['type']) => {
    const mealType = MEAL_TYPES.find(m => m.value === type);
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      type,
      time: mealType?.defaultTime || '12:00',
      location: '',
      attendees: 1,
    };
    setMeals([...meals, newMeal]);
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals(meals.map(meal => 
      meal.id === id ? { ...meal, ...updates } : meal
    ));
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const toggleRestriction = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const addCustomRestriction = () => {
    if (customRestriction.trim()) {
      setDietaryRestrictions([...dietaryRestrictions, customRestriction.trim()]);
      setCustomRestriction('');
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim()) {
      setAllergies([...allergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleSave = () => {
    const mealPlan: MealPlan = {
      visitId: visit.visitId,
      meals,
      dietaryRestrictions,
      allergies,
      preferences,
      notes: notes || undefined
    };

    onSave(mealPlan);
    onClose();
  };

  const getTotalCost = () => {
    return meals.reduce((sum, meal) => sum + (meal.cost || 0), 0);
  };

  const getMealIcon = (type: Meal['type']) => {
    return MEAL_TYPES.find(m => m.value === type)?.icon || '🍽️';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Planification des repas"
      size="xl"
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {visit.nom}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>

        {/* Restrictions alimentaires */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Restrictions alimentaires
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_RESTRICTIONS.map((restriction) => (
              <button
                key={restriction}
                onClick={() => toggleRestriction(restriction)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  dietaryRestrictions.includes(restriction)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRestriction}
              onChange={(e) => setCustomRestriction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomRestriction()}
              placeholder="Autre restriction..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button variant="outline" size="sm" onClick={addCustomRestriction}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Allergies (important !)
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGIES.map((allergy) => (
              <button
                key={allergy}
                onClick={() => toggleAllergy(allergy)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  allergies.includes(allergy)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              placeholder="Autre allergie..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button variant="outline" size="sm" onClick={addCustomAllergy}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Repas planifiés */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Repas planifiés
            </label>
            <div className="flex gap-2">
              {MEAL_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => addMeal(type.value)}
                  title={`Ajouter ${type.label}`}
                >
                  <span className="text-lg">{type.icon}</span>
                </Button>
              ))}
            </div>
          </div>

          {meals.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aucun repas planifié. Cliquez sur les icônes ci-dessus pour ajouter un repas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <Card key={meal.id}>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMealIcon(meal.type)}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {MEAL_TYPES.find(t => t.value === meal.type)?.label}
                          </span>
                        </div>
                        <button
                          onClick={() => removeMeal(meal.id)}
                          aria-label="Supprimer ce repas"
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Heure
                          </label>
                          <input
                            type="time"
                            value={meal.time}
                            onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                            aria-label="Heure du repas"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Nombre de personnes
                          </label>
                          <input
                            type="number"
                            value={meal.attendees}
                            onChange={(e) => updateMeal(meal.id, { attendees: Number(e.target.value) })}
                            min="1"
                            aria-label="Nombre de personnes"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Lieu
                        </label>
                        <input
                          type="text"
                          value={meal.location}
                          onChange={(e) => updateMeal(meal.id, { location: e.target.value })}
                          placeholder="Restaurant, domicile, etc."
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Hôte / Responsable
                        </label>
                        <input
                          type="text"
                          value={meal.host || ''}
                          onChange={(e) => updateMeal(meal.id, { host: e.target.value })}
                          placeholder="Nom de l'hôte"
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Menu (optionnel)
                          </label>
                          <input
                            type="text"
                            value={meal.menu || ''}
                            onChange={(e) => updateMeal(meal.id, { menu: e.target.value })}
                            placeholder="Description du menu"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Coût estimé (€)
                          </label>
                          <input
                            type="number"
                            value={meal.cost || ''}
                            onChange={(e) => updateMeal(meal.id, { cost: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes supplémentaires
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Préférences culinaires, informations complémentaires..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Résumé */}
        {(meals.length > 0 || dietaryRestrictions.length > 0 || allergies.length > 0) && (
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardBody>
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                Résumé
              </h4>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <p>• {meals.length} repas planifié(s)</p>
                {dietaryRestrictions.length > 0 && (
                  <p>• {dietaryRestrictions.length} restriction(s) alimentaire(s)</p>
                )}
                {allergies.length > 0 && (
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    ⚠️ {allergies.length} allergie(s) à prendre en compte
                  </p>
                )}
                {getTotalCost() > 0 && (
                  <p>• Coût total estimé : {getTotalCost().toFixed(2)}€</p>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Utensils className="w-4 h-4 mr-2" />
            Enregistrer le plan de repas
          </Button>
        </div>
      </div>
    </Modal>
  );
};
