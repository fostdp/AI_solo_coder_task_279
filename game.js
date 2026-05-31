class TrashGame {
    constructor() {
        this.score = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTrash = null;
        this.trashItems = [];
        this.gameMode = 'endless';
        this.challengeTime = 60;
        this.currentTime = 60;
        this.timerInterval = null;
        this.currentRegion = 'national';
        
        this.initTrashData();
        this.initKnowledgeData();
        this.initRegionStandards();
        this.init();
    }
    
    initTrashData() {
        this.allTrashItems = {
            recyclable: [
                { emoji: '🥤', name: '塑料瓶' },
                { emoji: '📦', name: '纸箱' },
                { emoji: '🍶', name: '玻璃瓶' },
                { emoji: '📄', name: '废纸' },
                { emoji: '🥫', name: '易拉罐' },
                { emoji: '📰', name: '报纸' },
                { emoji: '🧴', name: '洗发水瓶' },
                { emoji: '🫙', name: '玻璃罐' },
                { emoji: '📚', name: '旧书' },
                { emoji: '👕', name: '旧衣服' },
                { emoji: '👟', name: '旧鞋子' },
                { emoji: '🛏️', name: '棉被' },
                { emoji: '🖥️', name: '旧电脑配件' },
                { emoji: '📱', name: '旧手机壳' },
                { emoji: '🔌', name: '旧电线' }
            ],
            kitchen: [
                { emoji: '🍌', name: '香蕉皮' },
                { emoji: '🍎', name: '苹果核' },
                { emoji: '🥬', name: '菜叶' },
                { emoji: '🍗', name: '骨头' },
                { emoji: '🍚', name: '剩饭' },
                { emoji: '🥚', name: '蛋壳' },
                { emoji: '🍉', name: '西瓜皮' },
                { emoji: '🥕', name: '胡萝卜头' },
                { emoji: '🍇', name: '葡萄皮' },
                { emoji: '🥔', name: '土豆皮' },
                { emoji: '🍳', name: '鸡蛋壳' },
                { emoji: '🥛', name: '过期牛奶' },
                { emoji: '🍞', name: '过期面包' },
                { emoji: '🥩', name: '肉骨头' },
                { emoji: '🦐', name: '虾壳' }
            ],
            harmful: [
                { emoji: '🔋', name: '电池' },
                { emoji: '💊', name: '药品' },
                { emoji: '💡', name: '灯泡' },
                { emoji: '🧴', name: '杀虫剂' },
                { emoji: '🌡️', name: '温度计' },
                { emoji: '💄', name: '过期化妆品' },
                { emoji: '🧪', name: '化学试剂' },
                { emoji: '🩹', name: '用过的创可贴' },
                { emoji: '💉', name: '针头' },
                { emoji: '🖌️', name: '油漆桶' },
                { emoji: '🧨', name: '废鞭炮' },
                { emoji: '☢️', name: '放射性废料' },
                { emoji: '🧴', name: '指甲油' },
                { emoji: '🗑️', name: '废墨盒' },
                { emoji: '🔦', name: '废荧光棒' }
            ],
            other: [
                { emoji: '🚬', name: '烟头' },
                { emoji: '🧻', name: '用过的纸巾' },
                { emoji: '🍽️', name: '一次性餐具' },
                { emoji: '🩹', name: '创可贴' },
                { emoji: '🧹', name: '灰尘' },
                { emoji: '🧦', name: '破袜子' },
                { emoji: '🪥', name: '旧牙刷' },
                { emoji: '🧽', name: '海绵' },
                { emoji: '🥡', name: '外卖餐盒' },
                { emoji: '🧻', name: '卫生间废纸' },
                { emoji: '🪑', name: '破碎陶瓷' },
                { emoji: '🥢', name: '一次性筷子' },
                { emoji: '👓', name: '破损眼镜' },
                { emoji: '🎒', name: '破旧书包' },
                { emoji: '🥿', name: '破旧拖鞋' }
            ]
        };
    }
    
    initRegionStandards() {
        this.regionStandards = {
            national: {
                name: '国家标准',
                bins: ['recyclable', 'kitchen', 'harmful', 'other'],
                special: {
                    '卫生纸': 'other',
                    '电池': 'harmful',
                    '外卖餐盒': 'other'
                }
            },
            shanghai: {
                name: '上海标准',
                bins: ['recyclable', 'kitchen', 'harmful', 'other'],
                binNames: {
                    recyclable: '可回收物',
                    kitchen: '湿垃圾',
                    harmful: '有害垃圾',
                    other: '干垃圾'
                },
                special: {
                    '大骨头': 'other',
                    '椰子壳': 'other',
                    '小龙虾壳': 'kitchen'
                }
            },
            beijing: {
                name: '北京标准',
                bins: ['recyclable', 'kitchen', 'harmful', 'other'],
                special: {
                    '酸奶盒': 'recyclable',
                    '塑料袋': 'other'
                }
            },
            guangzhou: {
                name: '广州标准',
                bins: ['recyclable', 'kitchen', 'harmful', 'other'],
                special: {
                    '宠物粪便': 'other',
                    '茶叶渣': 'kitchen'
                }
            },
            shenzhen: {
                name: '深圳标准',
                bins: ['recyclable', 'kitchen', 'harmful', 'other'],
                special: {
                    '废弃药品': 'harmful',
                    '旧家具': 'recyclable'
                }
            }
        };
    }
    
    initKnowledgeData() {
        this.knowledgeData = {
            process: {
                recyclable: {
                    title: '♻️ 可回收物处理流程',
                    steps: [
                        { title: '收集分类', desc: '居民将可回收物分类投放至指定回收容器' },
                        { title: '清运运输', desc: '环卫部门定时清运至回收分拣中心' },
                        { title: '分拣处理', desc: '按材质分类：纸类、塑料、玻璃、金属等' },
                        { title: '清洗消毒', desc: '对可回收物进行清洗、消毒、去污处理' },
                        { title: '再生加工', desc: '送工厂进行再加工，生产新产品' }
                    ]
                },
                kitchen: {
                    title: '🍎 厨余垃圾处理流程',
                    steps: [
                        { title: '分类投放', desc: '沥干水分后投放至厨余垃圾专用容器' },
                        { title: '密闭运输', desc: '专用密闭车辆运输，防止滴漏' },
                        { title: '粉碎处理', desc: '送入处理厂进行粉碎、脱水' },
                        { title: '生物发酵', desc: '高温好氧发酵或厌氧发酵' },
                        { title: '资源利用', desc: '生产有机肥、生物柴油等产品' }
                    ]
                },
                harmful: {
                    title: '☠️ 有害垃圾处理流程',
                    steps: [
                        { title: '单独收集', desc: '使用专用容器单独收集有害垃圾' },
                        { title: '安全运输', desc: '专业危化品运输车辆转运' },
                        { title: '分类存储', desc: '按危险特性分类存储' },
                        { title: '专业处理', desc: '固化稳定化、安全填埋或焚烧' },
                        { title: '废气处理', desc: '废气净化达标后排放' }
                    ]
                },
                other: {
                    title: '🗑️ 其他垃圾处理流程',
                    steps: [
                        { title: '收集投放', desc: '投放至其他垃圾收集容器' },
                        { title: '密闭清运', desc: '密闭车辆运输至处理厂' },
                        { title: '焚烧发电', desc: '高温焚烧，产生热能发电' },
                        { title: '残渣处理', desc: '焚烧残渣进行安全填埋' },
                        { title: '烟气净化', desc: '烟气处理达标后排放' }
                    ]
                }
            },
            guide: {
                recyclable: {
                    title: '♻️ 可回收物投放指南',
                    content: `
                        <p><strong>定义：</strong>适宜回收和资源利用的废弃物</p>
                        <ul>
                            <li><strong>纸类：</strong>报纸、书刊、纸箱、办公用纸等</li>
                            <li><strong>塑料：</strong>饮料瓶、洗发水瓶、塑料玩具等</li>
                            <li><strong>玻璃：</strong>玻璃瓶、镜子、灯泡等</li>
                            <li><strong>金属：</strong>易拉罐、金属罐头盒等</li>
                            <li><strong>织物：</strong>旧衣服、桌布、洗脸巾等</li>
                        </ul>
                        <p><strong>注意：</strong>请清洁干燥、平整投放</p>
                    `
                },
                kitchen: {
                    title: '🍎 厨余垃圾投放指南',
                    content: `
                        <p><strong>定义：</strong>日常生活产生的易腐性生物质生活废弃物</p>
                        <ul>
                            <li><strong>食材废料：</strong>谷物、蔬菜、肉类等</li>
                            <li><strong>剩饭剩菜：</strong>米饭、面条、菜肴等</li>
                            <li><strong>果皮果核：</strong>水果皮、果核等</li>
                            <li><strong>过期食品：</strong>面包、糕点、奶制品等</li>
                        </ul>
                        <p><strong>注意：</strong>沥干水分，去除包装物后投放</p>
                    `
                },
                harmful: {
                    title: '☠️ 有害垃圾投放指南',
                    content: `
                        <p><strong>定义：</strong>对人体健康或自然环境造成直接或潜在危害的废弃物</p>
                        <ul>
                            <li><strong>电池类：</strong>充电电池、纽扣电池、蓄电池等</li>
                            <li><strong>灯管类：</strong>荧光灯管、节能灯等</li>
                            <li><strong>药品类：</strong>过期药品、药品包装等</li>
                            <li><strong>油漆类：</strong>废油漆、溶剂及其包装物</li>
                            <li><strong>其他：</strong>废杀虫剂、消毒剂、化妆品等</li>
                        </ul>
                        <p><strong>注意：</strong>请勿拆解，保持完整，轻放</p>
                    `
                },
                other: {
                    title: '🗑️ 其他垃圾投放指南',
                    content: `
                        <p><strong>定义：</strong>除可回收物、厨余垃圾、有害垃圾外的其他生活废弃物</p>
                        <ul>
                            <li><strong>污染纸张：</strong>卫生纸、湿巾、纸尿裤等</li>
                            <li><strong>破损陶瓷：</strong>陶瓷碗盘、花瓶等</li>
                            <li><strong>一次性用品：</strong>一次性餐具、杯子等</li>
                            <li><strong>烟蒂尘土：</strong>烟头、烟灰、尘土等</li>
                            <li><strong>其他：</strong>旧毛巾、旧牙刷、海绵等</li>
                        </ul>
                        <p><strong>注意：</strong>尽量沥干后投放</p>
                    `
                }
            },
            tips: [
                { title: '垃圾分类顺口溜', content: '绿厨余，蓝可收，红有害，灰其他，记清楚，不乱扔，环境美，人人夸' },
                { title: '投放小技巧', content: '投放前先看标识，不确定查一查，养成好习惯，分类并不难' },
                { title: '常见误区', content: '大骨头不是厨余垃圾，卫生纸不是可回收物，电池一定要单独放' },
                { title: '环保意义', content: '垃圾分类可以减少占地，减少环境污染，变废为宝' },
                { title: '从我做起', content: '垃圾分类，从我做起，从小事做起，让地球更美好' }
            ]
        };
    }
    
    init() {
        this.video = document.getElementById('camera');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.arContainer = document.querySelector('.ar-container');
        this.startOverlay = document.getElementById('startOverlay');
        this.messageOverlay = document.getElementById('messageOverlay');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.messageContent = this.messageOverlay.querySelector('.message-content');
        this.bins = document.querySelectorAll('.bin');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerElement = document.getElementById('timer');
        
        this.resizeCanvas();
        this.bindEvents();
        this.loadRecords();
        this.updateBinLabels();
    }
    
    resizeCanvas() {
        this.canvas.width = this.arContainer.clientWidth;
        this.canvas.height = this.arContainer.clientHeight;
    }
    
    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('recordsBtn').addEventListener('click', () => this.showRecords());
        document.getElementById('knowledgeBtn').addEventListener('click', () => this.showKnowledge());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
            });
        });
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameMode = e.target.dataset.mode;
                
                const challengeSettings = document.getElementById('challengeSettings');
                if (this.gameMode === 'challenge') {
                    challengeSettings.classList.remove('hidden');
                } else {
                    challengeSettings.classList.add('hidden');
                }
            });
        });
        
        document.getElementById('regionSelect').addEventListener('change', (e) => {
            this.currentRegion = e.target.value;
            this.updateBinLabels();
            this.clearTrash();
            if (this.isPlaying && !this.isPaused) {
                this.spawnTrash();
            }
        });
        
        document.getElementById('timeSelect').addEventListener('change', (e) => {
            this.challengeTime = parseInt(e.target.value);
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderKnowledgeTab(e.target.dataset.tab);
            });
        });
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.bins.forEach(bin => {
            bin.addEventListener('dragover', (e) => e.preventDefault());
            bin.addEventListener('drop', (e) => this.handleDrop(e, bin));
        });
    }
    
    updateBinLabels() {
        const standard = this.regionStandards[this.currentRegion];
        if (standard.binNames && Object.keys(standard.binNames).length > 0) {
            this.bins.forEach(bin => {
                const type = bin.dataset.type;
                const label = bin.querySelector('.bin-label');
                if (standard.binNames[type]) {
                    label.textContent = standard.binNames[type];
                }
            });
        }
    }
    
    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            this.video.srcObject = stream;
        } catch (err) {
            console.log('无法访问摄像头，使用模拟模式:', err);
            this.video.style.background = 'linear-gradient(45deg, #333, #666)';
        }
    }
    
    async startGame() {
        await this.startCamera();
        this.startOverlay.classList.add('hidden');
        this.isPlaying = true;
        this.isPaused = false;
        this.score = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        this.updateScore();
        
        if (this.gameMode === 'challenge') {
            this.currentTime = this.challengeTime;
            this.timerDisplay.classList.remove('hidden');
            this.startTimer();
        } else {
            this.timerDisplay.classList.add('hidden');
        }
        
        this.spawnTrash();
    }
    
    startTimer() {
        this.timerElement.textContent = this.currentTime;
        this.timerElement.classList.remove('warning');
        
        this.timerInterval = setInterval(() => {
            if (this.isPaused) return;
            
            this.currentTime--;
            this.timerElement.textContent = this.currentTime;
            
            if (this.currentTime <= 10) {
                this.timerElement.classList.add('warning');
            }
            
            if (this.currentTime <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    endGame() {
        this.isPlaying = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.clearTrash();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalTotal').textContent = this.totalAttempts;
        const accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctAttempts / this.totalAttempts) * 100) 
            : 0;
        document.getElementById('finalAccuracy').textContent = accuracy + '%';
        
        this.gameOverOverlay.classList.remove('hidden');
        this.saveRecord();
    }
    
    playAgain() {
        this.gameOverOverlay.classList.add('hidden');
        this.startOverlay.classList.remove('hidden');
    }
    
    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '▶️ 继续' : '⏸️ 暂停';
        
        if (this.isPaused) {
            this.showMessage('游戏已暂停', 'info', 0);
        } else {
            this.hideMessage();
        }
    }
    
    restartGame() {
        this.clearTrash();
        this.hideMessage();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.startOverlay.classList.remove('hidden');
        this.gameOverOverlay.classList.add('hidden');
        this.isPlaying = false;
    }
    
    spawnTrash() {
        if (!this.isPlaying || this.isPaused) return;
        
        const allTypes = Object.keys(this.allTrashItems);
        const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
        const items = this.allTrashItems[randomType];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        const trashElement = document.createElement('div');
        trashElement.className = 'trash-item';
        trashElement.textContent = randomItem.emoji;
        trashElement.dataset.type = randomType;
        trashElement.dataset.name = randomItem.name;
        
        const containerW = this.arContainer.clientWidth;
        const containerH = this.arContainer.clientHeight;
        const itemSize = 60;
        const margin = 20;
        
        const maxX = containerW - itemSize - margin;
        const maxY = containerH - itemSize - margin;
        const x = Math.random() * (maxX - margin) + margin;
        const y = Math.random() * (maxY - margin) + margin;
        
        trashElement.style.left = Math.max(margin, Math.min(x, maxX)) + 'px';
        trashElement.style.top = Math.max(margin, Math.min(y, maxY)) + 'px';
        
        trashElement.draggable = true;
        trashElement.addEventListener('dragstart', (e) => this.handleDragStart(e, trashElement));
        trashElement.addEventListener('dragend', (e) => this.handleDragEnd(e, trashElement));
        
        trashElement.addEventListener('touchstart', (e) => this.handleTouchStart(e, trashElement));
        trashElement.addEventListener('touchmove', (e) => this.handleTouchMove(e, trashElement));
        trashElement.addEventListener('touchend', (e) => this.handleTouchEnd(e, trashElement));
        
        this.arContainer.appendChild(trashElement);
        this.trashItems.push(trashElement);
    }
    
    handleDragStart(e, element) {
        if (this.isPaused) {
            e.preventDefault();
            return;
        }
        element.classList.add('dragging');
        this.currentTrash = element;
        e.dataTransfer.effectAllowed = 'move';
    }
    
    handleDragEnd(e, element) {
        element.classList.remove('dragging');
        this.currentTrash = null;
    }
    
    handleTouchStart(e, element) {
        if (this.isPaused) return;
        
        const touch = e.touches[0];
        const rect = element.getBoundingClientRect();
        
        element.dataset.startX = touch.clientX;
        element.dataset.startY = touch.clientY;
        element.dataset.offsetX = touch.clientX - rect.left;
        element.dataset.offsetY = touch.clientY - rect.top;
        element.dataset.isDragging = 'false';
        element.dataset.dragStartTime = Date.now();
    }
    
    handleTouchMove(e, element) {
        if (this.isPaused) return;
        
        const touch = e.touches[0];
        const startX = parseFloat(element.dataset.startX);
        const startY = parseFloat(element.dataset.startY);
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);
        const dragThreshold = 10;
        const longPressTime = 150;
        const elapsedTime = Date.now() - parseInt(element.dataset.dragStartTime);
        
        if (element.dataset.isDragging === 'false') {
            if (deltaX > deltaY && deltaX > dragThreshold) {
                e.preventDefault();
                element.dataset.isDragging = 'true';
                element.classList.add('dragging');
                this.currentTrash = element;
            } else if (elapsedTime > longPressTime && (deltaX + deltaY) < 5) {
                e.preventDefault();
                element.dataset.isDragging = 'true';
                element.classList.add('dragging');
                this.currentTrash = element;
            }
            return;
        }
        
        if (element.dataset.isDragging !== 'true' || !this.currentTrash) return;
        e.preventDefault();
        
        const containerRect = this.arContainer.getBoundingClientRect();
        const offsetX = parseFloat(element.dataset.offsetX);
        const offsetY = parseFloat(element.dataset.offsetY);
        
        let x = touch.clientX - containerRect.left - offsetX;
        let y = touch.clientY - containerRect.top - offsetY;
        
        const margin = 20;
        x = Math.max(margin, Math.min(x, containerRect.width - element.offsetWidth - margin));
        y = Math.max(margin, Math.min(y, containerRect.height - element.offsetHeight - margin));
        
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }
    
    handleTouchEnd(e, element) {
        if (this.isPaused) return;
        
        const wasDragging = element.dataset.isDragging === 'true';
        element.dataset.isDragging = 'false';
        element.classList.remove('dragging');
        
        if (!wasDragging || !this.currentTrash) {
            this.currentTrash = null;
            return;
        }
        
        const touch = e.changedTouches[0];
        const binsArray = Array.from(this.bins);
        
        for (const bin of binsArray) {
            const binRect = bin.getBoundingClientRect();
            if (
                touch.clientX >= binRect.left &&
                touch.clientX <= binRect.right &&
                touch.clientY >= binRect.top &&
                touch.clientY <= binRect.bottom
            ) {
                this.checkClassification(element, bin);
                return;
            }
        }
        
        this.currentTrash = null;
    }
    
    handleDrop(e, bin) {
        e.preventDefault();
        if (!this.currentTrash || this.isPaused) return;
        this.checkClassification(this.currentTrash, bin);
    }
    
    checkClassification(trashElement, bin) {
        const trashType = trashElement.dataset.type;
        const binType = bin.dataset.type;
        const trashName = trashElement.dataset.name;
        
        this.totalAttempts++;
        
        let correctType = trashType;
        const standard = this.regionStandards[this.currentRegion];
        if (standard.special && standard.special[trashName]) {
            correctType = standard.special[trashName];
        }
        
        if (correctType === binType) {
            this.correctAttempts++;
            this.score += 10;
            trashElement.classList.add('correct');
            this.showMessage('✅ 分类正确！+' + trashName, 'correct');
        } else {
            trashElement.classList.add('wrong');
            const correctBinName = this.getBinName(correctType);
            this.showMessage('❌ 分类错误！' + trashName + ' 应该放入 ' + correctBinName, 'wrong');
        }
        
        this.updateScore();
        
        setTimeout(() => {
            trashElement.remove();
            this.trashItems = this.trashItems.filter(t => t !== trashElement);
            this.currentTrash = null;
            
            if (this.isPlaying && !this.isPaused) {
                setTimeout(() => this.spawnTrash(), 500);
            }
        }, 500);
    }
    
    getBinName(type) {
        const standard = this.regionStandards[this.currentRegion];
        if (standard.binNames && standard.binNames[type]) {
            return standard.binNames[type];
        }
        const names = {
            recyclable: '可回收物',
            kitchen: '厨余垃圾',
            harmful: '有害垃圾',
            other: '其他垃圾'
        };
        return names[type] || type;
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        const accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctAttempts / this.totalAttempts) * 100) 
            : 0;
        document.getElementById('accuracy').textContent = accuracy + '%';
    }
    
    showMessage(text, type, duration = 1500) {
        this.messageContent.textContent = text;
        this.messageContent.className = 'overlay-content message-content ' + type;
        this.messageOverlay.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                this.hideMessage();
            }, duration);
        }
    }
    
    hideMessage() {
        this.messageOverlay.classList.add('hidden');
    }
    
    clearTrash() {
        this.trashItems.forEach(item => item.remove());
        this.trashItems = [];
        this.currentTrash = null;
    }
    
    async saveRecord() {
        if (this.totalAttempts === 0) return;
        
        const record = {
            date: new Date().toLocaleString('zh-CN'),
            score: this.score,
            total: this.totalAttempts,
            correct: this.correctAttempts,
            accuracy: Math.round((this.correctAttempts / this.totalAttempts) * 100),
            mode: this.gameMode,
            region: this.regionStandards[this.currentRegion].name
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            });
            
            if (!response.ok) {
                throw new Error('保存失败');
            }
        } catch (err) {
            console.log('使用本地存储:', err);
            const records = JSON.parse(localStorage.getItem('trashGameRecords') || '[]');
            records.unshift(record);
            if (records.length > 20) records.pop();
            localStorage.setItem('trashGameRecords', JSON.stringify(records));
        }
    }
    
    async loadRecords() {
        try {
            const response = await fetch('http://localhost:3000/api/records');
            if (response.ok) {
                this.records = await response.json();
            } else {
                throw new Error('加载失败');
            }
        } catch (err) {
            console.log('使用本地存储:', err);
            this.records = JSON.parse(localStorage.getItem('trashGameRecords') || '[]');
        }
    }
    
    async showRecords() {
        if (this.isPlaying) {
            await this.saveRecord();
        }
        await this.loadRecords();
        
        const recordsList = document.getElementById('recordsList');
        
        if (this.records.length === 0) {
            recordsList.innerHTML = '<p style="text-align: center; color: #666;">暂无游戏记录</p>';
        } else {
            recordsList.innerHTML = this.records.map(record => `
                <div class="record-item">
                    <div class="record-date">${record.date} ${record.region ? '- ' + record.region : ''} ${record.mode ? '(' + (record.mode === 'challenge' ? '限时挑战' : '无尽模式') + ')' : ''}</div>
                    <div class="record-stats">
                        <span>得分: ${record.score}</span>
                        <span>正确: ${record.correct}/${record.total}</span>
                        <span>正确率: ${record.accuracy}%</span>
                    </div>
                </div>
            `).join('');
        }
        
        document.getElementById('recordsModal').classList.remove('hidden');
    }
    
    showKnowledge() {
        this.renderKnowledgeTab('process');
        document.getElementById('knowledgeModal').classList.remove('hidden');
    }
    
    renderKnowledgeTab(tab) {
        const content = document.getElementById('knowledgeContent');
        
        if (tab === 'process') {
            content.innerHTML = Object.entries(this.knowledgeData.process).map(([type, process]) => `
                <div class="knowledge-card ${type}">
                    <h4>${process.title}</h4>
                    ${process.steps.map((step, index) => `
                        <div class="process-step">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">
                                <h4>${step.title}</h4>
                                <p>${step.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');
        } else if (tab === 'guide') {
            content.innerHTML = Object.entries(this.knowledgeData.guide).map(([type, guide]) => `
                <div class="knowledge-card ${type}">
                    ${guide.content}
                </div>
            `).join('');
        } else if (tab === 'tips') {
            content.innerHTML = this.knowledgeData.tips.map(tip => `
                <div class="tip-item">
                    <strong>${tip.title}</strong>
                    <p>${tip.content}</p>
                </div>
            `).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TrashGame();
});
