'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SkeletonDashboard = () => (
  <div className="flex h-screen w-full bg-background animate-pulse">
    {/* Sidebar Skeleton */}
    <div className="w-60 border-r border-border bg-card p-4 space-y-4">
      <div className="h-6 w-3/4 bg-muted rounded" />
      <div className="space-y-2 pt-8">
        <div className="h-8 w-full bg-muted rounded" />
        <div className="h-8 w-full bg-muted rounded" />
        <div className="h-8 w-full bg-muted rounded" />
      </div>
    </div>
    {/* Content Skeleton */}
    <div className="flex-1 flex flex-col bg-muted/10">
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-8 w-24 bg-muted rounded" />
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-card border border-border rounded" />
          <div className="h-32 bg-card border border-border rounded" />
          <div className="h-32 bg-card border border-border rounded" />
        </div>
        <div className="h-64 bg-card border border-border rounded" />
      </div>
    </div>
  </div>
);

export const AuthGuard = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isLoading, mustChangePassword } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        if (!['/', '/register'].includes(pathname)) {
          router.push('/');
        }
      } else {
        // Enforce Password Change
        if (mustChangePassword && pathname !== '/change-password') {
          router.push('/change-password');
          return;
        }

        // Handle Role-based access
        if (roles && !roles.includes(user.role)) {
          const dashboardMap: Record<string, string> = {
            'Admin': '/admin/dashboard',
            'Staff': '/staff/dashboard',
            'Customer': '/dashboard',
          };
          router.push(dashboardMap[user.role] || '/dashboard');
        }
      }
    }
  }, [user, isLoading, mustChangePassword, router, pathname, roles]);

  if (isLoading) {
    if (pathname.includes('dashboard')) {
      return <SkeletonDashboard />;
    }
    return null;
  }

  if (!user && !['/', '/register'].includes(pathname)) {
    return null;
  }

  return <>{children}</>;
};
