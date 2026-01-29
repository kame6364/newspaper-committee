import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-wrapper">
          <div className="section-header">
            <span className="section-subtitle">CONTACT</span>
            <h2 className="section-title">お問い合わせ</h2>
          </div>
          <form className="contact-form" onSubmit={async (e) => {
            e.preventDefault();
            if (!name || !email || !message) return alert('全ての項目を入力してください');
            try {
              await fetch('http://localhost:3000/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: Date.now(),
                  name,
                  email,
                  message,
                  date: new Date().toLocaleDateString('ja-JP')
                })
              });
              alert('送信しました');
              setName('');
              setEmail('');
              setMessage('');
            } catch (err) {
              console.error(err);
              alert('送信に失敗しました');
            }
          }}>
            <div className="form-group">
              <label htmlFor="name">お名前</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="山田 太郎" />
            </div>
            <div className="form-group">
              <label htmlFor="email">メールアドレス</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@school.edu" />
            </div>
            <div className="form-group">
              <label htmlFor="message">メッセージ</label>
              <textarea id="message" rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="ご意見・ご感想をお聞かせください"></textarea>
            </div>
            <button type="submit" className="submit-btn">送信する</button>
          </form>
        </div>
      </div>
      <style>{`
        .contact-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        .form-group label {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group textarea {
          padding: 1rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-family: inherit;
          transition: border-color var(--transition-fast);
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-text);
        }
        .submit-btn {
          background-color: var(--color-text);
          color: #fff;
          border: none;
          padding: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity var(--transition-fast);
        }
        .submit-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
}
