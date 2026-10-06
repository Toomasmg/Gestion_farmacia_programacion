import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { EmpleadosService } from './empleados.service';

describe('EmpleadosService', () => {
  let service: EmpleadosService;
  const repo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    existsBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const dto = {
    nombre: 'Ana',
    apellido: 'Perez',
    dni: '30123456',
    email: 'ana@farmacia.com',
    telefono: '2615550000',
    cargo: 'Farmaceutica',
    fechaIngreso: '2024-03-01',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        EmpleadosService,
        { provide: getRepositoryToken(Empleado), useValue: repo },
      ],
    }).compile();
    service = module.get(EmpleadosService);
  });

  it('crea un empleado con DNI y email libres', async () => {
    repo.existsBy.mockResolvedValue(false);
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ id: 1, ...dto });

    const resultado = await service.create(dto);

    expect(resultado.id).toBe(1);
  });

  it('rechaza con 409 un DNI repetido', async () => {
    repo.existsBy.mockResolvedValue(true);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('findOne lanza 404 si el id no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
  });

  it('update no consulta unicidad si no cambian dni ni email', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, ...dto });
    repo.save.mockResolvedValue({ id: 1, ...dto, cargo: 'Encargada' });

    await service.update(1, { cargo: 'Encargada' });

    expect(repo.existsBy).not.toHaveBeenCalled();
  });

  it('remove elimina el empleado existente', async () => {
    const empleado = { id: 1, ...dto };
    repo.findOneBy.mockResolvedValue(empleado);

    await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(empleado);
  });
});
