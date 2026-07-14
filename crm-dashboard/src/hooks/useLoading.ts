
// Example hook showing how to use the loading context
export const useLoadingExample = () => {

	// Example function that simulates an API call
	const simulateApiCall = async () => {

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Your API logic here
			console.log('API call completed');
		} catch (error) {
			console.error('API call failed:', error);
		}
	};

	return {

		simulateApiCall,
	};
}; 