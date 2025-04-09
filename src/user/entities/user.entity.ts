import { Profile } from './profile.entity';
import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
     this.password = await bcrypt.hash(this.password, 10);
    }
    
    @OneToOne(() => Profile,
    {cascade:true,
        // eager:true,
    })
    @JoinColumn()
    profile?: Profile
}
