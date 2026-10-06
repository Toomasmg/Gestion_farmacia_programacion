import { Test } from '@nestjs/testing';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';

describe('EmpleadosController', () => {
  let controller: EmpleadosController;
  const service = { findAll: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EmpleadosController],
      providers: [{ provide: EmpleadosService, useValue: service }],
    }).compile();
    controller = module.get(EmpleadosController);
  });

  it('findAll devuelve lo que entrega el servicio', async () => {
    service.findAll.mockResolvedValue([{ id: 1, nombre: 'Ana' }]);

    expect(await controller.findAll()).toHaveLength(1);
  });
});
