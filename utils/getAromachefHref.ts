export default (aromachefId?: null | number) => {
	if (aromachefId) {
		return `https://aromachef.ru/recipe/${aromachefId}`;
	}

	return '';
};
