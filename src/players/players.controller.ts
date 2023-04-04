import { Controller, Logger } from '@nestjs/common';
import { PlayersService } from './players.service'
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { Player } from './interfaces/player.interface'

const ackErrors: string[] = ['E11000']

@Controller()
export class PlayersController {

  logger = new Logger(PlayersController.name)
  constructor(private readonly playeresService: PlayersService) { }

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      await this.playeresService.create(player)
      await channel.ack(originalMsg)
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }

  @MessagePattern('get-players')
  async getAllPlayers(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      return await this.playeresService.getAll();
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @MessagePattern('get-player-by-id')
  async getPlayerById(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      return await this.playeresService.getById(id);
    } finally {
      await channel.ack(originalMsg)
    }
  }



  @EventPattern('update-player')
  async atualizarPlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      const id: string = data.id
      const player: Player = data.player
      await this.playeresService.update(id, player)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }

  @EventPattern('delete-player')
  async deletarPlayer(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      await this.playeresService.delete(id)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }
}
