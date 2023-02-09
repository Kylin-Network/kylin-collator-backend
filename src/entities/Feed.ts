import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  feedName: string;

  @Column()
  feedDesc: string;

}

