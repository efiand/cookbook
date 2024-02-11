export default (value: (number | string)[] | number | string) => {
	return Array.isArray(value) ? value : [value];
};
