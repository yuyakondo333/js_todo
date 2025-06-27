import { TaskModel } from "./taskModel.js";
import { TaskView } from "./taskView.js";

export class TaskController {
    constructor() {
        // Model と View のインスタンスを作成
        this.model = new TaskModel();
        this.view = new TaskView();

        // 初期化
        this.init();
    }

    init() {
        // View にイベント処理を設定（コールバック関数を渡す)
        this.view.bindEvents({
            onAdd: () => this.handleAdd(),              // 追加処理
            onToggle: (id) => this.handleToggle(id),    // 完了切り替え処理
            onEdit: (id) => this.handleEdit(id),        // 編集開始処理
            onSave: (id) => this.handleSave(id),        // 保存処理
            onCancel: () => this.handleCancel(),        // キャンセル処理
            onDelete: (id) => this.handleDelete(id)     // 削除処理
        });

        this.render();
    }

    // タスク追加処理
    handleAdd() {
        // Viewから入力値を取得
        const text = this.view.getInputValue();

        // 入力検証
        if (!text) {
            this.view.showAlert('タスクを入力してください');
            return;
        }

        // Modelでデータ追加
        this.model.addTask(text);

        // Viewの入力フィールドをクリア
        this.view.clearInput();

        // 画面を更新
        this.render();
    }

    // タスク完了切り替え処理
    handleToggle(id) {
        // Modelで完了状態を切り替え
        this.model.toggleTask(id);

        // 画面を更新
        this.render();
    }

    // 編集開始処理
    handleEdit(id) {
        // Viewで編集モードを開始
        this.view.startEdit(id);

        // 画面を更新（編集モードで表示）
        this.render();

        // 編集フィールドにフォーカス
        this.view.focusEditInput(id);
    }

    // 編集保存処理
    handleSave(id) {
        
        // Viewから編集中の値を取得
        const newText = this.view.getEditInputValue(id);

        // 入力検証
        if (!newText) {
            this.view.showAlert('タスクを入力してください');
            return;
        }

        // Modelでデータ更新
        this.model.updateTask(id, newText);
        
        // Viewで編集モードを終了
        this.view.endEdit();
        
        // 画面を更新
        this.render();
    }

    // 編集キャンセル処理
    handleCancel() {
        // Viewで編集モードを終了
        this.view.endEdit();

        // 画面を更新
        this.render();
    }

    // タスク削除処理
    handleDelete(id) {
        // Viewで確認ダイアログを表示
        const confirmed = this.view.showConfirm('本当に削除してもよろしいでしょうか？');

        // キャンセルされた場合は何もしない
        if (!confirmed) {
            return;
        }

        // Modelでデータ削除
        this.model.deleteTask(id);
        
        // 画面を更新
        this.render();
    }

    // 画面全体を更新
    render() {
        // Modelから最新データを取得
        const tasks = this.model.getAllTasks();
        const status = this.model.getTaskStatus();

        // Viewで画面を更新
        this.view.renderTasks(tasks);
        this.view.updateStatus(status);
    }
}
