import React from 'react';
import {
	FaAt,
	FaLinkedinIn,
	FaArrowPointer,
	FaImage,
	FaUser,
	FaBuilding,
	FaCalendar,
	FaTrash,
	FaHashtag,
	FaCalculator,
} from 'react-icons/fa6';
import { BiMenuAltLeft } from 'react-icons/bi';
import { HiLocationMarker } from 'react-icons/hi';
import { MdOutlinePhoneIphone } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';

export const getIconByType = (type: string, props?: any) => {
	switch (type) {
		case 'email':
			return <FaAt />;
		case 'address':
			return <HiLocationMarker />;
		case 'phone':
			return <MdOutlinePhoneIphone />;
		case 'linkedin':
			return <FaLinkedinIn />;
		case 'work_linkedin_url':
			return <FaLinkedinIn />;
		case 'website':
			return <FaArrowPointer />;
		case 'image':
			return <FaImage />;
		case 'edit':
			return <RiEditFill {...props} />;
		case 'name':
			return <FaUser />;
		case 'organization_name':
			return <FaBuilding />;
		case 'date':
			return <FaCalendar />;
		case 'delete':
			return <FaTrash {...props} />;
		case 'ein':
			return <FaHashtag />;
		case 'npi':
			return <FaCalculator />;
		default:
			return <BiMenuAltLeft />;
	}
};

export interface ContactItemProps {
	type: string | undefined;
	content: React.ReactNode | undefined | string;
    iconPath?: React.ReactNode | React.ElementType;
	label?: string;
	className?: string;
	displayLabel?: string; // For custom display labels like "EIN"
	displaySuffix?: string; // For suffixes like "(ein):"
}

export const ContactItem: React.FC<ContactItemProps> = ({
	type,
	content,
	iconPath,
	label,
	className = '',
	displayLabel,
	displaySuffix,
}) => {
	const isImageWithContent =
		type === 'image' && content && typeof content === 'string' && content !== '-';

	const renderIcon = () => {
		if (iconPath) {
			// If iconPath is a React element, return it directly
			if (React.isValidElement(iconPath)) {
				return iconPath;
			}
			// If iconPath is a component constructor, create an element with proper props
			if (typeof iconPath === 'function') {
				return React.createElement(iconPath as React.ElementType);
			}
			return null;
		} else if (iconPath === '') {
			return null;
		} else {
			return getIconByType(type || '');
		}
	};

	const iconElement = renderIcon();

	return (
		<div
			className={`flex space-x-4 sm:space-x-6 justify-center flex-shrink-0 items-start mb-4 sm:mb-5 md:mb-6`}
		>
			<div
				className="text-secondary-purple rounded-full p-1 sm:p-1.5 md:p-2 flex-shrink-0 place-items-start"
				style={{
					maxWidth: '18px',
					maxHeight: '18px',
					minWidth: '14px',
					minHeight: '14px',
					width: 'clamp(14px, 3vw, 18px)',
					height: 'clamp(14px, 3vw, 18px)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '4px',
				}}
			>
				{iconElement ? (
					<div className="text-xs sm:text-sm md:text-base bg-neutral-200 rounded-full p-2">
						{iconElement}
					</div>
				) : (
					<div style={{ width: '16px', height: '16px' }} />
				)}
			</div>
			<div className="flex flex-col text-gray-600 text-sm sm:text-base flex-grow whitespace-pre-line justify-center">
				{displayLabel && (
					<span className="font-normal text-sm sm:text-base text-neutral-dark-grey mb-1">
						{displayLabel}
					</span>
				)}

				{label && !displayLabel && (
					<span className="font-normal text-primary-navy mb-1">{label}</span>
				)}

				{isImageWithContent ? (
					<a href={content} target="_blank" rel="noopener noreferrer">
						<img
							src={content}
							alt={label || 'Uploaded image'}
							className="w-48 h-auto rounded-md border mt-1"
						/>
					</a>
				) : (
					<span className={`break-all text-justify ${className}`}>
						{displaySuffix && <span className="text-gray-500">{displaySuffix}</span>}
						{content}
					</span>
				)}
			</div>
		</div>
	);
};
