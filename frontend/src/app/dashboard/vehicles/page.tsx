'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useMyVehiclesQuery, useDeleteVehicleMutation } from '@/hooks/api/useVehicleApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Car,
  Search,
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  History
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from '@/hooks/useDebounce';
import AddVehicleModal from '@/components/dashboard/AddVehicleModal';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';

export default function MyVehiclesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const pageSize = 6;

  const { data, isLoading, isError } = useMyVehiclesQuery({
    pageNumber: page,
    pageSize: pageSize,
    search: debouncedSearch
  });

  const deleteMutation = useDeleteVehicleMutation();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-50/30 pb-20">
          <div className="p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">My Vehicles</h1>
                <p className="text-zinc-500 font-medium mt-1">Manage your registered vehicles and track maintenance.</p>
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-bold px-8 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Vehicle
              </Button>
            </div>

            <div className="relative group max-w-md">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <Input
                placeholder="Search Plate, VIN, Brand or Model..."
                className="pl-12 h-12 bg-white border-zinc-200 rounded-2xl shadow-sm focus:ring-0 focus:border-zinc-900 transition-all text-sm font-medium"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" strokeWidth={1.5} />
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Vehicles...</p>
              </div>
            ) : isError ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                  <AlertCircle className="h-10 w-10" />
                </div>
                <p className="text-lg font-bold text-zinc-900">Failed to load vehicles</p>
                <p className="text-sm text-zinc-500 max-w-xs">There was an error connecting to the server. Please try again later.</p>
              </div>
            ) : data?.items.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
                <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                  <Car className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No vehicles found</h3>
                <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">Try adjusting your search filters or add a new vehicle to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100">Plate Number</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100">Brand & Model</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100">Year</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100">VIN / Chassis</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {data?.items.map((vehicle) => (
                          <tr key={vehicle.id} className="hover:bg-zinc-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-50 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                                  <Car className="h-4 w-4" />
                                </div>
                                <span className="font-black text-zinc-950 uppercase tracking-tight text-sm">
                                  {vehicle.plateNumber}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="font-bold text-zinc-900">{vehicle.brand} {vehicle.model}</div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs font-bold text-zinc-500">{vehicle.year || '—'}</span>
                            </td>
                            <td className="px-8 py-6">
                              <code className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{vehicle.vin || 'Not provided'}</code>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-100 cursor-pointer">
                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-zinc-100 shadow-xl shadow-black/5">
                                  <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer focus:bg-zinc-50">
                                    <History className="mr-3 h-4 w-4 text-zinc-400" /> Service History
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer focus:bg-zinc-50">
                                    <Edit2 className="mr-3 h-4 w-4 text-zinc-400" /> Edit Vehicle
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                                    onClick={() => handleDelete(vehicle.id)}
                                  >
                                    <Trash2 className="mr-3 h-4 w-4" /> Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Premium Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!data.hasPreviousPage}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="h-12 w-12 rounded-2xl border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer disabled:opacity-30"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 px-4">
                      {[...Array(data.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`h-12 w-12 rounded-2xl text-sm font-black transition-all cursor-pointer ${page === i + 1
                            ? 'bg-zinc-950 text-white shadow-xl shadow-black/10'
                            : 'bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-900 hover:text-zinc-900'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!data.hasNextPage}
                      onClick={() => setPage(p => p + 1)}
                      className="h-12 w-12 rounded-2xl border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer disabled:opacity-30"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <AddVehicleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
