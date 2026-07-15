import { useSyncExternalStore } from 'react';
import { getAuthState, subscribeToAuthState } from '../utils/authState';

export const useUserInfo = () => {
	const authState = useSyncExternalStore(subscribeToAuthState, getAuthState, getAuthState);
	const isAdmin = authState.user?.role === 'admin';

	return {
		...authState,
		isAdmin,
	};
};
