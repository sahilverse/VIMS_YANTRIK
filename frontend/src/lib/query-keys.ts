export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    users: () => [...queryKeys.auth.all, 'users'] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    list: (filters: any) => [...queryKeys.inventory.all, 'list', { filters }] as const,
    detail: (id: string) => [...queryKeys.inventory.all, 'detail', id] as const,
  },
  vendors: {
    all: ['vendors'] as const,
    list: (params: any) => [...queryKeys.vendors.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.vendors.all, 'detail', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (params: any) => [...queryKeys.customers.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },
  services: {
    all: ['services'] as const,
    list: (params: any) => [...queryKeys.services.all, 'list', params] as const,
    history: (customerId: string) => [...queryKeys.services.all, 'history', customerId] as const,
  },
};
