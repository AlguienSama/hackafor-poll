import { Role } from "@utils/permisions";
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { PollEntity } from "@entities/poll.entity";

@Entity({name: "users"})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string;

  @ManyToMany(() => PollEntity, poll => poll.poll_id)
  votes!: PollEntity[];

  @Column({length: 50, unique: true})
  email!: string;

  @Column({nullable: true})
  username?: string;

  @Column({nullable: true})
  avatar?: string;

  @Column({select: false})
  password!: string;

  @Column({select: false, default: Role.USER})
  role!: Role;

  @Column({nullable: true})
  age?: string;

  @Column({nullable: true})
  gender?: string;

  @CreateDateColumn()
  created_at!: Timestamp;

  @UpdateDateColumn()
  updated_at?: Timestamp;

  token?: string;

  setPassword = async (password: string): Promise<void> => {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR || '12'));
    const hash = bcrypt.hashSync(password, salt);
    this.password = hash;
  }

  comparePassword = async (password: string): Promise<boolean> => {
    return bcrypt.compareSync(password, this.password);
  }

  generateJWT = async (): Promise<void> => {
    const encryption = process.env.JWT_ENCRYPTION;
    const expiresIn = process.env.JWT_EXPIRATION;
    if (!encryption) { throw new Error('Not encryption token') }
    this.token = jwt.sign({user_id: this.user_id, role: this.role}, encryption, { expiresIn });
  }

}