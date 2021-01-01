import { ApiResponse, MicroserviceApiError, RouteHandler } from '@darkbyte/herr';
import { Request } from "express";

export abstract class BaseAction implements RouteHandler {

    private ensureRequestContainsAllRequiredParameters(request: Request) {
        const notFoundParameters = this.requiredParameters()
            .map((paramName: string) => {
                return {
                    paramName,
                    found: request.body[paramName] !== undefined
                }
            }).filter((param) => !param.found);

        if (notFoundParameters.length) {
            throw new MicroserviceApiError(400, 1001, `Missing required parameter: ${notFoundParameters[0].paramName}`);
        }
    }
    
    protected requiredParameters(): string[] {
        return [];
    }

    public async handleRequest(request: Request): Promise<ApiResponse> {
        this.ensureRequestContainsAllRequiredParameters(request);
        return this.serveRequest(request);
    }

    public abstract serveRequest(request: Request): Promise<ApiResponse>;

}