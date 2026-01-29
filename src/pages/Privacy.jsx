import { Link } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle';

export default function Privacy() {
    usePageTitle('プライバシーポリシー');
    return (
        <div className="container" style={{ paddingTop: '80px', minHeight: '80vh', paddingBottom: '4rem' }}>
            <h1>プライバシーポリシー</h1>
            <div className="content">
                <p>制定日：2024年4月1日</p>
                <p>最終改定日：2024年4月1日</p>

                <section>
                    <h2>1. 基本方針</h2>
                    <p>新聞係（以下、「当団体」といいます。）は、個人情報の重要性を認識し、個人情報を保護することが社会的責務であると考え、個人情報に関する法令及び社内規程等を遵守し、当団体で取扱う個人情報の取得、利用、管理を適正に行います。</p>
                </section>

                <section>
                    <h2>2. 利用目的</h2>
                    <p>当団体が取得した個人情報は、以下の目的で利用いたします。</p>
                    <ul>
                        <li>お問い合わせへの対応</li>
                        <li>サービスの提供・運営</li>
                        <li>ユーザーへの連絡</li>
                    </ul>
                </section>

                <section>
                    <h2>3. 個人情報の第三者提供</h2>
                    <p>当団体は、法令に基づく場合を除き、あらかじめご本人の同意を得ることなく、第三者に個人情報を提供することはありません。</p>
                </section>

                <div style={{ marginTop: '2rem' }}>
                    <Link to="/" style={{ color: '#666', textDecoration: 'underline' }}>&larr; ホームに戻る</Link>
                </div>
            </div>
            <style>{`
        .content section { margin-bottom: 2rem; }
        .content h2 { font-size: 1.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
        .content p { margin-bottom: 1rem; line-height: 1.8; }
        .content ul { margin-left: 1.5rem; list-style-type: disc; margin-bottom: 1rem; }
      `}</style>
        </div>
    );
}
