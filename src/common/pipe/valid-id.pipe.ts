import { BadRequestException, Injectable, ParseUUIDPipe } from "@nestjs/common";

@Injectable()
export class ValidIdPipe extends ParseUUIDPipe {
    constructor() {
        super({
            exceptionFactory: () => new BadRequestException(`The "id" parameter must be a valid uuid`)
        })
    }
}