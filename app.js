const API_BASE = 'https://api.github.com';

let allIssues = [];

async function fetchIssues() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const forest = document.getElementById('bamboo-forest');

    loading.style.display = 'block';
    error.style.display = 'none';
    forest.innerHTML = '';

    try {
        const url = `${API_BASE}/repos/${CONFIG.owner}/${CONFIG.repo}/issues?state=all&per_page=100`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const issues = await response.json();
        allIssues = issues.filter(issue => !issue.pull_request);
        
        updateBambooCount();
        renderForest(allIssues);
    } catch (err) {
        error.textContent = `대나무 숲을 불러오는데 실패했습니다: ${err.message}`;
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function updateBambooCount() {
    const count = document.getElementById('bamboo-count');
    count.textContent = `🎋 ${allIssues.length}그루`;
}

function getEmotionFromLabels(labels) {
    if (!labels || labels.length === 0) return { emoji: '😌', text: '평온' };
    
    const emotionMap = {
        '😊 기쁨': { emoji: '😊', text: '기쁨' },
        '😢 슬픔': { emoji: '😢', text: '슬픔' },
        '😠 화남': { emoji: '😠', text: '화남' },
        '😌 평온': { emoji: '😌', text: '평온' },
        '💪 의지': { emoji: '💪', text: '의지' }
    };
    
    for (const label of labels) {
        if (emotionMap[label.name]) {
            return emotionMap[label.name];
        }
    }
    return { emoji: '😌', text: '평온' };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hour}:${min}`;
}

function truncateText(text, maxLength = 200) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function createBambooCard(issue, index) {
    const emotion = getEmotionFromLabels(issue.labels);
    const date = formatDate(issue.created_at);
    const content = truncateText(issue.body || '속마음이 적혀있지 않아요...');

    const card = document.createElement('div');
    card.className = 'bamboo-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.dataset.emotion = emotion.text;

    card.innerHTML = `
        <button class="bamboo-delete" title="일기 삭제">🗑️ 삭제</button>
        <div class="bamboo-emotion">${emotion.emoji} ${emotion.text}</div>
        <div class="bamboo-content">${content}</div>
        <div class="bamboo-meta">
            <span class="bamboo-author">익명의 나그네</span>
            <span class="bamboo-date">${date}</span>
        </div>
    `;

    const deleteBtn = card.querySelector('.bamboo-delete');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('정말 이 일기를 삭제하시겠어요?\n판다가 와서 대나무를 먹을 거예요! 🐼')) {
            deleteBamboo(issue, card);
        }
    });

    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('bamboo-delete')) {
            window.open(issue.html_url, '_blank');
        }
    });

    return card;
}

function renderForest(issues) {
    const forest = document.getElementById('bamboo-forest');
    forest.innerHTML = '';

    const sortedIssues = [...issues].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );

    sortedIssues.forEach((issue, index) => {
        const card = createBambooCard(issue, index);
        forest.appendChild(card);
    });
}

function filterIssues() {
    const emotionFilter = document.getElementById('emotion-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    let filtered = allIssues;

    if (emotionFilter !== 'all') {
        filtered = filtered.filter(issue => {
            const emotion = getEmotionFromLabels(issue.labels);
            return emotion.text + ' ' === emotionFilter.split(' ')[1] + ' ';
        });
        
        filtered = filtered.filter(issue => {
            const labels = issue.labels || [];
            return labels.some(label => label.name === emotionFilter);
        });
    }

    if (searchTerm) {
        filtered = filtered.filter(issue => 
            (issue.body && issue.body.toLowerCase().includes(searchTerm))
        );
    }

    renderForest(filtered);
}

function showPanda() {
    const panda = document.getElementById('panda-container');
    panda.classList.add('active');
    
    setTimeout(() => {
        panda.classList.remove('active');
    }, 4000);
}

function deleteBamboo(issue, card) {
    showPanda();
    
    card.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
        card.remove();
        allIssues = allIssues.filter(i => i.number !== issue.number);
        updateBambooCount();
    }, 500);
    
    setTimeout(() => {
        window.open(issue.html_url, '_blank');
        alert('GitHub에서 "Close issue" 버튼을 눌러 일기를 완전히 삭제해주세요!');
    }, 1000);
}

function showPanda() {
    const panda = document.getElementById('panda-container');
    panda.classList.add('active');
    
    setTimeout(() => {
        panda.classList.remove('active');
    }, 4000);
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
    }
}

document.getElementById('emotion-filter').addEventListener('change', filterIssues);
document.getElementById('search-input').addEventListener('input', filterIssues);

function init() {
    const githubLink = document.getElementById('github-link');
    githubLink.href = `https://github.com/${CONFIG.owner}/${CONFIG.repo}`;

    const fab = document.getElementById('fab');
    fab.addEventListener('click', () => {
        window.open(`https://github.com/${CONFIG.owner}/${CONFIG.repo}/issues/new`, '_blank');
    });

    fetchIssues();
    
    setInterval(fetchIssues, 60000);
}

document.addEventListener('DOMContentLoaded', init);
