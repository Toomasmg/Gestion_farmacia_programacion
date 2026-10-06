import { Test } from '@nestjs/testing';
import { MedicamentosController } from './medicamentos.controller';
import { MedicamentosService } from './medicamentos.service';

describe('MedicamentosController', () => {
  let controller: MedicamentosController;
  const service = { findAll: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MedicamentosController],
      providers: [{ provide: MedicamentosService, useValue: service }],
    }).compile();
    controller = module.get(MedicamentosController);
  });

  it('findAll devuelve lo que entrega el servicio', async () => {
    service.findAll.mockResolvedValue([{ id: 1, nombre: 'Ibuprofeno 400' }]);

    expect(await controller.findAll()).toHaveLength(1);
  });
});
