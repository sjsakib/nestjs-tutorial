import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters({ keyword, status }: GetTasksFilterDto): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter(task => {
      let select = true;
      if (keyword) {
        select =
          task.title.includes(keyword) || task.description.includes(keyword);
      }
      if (status) {
        select = select && task.status === status;
      }
      return select;
    });
  }

  getTaskById(id: string): Task {
    return this.tasks.find(t => (t.id = id));
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.tasks.find(t => t.id === id);
    task.status = status;
    return task;
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}
