export default async () => await prisma.structures.findMany({
	orderBy: [
		{ sortOrder: 'asc' },
		{ title: 'asc' },
	],
	select: {
		id: true,
		parentId: true,
		title: true,
	},
});
