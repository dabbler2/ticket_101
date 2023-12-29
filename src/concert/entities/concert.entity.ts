import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Schedule} from './schedule.entity'

@Entity({name: 'concerts'})
export class Concert {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 100})
    name: string

    @Column('text', {nullable: true})
    description!: string

    @Column({type: 'varchar', length: 100})
    venue: string

    @Column({type: 'int', default: 0})
    capacity: number

    @Column({type: 'int', default: 0})
    price: number

    @Column('varchar', {nullable: true})
    thumbnail!: string

    @Column('varchar', {nullable: true})
    category!: string

    @OneToMany(() => Schedule, schedule => schedule.concert)
    schedules: Schedule[]
}
