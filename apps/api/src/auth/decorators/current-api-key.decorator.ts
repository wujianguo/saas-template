import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const CurrentApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
    return request.apiKey
  }
)
