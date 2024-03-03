import Typograf from 'typograf';

const typograf = new Typograf({
	locale: [
		'ru',
		'en-US',
	],
});

export default (html: string) => typograf.execute(capitalize(html));
