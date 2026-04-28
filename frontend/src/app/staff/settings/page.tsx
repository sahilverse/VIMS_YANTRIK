"use client";
import React, { useState } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';

export default function StaffSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900">Settings</h1>
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-2">Manage your account and preferences</p>
      </div>

      <div className="border-b border-zinc-100 pb-2">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 border-b-2 text-sm uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'profile'
                ? 'border-zinc-950 font-black text-zinc-950'
                : 'border-transparent font-bold text-zinc-400 hover:text-zinc-600'
              }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 border-b-2 text-sm uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'security'
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
  );
}
