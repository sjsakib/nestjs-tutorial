import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    { status, keyword }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where('task."userId" = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (keyword) {
      query.andWhere(
        'task.title LIKE :keyword OR task.description LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    const tasks = query.getMany();

    return tasks;
  }
  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;

    return task;
  }
}
