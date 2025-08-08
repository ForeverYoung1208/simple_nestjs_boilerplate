import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity({ name: 'users' })
export class User {
  @IsString()
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    unique: true,
    generated: 'uuid',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;
}
