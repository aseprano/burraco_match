import { Request } from "express";
import { ApiResponse } from "../tech/api/ApiResponse";
import { MicroserviceApiError } from "./MicroserviceApiError";

export abstract class BaseController {
    private req = {} as Request;

    private ensureRequestContainsAllRequiredParameters() {
        const notFoundParameters = this.requiredParameters()
            .map((paramName: string) => {
                return {
                    paramName,
                    found: this.req.body[paramName] !== undefined
                }
            }).filter((param) => !param.found);

        if (notFoundParameters.length) {
            throw new MicroserviceApiError(400, 1001, `Missing required parameter: ${notFoundParameters[0].paramName}`);
        }
    }

    protected get request(): Request {
        return this.req;
    }
    
    protected requiredParameters(): string[] {
        return [];
    }

    public async run(req: Request): Promise<ApiResponse> {
        this.req = req;
        this.ensureRequestContainsAllRequiredParameters();
        return this.serveRequest();
    }

    public async abstract serveRequest(): Promise<ApiResponse>;

}