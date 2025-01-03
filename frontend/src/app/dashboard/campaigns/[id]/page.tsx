'use client';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useCampaignStore } from '@/store/campaign.store';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CampaignForm {
    name: string;
    type: 'email' | 'sms';
    content: string;
    recipients: string;
    scheduledAt?: Date | string;
}

export default function CampaignFormPage() {
    const params = useParams();
    const router = useRouter();
    const { campaigns, createCampaign, updateCampaign } = useCampaignStore();
    const campaign = campaigns.find(c => c._id === params.id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CampaignForm>({
        defaultValues: campaign
            ? {
                  ...campaign,
                  recipients: campaign.recipients.join(','),
                  scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : undefined,
              }
            : undefined,
    });

    useEffect(() => {
        if (campaign) {
            reset({
                ...campaign,
                recipients: campaign.recipients.join(','),
                scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : undefined,
            });
        }
    }, [campaign, reset]);

    const onSubmit = async (data: CampaignForm) => {
        try {
            const formattedData = {
                ...data,
                recipients: data.recipients.split(',').map(r => r.trim()),
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
            };

            if (campaign) {
                await updateCampaign(campaign._id, formattedData);
                toast.success('Campaign updated successfully');
            } else {
                await createCampaign(formattedData);
                toast.success('Campaign created successfully');
            }

            router.push('/dashboard/campaigns');
        } catch {
            toast.error(campaign ? 'Failed to update campaign' : 'Failed to create campaign');
        }
    };

    return (
        <div>
            <div className="md:grid md:grid-cols-3 lg:grid-cols-1 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{campaign ? 'Edit Campaign' : 'Create Campaign'}</h3>
                        <p className="mt-1 text-sm text-gray-600">Fill in the details for your campaign. You can save it as a draft or schedule it for later.</p>
                    </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="shadow sm:overflow-hidden sm:rounded-md">
                            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                                <InputField
                                    label="Campaign Name"
                                    placeholder="Enter campaign name"
                                    {...register('name', { required: 'Name is required' })}
                                    error={errors.name?.message}
                                />

                                <InputField
                                    label="Campaign Type"
                                    type="select"
                                    placeholder="Select Campaign Type"
                                    {...register('type', { required: 'Type is required' })}
                                    error={errors.type?.message}
                                    options={[
                                        { label: 'Email', value: 'email' },
                                        { label: 'SMS', value: 'sms' },
                                    ]}
                                />

                                <InputField
                                    label="Content"
                                    type="textarea"
                                    placeholder="Enter campaign content"
                                    {...register('content', { required: 'Content is required' })}
                                    error={errors.content?.message}
                                    rows={4}
                                />

                                <InputField
                                    label="Recipients (comma-separated)"
                                    placeholder="Enter recipients"
                                    {...register('recipients', { required: 'Recipients are required' })}
                                    error={errors.recipients?.message}
                                />

                                <InputField label="Schedule (optional)" type="datetime-local" {...register('scheduledAt')} />
                            </div>
                            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                <Button type="button" variant="secondary" className="mr-3" onClick={() => router.push('/dashboard/campaigns')}>
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={isSubmitting}>
                                    {campaign ? 'Update Campaign' : 'Create Campaign'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
