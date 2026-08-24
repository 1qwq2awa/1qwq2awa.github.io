
/**
 * ============================================================
 *  🎭 恶搞大师 (Prank Master) - 可移植到任何网站
 * ============================================================
 *  使用方法：
 *    1. 在浏览器控制台执行：prank()
 *    2. 或通过书签执行：javascript:(function(){var s=document.createElement('script');s.src='...';document.body.appendChild(s)})();
 *    3. 每次调用 prank() 会随机触发一种恶搞效果，6秒后自动恢复
 *    4. 调用 unprank() 可以立即恢复页面
 * ============================================================
 */

(function () {
    'use strict';

    // ---------- 私有变量 ----------
    var currentRestore = null; // 当前效果的恢复函数
    var timer = null; // 自动恢复定时器
    var isPranking = false; // 是否正在执行恶搞

    // ---------- 工具函数 ----------
    // 随机整数 [min, max]
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 随机浮点数 [min, max)
    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 随机选择数组中的一项
    function randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 随机颜色 (十六进制)
    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    // 获取页面中所有可见元素
    function getAllElements() {
        var all = document.querySelectorAll('*');
        var visible = [];
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            var rect = el.getBoundingClientRect();
            // 只选择可见且有一定大小的元素
            if (rect.width > 0 && rect.height > 0 && el.offsetParent !== null) {
                visible.push(el);
            }
        }
        return visible;
    }

    // 随机选择页面中的一些元素
    function pickRandomElements(count) {
        var all = getAllElements();
        if (all.length === 0) return [];
        var picked = [];
        var total = Math.min(count, all.length);
        var used = {};
        for (var i = 0; i < total; i++) {
            var idx;
            do {
                idx = randomInt(0, all.length - 1);
            } while (used[idx]);
            used[idx] = true;
            picked.push(all[idx]);
        }
        return picked;
    }

    // 保存元素的原始样式
    function saveStyles(elements) {
        var styles = [];
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            styles.push({
                element: el,
                cssText: el.style.cssText || '',
                // 保存一些重要的计算样式
                display: el.style.display,
                transform: el.style.transform,
                color: el.style.color,
                backgroundColor: el.style.backgroundColor,
                fontSize: el.style.fontSize,
                fontFamily: el.style.fontFamily,
                border: el.style.border,
                position: el.style.position,
                top: el.style.top,
                left: el.style.left,
                width: el.style.width,
                height: el.style.height,
                opacity: el.style.opacity,
                zIndex: el.style.zIndex,
                transition: el.style.transition
            });
        }
        return styles;
    }

    // 恢复元素的原始样式
    function restoreStyles(styles) {
        for (var i = 0; i < styles.length; i++) {
            var item = styles[i];
            var el = item.element;
            if (!el || !el.parentNode) continue;
            // 恢复内联样式
            el.style.cssText = item.cssText || '';
            // 如果原来没有内联样式，确保清空
            if (!item.cssText) {
                el.removeAttribute('style');
            }
            // 恢复特定属性
            if (item.display !== undefined) el.style.display = item.display;
            if (item.transform !== undefined) el.style.transform = item.transform;
            if (item.color !== undefined) el.style.color = item.color;
            if (item.backgroundColor !== undefined) el.style.backgroundColor = item.backgroundColor;
            if (item.fontSize !== undefined) el.style.fontSize = item.fontSize;
            if (item.fontFamily !== undefined) el.style.fontFamily = item.fontFamily;
            if (item.border !== undefined) el.style.border = item.border;
            if (item.position !== undefined) el.style.position = item.position;
            if (item.top !== undefined) el.style.top = item.top;
            if (item.left !== undefined) el.style.left = item.left;
            if (item.width !== undefined) el.style.width = item.width;
            if (item.height !== undefined) el.style.height = item.height;
            if (item.opacity !== undefined) el.style.opacity = item.opacity;
            if (item.zIndex !== undefined) el.style.zIndex = item.zIndex;
            if (item.transition !== undefined) el.style.transition = item.transition;
        }
    }

    // 移除通过 style 标签添加的样式
    function removeAddedStyles(styleId) {
        var styleEl = document.getElementById(styleId);
        if (styleEl) {
            styleEl.parentNode.removeChild(styleEl);
        }
    }

    // 添加临时样式表
    function addTempStyles(css, id) {
        var styleEl = document.createElement('style');
        styleEl.id = id;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
        return styleEl;
    }

    // 清除定时器
    function clearPrankTimer() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    // ---------- 恢复函数 ----------
    function restorePage() {
        clearPrankTimer();
        if (currentRestore) {
            currentRestore();
            currentRestore = null;
        }
        isPranking = false;
    }

    // ---------- 各种恶搞效果 ----------

    // 效果1: 色彩大混乱
    function effectColorChaos() {
        var elements = getAllElements();
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        var colors = [];
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var color = randomColor();
            var bg = randomColor();
            el.style.color = color;
            el.style.backgroundColor = bg;
            el.style.transition = 'all 0.3s ease';
            colors.push({ color: color, bg: bg });
        }

        // 也改变背景
        var origBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = randomColor();

        return function() {
            restoreStyles(saved);
            document.body.style.backgroundColor = origBodyBg;
            // 移除transition
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transition = '';
            }
        };
    }

    // 效果2: 元素缩放风暴
    function effectScaleStorm() {
        var elements = pickRandomElements(20);
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var scale = randomFloat(0.3, 2.5);
            var rotate = randomInt(-15, 15);
            el.style.transform = 'scale(' + scale + ') rotate(' + rotate + 'deg)';
            el.style.transition = 'transform 0.5s ease';
            el.style.zIndex = '9999';
        }

        return function() {
            restoreStyles(saved);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transition = '';
                elements[i].style.zIndex = '';
            }
        };
    }

    // 效果3: 页面旋转
    function effectPageRotate() {
        var body = document.body;
        var saved = saveStyles([body]);
        var angle = randomInt(-10, 10);
        body.style.transform = 'rotate(' + angle + 'deg)';
        body.style.transition = 'transform 0.8s ease';
        body.style.transformOrigin = 'center center';

        // 添加一点背景色变化
        var origBg = body.style.backgroundColor;
        body.style.backgroundColor = randomColor();

        return function() {
            restoreStyles(saved);
            body.style.transformOrigin = '';
            body.style.backgroundColor = origBg;
            body.style.transition = '';
        };
    }

    // 效果4: 元素漂浮
    function effectFloat() {
        var elements = pickRandomElements(15);
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        var styleId = 'prank-float-style-' + Date.now();

        // 生成随机浮动的关键帧
        var keyframes = '';
        for (var i = 0; i < elements.length; i++) {
            var x = randomInt(-100, 100);
            var y = randomInt(-80, 80);
            var dur = randomFloat(1.5, 3.5);
            var delay = randomFloat(0, 1);
            var name = 'prank-float-' + i;
            keyframes += '@keyframes ' + name + ' {';
            keyframes += '0% { transform: translate(0, 0); }';
            keyframes += '25% { transform: translate(' + x + 'px, ' + (y * 0.5) + 'px); }';
            keyframes += '50% { transform: translate(' + (x * 0.7) + 'px, ' + y + 'px); }';
            keyframes += '75% { transform: translate(' + (x * 0.3) + 'px, ' + (y * 0.7) + 'px); }';
            keyframes += '100% { transform: translate(0, 0); }';
            keyframes += '}';
            elements[i].style.animation = name + ' ' + dur + 's ease-in-out ' + delay + 's infinite';
            elements[i].style.transition = 'all 0.3s ease';
        }

        addTempStyles(keyframes, styleId);

        return function() {
            restoreStyles(saved);
            removeAddedStyles(styleId);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.animation = '';
                elements[i].style.transition = '';
            }
        };
    }

    // 效果5: 弹窗惊喜
    function effectPopup() {
        var saved = saveStyles([]);
        var messages = [
            '🎉 恭喜你触发了隐藏彩蛋！',
            '🤪 你被恶搞了！哈哈哈！',
            '👻 幽灵程序员向你问好！',
            '🎈 今天是个好日子！',
            '🐱 喵～ 你踩到猫尾巴了！',
            '🍕 你饿了么？来块披萨吧！',
            '🚀 准备起飞！3...2...1...',
            '💀 你被诅咒了！开玩笑的～',
            '🎃 不给糖就捣蛋！',
            '🤖 机器人占领世界！'
        ];
        var msg = randomPick(messages);

        // 创建弹窗元素
        var popup = document.createElement('div');
        popup.style.cssText = [
            'position: fixed',
            'top: 50%',
            'left: 50%',
            'transform: translate(-50%, -50%) scale(0)',
            'background: ' + randomColor(),
            'color: ' + randomColor(),
            'padding: 30px 50px',
            'border-radius: 20px',
            'font-size: 28px',
            'font-weight: bold',
            'font-family: "Comic Sans MS", cursive, sans-serif',
            'box-shadow: 0 20px 60px rgba(0,0,0,0.5)',
            'z-index: 999999',
            'text-align: center',
            'max-width: 80%',
            'border: 4px solid ' + randomColor(),
            'transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            'opacity: 0'
        ].join(';');
        popup.textContent = msg;

        // 关闭按钮
        var closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ 关闭';
        closeBtn.style.cssText = [
            'display: block',
            'margin: 20px auto 0',
            'padding: 8px 24px',
            'background: rgba(0,0,0,0.2)',
            'border: none',
            'border-radius: 30px',
            'color: inherit',
            'font-size: 16px',
            'cursor: pointer',
            'font-weight: bold',
            'transition: background 0.2s ease'
        ].join(';');
        closeBtn.onmouseover = function() { this.style.background = 'rgba(0,0,0,0.4)'; };
        closeBtn.onmouseout = function() { this.style.background = 'rgba(0,0,0,0.2)'; };
        closeBtn.onclick = function() {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeBtn);
        document.body.appendChild(popup);

        // 添加背景遮罩
        var overlay = document.createElement('div');
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100%',
            'height: 100%',
            'background: rgba(0,0,0,0.4)',
            'z-index: 999998',
            'backdrop-filter: blur(4px)',
            'transition: opacity 0.3s ease',
            'opacity: 0'
        ].join(';');
        document.body.appendChild(overlay);

        // 动画入场
        requestAnimationFrame(function() {
            overlay.style.opacity = '1';
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // 保存移除函数
        var removePopup = function() {
            if (popup.parentNode) {
                popup.style.transform = 'translate(-50%, -50%) scale(0)';
                popup.style.opacity = '0';
                overlay.style.opacity = '0';
                setTimeout(function() {
                    if (popup.parentNode) document.body.removeChild(popup);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 400);
            }
        };

        // 点击遮罩关闭
        overlay.onclick = removePopup;

        // 10秒后自动关闭
        setTimeout(removePopup, 10000);

        return function() {
            removePopup();
        };
    }

    // 效果6: 页面抖动
    function effectShake() {
        var body = document.body;
        var saved = saveStyles([body]);
        var styleId = 'prank-shake-style-' + Date.now();

        var intensity = randomInt(3, 8);
        var duration = randomFloat(0.8, 1.5);

        var css = '@keyframes prank-shake {';
        css += '0% { transform: translate(0, 0) rotate(0deg); }';
        for (var i = 1; i <= 10; i++) {
            var x = randomInt(-intensity, intensity);
            var y = randomInt(-intensity, intensity);
            var r = randomInt(-3, 3);
            var pct = i * 10;
            css += pct + '% { transform: translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg); }';
        }
        css += '100% { transform: translate(0, 0) rotate(0deg); }';
        css += '}';

        addTempStyles(css, styleId);

        body.style.animation = 'prank-shake ' + duration + 's ease-in-out';
        body.style.transformOrigin = 'center center';

        return function() {
            restoreStyles(saved);
            removeAddedStyles(styleId);
            body.style.animation = '';
            body.style.transformOrigin = '';
        };
    }

    // 效果7: 文字反转
    function effectTextReverse() {
        var elements = pickRandomElements(30);
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            // 只对有文本内容的元素操作
            if (el.textContent && el.textContent.trim().length > 0) {
                el.style.transform = 'scaleX(-1)';
                el.style.display = 'inline-block';
                el.style.transition = 'transform 0.5s ease';
                el.style.direction = 'rtl';
            }
        }

        return function() {
            restoreStyles(saved);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transform = '';
                elements[i].style.display = '';
                elements[i].style.transition = '';
                elements[i].style.direction = '';
            }
        };
    }

    // 效果8: 鼠标追踪幽灵
    function effectMouseTracker() {
        var saved = saveStyles([]);
        var tracker = document.createElement('div');
        var size = randomInt(40, 100);
        var color = randomColor();
        var emoji = randomPick(['👻', '🎃', '🤡', '👽', '💀', '😱', '🦄', '🐉', '🍕', '🚀']);

        tracker.textContent = emoji;
        tracker.style.cssText = [
            'position: fixed',
            'pointer-events: none',
            'z-index: 999999',
            'font-size: ' + size + 'px',
            'transform: translate(-50%, -50%) scale(0.5)',
            'opacity: 0.7',
            'transition: transform 0.15s ease, opacity 0.3s ease',
            'filter: drop-shadow(0 0 20px ' + color + ')'
        ].join(';');
        document.body.appendChild(tracker);

        // 显示动画
        requestAnimationFrame(function() {
            tracker.style.transform = 'translate(-50%, -50%) scale(1)';
            tracker.style.opacity = '0.9';
        });

        var onMouseMove = function(e) {
            tracker.style.left = e.clientX + 'px';
            tracker.style.top = e.clientY + 'px';
            // 随机旋转
            var rot = randomInt(-10, 10);
            tracker.style.transform = 'translate(-50%, -50%) scale(1) rotate(' + rot + 'deg)';
        };

        document.addEventListener('mousemove', onMouseMove);

        // 6秒后消失
        var timeout = setTimeout(function() {
            tracker.style.transform = 'translate(-50%, -50%) scale(0)';
            tracker.style.opacity = '0';
            setTimeout(function() {
                if (tracker.parentNode) document.body.removeChild(tracker);
            }, 400);
            document.removeEventListener('mousemove', onMouseMove);
        }, 6000);

        return function() {
            clearTimeout(timeout);
            document.removeEventListener('mousemove', onMouseMove);
            if (tracker.parentNode) {
                tracker.style.transform = 'translate(-50%, -50%) scale(0)';
                tracker.style.opacity = '0';
                setTimeout(function() {
                    if (tracker.parentNode) document.body.removeChild(tracker);
                }, 300);
            }
        };
    }

    // 效果9: 页面闪烁
    function effectFlash() {
        var saved = saveStyles([]);
        var body = document.body;
        var origBg = body.style.backgroundColor;
        var count = 0;
        var maxFlashes = randomInt(8, 18);
        var interval = randomInt(80, 200);

        var flashInterval = setInterval(function() {
            count++;
            if (count % 2 === 1) {
                body.style.backgroundColor = randomColor();
            } else {
                body.style.backgroundColor = randomColor();
            }
            if (count >= maxFlashes) {
                clearInterval(flashInterval);
                body.style.backgroundColor = origBg;
                // 最后闪一下白色
                body.style.backgroundColor = '#ffffff';
                setTimeout(function() {
                    body.style.backgroundColor = origBg;
                }, 150);
            }
        }, interval);

        return function() {
            clearInterval(flashInterval);
            body.style.backgroundColor = origBg;
        };
    }

    // 效果10: 边框混乱
    function effectBorderChaos() {
        var elements = pickRandomElements(25);
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        var borderStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var width = randomInt(1, 6);
            var style = randomPick(borderStyles);
            var color = randomColor();
            el.style.border = width + 'px ' + style + ' ' + color;
            el.style.borderRadius = randomInt(0, 20) + 'px';
            el.style.transition = 'border 0.3s ease';
        }

        return function() {
            restoreStyles(saved);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transition = '';
            }
        };
    }

    // 效果11: 字体混乱
    function effectFontChaos() {
        var elements = pickRandomElements(30);
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        var fonts = [
            'Comic Sans MS', 'Chalkboard SE', 'Papyrus', 'Courier New',
            'Impact', 'Arial Black', 'Times New Roman', 'Georgia',
            'Trebuchet MS', 'Verdana', 'Tahoma', 'Brush Script MT',
            'fantasy', 'cursive', 'monospace'
        ];

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el.textContent && el.textContent.trim().length > 0) {
                el.style.fontFamily = randomPick(fonts);
                el.style.fontSize = randomInt(10, 32) + 'px';
                el.style.fontWeight = randomPick(['normal', 'bold', 'bolder', 'lighter']);
                el.style.transition = 'all 0.3s ease';
                // 随机倾斜
                el.style.transform = 'skew(' + randomInt(-5, 5) + 'deg, ' + randomInt(-3, 3) + 'deg)';
            }
        }

        return function() {
            restoreStyles(saved);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transition = '';
                elements[i].style.transform = '';
            }
        };
    }

    // 效果12: 镜像翻转
    function effectMirror() {
        var body = document.body;
        var saved = saveStyles([body]);
        body.style.transform = 'scaleX(-1)';
        body.style.transition = 'transform 0.8s ease';
        body.style.transformOrigin = 'center center';

        // 也反转一些元素
        var elements = pickRandomElements(10);
        var elemSaved = saveStyles(elements);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            el.style.transform = 'scaleX(-1)';
            el.style.transition = 'transform 0.8s ease';
        }

        return function() {
            restoreStyles(saved);
            restoreStyles(elemSaved);
            body.style.transformOrigin = '';
            body.style.transition = '';
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transition = '';
                elements[i].style.transform = '';
            }
        };
    }

    // 效果13: 元素位移
    function effectDisplace() {
        var elements = pickRandomElements(20);
        if (elements.length === 0) return function() {};

        var saved = saveStyles(elements);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var x = randomInt(-80, 80);
            var y = randomInt(-80, 80);
            el.style.position = 'relative';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            el.style.zIndex = '9999';
        }

        return function() {
            restoreStyles(saved);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.transition = '';
                elements[i].style.zIndex = '';
            }
        };
    }

    // 效果14: 彩虹背景
    function effectRainbow() {
        var saved = saveStyles([]);
        var styleId = 'prank-rainbow-style-' + Date.now();

        var angle = randomInt(0, 360);
        var css = 'body { background: linear-gradient(' + angle + 'deg, ';
        var colors = [];
        for (var i = 0; i < 6; i++) {
            colors.push(randomColor());
        }
        css += colors.join(', ') + ') !important; ';
        css += 'background-attachment: fixed !important; ';
        css += 'transition: background 0.5s ease; ';
        css += '}';

        // 让所有文字变亮
        css += '* { color: white !important; text-shadow: 0 0 10px rgba(0,0,0,0.5) !important; }';

        addTempStyles(css, styleId);

        return function() {
            removeAddedStyles(styleId);
        };
    }

    // 效果15: 滚动失控
    function effectScrollMadness() {
        var saved = saveStyles([]);
        var scrollInterval = setInterval(function() {
            var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            var target = Math.random() * maxScroll;
            window.scrollTo({
                top: target,
                behavior: 'smooth'
            });
        }, randomInt(300, 800));

        // 同时改变滚动条颜色
        var styleId = 'prank-scroll-style-' + Date.now();
        var css = '::-webkit-scrollbar { width: 15px; } ';
        css += '::-webkit-scrollbar-track { background: ' + randomColor() + '; } ';
        css += '::-webkit-scrollbar-thumb { background: ' + randomColor() + '; border-radius: 10px; } ';
        css += '::-webkit-scrollbar-thumb:hover { background: ' + randomColor() + '; } ';
        addTempStyles(css, styleId);

        return function() {
            clearInterval(scrollInterval);
            removeAddedStyles(styleId);
        };
    }

    // ---------- 所有效果的列表 ----------
    var effects = [
        { name: '色彩大混乱', fn: effectColorChaos },
        { name: '元素缩放风暴', fn: effectScaleStorm },
        { name: '页面旋转', fn: effectPageRotate },
        { name: '元素漂浮', fn: effectFloat },
        { name: '弹窗惊喜', fn: effectPopup },
        { name: '页面抖动', fn: effectShake },
        { name: '文字反转', fn: effectTextReverse },
        { name: '鼠标追踪幽灵', fn: effectMouseTracker },
        { name: '页面闪烁', fn: effectFlash },
        { name: '边框混乱', fn: effectBorderChaos },
        { name: '字体混乱', fn: effectFontChaos },
        { name: '镜像翻转', fn: effectMirror },
        { name: '元素位移', fn: effectDisplace },
        { name: '彩虹背景', fn: effectRainbow },
        { name: '滚动失控', fn: effectScrollMadness }
    ];

    // ---------- 主函数 ----------
    function triggerPrank() {
        // 如果正在恶搞，先恢复
        if (isPranking) {
            restorePage();
        }

        // 随机选择一个效果
        var effect = randomPick(effects);
        console.log('🎭 恶搞效果: ' + effect.name);

        try {
            // 执行效果，获取恢复函数
            currentRestore = effect.fn();
            isPranking = true;

            // 设置自动恢复定时器 (6秒后)
            clearPrankTimer();
            timer = setTimeout(function() {
                if (isPranking) {
                    restorePage();
                    console.log('🔄 已自动恢复');
                }
            }, 6000);

        } catch (e) {
            console.error('恶搞效果执行失败:', e);
            isPranking = false;
            currentRestore = null;
        }
    }

    // ---------- 暴露全局API ----------
    window.prank = triggerPrank;
    window.unprank = restorePage;

    // 在控制台显示帮助信息
    console.log(
        '%c🎭 恶搞大师已加载！%c\n' +
        '  执行 %cprank()%c 触发随机恶搞效果\n' +
        '  执行 %cunprank()%c 立即恢复页面\n' +
        '  效果持续6秒后自动恢复',
        'font-size: 24px; font-weight: bold; color: #ff6b6b;',
        'font-size: 14px;',
        'font-size: 16px; color: #4ecdc4; font-weight: bold;',
        'font-size: 14px;',
        'font-size: 16px; color: #4ecdc4; font-weight: bold;',
        'font-size: 14px;'
    );

})();