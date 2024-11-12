import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateUserDTO } from "@user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post("register")
    async register(@Body() createUserDTO: CreateUserDTO) {
        return this.authService.register(createUserDTO)
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO)
    }


    @Get("/")
    async getProfile() {

    }

    async updateProfile() {

    }

}