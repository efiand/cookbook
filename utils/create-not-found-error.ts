export default (message: string) => createError({
	message,
	statusCode: constants.StatusCodes.NOT_FOUND,
});
