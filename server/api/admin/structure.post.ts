export default defineEventHandler(async (event) => {
	try {
		const {
			id, parentId, title,
		} = await schemas.structure.validate(await readBody(event));
		const data = {
			parentId,
			title: capitalize(title),
		};

		if (id) {
			return await prisma.structures.update({
				data,
				where: { id },
			});
		}

		const structure = await prisma.structures.create({ data });
		const structures = await getStructures();

		return {
			id: structure.id,
			structures,
		};
	} catch (error) {
		throw makeError(error as Error);
	}
});
