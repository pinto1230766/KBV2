import React, { useMemo, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Visit, Expense } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { 
  Euro, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

export const FinancialDashboard: React.FC = () => {
  const { visits } = useData();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [currency] = useState('€');

  // Helper to extract all expenses from visits
  const allExpenses = useMemo(() => visits.flatMap((v: Visit) => (v.expenses || []).map((e: Expense) => ({ ...e, visitNom: v.nom, visitDate: v.visitDate }))), [visits]);

  // Filter expenses by selected month
  const monthlyStats = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    const previousStart = startOfMonth(subMonths(start, 1));
    const previousEnd = endOfMonth(subMonths(start, 1));

    // Define the type for the flattened expense object
    type DashboardExpense = Expense & { visitNom: string; visitDate: string };

    const currentMonthExpenses = allExpenses.filter((e: DashboardExpense) => 
      isWithinInterval(new Date(e.date), { start, end })
    );

    const previousMonthExpenses = allExpenses.filter((e: DashboardExpense) => 
      isWithinInterval(new Date(e.date), { start: previousStart, end: previousEnd })
    );

    const totalCurrent = currentMonthExpenses.reduce((sum: number, e: DashboardExpense) => sum + e.amount, 0);
    const totalPrevious = previousMonthExpenses.reduce((sum: number, e: DashboardExpense) => sum + e.amount, 0);

    // Calculate variations
    const variation = totalPrevious === 0 ? 0 : ((totalCurrent - totalPrevious) / totalPrevious) * 100;

    // By Category
    const byCategory = currentMonthExpenses.reduce((acc: Record<string, number>, e: DashboardExpense) => {
      const cat = e.category || 'Autre';
      acc[cat] = (acc[cat] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalCurrent,
      variation,
      count: currentMonthExpenses.length,
      byCategory,
      expenses: currentMonthExpenses.sort((a: DashboardExpense, b: DashboardExpense) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  }, [allExpenses, selectedMonth]);

  // Overall stats (Year to date could be added here)
  const totalVisitsWithExpenses = visits.filter((v: Visit) => (v.expenses?.length || 0) > 0).length;
  const averageCostPerVisit = totalVisitsWithExpenses === 0 ? 0 : 
    allExpenses.reduce((sum: number, e: Expense & { visitNom: string; visitDate: string }) => sum + e.amount, 0) / totalVisitsWithExpenses;

  const exportData = () => {
    const headers = ['Date', 'Visite', 'Description', 'Catégorie', 'Montant'];
    const csvContent = [
      headers.join(','),
      ...monthlyStats.expenses.map((e: Expense & { visitNom: string; visitDate: string }) => [
        e.date,
        `"${e.visitNom}"`,
        `"${e.description}"`,
        e.category,
        e.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `depenses_${selectedMonth}.csv`;
    link.click();
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(new Date(), i);
    const value = format(d, 'yyyy-MM');
    const label = format(d, 'MMMM yyyy', { locale: fr });
    return { value, label: label.charAt(0).toUpperCase() + label.slice(1) };
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Tableau de bord financier
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Suivi des coûts et remboursements
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={monthOptions}
            className="min-w-[180px]"
          />
          <Button variant="secondary" onClick={exportData} leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dépenses du mois</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthlyStats.total.toFixed(2)} {currency}
              </h3>
              <div className={`flex items-center text-xs mt-1 ${monthlyStats.variation > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {monthlyStats.variation > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(monthlyStats.variation).toFixed(1)}% vs mois dernier
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Euro className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Coût moyen / Visite</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageCostPerVisit.toFixed(2)} {currency}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Sur toutes les visites</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nombre de notes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthlyStats.count}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Calendar className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Breakdown */}
        <Card className="h-full">
          <CardBody className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Répartition par catégorie</h3>
            <div className="space-y-4">
              {Object.entries(monthlyStats.byCategory).length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucune donnée</p>
              ) : (
                (Object.entries(monthlyStats.byCategory) as [string, number][])
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amount]) => {
                    const percentage = (amount / monthlyStats.total) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{amount.toFixed(2)} {currency} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-purple-600 h-2 rounded-full transition-all duration-500 w-[${percentage}%]`}
                          />
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardBody>
        </Card>

        {/* Recent Expenses List */}
        <Card className="h-full">
          <CardBody className="p-0">
             <div className="p-5 border-b border-gray-100 dark:border-gray-700">
               <h3 className="font-semibold text-gray-900 dark:text-white">Dernières dépenses</h3>
             </div>
             <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[300px] overflow-y-auto">
               {monthlyStats.expenses.length === 0 ? (
                 <p className="text-center text-gray-500 py-8">Aucune dépense ce mois-ci</p>
               ) : (
                 monthlyStats.expenses.map((expense: Expense & { visitNom: string; visitDate: string }) => (
                   <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="font-medium text-gray-900 dark:text-white text-sm">{expense.description}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                           {format(new Date(expense.date), 'dd MMM', { locale: fr })} • {expense.visitNom}
                         </p>
                       </div>
                       <span className="font-semibold text-gray-900 dark:text-white text-sm">
                         {expense.amount.toFixed(2)} {currency}
                       </span>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
