export type SuccessResponse<T = any> = {
  data: T;
  hasErrors: false;
};

export type ErrorResponse = {
  errors: Error[];
  hasErrors: true;
};

export type Error = {
  message: string;
  property: string;
};
