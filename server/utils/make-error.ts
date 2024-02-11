import { StatusCodes } from 'http-status-codes';

export default (
	error: Error | ValidationError,
	statusCode: StatusCode = StatusCodes.BAD_REQUEST,
) => {
	let message = '';

	if ((error as ValidationError).errors) {
		message = ensureArray((error as ValidationError).errors).join(' ');
	} else if (error.message) {
		message = error.message;
	}

	return createError({
		message,
		statusCode,
	});
};
