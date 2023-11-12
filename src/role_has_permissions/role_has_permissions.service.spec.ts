import { Test, TestingModule } from '@nestjs/testing';
import { RoleHasPermissionsService } from './role_has_permissions.service';

describe('RoleHasPermissionsService', () => {
  let service: RoleHasPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleHasPermissionsService],
    }).compile();

    service = module.get<RoleHasPermissionsService>(RoleHasPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
