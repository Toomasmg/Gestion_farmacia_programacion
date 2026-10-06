import { Test } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

describe('CategoriasController', () => {
  let controller: CategoriasController;
  const service = { findAll: jest.fn(), findOne: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [{ provide: CategoriasService, useValue: service }],
    }).compile();
    controller = module.get(CategoriasController);
  });

  it('findAll devuelve lo que entrega el servicio', async () => {
    service.findAll.mockResolvedValue([{ id: 1, nombre: 'Analgésicos' }]);

    expect(await controller.findAll()).toHaveLength(1);
  });
});