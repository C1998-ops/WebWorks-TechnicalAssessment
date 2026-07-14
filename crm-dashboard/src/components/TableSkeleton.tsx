interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	showHeader?: boolean;
	className?: string;
}

function TableSkeleton({ rows = 6, columns = 4, showHeader = true, className = '' }: TableSkeletonProps) {
	return (
		<div className={className} role="status" aria-label="Loading table">
			{showHeader && (
				<div className="mb-3 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
					{Array.from({ length: columns }).map((_, index) => (
						<div key={`header-${index}`} className="h-4 animate-pulse rounded bg-neutral-lightBorder" />
					))}
				</div>
			)}
			<div className="space-y-3">
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div
						key={`row-${rowIndex}`}
						className="grid gap-3"
						style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
					>
						{Array.from({ length: columns }).map((_, columnIndex) => (
							<div
								key={`cell-${rowIndex}-${columnIndex}`}
								className="h-5 animate-pulse rounded bg-neutral-lightBorder"
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default TableSkeleton;
