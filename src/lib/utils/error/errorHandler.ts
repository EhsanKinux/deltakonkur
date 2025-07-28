export interface CustomError extends Error {
  response?: {
    status: number;
    data?: unknown;
  };
}

export const parseApiError = (error: unknown): string => {
  if (error instanceof Error) {
    const customError = error as CustomError;

    // Handle HTTP errors
    if (customError.response) {
      if (customError.response.status === 500) {
        return "خطای سرور. لطفا دوباره تلاش کنید";
      }
      if (customError.response.status === 404) {
        return "مورد مورد نظر یافت نشد";
      }
      if (customError.response.status === 403) {
        return "شما مجوز انجام این عملیات را ندارید";
      }
    }

    // Try to parse JSON error messages
    try {
      const errorJson = JSON.parse(error.message);

      // Handle specific field errors
      if (
        errorJson.national_id &&
        errorJson.national_id.includes(
          "user with this national id already exists."
        )
      ) {
        return "این کاربر با این کد ملی در حال حاظر وجود دارد!";
      }

      if (
        errorJson.phone_number &&
        errorJson.phone_number.includes(
          "user with this phone number already exists."
        )
      ) {
        return "این شماره همراه تکراری است";
      }

      // Handle generic message
      if (errorJson.message) {
        return errorJson.message;
      }

      // Handle detail field
      if (errorJson.detail) {
        return errorJson.detail;
      }
    } catch (parseError) {
      // If JSON parsing fails, check for detail in string
      if (error.message.includes("detail")) {
        const detailMatch = error.message.match(/"([^"]+)"/);
        if (detailMatch) {
          return detailMatch[1];
        }
      }
    }

    return error.message;
  }

  return "خطایی رخ داده است";
};

export const handleApiError = (
  error: unknown,
  defaultMessage: string = "خطا در عملیات"
): string => {
  const parsedError = parseApiError(error);
  return parsedError || defaultMessage;
};
