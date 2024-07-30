import type {
	categories, images, recipes, recipesCategories, structures,
} from '@prisma/client';

type tableRow = categories | images | recipes | recipesCategories | structures;
type tableCell = Buffer | Date | boolean | null | number | string;
interface UrlData {
	href: URL;
}

const { YADISK_TOKEN } = process.env;
const YADISK_API = 'https://cloud-api.yandex.net/v1/disk/resources/upload';
const TAIL = 'overwrite=true&fields=href';
const SQL_PREPEND = `DELETE FROM \`recipesCategories\`;
DELETE FROM \`categories\`;
DELETE FROM \`recipes\`;
UPDATE \`structures\` SET \`parentId\` = null;
DELETE FROM \`structures\`;\n`;
const SQL_TABLES = [
	'structures',
	'categories',
	'recipes',
	'images',
	'recipesCategories',
];

const normalizeValue = (value: tableCell) => {
	if (value === null) {
		return 'null';
	}
	if (typeof value === 'string') {
		// Особенности одинарных кавычек в SQL
		const safeValue = value.trim()
			.replace(/(?<apos>')/gu, '$<apos>$<apos>');

		return `'${safeValue}'`;
	}

	if (value instanceof Date) {
		const data = value.toISOString().replace('T', ' ')
			.slice(0, -1);

		return `'${data}'`;
	}

	if (value instanceof Buffer) {
		return value.toString();
	}

	return value;
};

const createDump = ([
	tableName,
	rows,
]: [
	string, tableRow[],
]) => {
	if (!rows.length) {
		return '';
	}
	const values = rows
		.map((row: tableRow) => Object.values(row).map(normalizeValue)
			.join(', '))
		.join('),\n(');
	const columns = Object.keys(rows[0]).join('`, `');

	return `INSERT INTO \`${tableName}\` (\`${columns}\`) VALUES\n(${values});`;
};

const upload = async (filename: string, payload: string) => {
	const res = await $fetch(
		`${YADISK_API}?path=app:/cookbook/${filename}&${TAIL}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } },
	);
	const { href } = res as UrlData;

	return await $fetch(href.toString(), {
		body: Buffer.from(payload),
		method: 'PUT',
	});
};

export default defineEventHandler(async () => {
	try {
		const entities = await Promise.all([
			prisma.structures.findMany({ orderBy: { id: 'asc' } }),
			prisma.categories.findMany({ orderBy: { id: 'asc' } }),
			prisma.recipes.findMany({ orderBy: { id: 'asc' } }),
			prisma.images.findMany({ orderBy: { id: 'asc' } }),
			prisma.recipesCategories.findMany({ orderBy: { id: 'asc' } }),
		]);

		const dumpedEntities = entities
			.map((entity: tableRow[], i: number) => createDump([
				SQL_TABLES[i],
				entity,
			]))
			.filter((str) => str);
		const dataJson = entities.reduce((acc, entity, i) => ({
			...acc,
			[SQL_TABLES[i]]: entity,
		}), {});

		const filename = `dump/${Date.now()}`;

		await Promise.all([
			upload(`${filename}.json`, JSON.stringify(dataJson)),
			upload(
				`${filename}.sql`,
				`${SQL_PREPEND}\n${dumpedEntities.join('\n\n')}`,
			),
		]);
	} catch (error) {
		throw makeError(error as Error);
	}
});
