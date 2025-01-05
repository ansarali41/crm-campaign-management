'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampaignStore } from '@/store/campaign.store';
import { format } from 'date-fns';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CampaignViewPage() {
    const router = useRouter();
    const params = useParams();
    const { selectedCampaign, loading, fetchCampaign } = useCampaignStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (params.id) {
            fetchCampaign(params.id as string).catch(() => {
                toast.error('Failed to fetch campaign details');
                router.push('/dashboard/campaigns');
            });
        }
    }, [fetchCampaign, params.id, router]);

    if (!mounted || loading || !selectedCampaign) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Campaign Details</h1>
                    <p className="mt-2 text-sm text-gray-700">Detailed information about the campaign and its performance.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
                    <Button variant="secondary" onClick={() => router.push(`/dashboard/campaigns/${selectedCampaign._id}`)}>
                        Edit Campaign
                    </Button>
                    <Button onClick={() => router.push('/dashboard/campaigns')}>Back to Campaigns</Button>
                </div>
            </div>

            <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedCampaign.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Campaign details and information.</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <span
                                    className={clsx('inline-flex rounded-full px-2 text-xs font-semibold leading-5', {
                                        'bg-yellow-100 text-yellow-800': selectedCampaign.status === 'draft',
                                        'bg-blue-100 text-blue-800': selectedCampaign.status === 'scheduled',
                                        'bg-green-100 text-green-800': selectedCampaign.status === 'completed',
                                        'bg-red-100 text-red-800': selectedCampaign.status === 'failed',
                                        'bg-gray-100 text-gray-800': selectedCampaign.status === 'in_progress',
                                    })}
                                >
                                    {selectedCampaign.status?.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                                </span>
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Subject</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{selectedCampaign.subject}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Campaign Type</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{selectedCampaign.type}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Content</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2" dangerouslySetInnerHTML={{ __html: selectedCampaign.content }} />
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Recipients</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                    {selectedCampaign.recipients.map((recipient, index) => (
                                        <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                            <div className="flex w-0 flex-1 items-center">
                                                <span className="ml-2 w-0 flex-1 truncate">{recipient}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Performance</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Sent</p>
                                        <p className="mt-1 text-sm text-gray-900">{selectedCampaign.sentCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Failed</p>
                                        <p className="mt-1 text-sm text-gray-900">{selectedCampaign.failedCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Opened</p>
                                        <p className="mt-1 text-sm text-gray-900">{selectedCampaign.openCount}</p>
                                    </div>
                                </div>
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Created By</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                {selectedCampaign.createdBy.name} ({selectedCampaign.createdBy.email})
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Dates</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium">Created: </span>
                                        {format(new Date(selectedCampaign.createdAt), 'PPpp')}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated: </span>
                                        {format(new Date(selectedCampaign.updatedAt), 'PPpp')}
                                    </div>
                                    {selectedCampaign.scheduledAt && (
                                        <div>
                                            <span className="font-medium">Scheduled: </span>
                                            {format(new Date(selectedCampaign.scheduledAt), 'PPpp')}
                                        </div>
                                    )}
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
