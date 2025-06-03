import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  money: number;

  @Column({ default: 0 })
  totalDonations: number;

  @Column()
  status: string;

  @Column()
  paymentLinkId: string;

  @Column()
  amount: number;

  @Column({ default: 0 })
  donationCount: number;

  @Column({ type: 'bigint' })
  orderCode: number;

  @Column({ nullable: true })
  reference: number;

  @Column({ type: 'timestamp', nullable: true })
  transactionDateTime: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt;
}
