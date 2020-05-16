import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { user, id },
    });
    // console.log(user.id);
    // const query = this.taskRepository.createQueryBuilder('task');
    // query.andWhere('task.id = :id', { id });
    // query.andWhere('task."userId" = :userId', { userId: user.id });
    // const found = await query.getOne();
    if (!found) {
      throw new NotFoundException('Task not found');
    }
    return found;
  }

  createTask(CreateTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(CreateTaskDto, user);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number, user: User) {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
