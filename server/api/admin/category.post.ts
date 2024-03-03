export default defineEventHandler(async (event) => {
	try {
		const {
			id, title,
		} = await schemas.entity.validate(await readBody(event));
		const data = { title: typografy(title) };

		if (id) {
			return await prisma.categories.update({
				data,
				where: { id },
			});
		}

		return await prisma.categories.create({ data });
	} catch (error) {
		throw makeError(error as Error);
	}
});
