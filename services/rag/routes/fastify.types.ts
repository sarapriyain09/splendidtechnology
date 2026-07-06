export type FastifyRequestLike<TBody = unknown, TParams = Record<string, string>> = {
  body: TBody;
  params: TParams;
};

export type FastifyReplyLike = {
  statusCode?: number;
  code(statusCode: number): FastifyReplyLike;
  send(payload: unknown): unknown;
};

export type FastifyRouteHandlerLike<TBody = unknown, TParams = Record<string, string>> = (
  request: FastifyRequestLike<TBody, TParams>,
  reply: FastifyReplyLike
) => Promise<unknown>;

export type FastifyInstanceLike = {
  post(path: string, handler: FastifyRouteHandlerLike): void;
  put(path: string, handler: FastifyRouteHandlerLike): void;
  delete(path: string, handler: FastifyRouteHandlerLike): void;
};
