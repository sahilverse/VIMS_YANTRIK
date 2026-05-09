'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import ProfileSettings from '@/components/settings/ProfileSettings';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import { Settings } from 'lucide-react';

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />

        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          <header className="h-20 border-b border-zinc-100 flex items-center px-10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <Settings className="h-5 w-5 text-zinc-400" />
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">Settings</h1>
            </div>
          </header>

          <div className="p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border-b border-zinc-100 pb-2">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 border-b-2 text-sm uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'border-zinc-950 font-black text-zinc-950'
                      : 'border-transparent font-bold text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-4 border-b-2 text-sm uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'security'
                      ? 'border-zinc-950 font-black text-zinc-950'
                      : 'border-transparent font-bold text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Security & Password
                </button>
              </nav>
            </div>

            {activeTab === 'profile' ? <ProfileSettings /> : <ChangePasswordForm />}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
