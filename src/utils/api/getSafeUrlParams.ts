type GetSafeURLParamsReturn<
  TRequired extends string,
  TOptional extends string
> = { [R in TRequired]: string } & { [O in TOptional]?: string };

type GetSafeURLParamsOptions<
  TRequired extends string,
  TOptional extends string
> = {
  url: string;
  requiredParams?: TRequired[];
  optionalParams?: TOptional[];
};

/**
 * @warning This function can not used with array params
 */
const getSafeURLParams = <TRequired extends string, TOptional extends string>({
  requiredParams,
  url,
  optionalParams,
}: GetSafeURLParamsOptions<TRequired, TOptional>): GetSafeURLParamsReturn<
  TRequired,
  TOptional
> => {
  const { searchParams } = new URL(url);
  const allParams = Object.fromEntries(searchParams);

  const safeParams = requiredParams?.reduce((acc, param) => {
    if (allParams[param]) {
      acc[param] = allParams[param];
    }
    return acc;
  }, {} as Record<string, string>);

  const safeOptionalParams = optionalParams?.reduce((acc, param) => {
    if (param && param in allParams) {
      acc[param] = allParams[param];
    }

    return acc;
  }, {} as Record<string, string>);

  const missingParams =
    requiredParams?.filter(
      (param) => safeParams && !Object.keys(safeParams).includes(param)
    ) || [];

  if (missingParams.length > 0) {
    throw new Error(`Missing required params: ${missingParams.join(', ')}`);
  }

  return {
    ...safeParams,
    ...safeOptionalParams,
  } as GetSafeURLParamsReturn<TRequired, TOptional>;
};
export default getSafeURLParams;
