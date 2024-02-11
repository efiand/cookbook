export default defineEventHandler(async (event) => {
	deleteCookie(event, 'authToken');
	sendRedirect(event, '/', StatusCodes.MOVED_TEMPORARILY);
});
