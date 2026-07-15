import Select, { components } from 'react-select';
import { IoMdArrowDropdown } from 'react-icons/io'; // Or use any icon component

const CustomDropdownIndicator = (props: any) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoMdArrowDropdown className="w-4 h-4 text-neutral-grey" />
		</components.DropdownIndicator>
	);
};
export default CustomDropdownIndicator;
