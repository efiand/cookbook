type value = number | string;
type key = 'id' | 'title';
type Data = Entity | Recipe;

export const sortBy = (key: key, dir: -1 | 1 = 1) => (a: Data, b: Data) => {
	const valueA: value = a[key];
	const valueB: value = b[key];

	if (valueA > valueB) {
		return dir;
	}
	if (valueA < valueB) {
		return -dir;
	}

	return 0;
};

export const sortByTitle = sortBy('title');
