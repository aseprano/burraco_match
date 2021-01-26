import { ApiResponse, Logger, MicroserviceApiError, RouteHandler } from '@darkbyte/herr';
import { Request } from "express";

export abstract class BaseAction implements RouteHandler {

    constructor(
        private readonly logger: Logger
    ) {
        logger.setPrefix('Action');
    }

    private ensureRequestContainsAllRequiredParameters(request: Request) {
        this.logger.debug(() => `Ensuring that the request contains all the required parameters`);
        
        const requiredParameters = this.requiredParameters();
        this.logger.debug(() => `Required parameters: ${JSON.stringify(requiredParameters)}`);
        this.logger.debug(() => `Request body is: ${JSON.stringify(request.body)}`);

        const notFoundParameters = requiredParameters
            .map((paramName: string) => {
                return {
                    paramName,
                    found: request.body[paramName] !== undefined
                }
            }).filter((param) => !param.found);

        if (notFoundParameters.length) {
            this.logger.debug(() => `Params not found: ${JSON.stringify(notFoundParameters.map(p => p.paramName))}`);
            throw new MicroserviceApiError(400, 1001, `Missing required parameter: ${notFoundParameters[0].paramName}`);
        }
    }
    
    protected requiredParameters(): string[] {
        return [];
    }

    protected getLogger(): Logger {
        return this.logger;
    }

    public async handleRequest(request: Request): Promise<ApiResponse> {
        this.ensureRequestContainsAllRequiredParameters(request);
        return this.serveRequest(request);
    }

    public abstract serveRequest(request: Request): Promise<ApiResponse>;

}