interface LoadingProps {
	formData?: Record<string, any> | null;
	isLoading: boolean;
	message?: string;
	overlay?: boolean;
	size?: 'small' | 'medium' | 'large';
	className?: string;
	modal?: boolean; // New prop for modal-specific styling
}

const SandwychLoading = ({ 
	formData, 
	isLoading = false, 
	message = 'Loading...', 
	overlay = false,
	size = 'medium',
	className = '',
	modal = false
}: LoadingProps) => {
	// For compatibility with existing usage
	if (formData !== undefined && (!formData || isLoading)) {
		return (
			<div className="flex flex-col-reverse h-screen items-center justify-center">
				<span className="text-lg text-gray-500">{message}</span>
				<span className="rounded-full animate-spin border-4 border-t-4 border-primary-navy h-8 w-8"></span>
			</div>
		);
	}

	// For new loading states
	if (isLoading) {
		const sizeClasses = {
			small: 'h-4 w-4 border-2',
			medium: 'h-8 w-8 border-4',
			large: 'h-12 w-12 border-4'
		};

		const textSizeClasses = {
			small: 'text-sm',
			medium: 'text-lg',
			large: 'text-xl'
		};

		const loadingContent = (
			<div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
				<span className={`rounded-full animate-spin border-t-4 border-primary-navy ${sizeClasses[size]}`}></span>
				<span className={`text-gray-500 ${textSizeClasses[size]}`}>{message}</span>
			</div>
		);

		if (overlay) {
			const overlayClasses = modal 
				? "absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"
				: "absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50";
			
			const contentClasses = modal
				? "p-4"
				: "bg-white p-6 rounded-lg shadow-lg";
			
			return (
				<div className={overlayClasses}>
					<div className={contentClasses}>
						{loadingContent}
					</div>
				</div>
			);
		}

		return (
			<div className="flex items-center justify-center p-4">
				{loadingContent}
			</div>
		);
	}

	return null;
};

export default SandwychLoading;
