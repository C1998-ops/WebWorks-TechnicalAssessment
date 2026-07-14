import React from 'react';
import { MdArrowRight } from 'react-icons/md';

interface Column {
	key: string;
	header: string;
	render?: (value: any, item: any) => React.ReactNode;
}

interface Props {
	title: string;
	data: any[];
	columns: Column[];
	onViewAll?: () => void;
}

const DashboardTable: React.FC<Props> = ({ title, data, columns }) => {
	return (
		<div className="bg-white rounded-lg shadow-sm p-4">
			<div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
				<div className="flex items-center">
					<span className="subheading-3 font-semibold text-primary-navy">{title}</span>
					<div className="text-primary-navy">
						<MdArrowRight size={25} />
					</div>
				</div>

				<div className="flex space-x-2">
					<span className="cursor-pointer text-primary-navy font-extrabold">&lt;</span>
					<span className="cursor-pointer text-primary-navy font-extrabold">&gt;</span>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="text-xs text-gray-500">
							{columns.map(column => (
								<th key={column.key} className="text-left font-normal pb-2 text-secondary-purple">
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((item, idx) => (
							<tr key={idx} className="border-t border-gray-100">
								{columns.map(column => (
									<td
										key={column.key}
										className={`py-2 ${column.key === 'name' || column.key === 'patient' ? 'text-primary-navy text-body font-semibold' : ''}`}
									>
										{column.render ? column.render(item[column.key], item) : item[column.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DashboardTable;
