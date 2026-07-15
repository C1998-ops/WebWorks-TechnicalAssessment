import React from 'react';

interface CustomDateInputProps {
	id: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
	id,
	name,
	value,
	onChange,
	onBlur,
	placeholder = 'Renewal Date',
	disabled = false,
	className = '',
}) => {
	// Get today's date in YYYY-MM-DD format for the min attribute
	const today = new Date().toISOString().split('T')[0];

	return (
		<div className={`relative ${className}`}>
			<div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="text-gray-400"
				>
					<rect
						x="3"
						y="4"
						width="18"
						height="18"
						rx="2"
						stroke="currentColor"
						strokeWidth="1.5"
						fill="none"
					/>
					<path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
					<path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					<path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</svg>
			</div>
			<input
				type="date"
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				disabled={disabled}
				min={today}
				className={`
          form-input-1
          w-full h-10 pl-12 pr-3 
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}
        `}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default CustomDateInput;
