import {Column, Entity, Index, ManyToOne, JoinColumn,  PrimaryGeneratedColumn} from 'typeorm'

import {Concert} from './concert.entity'

@Entity({name: 'schedules'})
export class Schedule{
	@PrimaryGeneratedColumn()
    id: number
	
	@ManyToOne(() => Concert, concert => concert.schedules, {onDelete:'CASCADE'})
	@JoinColumn({name:'concert_id'})
	concert: Concert
	
	@Column('int')
	concertId: number
	
	@Column('datetime')
	startAt: Date
	
	@Column('datetime')
	endAt: Date
	
	@Column('int')
	vacancy: number
}