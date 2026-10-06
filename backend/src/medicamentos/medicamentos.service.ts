import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { Medicamento } from './entities/medicamento.entity';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly medicamentosRepository: Repository<Medicamento>,
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateMedicamentoDto): Promise<Medicamento> {
    await this.verificarCategoria(dto.categoriaId);
    const medicamento = this.medicamentosRepository.create(dto);
    const guardado = await this.medicamentosRepository.save(medicamento);
    return this.findOne(guardado.id);
  }

  findAll(): Promise<Medicamento[]> {
    return this.medicamentosRepository.find({
      relations: { categoria: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Medicamento> {
    const medicamento = await this.medicamentosRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });
    if (!medicamento) {
      throw new NotFoundException(`No existe el medicamento con id ${id}`);
    }
    return medicamento;
  }

  async update(id: number, dto: UpdateMedicamentoDto): Promise<Medicamento> {
    const medicamento = await this.buscar(id);
    if (dto.categoriaId !== undefined) {
      await this.verificarCategoria(dto.categoriaId);
    }
    Object.assign(medicamento, dto);
    await this.medicamentosRepository.save(medicamento);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const medicamento = await this.buscar(id);
    await this.medicamentosRepository.remove(medicamento);
  }

  private async buscar(id: number): Promise<Medicamento> {
    const medicamento = await this.medicamentosRepository.findOneBy({ id });
    if (!medicamento) {
      throw new NotFoundException(`No existe el medicamento con id ${id}`);
    }
    return medicamento;
  }

  private async verificarCategoria(categoriaId: number): Promise<void> {
    const existe = await this.categoriasRepository.existsBy({
      id: categoriaId,
    });
    if (!existe) {
      throw new NotFoundException(
        `No existe la categoría con id ${categoriaId}`,
      );
    }
  }
}