import { apiClient } from '@/lib/axios';
import { create } from 'zustand';

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
    deliveredCount: number;
}

interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CampaignAnalytics {
    total_campaigns: number;
    total_emails_sent: number;
    total_sms_sent: number;
    total_delivered: number;
}

interface CampaignState {
    campaigns: Campaign[];
    selectedCampaign: Campaign | null;
    metadata: PaginationMetadata;
    loading: boolean;
    error: string | null;
    analytics: CampaignAnalytics | null;
    fetchCampaigns: (page?: number, limit?: number, createdBy?: string) => Promise<void>;
    fetchCampaign: (id: string) => Promise<void>;
    createCampaign: (campaign: Partial<Campaign>) => Promise<void>;
    updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<void>;
    deleteCampaign: (id: string) => Promise<void>;
    getCampaignAnalytics: () => Promise<void>;
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
    error: null,
    analytics: null,

    fetchCampaigns: async (page = 1, limit = 10, createdBy?: string) => {
        try {
            set({ loading: true });
            const response = await apiClient.get('/campaigns', {
                params: { page, limit, ...(createdBy && { createdBy }) },
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
                error: null,
            });
        } catch (error) {
            set({ loading: false, campaigns: [], metadata: defaultMetadata, error: error instanceof Error ? error.message : 'Failed to fetch campaigns' });
            throw error;
        }
    },

    fetchCampaign: async (id: string) => {
        try {
            set({ loading: true });
            const response = await apiClient.get(`/campaigns/${id}`);
            set({ selectedCampaign: response.data.data, loading: false, error: null });
        } catch (error) {
            set({ loading: false, selectedCampaign: null, error: error instanceof Error ? error.message : 'Failed to fetch campaign' });
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

    getCampaignAnalytics: async () => {
        try {
            set({ loading: true, error: null });
            const endpoint = '/campaigns/analytics/overview';
            const response = await apiClient.get<{ data: CampaignAnalytics }>(endpoint);

            // Transform the data if it's the overview endpoint
            const analyticsData = response.data.data;

            set({
                loading: false,
                analytics: analyticsData,
                error: null,
            });
        } catch (error) {
            set({
                loading: false,
                analytics: null,
                error: error instanceof Error ? error.message : 'Failed to fetch campaign analytics',
            });
            console.error('Error fetching campaign analytics:', error);
        }
    },
}));
