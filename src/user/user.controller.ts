import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { ValidIdPipe } from "src/common/pipe/valid-id.pipe";
import { ResponseUserDTO } from "./dto/response-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get("/")
    async getUsers() {
        return this.userService.findAll();

    }

    @Get(":id")
    async getUser(@Param("id", ValidIdPipe) id: string) {
        return this.userService.findById(id);
    }

    @Patch(":id")
    async updateUser(@Param("id", ValidIdPipe) id: string, @Body() body: UpdateUserDTO) {
        return this.userService.update(id, body);
    }

    @Delete(":id")
    async removeUser(@Param("id", ValidIdPipe) id: string) {
        return this.userService.removeUser(id);
    }

}