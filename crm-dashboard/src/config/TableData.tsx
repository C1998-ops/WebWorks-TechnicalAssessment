import React from 'react';
import { TableColumn } from '../components/TableComponent/types';
import { FaTrashAlt } from 'react-icons/fa';
interface TableData {
	key: string;
	header: string;
	filter?: {
		type: string;
		options?: [string];
	};
	render?: (value: any, row: any, index: any) => React.ReactNode;
	lastUsed?: string;
}
interface UserRowData {
	id: string;
	name: string;
	type: string;
	lastUsed: string;
	actions?: React.ReactNode;
}
// Define the handleDelete function
const handleDelete = (id: string) => {
	console.log(`Delete user with ID: ${id}`);
};

export const userTableColumns: TableColumn<UserRowData>[] = [
	{
		key: 'index',
		header: '#',
		render: (_, __, index) => index + 1,
	},
	{ key: 'name', header: 'User Name', sortable: true },
	{
		key: 'type',
		header: 'User Type',
		filter: { type: 'select', options: ['Case Manager', 'Patient'] },
	},
	{ key: 'id', header: 'User ID' },
	{ key: 'lastUsed', header: 'Last Used' },
	{
		key: 'actions',
		header: '',
		render: (value, row, index) => (
			<div className="flex items-center space-x-2">
				<button
					type="button"
					className="text-secondary-gold rounded-full p-2 hover:bg-secondary-gold/50 hover:text-white"
					onClick={() => handleDelete(row.id)}
				>
					<FaTrashAlt />
				</button>
			</div>
		),
	},
];
export const userTempdata: UserRowData[] = Array.from({ length: 50 }, (_, index) => ({
	name: `User ${index + 1}`,
	id: `${1000 + index}`,
	type: index % 2 === 0 ? 'Case Manager' : 'Patient',
	lastUsed: `2023-10-${String((index % 30) + 1).padStart(2, '0')}`,
}));
