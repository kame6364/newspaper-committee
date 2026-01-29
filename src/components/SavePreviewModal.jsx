import BlockEditor from './BlockEditor';

export default function SavePreviewModal({ currentBlocks, newBlocks, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>変更内容の確認</h2>
                    <p>保存する前に、変更前と変更後のプレビューを確認してください。</p>
                </div>

                <div className="preview-container">
                    <div className="preview-pane">
                        <h3>変更前 (現在のサイト)</h3>
                        <div className="preview-wrapper">
                            <BlockEditor blocks={currentBlocks} isEditable={false} />
                        </div>
                    </div>
                    <div className="preview-pane">
                        <h3>変更後 (プレビュー)</h3>
                        <div className="preview-wrapper">
                            <BlockEditor blocks={newBlocks} isEditable={false} />
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onCancel} className="btn-cancel">キャンセル</button>
                    <button onClick={onConfirm} className="btn-confirm">変更を保存する</button>
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: #fff;
                    width: 90vw;
                    height: 90vh;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                }
                .modal-header h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
                .preview-container {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                    background: #f5f5f5;
                }
                .preview-pane {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #ddd;
                }
                .preview-pane:last-child { border-right: none; }
                .preview-pane h3 {
                    padding: 1rem;
                    background: #fff;
                    border-bottom: 1px solid #eee;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #666;
                    text-align: center;
                }
                .preview-wrapper {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                    background: #fff;
                }
                .modal-actions {
                    padding: 1.5rem;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                .btn-cancel {
                    padding: 0.8rem 1.5rem;
                    background: #eee;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .btn-confirm {
                    padding: 0.8rem 1.5rem;
                    background: var(--color-accent);
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
