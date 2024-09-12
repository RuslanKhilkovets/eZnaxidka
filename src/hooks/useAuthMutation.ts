import {useContext} from 'react';
import {useMutation} from '@tanstack/react-query';

import {AuthContext} from '@/contexts/Auth/AuthContext';

export const useAuthMutation = options => {
  const {logout} = useContext(AuthContext);
  const mutation = useMutation(options);

  if (mutation?.error?.status === 401 || mutation?.error?.status === 403) {
    return logout();
  }

  return mutation;
};

export default useAuthMutation;