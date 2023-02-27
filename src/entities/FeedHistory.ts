import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from "typeorm";
import { Feed } from "./Feed"

@Entity()
export class FeedHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @Column()
  value: number;

  @ManyToOne(() => Feed)
  @JoinColumn()
  feed: Feed
}

