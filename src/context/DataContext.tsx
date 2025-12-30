import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Expense, Host, Feedback, Accommodation } from '../types';

// Interfaces locales pour les types manquants
interface Event {
  id: string;
  title: string;
  date: string;
  description?: string;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  date: string;
  read?: boolean;
}

// Interface pour l'état global de l'application
interface AppState {
  // Données principales
  expenses: Expense[];
  hosts: Host[];
  events: Event[];
  feedback: Feedback[];
  messages: Message[];
  accommodations: Accommodation[];

  // État de l'application
  isLoading: boolean;
  error: string | null;

  // Configuration
  dashboardConfig: {
    currency: string;
    theme: string;
    notifications: boolean;
  };
}

// Types d'actions
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_HOSTS'; payload: Host[] }
  | { type: 'ADD_HOST'; payload: Host }
  | { type: 'UPDATE_HOST'; payload: Host }
  | { type: 'DELETE_HOST'; payload: string }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_FEEDBACK'; payload: Feedback[] }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_ACCOMMODATIONS'; payload: Accommodation[] }
  | { type: 'ADD_ACCOMMODATION'; payload: Accommodation }
  | { type: 'UPDATE_DASHBOARD_CONFIG'; payload: Partial<AppState['dashboardConfig']> }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> };

// État initial
const initialState: AppState = {
  expenses: [],
  hosts: [],
  events: [],
  feedback: [],
  messages: [],
  accommodations: [],
  isLoading: false,
  error: null,
  dashboardConfig: {
    currency: 'EUR',
    theme: 'light',
    notifications: true,
  },
};

// Reducer pour gérer les actions
function dataReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };

    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };

    case 'SET_HOSTS':
      return { ...state, hosts: action.payload };

    case 'ADD_HOST':
      return { ...state, hosts: [...state.hosts, action.payload] };

    case 'UPDATE_HOST':
      return {
        ...state,
        hosts: state.hosts.map((host) => (host.nom === action.payload.nom ? action.payload : host)),
      };

    case 'DELETE_HOST':
      return {
        ...state,
        hosts: state.hosts.filter((host) => host.nom !== action.payload),
      };

    case 'SET_EVENTS':
      return { ...state, events: action.payload };

    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };

    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };

    case 'ADD_FEEDBACK':
      return { ...state, feedback: [...state.feedback, action.payload] };

    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'SET_ACCOMMODATIONS':
      return { ...state, accommodations: action.payload };

    case 'ADD_ACCOMMODATION':
      return { ...state, accommodations: [...state.accommodations, action.payload] };

    case 'UPDATE_DASHBOARD_CONFIG':
      return {
        ...state,
        dashboardConfig: { ...state.dashboardConfig, ...action.payload },
      };

    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };

    default:
      return state;
  }
}

// Interface du contexte
interface DataContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Actions便捷
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions pour les dépenses
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  // Actions pour les hôtes
  setHosts: (hosts: Host[]) => void;
  addHost: (host: Host) => void;
  updateHost: (host: Host) => void;
  deleteHost: (id: string) => void;

  // Actions pour les événements
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;

  // Actions pour le feedback
  setFeedback: (feedback: Feedback[]) => void;
  addFeedback: (feedback: Feedback) => void;

  // Actions pour les messages
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;

  // Actions pour les hébergements
  setAccommodations: (accommodations: Accommodation[]) => void;
  addAccommodation: (accommodation: Accommodation) => void;

  // Actions pour la configuration
  updateDashboardConfig: (config: Partial<AppState['dashboardConfig']>) => void;

  // Action pour charger toutes les données
  loadData: (data: Partial<AppState>) => void;
}

// Création du contexte
const DataContext = createContext<DataContextType | undefined>(undefined);

// Props du provider
interface DataProviderProps {
  children: ReactNode;
}

