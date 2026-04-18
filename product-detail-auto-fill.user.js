// ==UserScript==
// @name         Product Detail Auto Fill
// @namespace    http://tampermonkey.net/
// @version      5.0.2
// @description  自动解析文案并填充到商品详情页表单，支持批量上传图片
// @author       You
// @match        https://md2img.lizhi.host/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izc2NGJhMiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTQiIGZpbGw9InVybCgjYmcpIi8+CiAgPCEtLSDooajljZUv5paH5qGj5Zu+5qCHIC0tPgogIDxyZWN0IHg9IjE0IiB5PSIxMiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjQwIiByeD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyLjUiIG9wYWNpdHk9IjAuOSIvPgogIDwhLS0g6KGo5Y2V57q/5p2hIC0tPgogIDxsaW5lIHgxPSIyMSIgeTE9IjIzIiB4Mj0iMzgiIHkyPSIyMyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iMC44Ii8+CiAgPGxpbmUgeDE9IjIxIiB5MT0iMzEiIHgyPSIzNCIgeTI9IjMxIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjgiLz4KICA8bGluZSB4MT0iMjEiIHkxPSIzOSIgeDI9IjMwIiB5Mj0iMzkiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuOCIvPgogIDwhLS0g5Yu+6YCJ5qCH6K6wIC0tPgogIDxjaXJjbGUgY3g9IjQ2IiBjeT0iNDQiIHI9IjExIiBmaWxsPSJ3aGl0ZSIvPgogIDxwYXRoIGQ9Ik00MCA0NCBMNDQgNDggTDUyIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjdlZWEiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=
// @grant        GM_addStyle
// @license      MIT
// @updateURL    https://greasyfork.org/scripts/571173/code.meta.js
// @downloadURL  https://greasyfork.org/scripts/571173/code.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式
    GM_addStyle(`
        #input-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.45); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
        }
        #input-modal-content {
            background: white; padding: 20px 24px; border-radius: 8px;
            width: 60%; max-width: 600px; max-height: 85vh; overflow-y: auto;
            position: relative; box-sizing: border-box;
        }
        #input-modal-content h3 { margin: 0 0 16px 0; color: rgba(0,0,0,0.88); font-size: 16px; font-weight: 600; }
        #modal-close-btn {
            position: absolute; top: 17px; right: 20px; width: 22px; height: 22px; padding: 0;
            display: flex; align-items: center; justify-content: center;
            background: none; border: none; cursor: pointer; color: rgba(0,0,0,0.45);
            font-size: 16px; border-radius: 4px; transition: all 0.2s;
        }
        #modal-close-btn:hover { color: rgba(0,0,0,0.88); background: rgba(0,0,0,0.06); }
        .modal-section { margin-bottom: 20px; }
        .modal-section-title { font-size: 14px; font-weight: 500; color: rgba(0,0,0,0.88); margin-bottom: 8px; }
        .modal-section-title .badge { font-size: 12px; color: #1677ff; background: #e6f4ff; padding: 2px 8px; border-radius: 4px; }
        #input-textarea {
            width: 100%; height: 250px; padding: 12px; border: 1px solid #d9d9d9;
            border-radius: 6px; font-size: 14px; resize: vertical; font-family: inherit;
            box-sizing: border-box; outline: none;
        }
        #input-textarea:focus { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,0.1); }
        .file-input-group label { display: block; font-size: 13px; color: rgba(0,0,0,0.65); margin-bottom: 4px; }
        .file-input-group input[type="file"] {
            width: 100%; padding: 8px; border: 1px dashed #d9d9d9;
            border-radius: 6px; font-size: 13px; cursor: pointer; box-sizing: border-box;
        }
        .file-input-group input[type="file"]:hover { border-color: #1677ff; }
        .file-count { font-size: 12px; color: #1677ff; margin-top: 4px; }
        #modal-buttons { margin-top: 16px; display: flex; gap: 8px; justify-content: flex-end; }
        #modal-buttons button { padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; }
        #paste-btn { background: white; border: 1px solid #d9d9d9; color: rgba(0,0,0,0.88); }
        #paste-btn:hover { border-color: #1677ff; color: #1677ff; }
        #confirm-fill-btn { background: #1677ff; border: 1px solid #1677ff; color: white; }
        #confirm-fill-btn:hover { background: #4096ff; border-color: #4096ff; }
        #fill-status {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 30px; border-radius: 8px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.08); z-index: 10001;
            text-align: center; min-width: 350px; max-width: 500px;
        }
        #fill-status h4 { margin: 0 0 15px 0; color: rgba(0,0,0,0.88); }
        #status-list { max-height: 300px; overflow-y: auto; text-align: left; }
        .status-item { padding: 8px 12px; margin: 4px 0; border-radius: 6px; background: #f5f5f5; font-size: 13px; }
        .status-item.success { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
        .status-item.pending { background: #fffbe6; color: #d48806; border: 1px solid #ffe58f; }
        .status-item.error { background: #fff2f0; color: #cf1322; border: 1px solid #ffccc7; }
        .status-item.skip { background: #fafafa; color: #8c8c8c; border: 1px solid #d9d9d9; }
    `);

    // 全局状态
    let selectedFiles = [];

    // 工具函数
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { observer.disconnect(); resolve(el); }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); reject(new Error(`等待元素超时: ${selector}`)); }, timeout);
        });
    }

    function setReactValue(element, value) {
        if (!element) return;
        const setter = Object.getOwnPropertyDescriptor(
            element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value'
        ).set;
        setter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function cleanContent(text) {
        if (!text) return '';
        return text.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\n{3,}/g, '\n\n').trim();
    }

    // 解析markdown
    function splitMarkdown(text) {
        const sections = {
            specDifferences: '', specialNotes: '', introduction: '',
            scenarios: '', activation: '', softwareName: '', bannerTexts: []
        };
        const lines = text.split('\n');
        let currentSection = null, buffer = [];

        const saveBuffer = () => {
            if (currentSection && buffer.length) sections[currentSection] = buffer.join('\n').trim();
        };

        for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed.startsWith('## 规格区别')) { saveBuffer(); currentSection = 'specDifferences'; buffer = []; continue; }
            if (trimmed.startsWith('## 特殊说明')) { saveBuffer(); currentSection = 'specialNotes'; buffer = []; continue; }
            if (trimmed.match(/^##\s*(软件介绍|软件简介|商品介绍|商品简介)(\s|$)/)) { saveBuffer(); currentSection = 'introduction'; buffer = []; continue; }
            if (trimmed.startsWith('## 使用场景')) { saveBuffer(); currentSection = 'scenarios'; buffer = []; continue; }
            if (trimmed.startsWith('## 商品轮播图文案') || trimmed.startsWith('## 配图文案')) { saveBuffer(); currentSection = 'banner'; buffer = []; continue; }
            if (trimmed.startsWith('## 激活教程')) { saveBuffer(); currentSection = 'activation'; buffer = []; continue; }

            if (currentSection === 'banner') {
                if (!sections.softwareName && trimmed.includes(':')) {
                    const name = trimmed.split(':')[0].trim();
                    if (name && name.length < 20) sections.softwareName = name;
                }
                if (trimmed) sections.bannerTexts.push(trimmed);
                continue;
            }
            buffer.push(line);
        }
        saveBuffer();
        return sections;
    }

    function parseSpecialNotes(text) {
        const result = { sku: '', params: '' };
        if (!text) return result;
        const lines = text.split('\n');
        let current = null, buffer = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('### SKU 选择板块')) { if (current && buffer.length) result[current] = buffer.join('\n').trim(); current = 'sku'; buffer = []; continue; }
            if (trimmed.startsWith('### 商品参数板块')) { if (current && buffer.length) result[current] = buffer.join('\n').trim(); current = 'params'; buffer = []; continue; }
            if (trimmed === '无') continue;
            if (current) buffer.push(line);
        }
        if (current && buffer.length) result[current] = buffer.join('\n').trim();
        return result;
    }

    // 文件分类
    function classifyFiles(files) {
        const album = [], activation = [];
        for (const file of files) {
            if (file.name.includes('-how-to-activate-')) activation.push(file);
            else album.push(file);
        }
        return { album: sortByNumber(album), activation: sortByNumber(activation) };
    }

    function sortByNumber(files) {
        return [...files].sort((a, b) => {
            const numA = a.name.match(/-(\d+)-/)?.[1] || '0';
            const numB = b.name.match(/-(\d+)-/)?.[1] || '0';
            return parseInt(numA) - parseInt(numB);
        });
    }

    // 导入功能
    function clickImportButton(type) {
        const sectionMap = { introduction: 'product-intro', scenarios: 'usage-scenarios', activation: 'activation-guide' };
        const section = document.getElementById(sectionMap[type]);
        if (!section) return false;
        for (const btn of section.querySelectorAll('button')) {
            if (btn.textContent.includes('导入内容')) { btn.click(); return true; }
        }
        return false;
    }

    async function importSection(type, content, status) {
        if (!content || content.trim().length < 10) { status(`${type}: 内容为空，跳过`, 'skip'); return; }
        status(`${type}: 打开导入对话框...`, 'pending');
        if (!clickImportButton(type)) { status(`${type}: 未找到导入按钮`, 'error'); return; }
        await sleep(1000);
        try {
            const textarea = await waitForElement('.ant-modal:not([style*="display: none"]) textarea', 5000);
            status(`${type}: 填入内容...`, 'pending');
            setReactValue(textarea, content);
            await sleep(500);
            const modal = document.querySelector('.ant-modal:not([style*="display: none"])');
            if (modal) {
                const importBtn = modal.querySelector('.ant-btn-primary');
                if (importBtn) {
                    status(`${type}: 正在导入...`, 'pending');
                    importBtn.click();
                    await new Promise(resolve => {
                        const check = setInterval(() => {
                            if (!document.querySelector('.ant-modal:not([style*="display: none"])') ||
                                document.querySelector('.ant-message-success')) {
                                clearInterval(check); resolve();
                            }
                        }, 200);
                        setTimeout(() => { clearInterval(check); resolve(); }, 15000);
                    });
                    status(`${type}: 导入完成`, 'success');
                    await sleep(800);
                    return;
                }
            }
            status(`${type}: 导入失败`, 'error');
        } catch (err) { status(`${type}: ${err.message}`, 'error'); }
    }

    // 上传产品相册图片
    async function uploadAlbumImages(files, bannerTexts, status) {
        if (!files.length) { status('产品相册: 无图片，跳过', 'skip'); return; }
        const sorted = sortByNumber(files);
        status(`产品相册: 上传 ${sorted.length} 张图片...`, 'pending');

        const albumSection = document.getElementById('album');
        if (!albumSection) { status('产品相册: 未找到上传区域', 'error'); return; }

        const fileInput = albumSection.querySelector('input[type="file"]');
        if (!fileInput) { status('产品相册: 未找到文件输入框', 'error'); return; }

        const dt = new DataTransfer();
        sorted.forEach(f => dt.items.add(f));
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));

        // 等待Alt属性值输入框出现
        await sleep(2000);
        let waitTime = 0;
        while (waitTime < 30000) {
            if (albumSection.querySelectorAll('input[placeholder="请输入Alt属性值"]').length >= sorted.length) break;
            await sleep(500);
            waitTime += 500;
        }
        status('产品相册: 图片上传完成', 'success');
        await sleep(1000);

        // 填写配文
        if (bannerTexts.length > 0) {
            status('产品相册: 填写配文...', 'pending');
            const altInputs = albumSection.querySelectorAll('input[placeholder="请输入Alt属性值"]');
            for (let i = 0; i < Math.min(altInputs.length, bannerTexts.length); i++) {
                if (altInputs[i] && bannerTexts[i]) {
                    setReactValue(altInputs[i], bannerTexts[i]);
                    await sleep(300);
                }
            }
            status('产品相册: 配文填写完成', 'success');
        }
    }

    // 上传激活步骤图片
    async function uploadActivationImages(files, status) {
        if (!files.length) { status('激活步骤: 无图片，跳过', 'skip'); return; }
        const sorted = sortByNumber(files);
        status(`激活步骤: 上传 ${sorted.length} 张图片...`, 'pending');

        const section = document.getElementById('activation-guide');
        if (!section) { status('激活步骤: 未找到区域', 'error'); return; }

        const fileInputs = section.querySelectorAll('.ant-upload input[type="file"]');
        if (fileInputs.length === 0) { status('激活步骤: 未找到上传入口', 'error'); return; }

        for (let i = 0; i < Math.min(sorted.length, fileInputs.length); i++) {
            const dt = new DataTransfer();
            dt.items.add(sorted[i]);
            fileInputs[i].files = dt.files;
            fileInputs[i].dispatchEvent(new Event('change', { bubbles: true }));
            status(`激活步骤: 上传第 ${i + 1} 张...`, 'pending');
            await sleep(1500);
        }
        await sleep(2000);
        status('激活步骤: 上传完成', 'success');
    }

    // 填充简单字段
    function fillSimpleFields(sections) {
        const notes = parseSpecialNotes(sections.specialNotes);
        if (sections.softwareName) setReactValue(document.getElementById('name'), sections.softwareName);
        if (sections.specDifferences) setReactValue(document.getElementById('spec_differences'), sections.specDifferences);
        if (notes.sku) setReactValue(document.getElementById('sku_section'), notes.sku);
        if (notes.params) setReactValue(document.getElementById('params_section'), notes.params);
    }

    // 状态窗口
    function showStatusWindow() {
        const div = document.createElement('div');
        div.id = 'fill-status';
        div.innerHTML = '<h4>正在自动填写...</h4><div id="status-list"></div>';
        document.body.appendChild(div);
        return {
            update(msg, type) {
                const list = document.getElementById('status-list');
                if (!list) return;
                const item = document.createElement('div');
                item.className = `status-item ${type || ''}`;
                item.textContent = msg;
                list.appendChild(item);
                list.scrollTop = list.scrollHeight;
            },
            close() { setTimeout(() => div.remove(), 3000); }
        };
    }

    // 主流程
    async function autoFill(text, files) {
        const sections = splitMarkdown(text);
        const classified = classifyFiles(files);
        const status = showStatusWindow();
        const btn = document.getElementById('auto-fill-btn');
        if (btn) btn.disabled = true;

        try {
            status.update('填充基础信息...', 'pending');
            fillSimpleFields(sections);
            await sleep(500);
            status.update('基础信息已填充', 'success');

            await importSection('introduction', cleanContent(sections.introduction), status.update);
            await importSection('scenarios', cleanContent(sections.scenarios), status.update);
            await uploadAlbumImages(classified.album, sections.bannerTexts, status.update);
            await importSection('activation', cleanContent(sections.activation), status.update);
            await uploadActivationImages(classified.activation, status.update);

            status.update('全部完成！', 'success');
        } catch (err) {
            status.update(`错误: ${err.message}`, 'error');
            console.error(err);
        } finally {
            if (btn) btn.disabled = false;
            status.close();
        }
    }

    // 弹窗
    function showModal() {
        const modal = document.createElement('div');
        modal.id = 'input-modal';
        modal.innerHTML = `
            <div id="input-modal-content">
                <h3>商品信息批量导入</h3>
                <button id="modal-close-btn" title="关闭">✕</button>
                <div class="modal-section">
                    <div class="modal-section-title">商品文案 <span class="badge">必填</span></div>
                    <textarea id="input-textarea" placeholder="请粘贴完整的商品文案内容..."></textarea>
                </div>
                <div class="modal-section">
                    <div class="modal-section-title">批量上传图片</div>
                    <div class="file-input-group">
                        <label>选择所有图片（产品相册 + 激活步骤，系统自动分类）</label>
                        <input type="file" id="image-files" multiple accept=".jpg,.jpeg,.png">
                        <div class="file-count" id="image-count"></div>
                    </div>
                </div>
                <div id="modal-buttons">
                    <button id="paste-btn">从剪切板粘贴文案</button>
                    <button id="confirm-fill-btn">一键填写</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('image-files').addEventListener('change', e => {
            selectedFiles = [...e.target.files];
            const classified = classifyFiles(selectedFiles);
            document.getElementById('image-count').textContent =
                `已选择 ${selectedFiles.length} 张图片（产品相册: ${classified.album.length}，激活步骤: ${classified.activation.length}）`;
        });

        document.getElementById('paste-btn').addEventListener('click', async () => {
            try { document.getElementById('input-textarea').value = await navigator.clipboard.readText(); }
            catch { alert('无法读取剪切板，请手动粘贴（Ctrl+V）'); }
        });

        const close = () => modal.remove();
        document.getElementById('modal-close-btn').addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target === modal) close(); });

        document.getElementById('confirm-fill-btn').addEventListener('click', () => {
            const text = document.getElementById('input-textarea').value;
            if (!text.trim()) { alert('请先粘贴文案内容'); return; }
            close();
            autoFill(text, selectedFiles);
        });
    }

    // 按钮创建
    function createButton() {
        if (document.getElementById('auto-fill-btn')) return true;

        const btn = document.createElement('button');
        btn.id = 'auto-fill-btn';
        btn.type = 'button';
        btn.className = 'ant-btn css-1ty23fb ant-btn-default ant-btn-color-default ant-btn-variant-outlined';
        btn.innerHTML = '<span>一键填写</span>';
        btn.addEventListener('click', showModal);

        const footer = document.querySelector('div[style*="position: fixed"][style*="bottom: 0"]');
        if (footer) {
            const space = footer.querySelector('.ant-space');
            if (space && !space.querySelector('#auto-fill-btn')) {
                // 用 ant-space-item 包装，保持与其他按钮间距一致
                const wrapper = document.createElement('div');
                wrapper.className = 'ant-space-item';
                wrapper.appendChild(btn);
                space.appendChild(wrapper);
                return true;
            }
        }
        return false;
    }

    // 延迟重试创建按钮
    function tryCreateButton(retries = 10) {
        if (createButton()) return;
        if (retries <= 0) return;
        setTimeout(() => tryCreateButton(retries - 1), 500);
    }

    // 启动
    function init() {
        tryCreateButton();

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            if (!document.getElementById('auto-fill-btn')) {
                tryCreateButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 监听URL变化（SPA路由）
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                // URL变化后延迟创建按钮
                setTimeout(() => tryCreateButton(), 300);
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
