import { create } from 'zustand';
import { apiClient } from '@/lib/axios';

export interface Campaign {
    _id: string;
    name: string;
    type: 'email' | 'sms';
    content: string;
    recipients: string[];
    status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'failed';
    scheduledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface CampaignState {
    campaigns: Campaign[];
    selectedCampaign: Campaign | null;
    loading: boolean;
    fetchCampaigns: () => Promise<void>;
    createCampaign: (campaign: Partial<Campaign>) => Promise<void>;
    updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<void>;
    deleteCampaign: (id: string) => Promise<void>;
    setSelectedCampaign: (campaign: Campaign | null) => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
    campaigns: [],
    selectedCampaign: null,
    loading: false,
    fetchCampaigns: async () => {
        try {
            set({ loading: true });
            const response = await apiClient.get('/campaigns');
            set({ campaigns: response.data.data, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    createCampaign: async campaign => {
        try {
            const response = await apiClient.post('/campaigns', campaign);
            set({ campaigns: [...get().campaigns, response.data.data] });
        } catch (error) {
            throw error;
        }
    },
    updateCampaign: async (id, campaign) => {
        try {
            const response = await apiClient.put(`/campaigns/${id}`, campaign);
            set({
                campaigns: get().campaigns.map(c => (c._id === id ? response.data.data : c)),
            });
        } catch (error) {
            throw error;
        }
    },
    deleteCampaign: async id => {
        try {
            await apiClient.delete(`/campaigns/${id}`);
            set({
                campaigns: get().campaigns.filter(c => c._id !== id),
            });
        } catch (error) {
            throw error;
        }
    },
    setSelectedCampaign: campaign => set({ selectedCampaign: campaign }),
}));
