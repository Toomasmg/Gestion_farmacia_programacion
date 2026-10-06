import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    await this.verificarNombreLibre(dto.nombre);
    const categoria = this.categoriasRepository.create(dto);
    return this.categoriasRepository.save(categoria);
  }

  findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`No existe la categoría con id ${id}`);
    }
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);
    if (dto.nombre && dto.nombre !== categoria.nombre) {
      await this.verificarNombreLibre(dto.nombre);
    }
    Object.assign(categoria, dto);
    return this.categoriasRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriasRepository.remove(categoria);
  }

  private async verificarNombreLibre(nombre: string): Promise<void> {
    const existente = await this.categoriasRepository.findOneBy({ nombre });
    if (existente) {
      throw new ConflictException(
        `Ya existe una categoría con el nombre "${nombre}"`,
      );
    }
  }
}