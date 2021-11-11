export const sendNotification = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
	// Todo - create decent alert
	alert(`${title}, ${message}`);
};
