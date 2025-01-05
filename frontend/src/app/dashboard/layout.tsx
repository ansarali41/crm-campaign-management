'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout, initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/dashboard" className="flex items-center pr-4 text-2xl font-bold text-blue-600  border-gray-200">
                                CampaignPro
                            </Link>
                            <Link href="/dashboard/campaigns" className="flex items-center px-2 py-2 text-gray-900 hover:text-gray-700">
                                Campaigns
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">{user?.name.charAt(0).toUpperCase()}</div>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <div className="font-medium">{user?.name}</div>
                                            <div className="text-gray-500">{user?.email}</div>
                                        </div>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
}
