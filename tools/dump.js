import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const YADISK_API = 'https://cloud-api.yandex.net/v1/disk/resources/upload';
const TAIL = 'overwrite=true&fields=href';
const { YADISK_TOKEN = '' } = process.env;
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

const prisma = new PrismaClient();

dump();

function createDump([
	tableName,
	rows,
]) {
	if (!rows.length) {
		return '';
	}
	const values = rows
		.map(function (row) {
			return Object.values(row).map(stringifyCell)
				.join(', ');
		})
		.join('),\n(');
	const columns = Object.keys(rows[0]).join('`, `');

	return `INSERT INTO \`${tableName}\` (\`${columns}\`) VALUES\n(${values});`;
}

async function dump() {
	const entities = await Promise.all([
		prisma.structures.findMany({ orderBy: { id: 'asc' } }),
		prisma.categories.findMany({ orderBy: { id: 'asc' } }),
		prisma.recipes.findMany({ orderBy: { id: 'asc' } }),
		prisma.images.findMany({ orderBy: { id: 'asc' } }),
		prisma.recipesCategories.findMany({ orderBy: { id: 'asc' } }),
	]);

	const dumpedEntities = entities
		.map(function (entity, i) {
			return createDump([
				SQL_TABLES[i],
				entity,
			]);
		})
		.filter(Boolean);
	const dataJson = entities.reduce(function (acc, entity, i) {
		return {
			...acc,
			[SQL_TABLES[i]]: entity,
		};
	}, {});

	const filename = `dump/${Date.now()}`;

	await Promise.all([
		upload(`${filename}.json`, JSON.stringify(dataJson)),
		upload(
			`${filename}.sql`,
			`${SQL_PREPEND}\n${dumpedEntities.join('\n\n')}`,
		),
	]);
}

function stringifyCell(value) {
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

	return `${value}`;
}

async function upload(filename, payload) {
	const response = await fetch(
		`${YADISK_API}?path=app:/cookbook/${filename}&${TAIL}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } },
	);
	const url = (await response.json()).href.toString();

	return await fetch(url, {
		body: Buffer.from(payload),
		method: 'PUT',
	});
}
