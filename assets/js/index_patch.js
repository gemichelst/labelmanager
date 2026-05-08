
/* ═══════════════════════════════════════════════════════════════
   AUTH + HELP INTEGRATION PATCH
   Add this block to assets/js/index.js

   1. Add renderSidebarUser() to the LOS object.
   2. Wrap the existing init() / DOMContentLoaded boot with auth guard.
═══════════════════════════════════════════════════════════════ */

/* ── Add inside the LOS object (alongside other methods): ─── */

  /**
   * Renders the logged-in user's avatar, name and role
   * in the sidebar footer (#sidebarUser).
   */
  renderSidebarUser() {
    const user = LMAuth._currentUser;
    if (!user) return;

    const roleColors = {
      admin: '#c9a84c', labelmanager: '#4a9fa8',
      ar: '#7c6fa8', artist: '#3d9970'
    };
    const col = roleColors[user.role] || '#5a5a72';
    const initial = (user.name || '?')[0].toUpperCase();

    const avatar = document.getElementById('sidebarAvatar');
    const name   = document.getElementById('sidebarName');
    const role   = document.getElementById('sidebarRole');

    if (avatar) { avatar.textContent = initial; avatar.style.background = col; }
    if (name)   name.textContent  = user.name || '–';
    if (role)   role.textContent  = (user.role || '–').replace('_', ' ');
  },

/* ── Replace / wrap your existing DOMContentLoaded boot: ─── */

/*
  BEFORE (original):
  ─────────────────
  document.addEventListener('DOMContentLoaded', () => {
    LOS.init();
    lucide.createIcons();
  });

  AFTER (with auth guard):
  ──────────────────────
*/
document.addEventListener('DOMContentLoaded', () => {
  // 1. Init Lucide icons (needed for login screen icons too)
  lucide.createIcons();

  // 2. Wire auth + help event listeners
  LMAuth.init();
  LMHelp.init();

  // 3. Load DB (LOS.db must be ready before guard())
  //    If your LOS.init() already calls loadDB(), move guard() call
  //    to AFTER that line, or restructure as shown below:
  LOS.db = (typeof loadDB === 'function') ? loadDB() : LOS.db;

  // 4. Run auth guard — if session is invalid, showLogin() is called
  //    and the app shell stays hidden. Nothing else renders.
  const authed = LMAuth.guard();

  if (authed) {
    // 5. Full app boot only for authenticated users
    LOS.init();          // sets up nav, player, keys, renders all
    LOS.renderSidebarUser();
  } else {
    // Still call lucide again after login screen icons are in DOM
    lucide.createIcons();
  }
});
