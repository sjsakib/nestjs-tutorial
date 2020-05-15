import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../tasks-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: string) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }
    return value;
  }

  private isStatusValid(value: any) {
    return this.allowedStatus.indexOf(value) !== -1;
  }
}
