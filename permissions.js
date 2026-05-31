// =====================================================================
// Yol_Admin — UI Permissions (CSS natif, sans dépendance Tailwind)
// Communique avec server/permissions.lua via NUI callbacks
// =====================================================================
(function () {
    const RES = (typeof GetParentResourceName === 'function') ? GetParentResourceName() : 'Yol_Admin';

    const state = {
        snapshot: null,
        selectedGroup: null,
        activeSubtab: 'perms',
        canManage: false,
        fetchRequested: false,
        fetchTimeoutId: null,
    };

    // ---- Helpers ----
    function post(endpoint, data) {
        return fetch(`https://${RES}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data || {})
        }).catch((err) => {
            console.warn('[Perms] POST', endpoint, 'failed', err);
        });
    }
    function $(id) { return document.getElementById(id); }
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }
    function showToast(text, type) {
        const t = type || 'info';
        if (window.toast)               return window.toast(text, t);
        if (window.showNotification)    return window.showNotification(text, t);
        console.log('[Perms toast]', t, text);
    }

    // ---- Modal custom (remplace confirm/prompt natifs qui bloquent la NUI CEF) ----
    // openModal({ title, body, danger, icon, withInput, placeholder, okLabel, onOk, onCancel })
    function openModal(opts) {
        opts = opts || {};
        const modal = $('perms-modal');
        if (!modal) {
            // Fallback ultime si le modal n'est pas dans le DOM
            if (window.confirm(opts.body || 'Confirmer ?')) {
                if (opts.onOk) opts.onOk(opts.withInput ? '' : true);
            }
            return;
        }
        $('perms-modal-title').textContent = opts.title || 'Confirmation';
        $('perms-modal-body').innerHTML = opts.body || '';
        const iconEl = $('perms-modal-icon');
        iconEl.className = 'fa-solid ' + (opts.icon || (opts.danger ? 'fa-triangle-exclamation' : 'fa-circle-question'));
        modal.classList.toggle('danger', !!opts.danger);

        const inputWrap = $('perms-modal-input-wrap');
        const input = $('perms-modal-input');
        if (opts.withInput) {
            inputWrap.style.display = 'block';
            input.value = opts.defaultValue || '';
            input.placeholder = opts.placeholder || '';
            setTimeout(() => input.focus(), 50);
        } else {
            inputWrap.style.display = 'none';
        }

        const okBtn = $('perms-modal-ok');
        const cancelBtn = $('perms-modal-cancel');
        okBtn.textContent = opts.okLabel || 'Confirmer';

        function close() {
            modal.style.display = 'none';
            okBtn.onclick = null;
            cancelBtn.onclick = null;
            input.onkeydown = null;
        }
        okBtn.onclick = () => {
            const val = opts.withInput ? input.value : true;
            close();
            if (opts.onOk) opts.onOk(val);
        };
        cancelBtn.onclick = () => {
            close();
            if (opts.onCancel) opts.onCancel();
        };
        input.onkeydown = (e) => {
            if (e.key === 'Enter') okBtn.click();
            else if (e.key === 'Escape') cancelBtn.click();
        };

        modal.style.display = 'flex';
    }

    function showState(which) {
        const loading = $('perms-loading');
        const error   = $('perms-error');
        const body    = $('perms-body');
        if (loading) loading.style.display = (which === 'loading') ? 'flex' : 'none';
        if (error)   error.style.display   = (which === 'error')   ? 'flex' : 'none';
        if (body)    body.style.display    = (which === 'body')    ? 'grid' : 'none';
    }

    // ---- Fetch avec retry / timeout ----
    function fetchSnapshot() {
        showState('loading');
        state.fetchRequested = true;
        if (state.fetchTimeoutId) clearTimeout(state.fetchTimeoutId);
        // Si pas de réponse en 4s, on bascule en erreur
        state.fetchTimeoutId = setTimeout(() => {
            if (!state.snapshot) {
                showState('error');
                console.warn('[Perms] Aucun snapshot reçu après 4s — vérifie le serveur Lua.');
            }
        }, 4000);
        post('perms:fetch', {});
    }
    window.YolPermsRefetch = fetchSnapshot;

    // ---- Rendu liste des groupes ----
    function renderGroupsList() {
        const list = $('perms-groups-list');
        const count = $('perms-groups-count');
        if (!list || !state.snapshot) return;
        list.innerHTML = '';
        const groups = state.snapshot.groups || [];
        if (count) count.textContent = groups.length;

        if (groups.length === 0) {
            list.innerHTML = `
                <div class="perms-empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    Aucun groupe<br><span style="opacity:.6">Clique sur « Nouveau groupe »</span>
                </div>`;
            return;
        }

        groups.forEach(g => {
            const isActive = (g.name === state.selectedGroup);
            const row = document.createElement('div');
            row.className = 'perms-group-row' + (isActive ? ' active' : '');
            row.style.borderLeftColor = g.color || '#F04C00';
            row.innerHTML = `
                <div class="perms-group-row-top">
                    <span class="perms-group-label" style="color:${escapeHtml(g.color || '#F04C00')}">
                        ${escapeHtml(g.label)}
                        ${g.is_system ? '<span class="perms-group-sys-badge">Sys</span>' : ''}
                    </span>
                    <span class="perms-group-priority">P${g.priority}</span>
                </div>
                <div class="perms-group-row-bottom">
                    <span class="perms-group-name">${escapeHtml(g.name)}</span>
                    <span class="perms-group-stats">
                        <span title="Permissions"><i class="fa-solid fa-key"></i> ${(g.perms || []).length}</span>
                        <span title="Utilisateurs"><i class="fa-solid fa-users"></i> ${g.user_count || 0}</span>
                        ${g.parent_group ? `<span title="Hérite de"><i class="fa-solid fa-arrow-up"></i> ${escapeHtml(g.parent_group)}</span>` : ''}
                    </span>
                </div>
            `;
            row.addEventListener('click', () => {
                state.selectedGroup = g.name;
                renderGroupsList();
                renderDetail();
            });
            list.appendChild(row);
        });
    }

    // ---- Rendu détail ----
    function renderDetail() {
        const empty = $('perms-detail-empty');
        const detail = $('perms-detail');
        if (!state.snapshot || !state.selectedGroup) {
            if (empty) empty.style.display = 'flex';
            if (detail) detail.style.display = 'none';
            return;
        }
        const g = (state.snapshot.groups || []).find(x => x.name === state.selectedGroup);
        if (!g) { state.selectedGroup = null; return renderDetail(); }

        if (empty) empty.style.display = 'none';
        if (detail) detail.style.display = 'flex';

        // Header
        $('perms-detail-color').style.background = g.color || '#F04C00';
        $('perms-detail-label').value = g.label || '';
        $('perms-detail-name').textContent = g.name;
        $('perms-detail-system').style.display = g.is_system ? 'inline-block' : 'none';
        $('perms-detail-color-input').value = g.color || '#F04C00';
        $('perms-detail-priority').value = g.priority || 0;

        // Parent select
        const parentSel = $('perms-detail-parent');
        parentSel.innerHTML = '<option value="">— Aucun —</option>';
        (state.snapshot.groups || []).forEach(og => {
            if (og.name === g.name) return;
            const opt = document.createElement('option');
            opt.value = og.name;
            opt.textContent = og.label + ' (' + og.name + ')';
            if (og.name === g.parent_group) opt.selected = true;
            parentSel.appendChild(opt);
        });
        parentSel.disabled = !!g.is_system;

        // Subtab buttons
        document.querySelectorAll('.perms-subtab').forEach(btn => {
            const isAct = btn.dataset.subtab === state.activeSubtab;
            btn.classList.toggle('perms-subtab-active', isAct);
        });

        $('perms-detail-perms-count').textContent = (g.perms || []).length;
        $('perms-detail-users-count').textContent = (g.users || []).length;

        // Utilise classes .active (le CSS gère display) plutôt que style inline
        const subPerms = $('perms-subtab-perms');
        const subUsers = $('perms-subtab-users');
        if (subPerms) {
            subPerms.classList.toggle('active', state.activeSubtab === 'perms');
            subPerms.style.removeProperty('display');
        }
        if (subUsers) {
            subUsers.classList.toggle('active', state.activeSubtab === 'users');
            subUsers.style.removeProperty('display');
        }

        if (state.activeSubtab === 'perms') renderPermissions(g);
        else renderUsers(g);

        $('perms-detail-delete').style.display = g.is_system ? 'none' : 'inline-flex';
    }

    // ---- Rendu permissions par catégorie ----
    function renderPermissions(g) {
        const wrap = $('perms-subtab-perms');
        wrap.innerHTML = '';
        const catalog = state.snapshot.catalog || [];
        const ownedSet = new Set(g.perms || []);
        const hasWildAll = ownedSet.has('*');

        if (catalog.length === 0) {
            wrap.innerHTML = '<div class="perms-empty-state"><i class="fa-solid fa-circle-info"></i>Catalogue de permissions vide.</div>';
            return;
        }

        catalog.forEach(cat => {
            const items = cat.items || [];
            const ownedCount = items.filter(i => ownedSet.has(i.key) || (hasWildAll && i.key !== '*')).length;

            const card = document.createElement('div');
            card.className = 'perms-cat-card';

            const header = document.createElement('div');
            header.className = 'perms-cat-header';
            header.innerHTML = `
                <span class="perms-cat-title">
                    <i class="fa-solid ${escapeHtml(cat.icon || 'fa-folder')}"></i>
                    ${escapeHtml(cat.category)}
                </span>
                <span class="perms-cat-count">${ownedCount} / ${items.length}</span>
            `;
            card.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'perms-cat-grid';
            items.forEach(item => {
                const checked = ownedSet.has(item.key) || (hasWildAll && item.key !== '*');
                const row = document.createElement('label');
                row.className = 'perms-check-row' + (checked ? ' perms-checked' : '');
                row.innerHTML = `
                    <input type="checkbox" data-perm="${escapeHtml(item.key)}" ${checked ? 'checked' : ''}>
                    <div class="perms-check-info">
                        <div class="perms-check-label">
                            ${escapeHtml(item.label)}
                            ${item.critical ? '<i class="fa-solid fa-triangle-exclamation perms-critical" title="Permission sensible"></i>' : ''}
                        </div>
                        <div class="perms-check-key">${escapeHtml(item.key)}</div>
                    </div>
                `;
                const cb = row.querySelector('input');
                cb.addEventListener('change', () => {
                    row.classList.toggle('perms-checked', cb.checked);
                    post('perms:togglePerm', {
                        group: g.name,
                        perm: item.key,
                        enable: cb.checked
                    });
                    // Mise à jour locale du compteur de header
                    const newCnt = grid.querySelectorAll('input:checked').length;
                    header.querySelector('.perms-cat-count').textContent = newCnt + ' / ' + items.length;
                });
                grid.appendChild(row);
            });
            card.appendChild(grid);
            wrap.appendChild(card);
        });
    }

    // ---- Rendu users ----
    function renderUsers(g) {
        const list = $('perms-users-list');
        list.innerHTML = '';
        const users = g.users || [];
        if (users.length === 0) {
            list.innerHTML = `
                <div class="perms-empty-state">
                    <i class="fa-solid fa-user-slash"></i>
                    Aucun utilisateur assigné
                </div>`;
            return;
        }
        users.forEach(u => {
            const row = document.createElement('div');
            row.className = 'perms-user-row';
            const name = (u.firstname || u.lastname) ? (u.firstname + ' ' + u.lastname).trim() : 'Inconnu';
            row.innerHTML = `
                <div class="perms-user-info">
                    <i class="fa-solid fa-user-shield" style="color:${escapeHtml(g.color || '#F04C00')}"></i>
                    <div>
                        <div class="perms-user-name">${escapeHtml(name)}</div>
                        <div class="perms-user-lic">${escapeHtml(u.license)}</div>
                    </div>
                </div>
                <button class="perms-user-unassign" data-lic="${escapeHtml(u.license)}">
                    <i class="fa-solid fa-xmark"></i> Retirer
                </button>
            `;
            row.querySelector('.perms-user-unassign').addEventListener('click', () => {
                openModal({
                    title: 'Retirer du groupe',
                    body: 'Retirer <strong>' + escapeHtml(name) + '</strong> du groupe <strong>' + escapeHtml(g.label) + '</strong> ?',
                    icon: 'fa-user-minus',
                    danger: true,
                    okLabel: 'Retirer',
                    onOk: () => {
                        post('perms:unassignUser', { license: u.license, group: g.name });
                    }
                });
            });
            list.appendChild(row);
        });
    }

    // ---- Bindings ----
    function bindUI() {
        document.querySelectorAll('.perms-subtab').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeSubtab = btn.dataset.subtab;
                renderDetail();
            });
        });

        const refresh = $('perms-refresh');
        if (refresh) refresh.addEventListener('click', () => {
            fetchSnapshot();
            showToast('Permissions rechargées', 'info');
        });

        const newGroup = $('perms-new-group');
        if (newGroup) newGroup.addEventListener('click', () => {
            openModal({
                title: 'Nouveau groupe',
                body: 'Nom technique du groupe (a-z, 0-9, _). Exemple : <code>helper</code>',
                icon: 'fa-circle-plus',
                withInput: true,
                placeholder: 'modo, admin, helper…',
                okLabel: 'Suivant',
                onOk: (name) => {
                    name = (name || '').trim().toLowerCase();
                    if (!name) return;
                    if (!/^[a-z0-9_]+$/.test(name)) {
                        showToast('Nom invalide (a-z, 0-9, _)', 'error');
                        return;
                    }
                    // 2e modal pour le label
                    openModal({
                        title: 'Label du groupe',
                        body: 'Nom affiché dans l\'UI :',
                        icon: 'fa-tag',
                        withInput: true,
                        defaultValue: name.charAt(0).toUpperCase() + name.slice(1),
                        placeholder: 'Modérateur, Administrateur…',
                        okLabel: 'Créer',
                        onOk: (label) => {
                            label = (label || '').trim() || name;
                            post('perms:createGroup', { name, label, color: '#F04C00', priority: 0, parent: null });
                        }
                    });
                }
            });
        });

        const save = $('perms-detail-save');
        if (save) save.addEventListener('click', () => {
            if (!state.selectedGroup) return;
            post('perms:updateGroup', {
                name: state.selectedGroup,
                fields: {
                    label: $('perms-detail-label').value.trim(),
                    color: $('perms-detail-color-input').value,
                    priority: parseInt($('perms-detail-priority').value, 10) || 0,
                    parent_group: $('perms-detail-parent').value || null,
                }
            });
            showToast('Groupe enregistré', 'success');
            setTimeout(fetchSnapshot, 200);
        });

        const colorInput = $('perms-detail-color-input');
        if (colorInput) colorInput.addEventListener('input', e => {
            $('perms-detail-color').style.background = e.target.value;
        });

        const del = $('perms-detail-delete');
        if (del) del.addEventListener('click', () => {
            if (!state.selectedGroup) return;
            const g = (state.snapshot && state.snapshot.groups || []).find(x => x.name === state.selectedGroup);
            const label = g ? g.label : state.selectedGroup;
            openModal({
                title: 'Supprimer le groupe',
                body: 'Supprimer définitivement le groupe <strong>' + escapeHtml(label) + '</strong> ?<br>' +
                      '<span style="color:rgba(255,255,255,0.5);font-size:11px">Tous les utilisateurs assignés seront retirés. Action irréversible.</span>',
                icon: 'fa-trash',
                danger: true,
                okLabel: 'Supprimer',
                onOk: () => {
                    post('perms:deleteGroup', { name: state.selectedGroup });
                    state.selectedGroup = null;
                    // Re-render immédiat pour cacher le détail, le snapshot du serveur arrivera ensuite
                    renderDetail();
                    // Force un fetch pour récup la nouvelle liste (au cas où le serveur ne push pas)
                    setTimeout(fetchSnapshot, 300);
                }
            });
        });

        const assignBtn = $('perms-assign-btn');
        if (assignBtn) assignBtn.addEventListener('click', () => {
            if (!state.selectedGroup) {
                showToast('Sélectionne d\'abord un groupe à gauche', 'error');
                return;
            }
            const input = $('perms-assign-input');
            let v = (input && input.value || '').trim();
            if (!v) {
                showToast('Entre un ID joueur, license:, discord:, steam: ou fivem:', 'error');
                if (input) input.focus();
                return;
            }
            // Format accepté : ID numérique | license:xxx | discord:xxx | steam:xxx | fivem:xxx | xbl:xxx | live:xxx
            if (!/^(\d+|[a-z]+:.+)$/i.test(v)) {
                showToast('Format invalide. Ex : 5, license:abc, discord:1234…', 'error');
                return;
            }
            // Heuristique : un ID purement numérique > 10 chiffres = Discord snowflake (17-19 chiffres)
            // Les IDs joueur FiveM/GTA sont des entiers max ~1024 (toujours < 10000)
            if (/^\d+$/.test(v) && v.length > 10) {
                v = 'discord:' + v;
                showToast('ID Discord détecté → préfixé automatiquement avec discord:', 'info');
            }
            // Feedback visuel : bouton désactivé pendant le post + refetch après réponse
            assignBtn.disabled = true;
            const originalHtml = assignBtn.innerHTML;
            assignBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi…';
            post('perms:assignUser', { identifier: v, group: state.selectedGroup });
            if (input) input.value = '';
            // Restore après un petit délai + refetch du snapshot pour voir le résultat
            setTimeout(() => {
                assignBtn.disabled = false;
                assignBtn.innerHTML = originalHtml;
                fetchSnapshot();
            }, 600);
        });

        const assignInput = $('perms-assign-input');
        if (assignInput) assignInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') $('perms-assign-btn').click();
        });

        // Auto-fetch quand on clique sur le nav-icon
        const navIcon = document.querySelector('[data-tab="tab-permissions"]');
        if (navIcon) navIcon.addEventListener('click', () => {
            setTimeout(fetchSnapshot, 80);
        });
    }

    // ---- Messages serveur ----
    window.addEventListener('message', (event) => {
        const data = event.data || {};

        if (data.type === 'YOL_PERMS_SNAPSHOT') {
            state.snapshot = data.snapshot;
            state.canManage = !!(data.snapshot && data.snapshot.canManage);
            if (state.fetchTimeoutId) { clearTimeout(state.fetchTimeoutId); state.fetchTimeoutId = null; }
            showState('body');
            renderGroupsList();
            renderDetail();
        }

        if (data.type === 'YOL_PERMS_RESULT') {
            const r = data.result || {};
            if (!r.ok) {
                showToast('Erreur ' + (r.action || '') + ' : ' + (r.err || 'Inconnue'), 'error');
            } else if (r.action === 'assignUser') {
                showToast('Utilisateur ajouté ✓', 'success');
            } else if (r.action === 'unassignUser') {
                showToast('Utilisateur retiré', 'success');
            }
        }

        // Quand le menu admin s'ouvre, on précharge en arrière-plan
        if (data.type === 'SHOW_MENU') {
            setTimeout(fetchSnapshot, 300);
        }
    });

    // ---- Boot ----
    function boot() {
        if (!$('tab-permissions')) return setTimeout(boot, 200);
        bindUI();
        // Pre-fetch immédiat (sera relancé au SHOW_MENU)
        setTimeout(fetchSnapshot, 200);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
