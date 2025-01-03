'use client';
import { Button } from '@/components/ui/Button';
import { useCampaignStore } from '@/store/campaign.store';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CampaignsPage() {
    const router = useRouter();
    const { campaigns, loading, fetchCampaigns, deleteCampaign } = useCampaignStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchCampaigns();
    }, [fetchCampaigns]);

    // Prevent hydration mismatch by not rendering until client-side
    if (!mounted) {
        return null;
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            try {
                await deleteCampaign(id);
                toast.success('Campaign deleted successfully');
            } catch {
                toast.error('Failed to delete campaign');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
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
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
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
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {campaigns?.map(campaign => (
                                        <tr key={campaign._id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{campaign.name}</td>
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
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {campaign.createdAt ? format(new Date(campaign.createdAt), 'MMM d, yyyy') : '-'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Button variant="secondary" size="sm" onClick={() => router.push(`/dashboard/campaigns/${campaign._id}`)}>
                                                    Edit
                                                </Button>
                                                <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDelete(campaign._id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
