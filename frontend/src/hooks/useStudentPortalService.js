import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { createStudentPortalService } from '../services/studentPortalService';

export function useStudentPortalService() {
  const { token } = useAuth();
  return useMemo(() => createStudentPortalService({ getToken: () => token }), [token]);
}
