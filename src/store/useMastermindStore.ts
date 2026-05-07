import { create } from 'zustand';

interface MastermindState {
  isListening: boolean;
  revenue: number;
  activeAgents: string[];
  systemStatus: 'Optimal' | 'Healing' | 'Guarded';
  setListening: (val: boolean) => void;
  addAgent: (name: string) => void;
  updateRevenue: (amount: number) => void;
  setSystemStatus: (status: 'Optimal' | 'Healing' | 'Guarded') => void;
}

export const useMastermindStore = create<MastermindState>((set) => ({
  isListening: false,
  revenue: 12450.00,
  activeAgents: ['DevAgent', 'GrowthAgent'],
  systemStatus: 'Optimal',
  setListening: (val) => set({ isListening: val }),
  addAgent: (name) => set((state) => ({ activeAgents: [...state.activeAgents, name] })),
  updateRevenue: (amount) => set((state) => ({ revenue: state.revenue + amount })),
  setSystemStatus: (status) => set({ systemStatus: status }),
}));