import { redirect } from 'next/navigation';

export default function DashboardPage() {
    // Redirect to campaigns page by default
    redirect('/dashboard/campaigns');
}
