import React, { createContext } from 'react';
import { useToast } from '../hooks/useToast';
import { TOAST_POSITIONS } from '@/constants/toast';
import Toast from './Toast';

const positionClasses: Record<string, string> = {
	[TOAST_POSITIONS.TOP_RIGHT]: 'top-6 right-6',
	[TOAST_POSITIONS.TOP_LEFT]: 'top-6 left-6',
	[TOAST_POSITIONS.BOTTOM_RIGHT]: 'bottom-6 right-6',
	[TOAST_POSITIONS.BOTTOM_LEFT]: 'bottom-6 left-6',
	[TOAST_POSITIONS.TOP_CENTER]: 'top-6 left-1/2 -translate-x-1/2',
	[TOAST_POSITIONS.BOTTOM_CENTER]: 'bottom-6 left-1/2 -translate-x-1/2',
};
const ToastContainer: React.FC = React.memo(() => {
	const { toasts, position } = useToast();
	const containerPosition =
		positionClasses[position] || positionClasses[TOAST_POSITIONS.BOTTOM_CENTER];

	return (
		<div
			className={`fixed ${containerPosition} z-[9999] pointer-events-none min-w-[320px] max-w-md`}
		>
			<div
				className={`flex flex-col ${position.includes('bottom') ? 'space-y-reverse space-y-3' : 'space-y-3'}`}
			>
				{toasts.map(toast => (
					<Toast key={toast.id} {...toast} />
				))}
			</div>
		</div>
	);
});

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
