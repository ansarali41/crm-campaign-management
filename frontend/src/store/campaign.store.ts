import { create } from 'zustand';
import { apiClient } from '@/lib/axios';

export interface Campaign {
    _id: string;
    name: string;
    subject: string;
    type: 'email' | 'sms';
    content: string;
    recipients: string[];
    status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'failed';
    scheduledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    sentCount: number;
    failedCount: number;
    openCount: number;
}

interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface CampaignState {
    campaigns: Campaign[];
    selectedCampaign: Campaign | null;
    metadata: PaginationMetadata;
    loading: boolean;
    fetchCampaigns: (page?: number, limit?: number) => Promise<void>;
    fetchCampaign: (id: string) => Promise<void>;
    createCampaign: (campaign: Partial<Campaign>) => Promise<void>;
    updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<void>;
    deleteCampaign: (id: string) => Promise<void>;
}

const defaultMetadata: PaginationMetadata = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
    campaigns: [],
    selectedCampaign: null,
    metadata: defaultMetadata,
    loading: false,

    fetchCampaigns: async (page = 1, limit = 10) => {
        try {
            set({ loading: true });
            const response = await apiClient.get('/campaigns', {
                params: { page, limit },
            });

            // Ensure we have valid numbers for metadata
            const metadata: PaginationMetadata = {
                total: Math.max(0, Number(response.data.metadata.total) || 0),
                page: Math.max(1, Number(response.data.metadata.page) || 1),
                limit: Math.max(1, Number(response.data.metadata.limit) || 10),
                totalPages: Math.max(1, Number(response.data.metadata.totalPages) || 1),
            };

            set({
                campaigns: response.data.data || [],
                metadata,
                loading: false,
            });
        } catch (error) {
            set({ loading: false, campaigns: [], metadata: defaultMetadata });
            throw error;
        }
    },

    fetchCampaign: async (id: string) => {
        try {
            set({ loading: true });
            const response = await apiClient.get(`/campaigns/${id}`);
            set({ selectedCampaign: response.data.data, loading: false });
        } catch (error) {
            set({ loading: false, selectedCampaign: null });
            throw error;
        }
    },

    createCampaign: async campaign => {
        try {
            set({ loading: true });
            await apiClient.post('/campaigns', campaign);
            await get().fetchCampaigns(1, get().metadata.limit); // Go to first page after creating
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    updateCampaign: async (id, campaign) => {
        try {
            set({ loading: true });
            await apiClient.put(`/campaigns/${id}`, campaign);
            await get().fetchCampaigns(get().metadata.page, get().metadata.limit);
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    deleteCampaign: async id => {
        try {
            set({ loading: true });
            await apiClient.delete(`/campaigns/${id}`);

            const { metadata, campaigns } = get();
            const isLastItemOnPage = campaigns.length === 1;
            const isLastPage = metadata.page === metadata.totalPages;
            const hasMorePages = metadata.page > 1;

            // Calculate the appropriate page to show after deletion
            let nextPage = metadata.page;
            if (isLastItemOnPage && hasMorePages && !isLastPage) {
                nextPage = metadata.page - 1;
            }

            await get().fetchCampaigns(nextPage, metadata.limit);
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
}));
