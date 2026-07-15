export type UserRole =
	| 'admin'
	| 'care_manager'
	| 'supplier'
	| 'local_resource'
	| 'super_admin'
	| 'user'
	| 'provider';
export type subscriptionPlan = 'free' | 'paid';

export interface User {
	id?: number;
	email?: string;
	username?: string;
	role?: UserRole;
	type?: UserRole;
	pwd?: string;
	subscription?: subscriptionPlan;
	hasPaid?: boolean;
	isAuthenticated?: boolean;
}

export interface RootState {
	auth: {
		isAuthenticated: boolean;
		user: User | null;
	};
}
