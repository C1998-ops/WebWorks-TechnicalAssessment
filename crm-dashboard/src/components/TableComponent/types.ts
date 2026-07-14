export interface TableColumn<T = any> {
	key: keyof T | string;
	header: string;
	width?: string;
	render?: (value: any, row: T, index: any, onAction?: (...args: any[]) => void) => React.ReactNode;
	sortable?: boolean;
	filterable?: boolean;
	align?: 'left' | 'center' | 'right';
	className?: string;
	headerClassName?: string;
	filter?: {
		type: 'text' | 'select' | 'date';
		options?: Array<string>;
		placeholder?: string;
	};
	headerRender?: () => React.ReactNode;
}

export interface ExpandableRowConfig<T = any> {
	isExpanded: (row: T) => boolean;
	expandedRowRenderer: (row: T) => React.ReactNode;
	onToggleExpanded: (row: T) => void;
}
