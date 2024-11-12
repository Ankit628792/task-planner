import { comparePassword } from "@common/util/crypto.util";
import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "@user/dto/create-user.dto";
import { UserService } from "@user/user.service";
import { LoginDTO } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) { }

    async register(createUserDTO: CreateUserDTO) {
        return this.userService.create(createUserDTO);
    }

    async login(data: LoginDTO) {
        const result = await this.validateUser(data);
        if (!result) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            message: "Logged in successfully"
        }
    }

    async validateUser(data: LoginDTO) {
        const user = await this.userService.findOne({ email: data.email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await comparePassword(data.password, user.password);
        if (!isMatch) {
            return null;
        }
        return user;
    }
}
