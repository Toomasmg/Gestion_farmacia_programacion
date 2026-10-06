
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadosRepository: Repository<Empleado>,
  ) {}

  async create(dto: CreateEmpleadoDto): Promise<Empleado> {
    await this.verificarUnicos(dto.dni, dto.email);
    const empleado = this.empleadosRepository.create(dto);
    return this.empleadosRepository.save(empleado);
  }

  findAll(): Promise<Empleado[]> {
    return this.empleadosRepository.find({
      order: { apellido: 'ASC', nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOneBy({ id });
    if (!empleado) {
      throw new NotFoundException(`No existe el empleado con id ${id}`);
    }
    return empleado;
  }

  async update(id: number, dto: UpdateEmpleadoDto): Promise<Empleado> {
    const empleado = await this.findOne(id);
    await this.verificarUnicos(
      dto.dni !== undefined && dto.dni !== empleado.dni ? dto.dni : undefined,
      dto.email !== undefined && dto.email !== empleado.email
        ? dto.email
        : undefined,
    );
    Object.assign(empleado, dto);
    return this.empleadosRepository.save(empleado);
  }

  async remove(id: number): Promise<void> {
    const empleado = await this.findOne(id);
    await this.empleadosRepository.remove(empleado);
  }

  private async verificarUnicos(dni?: string, email?: string): Promise<void> {
    if (dni && (await this.empleadosRepository.existsBy({ dni }))) {
      throw new ConflictException(`Ya existe un empleado con el DNI ${dni}`);
    }
    if (email && (await this.empleadosRepository.existsBy({ email }))) {
      throw new ConflictException(
        `Ya existe un empleado con el email ${email}`,
      );
    }
  }
}
