const TITLE_LIMIT = 48;

export default (title?: string) => {
	if (!title) {
		return constants.PROJECT;
	}

	if (title.length > TITLE_LIMIT) {
		const titleMatches = title.match(/^(?<title>.{1,47})\s/u);

		if (titleMatches) {
			title = `${titleMatches[1]}…`;
		}
	}

	return `${constants.PROJECT} > ${title}`;
};
