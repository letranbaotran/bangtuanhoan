(function () {
  const CV = (window.CHEMVERSE = window.CHEMVERSE || {});

  const BADGES = [
    { id: 'beginner', name: 'Chemistry Beginner', icon: '🌱', desc: 'Bắt đầu hành trình khám phá CHEMVERSE', check: (u) => u.xp >= 10 },
    { id: 'explorer', name: 'Element Explorer', icon: '🔭', desc: 'Khám phá ít nhất 10 nguyên tố hóa học', check: (u) => (u.exploredElements || []).length >= 10 },
    { id: 'periodic', name: 'Periodic Master', icon: '📈', desc: 'Phân tích quy luật tuần hoàn trong ChemPredict', check: (u) => (u.predictCount || 0) >= 1 },
    { id: 'reaction', name: 'Reaction Expert', icon: '⚗️', desc: 'Thực hiện ít nhất 3 phản ứng trong Virtual Lab', check: (u) => (u.reactionCount || 0) >= 3 },
    { id: 'scientist', name: 'Virtual Scientist', icon: '👨‍🔬', desc: 'Đạt từ 300 XP trở lên', check: (u) => u.xp >= 300 }
  ];

  const SAMPLE_LEADERBOARD = [
    { name: 'Lê Trần Bảo Trân (10A1)', xp: 520, level: 6 },
    { name: 'Nguyễn Phương Anh (10A1)', xp: 440, level: 5 },
    { name: 'Trần Mỹ Tâm (10A1)', xp: 360, level: 4 },
    { name: 'Nguyễn Công Tuấn Anh', xp: 290, level: 3 }
  ];

  function loadUsers() {
    try {
      const raw = localStorage.getItem('chemverse_users');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      baotran: {
        username: 'baotran',
        displayName: 'Lê Trần Bảo Trân',
        password: '123',
        xp: 120,
        streak: 3,
        lastActiveDate: new Date().toDateString(),
        exploredElements: [1, 6, 8, 11, 26],
        reactionCount: 1,
        predictCount: 0,
        history: ['[Khởi tạo] Chào mừng đến với CHEMVERSE!']
      }
    };
  }

  function saveUsers(users) {
    localStorage.setItem('chemverse_users', JSON.stringify(users));
  }

  CV.Player = {
    getCurrentUsername() {
      return localStorage.getItem('chemverse_current_user') || null;
    },

    getCurrentUser() {
      const uname = this.getCurrentUsername();
      if (!uname) return null;
      const users = loadUsers();
      return users[uname] || null;
    },

    getLevel(xp) {
      return Math.floor((xp || 0) / 100) + 1;
    },

    register(username, displayName, password) {
      const u = username.trim().toLowerCase();
      if (!u || !password) return { ok: false, msg: 'Vui lòng nhập tên đăng nhập và mật khẩu.' };
      const users = loadUsers();
      if (users[u]) return { ok: false, msg: 'Tên đăng nhập đã tồn tại!' };
      users[u] = {
        username: u,
        displayName: displayName.trim() || u,
        password,
        xp: 20,
        streak: 1,
        lastActiveDate: new Date().toDateString(),
        exploredElements: [],
        reactionCount: 0,
        predictCount: 0,
        history: [`[${new Date().toLocaleTimeString('vi-VN')}] Đăng ký tài khoản (+20 XP)`]
      };
      saveUsers(users);
      localStorage.setItem('chemverse_current_user', u);
      return { ok: true };
    },

    login(username, password) {
      const u = username.trim().toLowerCase();
      const users = loadUsers();
      if (!users[u] || users[u].password !== password) {
        return { ok: false, msg: 'Sai tên đăng nhập hoặc mật khẩu.' };
      }
      const today = new Date().toDateString();
      if (users[u].lastActiveDate !== today) {
        users[u].streak = (users[u].streak || 0) + 1;
        users[u].lastActiveDate = today;
      }
      saveUsers(users);
      localStorage.setItem('chemverse_current_user', u);
      return { ok: true };
    },

    logout() {
      localStorage.removeItem('chemverse_current_user');
    },

    recordEvent(type, detail, xpGain) {
      const uname = this.getCurrentUsername();
      if (!uname) return;
      const users = loadUsers();
      const user = users[uname];
      if (!user) return;

      if (type === 'element' && detail) {
        user.exploredElements = user.exploredElements || [];
        if (!user.exploredElements.includes(detail)) {
          user.exploredElements.push(detail);
          user.xp += xpGain;
        }
      } else {
        user.xp += xpGain;
      }

      if (type === 'reaction') user.reactionCount = (user.reactionCount || 0) + 1;
      if (type === 'predict') user.predictCount = (user.predictCount || 0) + 1;

      const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      user.history = user.history || [];
      user.history.unshift(`[${time}] ${type === 'element' ? 'Khám phá nguyên tố Z=' + detail : detail} (+${xpGain} XP)`);
      if (user.history.length > 25) user.history.pop();

      saveUsers(users);
      if (CV.state.currentRoute === 'profile' && CV.modules.profile) {
        CV.modules.profile.render();
      }
    }
  };

  CV.modules.profile = {
    init(container) {
      this.container = container;
      this.render();
    },

    onShow() {
      this.render();
    },

    render() {
      const user = CV.Player.getCurrentUser();
      if (!user) {
        this.renderAuth();
        return;
      }

      const level = CV.Player.getLevel(user.xp);
      const nextXp = level * 100;
      const pct = user.xp % 100;
      const unlockedBadges = BADGES.filter((b) => b.check(user));

      // Combine leaderboard
      const board = [
        ...SAMPLE_LEADERBOARD,
        { name: `${user.displayName} (Bạn)`, xp: user.xp, level, isSelf: true }
      ].sort((a, b) => b.xp - a.xp);

      this.container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">👤 ${CV.t('Hồ Sơ Nhà Khoa Học & Thành Tích', 'Scientist Profile & Gamification')}</h2>
              <p class="section-subtitle">${CV.t('Theo dõi điểm XP, cấp độ, huy hiệu, nhiệm vụ hằng ngày và bảng xếp hạng', 'Track XP, player level, badges, daily missions, and leaderboard')}</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="prof-logout-btn">🚪 ${CV.t('Đăng xuất', 'Logout')}</button>
          </div>

          <!-- Top Player Stats -->
          <div class="stats-grid" style="margin-bottom:24px;">
            <div class="stat-card glass-surface">
              <div class="stat-value">Lv.${level}</div>
              <div class="stat-label">${user.displayName}</div>
              <div class="stat-sub mono">${user.xp} / ${nextXp} XP</div>
              <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:999px;margin-top:8px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#00E5FF,#818CF8);"></div>
              </div>
            </div>
            <div class="stat-card glass-surface">
              <div class="stat-value">🔥 ${user.streak || 1}</div>
              <div class="stat-label">${CV.t('Chuỗi ngày học tập', 'Study Streak')}</div>
              <div class="stat-sub">${CV.t('Ngày liên tiếp', 'Consecutive days')}</div>
            </div>
            <div class="stat-card glass-surface">
              <div class="stat-value">${(user.exploredElements || []).length}/118</div>
              <div class="stat-label">${CV.t('Nguyên tố đã mở', 'Elements Explored')}</div>
              <div class="stat-sub">${CV.t('Phản ứng đã thử:', 'Reactions:')} ${user.reactionCount || 0}</div>
            </div>
            <div class="stat-card glass-surface">
              <div class="stat-value">${unlockedBadges.length}/${BADGES.length}</div>
              <div class="stat-label">${CV.t('Huy hiệu đạt được', 'Badges Unlocked')}</div>
              <div class="stat-sub">${CV.t('Thành tích cá nhân', 'Personal Achievements')}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-bottom:24px;">
            <!-- Badges -->
            <div class="glass-surface" style="padding:20px;border-radius:var(--radius-lg);">
              <h3 style="margin-bottom:12px;">🏅 ${CV.t('Bộ Sưu Tập Huy Hiệu', 'Badges Collection')}</h3>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${BADGES.map((b) => {
                  const ok = b.check(user);
                  return `
                  <div class="glass-surface" style="padding:10px 12px;border-radius:12px;display:flex;align-items:center;gap:12px;opacity:${ok ? 1 : 0.45};border-color:${ok ? 'rgba(0,229,255,0.45)' : 'var(--glass-border)'};">
                    <span style="font-size:1.5rem;">${b.icon}</span>
                    <div style="flex:1;">
                      <div style="font-weight:700;font-size:0.9rem;">${b.name} ${ok ? '✅' : '🔒'}</div>
                      <div style="font-size:0.78rem;color:var(--text-muted);">${b.desc}</div>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>

            <!-- Daily Missions -->
            <div class="glass-surface" style="padding:20px;border-radius:var(--radius-lg);">
              <h3 style="margin-bottom:12px;">📋 ${CV.t('Nhiệm Vụ Hằng Ngày', 'Daily Missions')}</h3>
              <div style="display:flex;flex-direction:column;gap:12px;font-size:0.86rem;">
                <div>
                  <div style="display:flex;justify-content:space-between;"><span>🔭 Khám phá 3 nguyên tố</span><strong class="mono">${Math.min(3, (user.exploredElements || []).length)}/3</strong></div>
                  <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:999px;margin-top:4px;"><div style="width:${Math.min(100, ((user.exploredElements || []).length / 3) * 100)}%;height:100%;background:#34D399;border-radius:999px;"></div></div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;"><span>🔬 Thực hiện 2 phản ứng Virtual Lab</span><strong class="mono">${Math.min(2, user.reactionCount || 0)}/2</strong></div>
                  <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:999px;margin-top:4px;"><div style="width:${Math.min(100, ((user.reactionCount || 0) / 2) * 100)}%;height:100%;background:#38BDF8;border-radius:999px;"></div></div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;"><span>📈 Phân tích quy luật ChemPredict</span><strong class="mono">${Math.min(1, user.predictCount || 0)}/1</strong></div>
                  <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:999px;margin-top:4px;"><div style="width:${Math.min(100, ((user.predictCount || 0) / 1) * 100)}%;height:100%;background:#C084FC;border-radius:999px;"></div></div>
                </div>
              </div>

              <h3 style="margin:20px 0 10px;">🏆 ${CV.t('Bảng Xếp Hạng', 'Leaderboard')}</h3>
              <div style="display:flex;flex-direction:column;gap:6px;">
                ${board
                  .map(
                    (row, idx) => `
                  <div style="display:flex;justify-content:space-between;padding:8px 10px;border-radius:10px;background:${row.isSelf ? 'rgba(0,229,255,0.14)' : 'rgba(255,255,255,0.04)'};font-size:0.84rem;">
                    <span><strong>#${idx + 1}</strong> ${row.name}</span>
                    <span class="mono" style="color:#FBBF24;">Lv.${row.level} • ${row.xp} XP</span>
                  </div>`
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('prof-logout-btn').addEventListener('click', () => {
        CV.Player.logout();
        this.render();
      });
    },

    renderAuth() {
      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface" style="max-width:480px;">
            <h2 style="text-align:center;margin-bottom:6px;">👨‍🚀 ${CV.t('Đăng Nhập / Đăng Ký CHEMVERSE', 'CHEMVERSE Account')}</h2>
            <p style="text-align:center;color:var(--text-muted);font-size:0.88rem;margin-bottom:18px;">
              ${CV.t('Lưu điểm XP, cấp độ, huy hiệu và lịch sử thí nghiệm của riêng bạn', 'Save your XP, player level, badges, and lab history')}
            </p>

            <div style="display:flex;flex-direction:column;gap:12px;">
              <input type="text" id="auth-user" class="input-field" placeholder="Tên đăng nhập (vd: baotran)" />
              <input type="text" id="auth-name" class="input-field" placeholder="Họ tên hiển thị (khi đăng ký mới)" />
              <input type="password" id="auth-pass" class="input-field" placeholder="Mật khẩu" />
              <div id="auth-msg" style="font-size:0.84rem;color:#F87171;"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <button class="btn btn-primary" id="auth-login-btn">🔑 Đăng nhập</button>
                <button class="btn btn-secondary" id="auth-reg-btn">✨ Đăng ký mới</button>
              </div>
              <button class="btn btn-secondary btn-sm" id="auth-demo-btn">⚡ Dùng nhanh tài khoản mẫu (baotran / 123)</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('auth-login-btn').addEventListener('click', () => {
        const res = CV.Player.login(document.getElementById('auth-user').value, document.getElementById('auth-pass').value);
        if (!res.ok) document.getElementById('auth-msg').textContent = res.msg;
        else this.render();
      });

      document.getElementById('auth-reg-btn').addEventListener('click', () => {
        const res = CV.Player.register(
          document.getElementById('auth-user').value,
          document.getElementById('auth-name').value,
          document.getElementById('auth-pass').value
        );
        if (!res.ok) document.getElementById('auth-msg').textContent = res.msg;
        else this.render();
      });

      document.getElementById('auth-demo-btn').addEventListener('click', () => {
        CV.Player.login('baotran', '123');
        this.render();
      });
    }
  };
})();
