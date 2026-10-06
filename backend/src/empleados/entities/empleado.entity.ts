import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 20, unique: true })
  dni: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 30 })
  telefono: string;

  @Column({ length: 100 })
  cargo: string;

  @Column({ type: 'date' })
  fechaIngreso: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}