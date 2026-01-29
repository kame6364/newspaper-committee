import { Link } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle';

export default function Terms() {
    usePageTitle('利用規約');
    return (
        <div className="container" style={{ paddingTop: '80px', minHeight: '80vh', paddingBottom: '4rem' }}>
            <h1>利用規約</h1>
            <div className="content">
                <p>制定日：2024年4月1日</p>

                <section>
                    <h2>第1条（適用）</h2>
                    <p>本規約は、ユーザーと新聞係（以下、「当団体」といいます。）との間の、当団体が提供するサービスの利用に関わる一切の関係に適用されるものとします。</p>
                </section>

                <section>
                    <h2>第2条（禁止事項）</h2>
                    <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                    <ul>
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>当団体のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                        <li>当団体のサービスの運営を妨害するおそれのある行為</li>
                        <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                    </ul>
                </section>

                <section>
                    <h2>第3条（免責事項）</h2>
                    <p>当団体は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</p>
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
