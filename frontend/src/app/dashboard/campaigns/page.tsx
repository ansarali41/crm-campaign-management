'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { apiClient } from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { useCampaignStore } from '@/store/campaign.store';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CampaignsPage() {
    const router = useRouter();
    const { campaigns, loading, metadata, fetchCampaigns, deleteCampaign, error, analytics, getCampaignAnalytics } = useCampaignStore();
    const { user } = useAuthStore();

    const [mounted, setMounted] = useState(false);
    const [actionCampaign, setActionCampaign] = useState<string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
    const [runConfirmOpen, setRunConfirmOpen] = useState(false);
    const [campaignToRun, setCampaignToRun] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        if (user?._id) {
            // Only fetch if we have a user
            getCampaignAnalytics();
            fetchCampaigns(1, 10, user._id);
        }
    }, [fetchCampaigns, getCampaignAnalytics, user?._id]);

    // Prevent hydration mismatch by not rendering until client-side
    if (!mounted) {
        return null;
    }

    const handleDeleteClick = (id: string) => {
        setCampaignToDelete(id);
        setDeleteConfirmOpen(true);
        setActionCampaign(null);
    };

    const handleDeleteConfirm = async () => {
        if (campaignToDelete) {
            try {
                await deleteCampaign(campaignToDelete);
                toast.success('Campaign deleted successfully');
            } catch {
                toast.error('Failed to delete campaign');
            } finally {
                setDeleteConfirmOpen(false);
                setCampaignToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setCampaignToDelete(null);
    };

    const handleRunClick = (id: string) => {
        setCampaignToRun(id);
        setRunConfirmOpen(true);
        setActionCampaign(null);
    };

    const handleRunConfirm = async () => {
        if (campaignToRun) {
            try {
                await apiClient.post(`/campaigns/${campaignToRun}/send`);
                toast.success('Campaign started successfully');
                fetchCampaigns(metadata.page, metadata.limit); // Refresh the list
            } catch {
                toast.error('Failed to start campaign');
            } finally {
                setRunConfirmOpen(false);
                setCampaignToRun(null);
            }
        }
    };

    const handleRunCancel = () => {
        setRunConfirmOpen(false);
        setCampaignToRun(null);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= metadata.totalPages) {
            fetchCampaigns(newPage, metadata.limit);
            // Close any open action menu when changing pages
            setActionCampaign(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Total Campaigns</h3>
                        <p className="text-3xl font-bold">{analytics?.total_campaigns?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total number of campaigns</p>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Total Emails</h3>
                        <p className="text-3xl font-bold">{analytics?.total_emails_sent?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total emails sent</p>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Total SMS</h3>
                        <p className="text-3xl font-bold">{analytics?.total_sms_sent?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total SMS sent</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Delivered</h3>
                        <p className="text-3xl font-bold">{analytics?.total_delivered?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Successfully delivered</p>
                    </Card>
                </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>
                        <p className="mt-2 text-sm text-gray-700">A list of all campaigns including their name, type, status, and creation date.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Button type="button" onClick={() => router.push('/dashboard/campaigns/new')}>
                            Add campaign
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col mt-8 px-4 sm:px-6 lg:px-8 ">
                <div className="flex-1 -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle ">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 border md:rounded-lg !h-dvh">
                            <table className="min-w-full h divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Subject
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Created At
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-sm font-semibold text-gray-900 text-end">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {campaigns?.map(campaign => (
                                        <tr key={campaign._id} className={actionCampaign === campaign._id ? 'bg-gray-50' : undefined}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{campaign.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{campaign.subject}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{campaign.type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span
                                                    className={clsx('inline-flex rounded-full px-2 text-xs font-semibold leading-5', {
                                                        'bg-yellow-100 text-yellow-800': campaign.status === 'draft',
                                                        'bg-blue-100 text-blue-800': campaign.status === 'scheduled',
                                                        'bg-green-100 text-green-800': campaign.status === 'completed',
                                                        'bg-red-100 text-red-800': campaign.status === 'failed',
                                                        'bg-gray-100 text-gray-800': campaign.status === 'in_progress',
                                                    })}
                                                >
                                                    {campaign?.status?.charAt(0).toUpperCase() + campaign?.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {campaign.createdAt ? format(new Date(campaign.createdAt), 'MMM d, yyyy') : '-'}
                                            </td>

                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActionCampaign(actionCampaign === campaign._id ? null : campaign._id)}
                                                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <circle cx="12" cy="12" r="1" />
                                                            <circle cx="12" cy="5" r="1" />
                                                            <circle cx="12" cy="19" r="1" />
                                                        </svg>
                                                    </button>
                                                    {/* action menu */}
                                                    {actionCampaign === campaign._id && (
                                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => handleRunClick(campaign._id)}
                                                                    className="group flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-3 text-green-400 group-hover:text-green-500"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M5 4a2 2 0 00-2 2v6a2 2 0 110 4v-6a2 2 0 012-2zM8 4a2 2 0 00-2 2v6a2 2 0 120 4v-6a2 2 0 012-2zM12 4a2 2 0 00-2 2v6a2 2 0 100 4v-6a2 2 0 012-2z" />
                                                                    </svg>
                                                                    Run Campaign
                                                                </button>
                                                            </div>
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => {
                                                                        setActionCampaign(null);
                                                                        router.push(`/dashboard/campaigns/${campaign._id}/view`);
                                                                    }}
                                                                    className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    View Campaign
                                                                </button>
                                                            </div>
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => {
                                                                        setActionCampaign(null);
                                                                        router.push(`/dashboard/campaigns/${campaign._id}`);
                                                                    }}
                                                                    className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                    Edit Campaign
                                                                </button>
                                                            </div>

                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => handleDeleteClick(campaign._id)}
                                                                    className="group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-3 text-red-400 group-hover:text-red-500"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Delete Campaign
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {metadata.totalPages > 1 && (
                    <div className="mt-auto border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(metadata.page - 1)}
                                disabled={metadata.page === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(metadata.page + 1)}
                                disabled={metadata.page === metadata.totalPages}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(metadata.page - 1) * metadata.limit + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(metadata.page * metadata.limit, metadata.total)}</span> of{' '}
                                    <span className="font-medium">{metadata.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(metadata.page - 1)}
                                        disabled={metadata.page === 1}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    {Array.from({ length: metadata.totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={clsx(
                                                'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
                                                {
                                                    'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600':
                                                        page === metadata.page,
                                                    'text-gray-900 hover:bg-gray-50': page !== metadata.page,
                                                },
                                            )}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(metadata.page + 1)}
                                        disabled={metadata.page === metadata.totalPages}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmationDialog
                open={deleteConfirmOpen}
                title="Delete Campaign"
                message="Are you sure you want to delete this campaign? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                variant="danger"
            />
            <ConfirmationDialog
                open={runConfirmOpen}
                title="Run Campaign"
                message="Are you sure you want to run this campaign?"
                confirmLabel="Run"
                cancelLabel="Cancel"
                onConfirm={handleRunConfirm}
                onCancel={handleRunCancel}
                variant="success"
            />
        </div>
    );
}
