import {Column, Entity, Index, ManyToOne, JoinColumn,  PrimaryGeneratedColumn} from 'typeorm'

import {Concert} from './concert.entity'

@Entity({name: 'schedules'})
export class Schedule{
	@PrimaryGeneratedColumn()
    id: number
	
	@ManyToOne(() => Concert, concert => concert.schedules, {onDelete:'CASCADE'})
	@JoinColumn({name:'concertId'})
	concert: Concert
	
	@Column('int')
	concertId: number
	
	@Column({type: 'datetime', nullable: false})
	startAt: Date
	
	@Column({type: 'datetime', nullable: false})
	endAt: Date
}