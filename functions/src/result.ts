export type ErrorOr<Data> = IsError | IsSuccess<Data>;

type IsSuccess<Data> = {
  isErr: false;
  data: Data;
};

type IsError = {
  isErr: true;
  err: string;
};

export const succ = <Data>(data: Data): IsSuccess<Data> => ({
  isErr: false,
  data,
});

export const err = (err: string): IsError => ({
  isErr: true,
  err,
});
