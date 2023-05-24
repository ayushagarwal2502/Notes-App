import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('notes')
export class Notes{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true})
    note: string;
    
    notes:Notes;
}