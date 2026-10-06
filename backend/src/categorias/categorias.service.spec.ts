import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';

describe('CategoriasService', () => {
  let service: CategoriasService;
  const repo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: getRepositoryToken(Categoria), useValue: repo },
      ],
    }).compile();
    service = module.get(CategoriasService);
  });

  it('crea una categoría si el nombre está libre', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.create.mockReturnValue({ nombre: 'Analgésicos' });
    repo.save.mockResolvedValue({ id: 1, nombre: 'Analgésicos' });

    const resultado = await service.create({ nombre: 'Analgésicos' });

    expect(resultado.id).toBe(1);
    expect(repo.save).toHaveBeenCalled();
  });

  it('rechaza con 409 un nombre repetido', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, nombre: 'Analgésicos' });

    await expect(service.create({ nombre: 'Analgésicos' })).rejects.toThrow(
      ConflictException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('findOne lanza 404 si el id no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
  });

  it('remove elimina la categoría existente', async () => {
    const categoria = { id: 1, nombre: 'Analgésicos' };
    repo.findOneBy.mockResolvedValue(categoria);

    await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(categoria);
  });
});