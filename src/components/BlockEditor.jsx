import { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function BlockEditor({ blocks, onChange, isEditable }) {
    const { settings } = useSettings();
    // blocks: Array of { id, type: 'text'|'image', value: string, font?: string }

    const defaultFontOptions = [
        { label: 'ゴシック体 (標準)', value: 'sans', family: 'var(--font-sans)' },
        { label: '明朝体 (標準)', value: 'serif', family: 'var(--font-serif)' },
        { label: 'メイリオ (Local)', value: 'meiryo', family: '"Meiryo", sans-serif' },
        { label: 'MS ゴシック (Local)', value: 'ms-gothic', family: '"MS Gothic", sans-serif' },
        { label: '遊ゴシック (Local)', value: 'yu-gothic', family: '"Yu Gothic", sans-serif' },
        { label: 'BIZ UDゴシック (Local)', value: 'biz-gothic', family: '"BIZ UDGothic", sans-serif' },
        { label: 'BIZ UD明朝 (Local)', value: 'biz-mincho', family: '"BIZ UDMincho", serif' },
        { label: 'Noto Sans JP (Google)', value: 'noto-sans', family: '"Noto Sans JP", sans-serif', google: true },
        { label: 'Noto Serif JP (Google)', value: 'noto-serif', family: '"Noto Serif JP", serif', google: true },
        { label: 'Zen Maru Gothic (Google)', value: 'zen-maru', family: '"Zen Maru Gothic", sans-serif', google: true },
        { label: 'Dela Gothic One (Google)', value: 'dela-gothic', family: '"Dela Gothic One", cursive', google: true },
        { label: 'DotGothic16 (Google)', value: 'dot-gothic', family: '"DotGothic16", sans-serif', google: true },
    ];

    const fontOptions = useMemo(() => {
        const customOnes = (settings?.customFonts || []).map(f => ({
            label: `${f.name} (Custom)`,
            value: `custom-${f.name.replace(/\s+/g, '-').toLowerCase()}`,
            family: `"${f.name}", sans-serif`,
            google: true // Assume google-like loading via SettingsContext
        }));
        return [...defaultFontOptions, ...customOnes];
    }, [settings.customFonts]);

    // Load Google Fonts dynamically
    useEffect(() => {
        const usedFonts = new Set(blocks.map(b => b.font).filter(f => f));
        fontOptions.forEach(opt => {
            if (opt.google && (usedFonts.has(opt.value) || isEditable)) {
                // Determine the Google Font URL param (replace spaces with +)
                const familyParam = opt.family.split(',')[0].replace(/"/g, '').replace(/ /g, '+');
                const id = `font-${opt.value}`;
                if (!document.getElementById(id)) {
                    const link = document.createElement('link');
                    link.id = id;
                    link.rel = 'stylesheet';
                    link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;500;700&display=swap`;
                    document.head.appendChild(link);
                }
            }
        });
    }, [blocks, isEditable]); // Re-run when blocks change or edit mode changes

    const addBlock = (type) => {
        const newBlock = {
            id: Date.now(),
            type,
            value: type === 'text' ? '' : '',
            font: 'sans' // default font
        };
        onChange([...blocks, newBlock]);
    };

    const updateBlock = (id, changes) => {
        onChange(blocks.map(b => b.id === id ? { ...b, ...changes } : b));
    };

    const deleteBlock = (id) => {
        onChange(blocks.filter(b => b.id !== id));
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        onChange(newBlocks);
    };

    const handleImageUpload = (id, file) => {
        const url = URL.createObjectURL(file);
        updateBlock(id, { value: url });
    };

    const getFontFamily = (fontValue) => {
        const font = fontOptions.find(f => f.value === fontValue);
        return font ? font.family : 'var(--font-sans)';
    };

    if (!isEditable) {
        return (
            <div className="article-content">
                {blocks.map(block => (
                    <div key={block.id} className={`block block-${block.type}`}>
                        {block.type === 'text' ? (
                            <p style={{ fontFamily: getFontFamily(block.font) }}>{block.value}</p>
                        ) : block.value ? (
                            <img src={block.value} alt="Content" />
                        ) : null}
                    </div>
                ))}
                {blocks.length === 0 && <p className="empty-content">本文はありません。</p>}
                <style>{`
            .block { margin-bottom: 1.5rem; }
            .block-text p { font-size: 1.1rem; line-height: 1.8; color: #333; white-space: pre-wrap; }
            .block-image img { max-width: 100%; border-radius: 4px; }
            .empty-content { color: #999; font-style: italic; }
        `}</style>
            </div>
        );
    }

    return (
        <div className="editor-container">
            {blocks.map((block, index) => (
                <div key={block.id} className="editor-block">
                    <div className="block-controls">
                        <div className="left-controls">
                            <span className="block-type-label">{block.type === 'text' ? 'テキスト' : '画像'}</span>
                            {block.type === 'text' && (
                                <select
                                    value={block.font || 'sans'}
                                    onChange={(e) => updateBlock(block.id, { font: e.target.value })}
                                    className="font-select"
                                >
                                    {fontOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="control-buttons">
                            <button onClick={() => moveBlock(index, 'up')} disabled={index === 0}>↑</button>
                            <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1}>↓</button>
                            <button onClick={() => deleteBlock(block.id)} className="delete-btn">削除</button>
                        </div>
                    </div>

                    <div className="block-input">
                        {block.type === 'text' ? (
                            <textarea
                                value={block.value}
                                onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                placeholder="ここにテキストを入力..."
                                rows="3"
                                style={{ fontFamily: getFontFamily(block.font) }}
                            />
                        ) : (
                            <div className="image-uploader">
                                {block.value && <img src={block.value} alt="Preview" className="image-preview" />}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e.target.files[0])} />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <div className="add-block-controls">
                <button onClick={() => addBlock('text')} className="add-btn">+ テキストを追加</button>
                <button onClick={() => addBlock('image')} className="add-btn">+ 画像を追加</button>
            </div>

            <style>{`
        .editor-container { background: #fafafa; padding: 1rem; border-radius: 8px; border: 1px dashed #ccc; }
        .editor-block { background: #fff; padding: 1rem; border: 1px solid #eee; margin-bottom: 1rem; border-radius: 4px; }
        .block-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .left-controls { display: flex; align-items: center; gap: 1rem; }
        .block-type-label { font-size: 0.8rem; font-weight: bold; color: #666; text-transform: uppercase; }
        .font-select { padding: 0.2rem; border-radius: 4px; border: 1px solid #ddd; font-size: 0.85rem; max-width: 200px; }
        .control-buttons { display: flex; gap: 0.5rem; }
        .control-buttons button { padding: 0.2rem 0.6rem; font-size: 0.9rem; cursor: pointer; }
        .delete-btn { background: #fee; color: #c00; border: 1px solid #fdd; }
        .block-input textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-size: 1.1rem; line-height: 1.6; }
        .image-uploader { display: flex; flex-direction: column; gap: 0.5rem; }
        .image-preview { max-height: 200px; max-width: 100%; object-fit: contain; background: #eee; }
        .add-block-controls { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        .add-btn { padding: 0.8rem 1.5rem; background: #fff; border: 1px solid #333; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .add-btn:hover { background: #333; color: #fff; }
      `}</style>
        </div>
    );
}
