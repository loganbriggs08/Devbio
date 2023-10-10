import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class DeveloperBio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    profile_picture: string;

    @Column()
    is_hireable: boolean;

    @Column('json')
    languages_spoken: string[];

    @Column('text')
    description: string;

    @Column('json')
    coding_languages: string[];

    @Column()
    is_premium: boolean;

    @Column()
    is_staff: boolean;

    @Column()
    staff_rank: number;

    @Column('json')
    badges: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}