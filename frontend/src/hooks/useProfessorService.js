import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { createProfessorService } from '../services/professorService';

export function useProfessorService() {
  const { token } = useAuth();
  return useMemo(() => createProfessorService({ getToken: () => token }), [token]);
}

