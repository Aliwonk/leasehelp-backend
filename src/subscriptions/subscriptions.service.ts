import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscripiton.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscriptions } from './entities/subscriptions.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionsRepository: Repository<Subscriptions>,
  ) {}

  async createSubscription(data: CreateSubscriptionDto) {
    const subscripiton = await this.subscriptionsRepository.save(data);
    return await this.getSubscriptionById(subscripiton.id);
  }

  async updateSubscription(id: number, data: UpdateSubscriptionDto) {
    const subscripiton = await this.subscriptionsRepository.save({
      id,
      ...data,
    });
    return this.getSubscriptionById(id);
  }

  async getSubscriptionById(id: number): Promise<Subscriptions> {
    const subscripiton = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    return subscripiton;
  }

  async getAllSubscription(): Promise<Subscriptions[]> {
    const subscriptions = await this.subscriptionsRepository.find({
      relations: { user: true },
    });
    return subscriptions;
  }
}