// Provider component
export function DataProvider({ children }: DataProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Actions便捷
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Actions pour les dépenses
  const setExpenses = (expenses: Expense[]) => {
    dispatch({ type: 'SET_EXPENSES', payload: expenses });
  };

  const addExpense = (expense: Expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  // Actions pour les hôtes
  const setHosts = (hosts: Host[]) => {
    dispatch({ type: 'SET_HOSTS', payload: hosts });
  };

  const addHost = (host: Host) => {
    dispatch({ type: 'ADD_HOST', payload: host });
  };

  const updateHost = (host: Host) => {
    dispatch({ type: 'UPDATE_HOST', payload: host });
  };

  const deleteHost = (id: string) => {
    dispatch({ type: 'DELETE_HOST', payload: id });
  };

  // Actions pour les événements
  const setEvents = (events: Event[]) => {
    dispatch({ type: 'SET_EVENTS', payload: events });
  };

  const addEvent = (event: Event) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  };

  const updateEvent = (event: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  };

  // Actions pour le feedback
  const setFeedback = (feedback: Feedback[]) => {
    dispatch({ type: 'SET_FEEDBACK', payload: feedback });
  };

  const addFeedback = (feedback: Feedback) => {
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
  };

  // Actions pour les messages
  const setMessages = (messages: Message[]) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  };

  const addMessage = (message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  // Actions pour les hébergements
  const setAccommodations = (accommodations: Accommodation[]) => {
    dispatch({ type: 'SET_ACCOMMODATIONS', payload: accommodations });
  };

  const addAccommodation = (accommodation: Accommodation) => {
    dispatch({ type: 'ADD_ACCOMMODATION', payload: accommodation });
  };

  // Actions pour la configuration
  const updateDashboardConfig = (config: Partial<AppState['dashboardConfig']>) => {
    dispatch({ type: 'UPDATE_DASHBOARD_CONFIG', payload: config });
  };

  // Action pour charger toutes les données
  const loadData = (data: Partial<AppState>) => {
    dispatch({ type: 'LOAD_DATA', payload: data });
  };

  // Valeur du contexte
  const contextValue: DataContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    setHosts,
    addHost,
    updateHost,
    deleteHost,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    setFeedback,
    addFeedback,
    setMessages,
    addMessage,
    setAccommodations,
    addAccommodation,
    updateDashboardConfig,
    loadData,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}

// Hook pour utiliser le contexte
export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Hook spécialisé pour les dépenses
export function useExpenses() {
  const { state, addExpense, updateExpense, deleteExpense, setExpenses } = useData();
  return {
    expenses: state.expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    setExpenses,
    isLoading: state.isLoading,
    error: state.error,
  };
}

// Hook spécialisé pour les hôtes
export function useHosts() {
  const { state, addHost, updateHost, deleteHost, setHosts } = useData();
  return {
    hosts: state.hosts,
    addHost,
    updateHost,
    deleteHost,
    setHosts,
    isLoading: state.isLoading,
    error: state.error,
  };
}

// Hook spécialisé pour les événements
export function useEvents() {
  const { state, addEvent, updateEvent, deleteEvent, setEvents } = useData();
  return {
    events: state.events,
    addEvent,
    updateEvent,
    deleteEvent,
    setEvents,
    isLoading: state.isLoading,
    error: state.error,
  };
}

// Hook spécialisé pour le feedback
export function useFeedback() {
  const { state, addFeedback, setFeedback } = useData();
  return {
    feedback: state.feedback,
    addFeedback,
    setFeedback,
    isLoading: state.isLoading,
    error: state.error,
  };
}

// Hook spécialisé pour les messages
export function useMessages() {
  const { state, addMessage, setMessages } = useData();
  return {
    messages: state.messages,
    addMessage,
    setMessages,
    isLoading: state.isLoading,
    error: state.error,
  };
}

// Hook spécialisé pour les hébergements
export function useAccommodations() {
  const { state, addAccommodation, setAccommodations } = useData();
  return {
    accommodations: state.accommodations,
    addAccommodation,
    setAccommodations,
    isLoading: state.isLoading,
    error: state.error,
  };
}
