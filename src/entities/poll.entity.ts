import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from '@entities/user.entity';

@Entity({name: "polls"})
export class PollEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  poll_id!: string;

  @ManyToOne(() => UserEntity, user => user.user_id)
  owner!: UserEntity;

  @ManyToMany(() => UserEntity, user => user.user_id)
  @JoinColumn()
  votes!: UserEntity[];

  @Column({length: 50})
  title!: string;

  @Column()
  description!: string;

  @Column("json")
  options!: {id: string, value: string}[];

  @Column({default: 0})
  total_votes!: number;

  @Column({default: false})
  anonymous_poll?: boolean;

  @Column({default: false})
  public_poll?: boolean;

  @Column({default: false})
  public_result?: boolean;

  @Column({default: false})
  user_registred?: boolean;

  @Column()
  duration!: number;

  @CreateDateColumn()
  created_at!: Timestamp;

  @UpdateDateColumn()
  updated_at?: Timestamp;

  @DeleteDateColumn()
  deleted_at?: Timestamp;
}

export class PollRelationshipEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  poll_relation_id!: string;

  @ManyToOne(() => UserEntity, user => user.user_id)
  user!: string;

  @ManyToOne(() => PollEntity, poll => poll.poll_id)
  poll!: string;

  @Column()
  option!: string;

  @CreateDateColumn()
  created_at!: Timestamp;
}