import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Subscriptions } from './entities/subscriptions.entity';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscripitonService: SubscriptionsService) {}

  @Role('USER' || 'ADMIN')
  @UseGuards(RolesGuard)
  @Get(':id')
  async getSubscription(@Param('id') id: number): Promise<Subscriptions> {
    return await this.subscripitonService.getSubscriptionById(id);
  }

  @Role('ADMIN')
  @UseGuards(RolesGuard)
  @Get('all')
  async getAllSubscriptions(): Promise<Subscriptions[]> {
    return await this.subscripitonService.getAllSubscription();
  }
}
