import { Exclude } from "class-transformer";
import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Exclude()
    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "text", nullable: true })
    image: string;

}