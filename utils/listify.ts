export default (str = '') => Array.from(new Set(str
	.split('\n')
	.map((item: string) => item.trim())
	.filter(Boolean)));
