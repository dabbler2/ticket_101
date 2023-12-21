import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Role} from '../types/userRole.type'

@Index('email', ['email'], {unique: true})
@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 70, unique: true, nullable: false})
    email: string

    @Column({type: 'varchar', length: 20, nullable: false})
    nickname: string

    @Column({type: 'varchar', select: false, nullable: false})
    hashPW: string

    @Column({type: 'enum', enum: Role, default: Role.User})
    role: Role
}
