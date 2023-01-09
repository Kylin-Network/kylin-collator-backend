import { 
  Entity, PrimaryGeneratedColumn, Column, 
  OneToOne, JoinColumn 
} from "typeorm";
import { Feed } from "./Feed"

@Entity()
export class FeedSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sourceName: string;

  @Column()
  sourceDesc: string;
  
  @OneToOne(() => Feed)
  @JoinColumn()
  feed: Feed
}

