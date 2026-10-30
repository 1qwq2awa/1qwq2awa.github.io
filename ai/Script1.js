/**
 * ============================================================
 *  🎭 恶搞大师（优化版） - 更轻量、更安全
 * ============================================================
 *  调用 prank() 触发随机效果，6秒后自动恢复
 *  调用 unprank() 立即恢复
 * ============================================================
 */
(function () {
    'use strict';

    let currentRestore = null;
    let timer = null;
    let isPranking = false;

    // ---- 工具 ----
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const pick = arr => arr[rand(0, arr.length - 1)];
    const randColor = () => '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');

    // 获取可见元素（优化：减少遍历次数）
    const getVisible = () => {
        const all = document.querySelectorAll('body *');
        const result = [];
        for (let el of all) {
            if (el.offsetParent !== null && el.getBoundingClientRect().width > 0) {
                result.push(el);
            }
        }
        return result;
    };

    const pickVisible = (count) => {
        const all = getVisible();
        if (!all.length) return [];
        const shuffled = all.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    // 保存/恢复样式
    const saveStyles = (elements) => elements.map(el => ({
        element: el,
        cssText: el.style.cssText || ''
    }));

    const restoreStyles = (saved) => {
        for (let item of saved) {
            const el = item.element;
            if (!el || !el.parentNode) continue;
            el.style.cssText = item.cssText || '';
            if (!item.cssText) el.removeAttribute('style');
        }
    };

    const addTempStyle = (css, id) => {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    };

    const removeTempStyle = (id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
    };

    const clearTimer = () => {
        if (timer) { clearTimeout(timer); timer = null; }
    };

    const restorePage = () => {
        clearTimer();
        if (currentRestore) {
            currentRestore();
            currentRestore = null;
        }
        isPranking = false;
    };

    // ---- 各效果（精简实现，移除冗余） ----
    const effects = [];

    const addEffect = (name, fn) => effects.push({ name, fn });

    addEffect('色彩大混乱', function() {
        const els = getVisible();
        if (!els.length) return () => {};
        const saved = saveStyles(els);
        const origBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = randColor();
        for (let el of els) {
            el.style.color = randColor();
            el.style.backgroundColor = randColor();
            el.style.transition = 'all 0.3s';
        }
        return () => {
            restoreStyles(saved);
            document.body.style.backgroundColor = origBodyBg;
            for (let el of els) el.style.transition = '';
        };
    });

    addEffect('元素缩放', function() {
        const els = pickVisible(20);
        if (!els.length) return () => {};
        const saved = saveStyles(els);
        for (let el of els) {
            const s = (Math.random() * 2.2 + 0.3).toFixed(2);
            el.style.transform = `scale(${s}) rotate(${rand(-15,15)}deg)`;
            el.style.transition = 'transform 0.5s';
            el.style.zIndex = '9999';
        }
        return () => {
            restoreStyles(saved);
            for (let el of els) { el.style.transition = ''; el.style.zIndex = ''; }
        };
    });

    addEffect('页面抖动', function() {
        const body = document.body;
        const saved = saveStyles([body]);
        const id = 'prank-shake-' + Date.now();
        const intensity = rand(3, 8);
        const dur = (Math.random() * 0.7 + 0.8).toFixed(2);
        let css = `@keyframes ${id} {`;
        for (let i = 1; i <= 10; i++) {
            const x = rand(-intensity, intensity);
            const y = rand(-intensity, intensity);
            const r = rand(-3, 3);
            css += `${i*10}% { transform: translate(${x}px, ${y}px) rotate(${r}deg); }`;
        }
        css += '100% { transform: translate(0,0) rotate(0); }}';
        addTempStyle(css, id);
        body.style.animation = `${id} ${dur}s ease-in-out`;
        return () => {
            restoreStyles(saved);
            removeTempStyle(id);
            body.style.animation = '';
        };
    });

    addEffect('弹窗惊喜', function() {
        const msgs = ['🎉 彩蛋！', '🤪 恶搞！', '👻 幽灵程序员', '🎈 好日子', '🐱 喵~', '🍕 披萨！', '🚀 起飞！', '💀 骗你的', '🎃 不给糖', '🤖 机器人'];
        const msg = pick(msgs);
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%) scale(0)',
            background: randColor(), color: randColor(),
            padding: '30px 50px', borderRadius: '20px',
            fontSize: '28px', fontWeight: 'bold',
            fontFamily: 'Comic Sans MS, cursive',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: '999999', textAlign: 'center',
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s',
            opacity: '0'
        });
        popup.textContent = msg;
        const close = document.createElement('button');
        close.textContent = '✕ 关闭';
        Object.assign(close.style, {
            display: 'block', margin: '20px auto 0',
            padding: '8px 24px', background: 'rgba(0,0,0,0.2)',
            border: 'none', borderRadius: '30px', color: 'inherit',
            fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
        });
        close.onclick = () => document.body.removeChild(popup);
        popup.appendChild(close);
        document.body.appendChild(popup);
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', zIndex: '999998',
            backdropFilter: 'blur(4px)', transition: 'opacity 0.3s', opacity: '0'
        });
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%,-50%) scale(1)';
        });
        const remove = () => {
            if (popup.parentNode) {
                popup.style.transform = 'translate(-50%,-50%) scale(0)';
                popup.style.opacity = '0';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (popup.parentNode) document.body.removeChild(popup);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 400);
            }
        };
        overlay.onclick = remove;
        setTimeout(remove, 10000);
        return remove;
    });

    // 可继续添加其他效果（篇幅所限，保留以上4个示例，其余可依此模式扩展）

    // ---- 主触发函数 ----
    function triggerPrank() {
        if (isPranking) restorePage();
        if (!effects.length) return;
        const effect = pick(effects);
        console.log('🎭 恶搞效果:', effect.name);
        try {
            currentRestore = effect.fn();
            isPranking = true;
            clearTimer();
            timer = setTimeout(() => {
                if (isPranking) {
                    restorePage();
                    console.log('🔄 已自动恢复');
                }
            }, 6000);
        } catch (e) {
            console.error('恶搞执行失败:', e);
            isPranking = false;
            currentRestore = null;
        }
    }

    // ---- 暴露全局 ----
    window.prank = triggerPrank;
    window.unprank = restorePage;

    console.log('%c🎭 恶搞大师已加载（优化版）', 'font-size:18px; font-weight:bold; color:#4ecdc4;');
})();