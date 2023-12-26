import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Schedule} from './schedule.entity'

@Entity({name: 'concerts'})
export class Concert {
	@PrimaryGeneratedColumn()
    id: number
	
	@Column({type: 'varchar', length: 100,  nullable: false})
    name: string
	
	@Column('text')
	description: string
	
	@Column({type: 'varchar', length: 100,  nullable: false})
	venue: string
	
	@Column({type: 'int', nullable: false, default: 0})
	capacity: number
	
	@Column('varchar')
	thumbnail: string
	
	@Column('varchar')
	category: string
	
	@OneToMany(() => Schedule, schedule => schedule.concert)
	schedules: Schedule[]
}