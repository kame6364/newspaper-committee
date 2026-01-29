import { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';

export default function ReportProblem() {
    usePageTitle('問題報告');
    const [formData, setFormData] = useState({
        name: '',
        type: 'bug',
        description: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: Date.now(),
                    date: new Date().toLocaleDateString('ja-JP'),
                    status: 'open'
                })
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit report', error);
            alert('送信に失敗しました。');
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{ paddingTop: '100px', minHeight: '60vh', textAlign: 'center' }}>
                <h2>報告ありがとうございます</h2>
                <p>頂いた内容は確認の上、順次対応いたします。</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="submit-btn"
                    style={{ marginTop: '2rem' }}
                >
                    戻る
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', minHeight: '80vh', maxWidth: '600px' }}>
            <h1 className="section-title">問題報告フォーム</h1>
            <p className="description">
                サイトのご利用ありがとうございます。バグやコンテンツの誤り、その他お気づきの点がございましたら、
                以下のフォームよりお知らせください。
            </p>

            <form onSubmit={handleSubmit} className="report-form">
                <div className="form-group">
                    <label>お名前 (任意)</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="山田 太郎"
                    />
                </div>

                <div className="form-group">
                    <label>報告の種類</label>
                    <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="bug">バグ・不具合</option>
                        <option value="content">記事・コンテンツの誤り</option>
                        <option value="feature">機能リクエスト</option>
                        <option value="other">その他</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>詳細</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        rows="6"
                        required
                        placeholder="不具合の内容や、どのような状況で発生したかなどを詳しくご記入ください。"
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn">送信する</button>
            </form>

            <style>{`
                .description { margin-bottom: 2rem; color: #666; line-height: 1.6; }
                .report-form { background: #f9f9f9; padding: 2rem; border-radius: 8px; border: 1px solid #eee; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;
                }
                .submit-btn {
                    background: #000; color: #fff; border: none; padding: 1rem 2rem;
                    border-radius: 4px; cursor: pointer; font-size: 1rem; width: 100%;
                }
                .submit-btn:hover { background: #333; }
            `}</style>
        </div>
    );
}
