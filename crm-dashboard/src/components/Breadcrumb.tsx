import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';

interface BreadcrumbProps {
	items?: { label: string; path: string }[];
	className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
	const location = useLocation();

	const pathItems =
		items ||
		location.pathname
			.split('/')
			.filter(segment => segment)
			.map((segment, index, segments) => {
				const path = `/${segments.slice(0, index + 1).join('/')}`;
				return {
					label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
					path,
				};
			});

	return (
		<nav className={`flex items-center text-sm ${className}`}>
			{pathItems.map((item, index) => (
				<React.Fragment key={item.path}>
					{index > 0 && <IoChevronForward className="mx-2 text-neutral-grey" />}
					{index === pathItems.length - 1 ? (
						<Link to={item.path} className="text-neutral-textGrey hover:text-primary-navy">
							{item.label}
						</Link>
					) : (
						<span className="text-neutral-dark">{item.label}</span>
					)}
				</React.Fragment>
			))}
		</nav>
	);
};

export default Breadcrumb;
