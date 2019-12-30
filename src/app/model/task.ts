export class Task {
    taskId: number;
	parentTaskId: number;
	projectId: number;
	userIds: number[];
	task: string;
	startDate: Date;
	endDate: Date;
	priority: number;
	isFinished: boolean;
	isParent: boolean;
}