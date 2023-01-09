import { 
  Entity, PrimaryGeneratedColumn, Column, 
  OneToOne, JoinColumn 
} from "typeorm";
import { Feed } from "./Feed"

@Entity()
export class FeedHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: number;

  @Column()
  value: number;
  
  @OneToOne(() => Feed)
  @JoinColumn()
  feed: Feed
}

