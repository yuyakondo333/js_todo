export class TaskModel {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    // タスク追加
    addTask(text) {
        const newTask = {
            id: this.nextId++,
            text: text.trim(),
            completed: false
        };
        this.tasks.push(newTask);
        return newTask;
    }

    // 全タスク取得
    getAllTasks() {
        return [...this.tasks];
    }

    // タスク削除
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks;
    }

    // タスク完了切り替え
    toggleTask(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };     // completed の値を反転
            }
            return task;
        });
        return this.tasks;
    }

    // タスクを更新
    updateTask(id, newText) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        });
        return this.tasks;
    }

    // 統計情報を取得
    getTaskStatus() {
        const total = this.tasks.length;    // 全タスク数を取得
        const completed = this.tasks.filter(task => task.completed).length;     // 完了済みのタスクの数を取得
        const incomplete = total - completed;   // 未完了タスクの数を取得
        return { total, completed, incomplete };
    }

    // IDでタスクを検索
    findTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }
}
