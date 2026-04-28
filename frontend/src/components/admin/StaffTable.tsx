'use client';

import { UserDto } from '@/types';
import { Edit3, ToggleLeft, ToggleRight, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface StaffTableProps {
  staff: UserDto[];
  isLoading: boolean;
  onEdit: (user: UserDto) => void;
  onToggleStatus: (id: string) => void;
  togglePendingId?: string | null;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-20" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-32" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-40" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-16" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-16" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-20" /></td>
    </tr>
  );
}

export default function StaffTable({ staff, isLoading, onEdit, onToggleStatus, togglePendingId }: StaffTableProps) {
  const { user: currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (!staff || staff.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
          <MoreHorizontal className="h-8 w-8 text-zinc-200" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-bold text-zinc-400">No staff members found.</p>
        <p className="text-xs text-zinc-300 mt-1">Try adjusting your search or add a new team member.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Code</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Role</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr
              key={member.id}
              className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors"
            >
              <td className="px-6 py-5">
                <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg">
                  {member.code || '—'}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm font-bold text-zinc-900">{member.fullName}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-zinc-500">{member.email}</span>
              </td>
              <td className="px-6 py-5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${member.role === 'Admin'
                    ? 'bg-violet-50 text-violet-600'
                    : 'bg-sky-50 text-sky-600'
                  }`}>
                  {member.role}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${member.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-zinc-500">{member.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(member.id)}
                    disabled={togglePendingId === member.id}
                    className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    title={member.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {togglePendingId === member.id ? (
                      <ToggleLeft className="h-4 w-4 animate-pulse" />
                    ) : member.isActive ? (
                      <ToggleRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
