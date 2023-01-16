import { 
  Entity, PrimaryGeneratedColumn, Column, 
  ManyToOne, JoinColumn 
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
  
  @ManyToOne(() => Feed)
  @JoinColumn()
  feed: Feed
}

