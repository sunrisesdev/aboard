type CreateResponseOptions = {
  statusCode?: number;
  body?: Object | string | number | any;
  statusText?: string;
};

const createResponse = ({
  statusCode = 200,
  statusText,
  body,
}: CreateResponseOptions) => {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    statusText: statusText,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default createResponse;
