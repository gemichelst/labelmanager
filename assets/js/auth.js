/* ═══════════════════════════════════════════════════════════════
   auth.js  —  LabelManager · Authentication & Help
   Path:  assets/js/auth.js
   Load:  BEFORE assets/js/index.js  in index.html
═══════════════════════════════════════════════════════════════ */
'use strict';

const LMAuth = {
  SESSION_KEY: 'lm_session_v1',

  getSession() {
    try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)) || null; }
    catch { return null; }
  },
  setSession(user) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({
      userId: user.id, role: user.role, name: user.name,
      email: user.email, loginAt: new Date().toISOString()
    }));
  },
  clearSession() { localStorage.removeItem(this.SESSION_KEY); },

  /** Must be called AFTER LOS.db is loaded. Returns true if session valid. */
  guard() {
    const sess = this.getSession();
    if (!sess) { this.showLogin(); return false; }
    const user = (LOS.db.users || []).find(u => u.id === sess.userId);
    if (!user || user.status !== 'Active') {
      this.clearSession();
      this.showLogin('Your account is inactive or was removed. Contact an admin.');
      return false;
    }
    LOS.role = user.role;
    LMAuth._currentUser = user;
    return true;
  },

  showLogin(errorMsg) {
    const screen = document.getElementById('loginScreen');
    const shell  = document.getElementById('appShell');
    if (screen) screen.classList.remove('hidden');
    if (shell)  shell.style.display = 'none';
    if (errorMsg) this._setError(errorMsg);
    setTimeout(() => document.getElementById('loginEmail')?.focus(), 80);
  },

  hideLogin() {
    document.getElementById('loginScreen')?.classList.add('hidden');
    const shell = document.getElementById('appShell');
    if (shell) { shell.style.display = ''; }
  },

  attempt() {
    const emailInput = document.getElementById('loginEmail');
    const passInput  = document.getElementById('loginPass');
    const email = emailInput?.value.trim().toLowerCase();
    const pass  = passInput?.value;

    if (!email || !pass) {
      this._setError('Please enter your email and password.');
      return;
    }
    const user = (LOS.db.users || []).find(u => u.email.toLowerCase() === email);
    if (!user) {
      this._setError('No account found with this email address.');
      return;
    }
    if (user.status !== 'Active') {
      this._setError('This account is inactive. Contact an admin.');
      return;
    }
    /* Password: stored in user.password OR fallback = email-prefix + "1234" */
    const expected = user.password || (user.email.split('@')[0] + '1234');
    if (pass !== expected) {
      this._setError('Incorrect password. Please try again.');
      passInput.value = '';
      passInput.focus();
      return;
    }

    /* ✅  Auth OK */
    this.setSession(user);
    LOS.role = user.role;
    LMAuth._currentUser = user;
    user.lastactive = new Date().toISOString().slice(0, 10);
    LOS.save();

    this._setError('');
    this.hideLogin();
    LOS.updateRoleChip();
    LOS.applyRBAC();
    LOS.renderAll();
    if (typeof LOS.initNotifications === 'function') LOS.initNotifications();
    LOS.renderSidebarUser();
    LOS.log(`${user.name} signed in`, 'System');
  },

  logout() {
    const u = this._currentUser;
    if (u) LOS.log(`${u.name} signed out`, 'System');
    LOS.save();
    this.clearSession();
    this._currentUser = null;
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value  = '';
    this._setError('');
    this.showLogin();
  },

  _setError(msg) {
    const el = document.getElementById('loginError');
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('show', !!msg);
  },

  init() {
    document.getElementById('loginBtn')
      ?.addEventListener('click', () => this.attempt());
    ['loginEmail', 'loginPass'].forEach(id =>
      document.getElementById(id)
        ?.addEventListener('keydown', e => { if (e.key === 'Enter') this.attempt(); })
    );
    document.getElementById('logoutBtn')
      ?.addEventListener('click', () => this.logout());
  }
};

/* ═══════════════════════════════════════════════════════════════
   HELP — opens ./docs/index.html in an iframe modal
═══════════════════════════════════════════════════════════════ */
const LMHelp = {
  _loaded: false,

  open() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    modal.classList.add('open');
    if (!this._loaded) {
      const f = document.getElementById('helpFrame');
      if (f) f.src = './docs/index.html';
      this._loaded = true;
    }
  },

  close() {
    document.getElementById('helpModal')?.classList.remove('open');
  },

  init() {
    ['helpBtn', 'helpBtnTop'].forEach(id =>
      document.getElementById(id)?.addEventListener('click', () => this.open())
    );
    document.getElementById('helpClose')
      ?.addEventListener('click', () => this.close());
    document.getElementById('helpModalOverlay')
      ?.addEventListener('click', () => this.close());
  }
};
