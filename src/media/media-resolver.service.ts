import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ResourcesService } from "@app/resources/resources.service";
import { pluralize } from "@app/common/helper/pluralize.helper";

type Services = {
  findOne: (id) => any;
};

@Injectable()
export class MediaResolverService {
  constructor(
    @Inject(forwardRef(() => ResourcesService))
    private readonly resourcesService: ResourcesService
  ) {}

  resolveService(modelName: string): Services {
    const serviceName = pluralize(modelName) + "Service";

    if (!this[serviceName]) {
      return null;
    }

    return this[serviceName];
  }

  async findOne(model_type: string, model_id: string | number) {
    return this.resolveService(model_type)?.findOne(model_id);
  }
}
