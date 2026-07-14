import React, { useCallback, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { useToast } from '@/hooks/useToast';
import { TOAST_TYPES } from '@/constants/toast';

interface ToastProps {
	id: string;
	message: string;
	type?: string;
}

const TOAST_COLORS = {
	[TOAST_TYPES.SUCCESS]: 'bg-white',
	[TOAST_TYPES.ERROR]: 'bg-white',
	[TOAST_TYPES.INFO]: 'bg-white',
	[TOAST_TYPES.WARNING]: 'bg-white',
};

const TOAST_ICONS = {
	[TOAST_TYPES.SUCCESS]: <FaCheckCircle className="w-6 h-6 text-secondary-green-500" />,
	[TOAST_TYPES.ERROR]: <FaTimesCircle className="w-6 h-6 text-secondary-orange-200" />,
	[TOAST_TYPES.INFO]: <FaInfoCircle className="w-6 h-6 text-blue-500" />,
	[TOAST_TYPES.WARNING]: <FaExclamationCircle className="w-6 h-6 text-yellow-500" />,
};

const Toast: React.FC<ToastProps> = ({ id, message, type = TOAST_TYPES.SUCCESS }) => {
	const { removeToast } = useToast();
	const handleRemove = useCallback(() => removeToast(id), [id, removeToast]);

	useEffect(() => {
		const timer = setTimeout(() => {
			handleRemove();
		}, 10000);

		return () => clearTimeout(timer);
	}, [handleRemove]);

	return (
		<div
			className={`
        ${TOAST_COLORS[type]} p-4 rounded-xl shadow-lg 
        flex items-center justify-between min-w-[300px] pointer-events-auto
        transform transition-all duration-300 ease-in-out
        animate-[slideIn_0.3s_ease-out,fadeIn_0.3s_ease-out]
        hover:translate-x-[-8px] hover:scale-[1.02]
      `}
			role="alert"
		>
			<div className="flex items-center gap-3">
				{TOAST_ICONS[type]}
				<span className="text-sm font-medium text-gray-700">{message}</span>
			</div>
		</div>
	);
};

export default React.memo(Toast);
