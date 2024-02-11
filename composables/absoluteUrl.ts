export const useAbsoluteUrl = () => {
	const {
		host, protocol,
	} = useRequestURL();

	return function (path: string = '/') {
		return `${protocol}//${host}${path}`;
	};
};
