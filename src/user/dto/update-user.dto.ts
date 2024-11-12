import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./create-user.dto";
import { IsOptional, IsString, Matches } from "class-validator";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {

    @IsOptional()
    @IsString()
    @Matches(/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/, {
        message: "Image URL must be a valid URL"
    })
    image?: string;
}