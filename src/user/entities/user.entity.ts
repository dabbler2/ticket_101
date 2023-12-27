import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Role} from '../types/userRole.type'
import {Booking} from '../../booking/entities/booking.entity'

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Index({unique: true})
    @Column({type: 'varchar', length: 70, nullable: false})
    email: string

    @Column({type: 'varchar', length: 20, nullable: false})
    nickname: string

    @Column({type: 'varchar', select: false, nullable: false})
    hashPW: string

    @Column({type: 'enum', enum: Role, nullable: false, default: Role.User})
    role: Role

    @Column({type: 'int', nullable: false, default: 0})
    point: number
	
	@OneToMany(() => Booking, Booking => Booking.user)
	Bookings: Booking[]
}
