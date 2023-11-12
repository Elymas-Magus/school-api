import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "professors"})
export class Professor {
    @PrimaryGeneratedColumn({type: "bigint", unsigned:true})
    id: number;

    @Column({ length: 100 })
    name: string;

	@Column({ length: 15 })
    sex: string;

    @Column({length:100, unique: true})
    email: string;

    @Column({ length: 100 })
    photoPath: string;

    @Column({ length: 1000 })
    description: string;

    @Column({ length: 100 })
    facomPageUrl: string;
}

