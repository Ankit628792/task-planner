import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { hashPassword } from "@common/util/crypto.util";
import { ResponseUserDTO } from "./dto/response-user.dto";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { UpdateUserDTO } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } })
    }

    async findAll() {
        const users = await this.userRepository.find()
        return instanceToPlain(users);
    }

    async findById(id: string): Promise<ResponseUserDTO> | null {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            return null;
        }
        return instanceToPlain(user) as ResponseUserDTO
    }

    async findOne(data: {
        email?: string;
        name?: string;
        id?: string;
    }) {
        return await this.userRepository.findOne({ where: data })
    }

    async create(data: CreateUserDTO) {
        const user = await this.findByEmail(data.email);
        if (user) {
            throw new BadRequestException('Email already exists')
        }
        const hashedPassword = await hashPassword(data.password);
        const newUser = this.userRepository.create({
            ...data,
            password: hashedPassword,
        })
        const savedUser = await this.userRepository.save(newUser)
        return instanceToPlain(savedUser)
    }

    async update(id: string, data: UpdateUserDTO) {
        const user = await this.findById(id)
        if (!user) {
            throw new BadRequestException('User not found')
        }
        let updatedUser = data;
        if (data.password) {
            updatedUser.password = await hashPassword(data.password)
        }
        const savedUser = await this.userRepository.save({ ...user, ...updatedUser })
        return instanceToPlain(savedUser)
    }

    async removeUser(id: string) {
        const user = await this.findById(id)
        if (!user) {
            throw new BadRequestException('User not found')
        }
        const result = await this.userRepository.delete(id)
        if (!result.affected) {
            throw new BadRequestException('Unable to remove user')
        }
        return {
            message: 'User deleted successfully',
            id: user.id
        }
    }
}