import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geist = Geist({
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'CRM Campaign Management',
    description: 'Manage your marketing campaigns efficiently',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={geist.className}>
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
