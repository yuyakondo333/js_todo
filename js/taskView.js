export class TaskView {
    constructor() {
        // DOM要素を取得して保存
        this.taskInput = document.getElementById('taskInput');  // taskInput という id を持つ要素を取得
        this.addBtn = document.getElementById('addBtn');    // addBtn という id を持つ要素を取得
        this.taskList = document.getElementById('taskList');    // taskList という id を持つ要素を取得
        this.taskStatus = document.getElementById('taskStatus');    // taskStatus という id を持つ要素を取得

        this.editingId = null;  // 編集状態を管理 （デフォルトは何も編集してないので null）
    }

    // 入力フィールドの値を取得
    getInputValue() {
        return this.taskInput.value.trim();
    }

    // 入力フィールドをクリア
    clearInput() {
        this.taskInput.value = '';
    }

    // 警告メッセージを表示
    showAlert(message) {
        alert(message);
    }

    // 確認ダイアログを表示
    showConfirm(message) {
        return confirm(message);
    }

    // 統計情報を表示
    updateStatus(status) {
        this.taskStatus.innerHTML = `全てのタスク: ${status.total} 完了済み: ${status.completed} 未完了: ${status.incomplete}`;
    }

    // タスク一覧を画面に表示
    renderTasks(tasks) {
        const html = tasks.map(task => {
            // 編集中
            if (this.editingId === task.id) {
                return `
                <li class="task-item editing">
                    <input type="text" value="${task.text}" id="edit-${task.id}" class="edit-input">
                    <button data-action="save" data-task-id="${task.id}" class="save-btn">保存</button>
                    <button data-action="cancel" class="cancel-btn">キャンセル</button>
                </li>
                `;
            // 編集中ではない
            } else {
                const completedClass = task.completed ? 'task-item completed' : 'task-item';
                return `
                <li class="${completedClass}">
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-action="toggle" data-task-id="${task.id}">
                    <span class="task-text">${task.text}</span>
                    <button data-action="edit" data-task-id="${task.id}" class="edit-btn">編集</button>
                    <button data-action="delete" data-task-id="${task.id}" class="delete-btn">削除</button>
                </li>
                `;
            }
        }).join('');

        this.taskList.innerHTML = html;     // 作成したHTMLを画面に表示
    }

    // 編集モードを開始
    startEdit(id) {
        this.editingId = id;
    }

    // 編集モードを終了
    endEdit() {
        this.editingId = null;
    }

    // 編集中の入力値を取得
    getEditInputValue(id) {
        const editInput = document.getElementById(`edit-${id}`);    // 編集用の入力フィールドを取得
        return editInput ? editInput.value.trim() : '';
    }

    // 編集フィールドにフォーカスを当てる
    focusEditInput(id) {
        setTimeout(() => {
            try {
                const editInput = document.getElementById(`edit-${id}`);    // 編集用の入力フィールドを取得
                
                if (editInput) {
                    editInput.focus();      // 入力フィールドにカーソルを移動
                    editInput.select();     // 入力フィールドの文字を全選択
                }
            } catch (error) {
                console.error('フォーカス処理でエラー:', error);    // コンソールでエラーを出す
            }
        }, 10);
    }

    // イベントリスナーを設定
    bindEvents(callbacks) {
        // 追加ボタンのクリック
        this.addBtn.addEventListener('click', callbacks.onAdd);

        // Enterキーでの追加
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                callbacks.onAdd();
            }
        });

        // タスク一覧のクリックイベント（イベント委譲）
        this.taskList.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const taskId = parseInt(e.target.dataset.taskId);
    
            switch (action) {
                case 'toggle':
                    callbacks.onToggle(taskId);
                    break;
                case 'edit':
                    callbacks.onEdit(taskId);
                    break;
                case 'delete':
                    callbacks.onDelete(taskId);
                    break;
                case 'save':
                    callbacks.onSave(taskId);
                    break;
                case 'cancel':
                    callbacks.onCancel();
                    break;
            }
        });
    }
}
