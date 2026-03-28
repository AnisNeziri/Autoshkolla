import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { createAdminService } from '../services/adminService';

export function useAdminService() {
  const { token } = useAuth();
  return useMemo(() => createAdminService({ getToken: () => token }), [token]);
}
