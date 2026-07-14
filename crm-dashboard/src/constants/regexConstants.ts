export const regexHelper = (label: string) => {
	if (!label) return '';
	const regexPattern = {
		LinkedIn: /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
		Facebook: /^https?:\/\/(www\.)?facebook\.com\/.*$/,
		Twitter: /^https?:\/\/(www\.)?twitter\.com\/.*$/,
		Instagram: /^https?:\/\/(www\.)?instagram\.com\/.*$/,
		YouTube: /^https?:\/\/(www\.)?youtube\.com\/.*$/,
		Website: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
		Email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		Phone: /^\(\d{3}\) \d{3}-\d{4}$/,
		ZipCode: /^\d{5}(\d{4})?$/,
		NPI: /^\d{10}$/,
		SSN: /^\d{3}-\d{2}-\d{4}$/,
		EIN: /^\d{2}-\d{7}$/,
		PACID: /^\d{10}$/,
		NumberOnly: /^[0-9.]*$/,
	};
	return regexPattern[label as keyof typeof regexPattern];
};
