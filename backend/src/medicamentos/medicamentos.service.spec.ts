import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Medicamento } from './entities/medicamento.entity';
import { MedicamentosService } from './medicamentos.service';

describe('MedicamentosService', () => {
  let service: MedicamentosService;
  const medicamentosRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const categoriasRepo = { existsBy: jest.fn() };

  const dto = {
    nombre: 'Ibuprofeno 400',
    descripcion: 'Antiinflamatorio',
    precio: 1250.5,
    stock: 30,
    laboratorio: 'Bago',
    fechaVencimiento: '2027-03-15',
    categoriaId: 3,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        MedicamentosService,
        { provide: getRepositoryToken(Medicamento), useValue: medicamentosRepo },
        { provide: getRepositoryToken(Categoria), useValue: categoriasRepo },
      ],
    }).compile();
    service = module.get(MedicamentosService);
  });

  it('crea un medicamento si la categoría existe', async () => {
    categoriasRepo.existsBy.mockResolvedValue(true);
    medicamentosRepo.create.mockReturnValue(dto);
    medicamentosRepo.save.mockResolvedValue({ id: 1, ...dto });
    medicamentosRepo.findOne.mockResolvedValue({ id: 1, ...dto });

    const resultado = await service.create(dto);

    expect(resultado.id).toBe(1);
    expect(medicamentosRepo.save).toHaveBeenCalled();
  });

  it('rechaza con 404 una categoría inexistente', async () => {
    categoriasRepo.existsBy.mockResolvedValue(false);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(medicamentosRepo.save).not.toHaveBeenCalled();
  });

  it('findOne lanza 404 si el medicamento no existe', async () => {
    medicamentosRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
  });

  it('remove elimina el medicamento existente', async () => {
    const medicamento = { id: 1, ...dto };
    medicamentosRepo.findOneBy.mockResolvedValue(medicamento);

    await service.remove(1);

    expect(medicamentosRepo.remove).toHaveBeenCalledWith(medicamento);
  });
});
