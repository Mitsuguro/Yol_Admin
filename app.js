// app.js - Global Logic
const _L = (key) => (window.locales && window.locales[key]) ? window.locales[key] : key;
window._L = _L;

if (typeof GetParentResourceName === 'undefined') {
    window.GetParentResourceName = () => "Yol_Admin";
}
window.playersData = [];
window.selectedPlayerId = null;
window.markers = window.markers || {};
window.map = window.map || null;
window.locales = window.locales || {};
const hexToRgba = (hex, alpha) => {
    if (!hex || hex[0] !== '#') return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const post = (action, data) => {
    fetch(`https://${GetParentResourceName()}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || {})
    }).catch(() => {});
};
window.post = post;

// Sidebar à catégories dépliantes : la redistribution dynamique n'est plus nécessaire.
const balanceSidebars = () => { /* no-op — préservé pour compat */ };
window.balanceSidebars = balanceSidebars;

const translateUI = () => {
    document.querySelectorAll('[data-locale]').forEach(el => {
        el.textContent = _L(el.dataset.locale);
    });
    document.querySelectorAll('[data-locale-placeholder]').forEach(el => {
        el.placeholder = _L(el.dataset.localePlaceholder);
    });
};
window.translateUI = translateUI;

const mainApp = document.getElementById('admin-panel');
const adminPanel = document.getElementById('admin-panel');
const panelHeader = document.getElementById('drag-handle');
const closeBtn = document.getElementById('close-menu');
const tabs = document.querySelectorAll('.nav-icon[data-tab]');
const tabContents = document.querySelectorAll('.tab-panel');
const searchInput = document.getElementById('player-search');
const playersListEl = document.getElementById('player-list');
const playerActionsEl = document.getElementById('player-view');
const selectedPlayerNameEl = document.getElementById('view-name');
const statOnline = document.getElementById('stat-online-dash');
const statOffline = document.getElementById('stat-offline-dash');
const opacitySlider = document.getElementById('opacitySlider');

// Map Initialization
// Map Initialization with proper GTA V CRS
const initMap = () => {
    if (map) return;
    
    // GTA V Map Bounds & CRS Transformation
    // The map tiles from Rockstar use a specific projection.
    // Coordinates usually range from -8000 to 8000.
    const factor = 0.015625; // 1/64
    
    L.CRS.GTAV = L.extend({}, L.CRS.Simple, {
        projection: L.Projection.LonLat,
        transformation: new L.Transformation(factor, 1024, -factor, 1024),
        scale: function (zoom) {
            return Math.pow(2, zoom);
        }
    });

    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -4,
        maxZoom: 5,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false
    }).setView([0, 0], 0);
    window.map = map;

    // Use QuickMenu Bounds for consistency
    const bounds = [[-3758, -4230], [7151, 5410]];
    L.imageOverlay('https://imagedelivery.net/xMNIukUvBnTcljSQ6wCsQg/d69bfcd1-773e-489a-201e-6ec358ec6500/MAPS', bounds).addTo(map);
    map.hasInteracted = false;
    map.on('movestart', () => map.hasInteracted = true);

    document.getElementById('map').style.background = '#0b0c10';
};
window.initMap = initMap;

const selectPlayer = (id, name, online) => {
    window.selectedPlayerId = id;
    const player = (window.playersData || []).find(p => p.id == id);
    window.selectedPlayer = player;
    
    if (selectedPlayerNameEl) {
        selectedPlayerNameEl.textContent = name + (online ? '' : ' (' + _L('ui_offline') + ')');
    }
    
    if (player) {
        const hpEl = document.getElementById('view-hp');
        const armorEl = document.getElementById('view-armor');
        const jobEl = document.getElementById('view-job');
        if (hpEl) hpEl.textContent = (player.health || 0) + '%';
        if (armorEl) armorEl.textContent = (player.armor || 0) + '%';
        if (jobEl) jobEl.textContent = player.job || 'Chômeur';

        // Update States Dots
        const handcuffDot = document.getElementById('state-handcuff-dot');
        const jailDot = document.getElementById('state-jail-dot');
        const frozenDot = document.getElementById('state-frozen-dot');
        const hpValEl = document.getElementById('view-hp');

        if (handcuffDot) {
            handcuffDot.style.background = player.handcuffed ? '#fbbf24' : 'rgba(255,255,255,0.1)';
            handcuffDot.style.boxShadow = player.handcuffed ? '0 0 8px #fbbf24' : 'none';
        }
        if (jailDot) {
            jailDot.style.background = player.jailed ? '#f87171' : 'rgba(255,255,255,0.1)';
            jailDot.style.boxShadow = player.jailed ? '0 0 8px #f87171' : 'none';
        }
        if (frozenDot) {
            frozenDot.style.background = player.frozen ? '#3b82f6' : 'rgba(255,255,255,0.1)';
            frozenDot.style.boxShadow = player.frozen ? '0 0 8px #3b82f6' : 'none';
        }
        if (hpValEl) {
            if (player.isDead) {
                hpValEl.textContent = 'MORT';
                hpValEl.classList.add('text-rose-500');
            } else {
                hpValEl.classList.remove('text-rose-500');
            }
        }
    }
    
    const viewIdEl = document.getElementById('view-id');
    if (viewIdEl) viewIdEl.textContent = 'ID: ' + id;
    if (mainApp) {
        mainApp.classList.remove('hidden');
        mainApp.style.display = 'flex';
    }
    playerActionsEl.classList.remove('hidden');
    playerActionsEl.style.display = 'flex';
    const noSelection = document.getElementById('no-selection');
    if (noSelection) noSelection.classList.add('hidden');
    
    // Switch to players tab if not already there
    const playersTabBtn = document.querySelector('.nav-icon[data-tab="tab-players"]');
    const playersTab = document.getElementById('tab-players');
    if (playersTabBtn && !playersTab.classList.contains('active')) {
        playersTabBtn.click();
    }

    renderPlayers();
    // Marker update is handled in index.html
    initPlayerActions();

    // Render PEFCL Accounts
    const pefclList = document.getElementById('pefcl-accounts-list');
    if (pefclList) {
        pefclList.innerHTML = '';
        if (player && player.pefclAccounts && player.pefclAccounts.length > 0) {
            player.pefclAccounts.forEach(acc => {
                const div = document.createElement('div');
                div.className = 'bg-black/40 border border-white/10 rounded-lg p-2 flex justify-between items-center transition-all hover:bg-black/60';
                div.innerHTML = `
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span class="text-[9px] font-bold text-white">${acc.label}</span>
                            ${acc.isDefault ? '<span class="text-[6px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 rounded-sm uppercase font-black">Défaut</span>' : ''}
                        </div>
                        <span class="text-[7px] text-white/30 font-mono tracking-tighter">${acc.number}</span>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                        <span class="text-[10px] font-black text-emerald-400">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(acc.balance).replace('$', '$ ')}</span>
                        <button 
                            onclick="triggerPefclAction('give_mastercard', {accountNumber: '${acc.number}'})" 
                            class="text-[6px] font-black uppercase bg-white/5 hover:bg-admin-gold/20 border border-white/10 hover:border-admin-gold/30 text-white/40 hover:text-admin-gold px-1.5 py-0.5 rounded transition-all flex items-center gap-1 group"
                        >
                            <i class="fa-solid fa-plus group-hover:scale-110 transition-transform"></i> MasterCard
                        </button>
                    </div>
                `;
                pefclList.appendChild(div);
            });
        } else {
            pefclList.innerHTML = '<div class="text-[9px] text-white/20 italic p-2 text-center w-full">Aucun compte PEFCL détecté</div>';
        }
    }

    // Render Owned Vehicles
    const vehList = document.getElementById('owned-vehicles-list');
    if (vehList) {
        vehList.innerHTML = '';
        if (player && player.vehicles && player.vehicles.length > 0) {
            player.vehicles.forEach(v => {
                const div = document.createElement('div');
                div.className = 'bg-black/40 border border-white/10 rounded-lg p-2 flex justify-between items-center transition-all hover:bg-black/60';
                div.innerHTML = `
                    <div class="flex flex-col">
                        <span class="text-[9px] font-bold text-white uppercase">${v.model || 'Véhicule'}</span>
                        <span class="text-[7px] text-white/40 font-mono tracking-widest">${v.plate}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="triggerVehicleAction('trunk_remote', '${v.plate}')" class="text-[6px] font-black uppercase bg-white/5 hover:bg-admin-gold/20 border border-white/10 hover:border-admin-gold/30 text-white/40 hover:text-admin-gold px-1.5 py-0.5 rounded transition-all"><i class="fa-solid fa-box-open"></i> Coffre</button>
                        <button onclick="triggerVehicleAction('glovebox_remote', '${v.plate}')" class="text-[6px] font-black uppercase bg-white/5 hover:bg-admin-gold/20 border border-white/10 hover:border-admin-gold/30 text-white/40 hover:text-admin-gold px-1.5 py-0.5 rounded transition-all"><i class="fa-solid fa-toolbox"></i> Gants</button>
                        <button onclick="triggerVehicleAction('keys_remote', '${v.plate}', '${v.model || 'Véhicule'}')" class="text-[6px] font-black uppercase bg-white/5 hover:bg-admin-gold/20 border border-white/10 hover:border-admin-gold/30 text-white/40 hover:text-admin-gold px-1.5 py-0.5 rounded transition-all"><i class="fa-solid fa-key"></i> Clés</button>
                    </div>
                `;
                vehList.appendChild(div);
            });
        } else {
            vehList.innerHTML = '<div class="text-[9px] text-white/20 italic p-2 text-center w-full">Aucun véhicule possédé</div>';
        }
    }
};

window.triggerPefclAction = (action, data) => {
    if (!window.selectedPlayerId) return;
    fetch(`https://${GetParentResourceName()}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'player',
            action: action,
            target: window.selectedPlayerId,
            ...data
        })
    });
};

window.triggerVehicleAction = (action, plate, model) => {
    fetch(`https://${GetParentResourceName()}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'vehicle',
            action: action,
            plate: plate,
            model: model
        })
    });
};

// Dragging Logic
let isDragging = false;
let startX, startY, initialX, initialY;

if (panelHeader) {
    panelHeader.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = adminPanel.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        adminPanel.style.left = initialX + 'px';
        adminPanel.style.top = initialY + 'px';
        adminPanel.style.position = 'absolute';
        adminPanel.style.margin = '0';
        adminPanel.style.transform = 'none';
    });
}

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    adminPanel.style.left = (initialX + dx) + 'px';
    adminPanel.style.top = (initialY + dy) + 'px';
});

document.addEventListener('mouseup', () => {
    if (isDragging && adminPanel) {
        // Persiste la position après chaque drag
        try {
            localStorage.setItem('yol_admin_position', JSON.stringify({
                left: adminPanel.style.left,
                top: adminPanel.style.top,
            }));
        } catch (_) {}
    }
    isDragging = false;
});

// Restaure la position sauvegardée au chargement (avec clamp si hors écran)
(function restoreAdminPanelPosition() {
    if (!adminPanel) return;
    try {
        const saved = JSON.parse(localStorage.getItem('yol_admin_position') || 'null');
        if (saved && saved.left && saved.top) {
            const left = parseFloat(saved.left) || 0;
            const top  = parseFloat(saved.top)  || 0;
            // Clamp : garde au moins 80 px du panel visible dans le viewport
            const maxLeft = Math.max(0, window.innerWidth  - 80);
            const maxTop  = Math.max(0, window.innerHeight - 60);
            const clampedLeft = Math.min(Math.max(0, left), maxLeft);
            const clampedTop  = Math.min(Math.max(0, top),  maxTop);
            adminPanel.style.position = 'absolute';
            adminPanel.style.margin = '0';
            adminPanel.style.transform = 'none';
            adminPanel.style.left = clampedLeft + 'px';
            adminPanel.style.top  = clampedTop  + 'px';
        }
    } catch (_) {}
})();

// Opacity Logic
if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
        adminPanel.style.opacity = e.target.value;
    });
}

// NUI Message listener
window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.type === 'START_SCREEN_SHARE') {
        window.startWebRTCScreenShare(data.adminId);
        return;
    }
    if (data.type === 'START_ADMIN_PIP') {
        handleAdminPiPStart(data.target);
        return;
    }
    if (data.type === 'STOP_ADMIN_PIP') {
        const pipContainer = document.getElementById('admin-pip-container');
        if (pipContainer) pipContainer.style.display = 'none';
        window.currentPiPTargetId = null;
        return;
    }
    if (data.type === 'STOP_SCREEN_SHARE') {
        handleStopScreenShare(data.adminId);
        return;
    }
    if (data.type === 'WEBRTC_OFFER') {
        window.handleWebRTCOffer(data.senderId, data.offer);
        return;
    }
    if (data.type === 'WEBRTC_ANSWER') {
        window.handleWebRTCAnswer(data.senderId, data.answer);
        return;
    }
    if (data.type === 'WEBRTC_CANDIDATE') {
        window.handleWebRTCCandidate(data.senderId, data.candidate);
        return;
    }

    if (data.type === 'SHOW_MENU') {
        if (mainApp) {
            mainApp.style.display = 'flex';
            mainApp.classList.remove('hidden');
        }
        
        // Apply Premium Colors from Config
        if (data.config && data.config.ui) {
            const root = document.documentElement;
            const ui = data.config.ui;
            const primary = ui.PrimaryGradient || "#9a2ba9";
            const secondary = ui.SecondaryGradient || "#f9d900";
            const outline = ui.OutlineColor || "rgba(255, 255, 255, 0.9)";
            
            // Dynamic Variables
            root.style.setProperty('--grad', `linear-gradient(45deg, ${primary}, ${secondary})`);
            root.style.setProperty('--bg-panel', `linear-gradient(45deg, ${hexToRgba(primary, 0.88)}, ${hexToRgba(secondary, 0.82)})`);
            root.style.setProperty('--outline', `2px solid ${outline}`);
            root.style.setProperty('--admin-gold', secondary);
            root.style.setProperty('--bg-primary', primary);
            root.style.setProperty('--bg-secondary', secondary);
            root.style.setProperty('--primary', primary);
            root.style.setProperty('--primary-light', secondary);
            
            // Aliases
            root.style.setProperty('--premium-gradient', `linear-gradient(45deg, ${primary}, ${secondary})`);
            root.style.setProperty('--premium-border', `2px solid ${outline}`);
            root.style.setProperty('--modern-grad', `linear-gradient(45deg, ${primary}, ${secondary})`);
            root.style.setProperty('--modern-bg', `linear-gradient(45deg, ${hexToRgba(primary, 0.88)}, ${hexToRgba(secondary, 0.82)})`);
            root.style.setProperty('--modern-outline', `2px solid ${outline}`);
        }

        if (data.config) {
            if (data.config.locales) { 
                window.locales = data.config.locales; 
                translateUI(); 
            }
            
            // Dynamic visibility for AntiCheat & Anti-Cipher panels
            const hasAnticheat = !!data.config.anticheatActive;
            const acNavIcon = document.querySelector('.nav-icon[data-tab="tab-anticheat"]');
            const cipherNavIcon = document.querySelector('.nav-icon[data-tab="tab-anticipher"]');
            if (acNavIcon) {
                acNavIcon.style.display = hasAnticheat ? 'flex' : 'none';
            }
            if (cipherNavIcon) {
                cipherNavIcon.style.display = hasAnticheat ? 'flex' : 'none';
            }

            // Permission-based gating of nav-icons
            window.userPerms = Array.isArray(data.config.userPerms) ? data.config.userPerms : [];
            window.userHasPerm = (perm) => {
                if (!perm) return true;
                const list = window.userPerms || [];
                if (list.includes('*')) return true;
                if (list.includes(perm)) return true;
                // Wildcard "prefix.*" match (e.g. "module.*" grants all module.X)
                for (const p of list) {
                    if (typeof p === 'string' && p.endsWith('.*')) {
                        const prefix = p.slice(0, -1);
                        if (perm.startsWith(prefix)) return true;
                    }
                }
                return false;
            };
            // Mapping: nav-icon data-tab -> required permission (only listed tabs get gated)
            const gatedTabs = {
                'tab-multipip':         'module.multipip',
                'tab-console':          'module.console',
                'tab-robberycreator':   'module.robberycreator',
            };
            Object.entries(gatedTabs).forEach(([tabId, requiredPerm]) => {
                const navIcon = document.querySelector(`.nav-icon[data-tab="${tabId}"]`);
                if (!navIcon) return;
                if (window.userHasPerm(requiredPerm)) {
                    navIcon.style.display = '';
                } else {
                    navIcon.style.display = 'none';
                    // If user is currently on a now-forbidden tab, fall back to dashboard
                    const panel = document.getElementById(tabId);
                    if (panel && panel.classList.contains('active')) {
                        const fallback = document.querySelector('.nav-icon[data-tab="tab-dashboard"]');
                        if (fallback) fallback.click();
                    }
                }
            });

            // Distribute icons evenly between the two columns
            if (typeof balanceSidebars === 'function') balanceSidebars();

            // Prefill Rich Presence config from server setting
            if (data.config && data.config.richPresence) {
                if (typeof window.applyRichPresenceForm === 'function') {
                    window.applyRichPresenceForm(data.config.richPresence);
                }
            }

            // Affiche le vrai nom du staff dans l'entête du panel
            if (data.config && data.config.staffName) {
                const adminNameEl = document.getElementById('admin-name');
                if (adminNameEl) adminNameEl.textContent = data.config.staffName;
                window.adminName = data.config.staffName;
            }
        }
        window.playersData = data.players || [];
        window.allPlayers = window.playersData;
        window.serverJobs = data.jobs || [];
        window.serverGangs = data.config ? data.config.gangs || [] : [];
        window.serverDrugs = data.config ? data.config.drugs || [] : [];
        // Lazy : items/logs/resources peuvent être null à l'ouverture (gros datasets fetch on-demand).
        // Ils seront chargés via RECEIVE_LAZY_DATA quand un tab les demandera.
        window.serverItems = data.items || [];
        window.serverLogs = data.logs || [];
        window.serverResources = data.resources || [];
        window._lazyItemsLoaded = Array.isArray(data.items) && data.items.length > 0;
        window._lazyLogsLoaded = Array.isArray(data.logs) && data.logs.length > 0;
        window._lazyResourcesLoaded = Array.isArray(data.resources) && data.resources.length > 0;
        window.serverConfig = data.config || {};

        // Fonction extraite : peuple le datalist <all-items-list> à partir de window.serverItems.
        // Appelée maintenant ET au moment du fetch lazy.
        window.populateItemsDatalist = function() {
            const itemDatalist = document.getElementById('all-items-list');
            if (!itemDatalist) return;
            itemDatalist.innerHTML = '';
            if (Array.isArray(window.serverItems)) {
                window.serverItems.forEach(item => {
                    if (item && item.name) {
                        const opt = document.createElement('option');
                        opt.value = item.name;
                        opt.textContent = `${item.label || item.name} (${item.name})`;
                        itemDatalist.appendChild(opt);
                    }
                });
            } else if (typeof window.serverItems === 'object' && window.serverItems !== null) {
                Object.entries(window.serverItems).forEach(([name, label]) => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = `${typeof label === 'string' ? label : (label.label || name)} (${name})`;
                    itemDatalist.appendChild(opt);
                });
            }
        };
        populateItemsDatalist();

        // Demande des datasets lazy au backend si nécessaire — déclenché par switch de tab plus tard.
        window.ensureLazyData = function(dataset) {
            const loadedFlag = '_lazy' + dataset.charAt(0).toUpperCase() + dataset.slice(1) + 'Loaded';
            if (window[loadedFlag]) return;
            // Marque comme "en cours" pour éviter les fetches multiples concurrents
            window[loadedFlag] = 'loading';
            post('request_lazy_data', { dataset: dataset });
        };
        
        // Populate Job/Gang Editor Selects
        const jobSelect = document.getElementById('job-edit-select');
        if (jobSelect) {
            jobSelect.innerHTML = '<option value="">-- [ CRÉER UN NOUVEAU MÉTIER ] --</option>';
            window.serverJobs.filter(j => !j.name.startsWith('off_')).forEach(j => {
                const opt = document.createElement('option');
                opt.value = j.name;
                opt.textContent = `${(j.label || j.name).toUpperCase()} (${j.name})`;
                jobSelect.appendChild(opt);
            });
        }
        
        const gangSelect = document.getElementById('gang-edit-select');
        if (gangSelect) {
            gangSelect.innerHTML = '<option value="">-- [ CRÉER UN NOUVEAU GANG ] --</option>';
            window.serverGangs.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.name;
                opt.textContent = `${(g.label || g.name).toUpperCase()} (${g.name})`;
                gangSelect.appendChild(opt);
            });
        }

        const drugSelect = document.getElementById('drug-edit-select');
        if (drugSelect) {
            drugSelect.innerHTML = '<option value="">-- [ CRÉER UNE NOUVELLE DROGUE ] --</option>';
            window.serverDrugs.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.name;
                opt.textContent = `${(d.label || d.name).toUpperCase()} (${d.name})`;
                drugSelect.appendChild(opt);
            });
        }
        
        updateDashboard();
        renderPlayers();
        
        // Ensure a tab is active and visible
        const activeTab = document.querySelector('.nav-icon[data-tab].active');
        if (!activeTab) {
            const dashTab = document.querySelector('.nav-icon[data-tab="tab-dashboard"]');
            if (dashTab) {
                document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                dashTab.classList.add('active');
                const dashPanel = document.getElementById('tab-dashboard');
                if (dashPanel) {
                    dashPanel.classList.add('active');
                    dashPanel.style.display = 'flex';
                }
            }
        }
        
        // Timeout to ensure map container has dimensions
        setTimeout(() => {
            if (!window.map) initMap();
            // Marker update handled by index.html UPDATE_POSITIONS
            if (window.map) window.map.invalidateSize();
            initPlayerActions();
            initVehicleActions();
            renderResources();
            renderLogs();
            // Fetch bot config so the Discord Bot panel is pre-filled with the
            // saved token/IDs. Sans ça, l'utilisateur voit des champs vides à
            // l'ouverture et un Save peut écraser la config persistée.
            try { post('get_bot_status', {}); } catch (_) {}
        }, 100);
    } else if (data.type === 'HIDE_MENU') {
        mainApp.style.display = 'none';
        mainApp.classList.add('hidden');
    } else if (data.type === 'UPDATE_DEV_DATA') {
        if (data.raycast) {
            const box = document.getElementById('entity-info-box');
            if (box) {
                box.innerHTML = `
                    <div class="flex flex-col gap-1 text-[10px]">
                        <div class="flex justify-between"><span class="text-white/30 uppercase">Model:</span> <span class="text-white font-bold">${data.raycast.model}</span></div>
                        <div class="flex justify-between"><span class="text-white/30 uppercase">NetID:</span> <span class="text-white font-bold">${data.raycast.netId}</span></div>
                        <div class="flex flex-col mt-1">
                            <span class="text-white/30 uppercase text-[8px]">Coords:</span>
                            <span class="text-[9px] text-admin-gold font-mono">${data.raycast.coords.x.toFixed(2)}, ${data.raycast.coords.y.toFixed(2)}, ${data.raycast.coords.z.toFixed(2)}</span>
                        </div>
                    </div>
                `;
            }
        }
        if (data.coords) {
            document.getElementById('dev-coord-x').innerText = data.coords.x.toFixed(2);
            document.getElementById('dev-coord-y').innerText = data.coords.y.toFixed(2);
            document.getElementById('dev-coord-z').innerText = data.coords.z.toFixed(2);
            document.getElementById('dev-coord-h').innerText = data.coords.h.toFixed(2);
        }
    } else if (data.type === 'UPDATE_POSITIONS') {
        if (data.players) {
            data.players.forEach(p => {
                const existing = playersData.find(pd => pd.id == p.id);
                if (existing) {
                    existing.coords = p.coords;
                    // Stats live envoyées par le client : merge sur le cache
                    if (typeof p.health === 'number') existing.health = p.health;
                    if (typeof p.armor  === 'number') existing.armor  = p.armor;
                    if (typeof p.handcuffed === 'boolean') existing.handcuffed = p.handcuffed;
                    if (typeof p.frozen === 'boolean') existing.frozen = p.frozen;
                    if (typeof p.dead === 'boolean') existing.dead = p.dead;
                }
            });
            // Rafraîchit le panneau du joueur sélectionné si concerné
            if (window.selectedPlayerId != null) {
                const sel = playersData.find(pd => pd.id == window.selectedPlayerId);
                if (sel) {
                    const hpEl = document.getElementById('view-hp');
                    const armorEl = document.getElementById('view-armor');
                    const jobEl = document.getElementById('view-job');
                    if (hpEl && typeof sel.health === 'number') hpEl.textContent = sel.health + '%';
                    if (armorEl && typeof sel.armor === 'number') armorEl.textContent = sel.armor + '%';
                    if (jobEl && sel.job) jobEl.textContent = sel.job;

                    const handcuffDot = document.getElementById('state-handcuff-dot');
                    const jailDot = document.getElementById('state-jail-dot');
                    const frozenDot = document.getElementById('state-frozen-dot');
                    if (handcuffDot) {
                        handcuffDot.style.background = sel.handcuffed ? '#fbbf24' : 'rgba(255,255,255,0.1)';
                        handcuffDot.style.boxShadow  = sel.handcuffed ? '0 0 8px #fbbf24' : 'none';
                    }
                    if (jailDot) {
                        jailDot.style.background = sel.jailed ? '#f87171' : 'rgba(255,255,255,0.1)';
                        jailDot.style.boxShadow  = sel.jailed ? '0 0 8px #f87171' : 'none';
                    }
                    if (frozenDot) {
                        frozenDot.style.background = sel.frozen ? '#60a5fa' : 'rgba(255,255,255,0.1)';
                        frozenDot.style.boxShadow  = sel.frozen ? '0 0 8px #60a5fa' : 'none';
                    }
                }
            }
        }
    } else if (data.type === 'UPDATE_ECO') {
        updateEcoUI(data.data);
    } else if (data.type === 'UPDATE_INV_RESULTS') {
        if (typeof updateInvPlayerResults === 'function') updateInvPlayerResults(data.players);
    } else if (data.type === 'UPDATE_INVENTORY') {
        if (typeof updateInventoryGrid === 'function') updateInventoryGrid(data.items);
    } else if (data.type === 'UPDATE_INVCREATOR_DATA') {
        if (typeof updateInventoryCreatorUI === 'function') updateInventoryCreatorUI(data.items, data.shops);
    } else if (data.type === 'RECEIVE_LAZY_DATA') {
        // Réception de datasets lazy-loaded (items, logs, resources) après fetch on-demand
        if (data.dataset === 'items') {
            window.serverItems = data.payload || [];
            window._lazyItemsLoaded = true;
            // Re-peuple les UIs qui dépendent de window.serverItems
            if (typeof window.populateItemsDatalist === 'function') window.populateItemsDatalist();
            if (typeof window.updateMarkerNameList === 'function') window.updateMarkerNameList();
            // Refresh inline datalist all-items-list pour les modales legacy
            const dl = document.getElementById('all-items-list');
            if (dl && Array.isArray(window.serverItems)) {
                dl.innerHTML = window.serverItems.map(i => '<option value="' + i.name + '">' + (i.label || i.name) + '</option>').join('');
            }
        } else if (data.dataset === 'logs') {
            window.serverLogs = data.payload || [];
            window._lazyLogsLoaded = true;
            if (typeof renderLogs === 'function') renderLogs();
        } else if (data.dataset === 'resources') {
            window.serverResources = data.payload || [];
            window._lazyResourcesLoaded = true;
            if (typeof renderResources === 'function') renderResources();
        }
    } else if (data.type === 'INVCREATOR_ADD_SHOP_LOCATION') {
        if (typeof invcreatorAddShopLocation === 'function') invcreatorAddShopLocation(data.location);
    } else if (data.type === 'INVCREATOR_PICK_START') {
        document.body.classList.add('invcreator-picking');
    } else if (data.type === 'INVCREATOR_PICK_END') {
        document.body.classList.remove('invcreator-picking');
    } else if (data.type === 'UPDATE_ZONES') {
        if (typeof updateZoneList === 'function') updateZoneList(data.zones);
    } else if (data.type === 'UPDATE_FLEET') {
        updateFleetUI(data.data);
    } else if (data.type === 'UPDATE_ANNOUNCEMENTS') {
        updateAnnouncements(data.announcements);
    } else if (data.type === 'UPDATE_ANTICHEAT_DATA') {
        updateAnticheatUI(data.data);
    } else if (data.type === 'UPDATE_ANTICIPHER_DATA') {
        updateAntiCipherUI(data.data);
    } else if (data.type === 'SWITCH_TAB') {
        const target = document.querySelector(`.nav-icon[data-tab="${data.tab}"]`);
        if (target) target.click();
    } else if (data.type === 'CYCLE_TAB') {
        const all = Array.from(document.querySelectorAll('.nav-icon[data-tab]'))
            .filter(t => t.offsetParent !== null || t.closest('.nav-flyout'));
        const cur = all.findIndex(t => t.classList.contains('active'));
        if (all.length) {
            const dir = data.direction || 1;
            const next = all[((cur >= 0 ? cur : 0) + dir + all.length) % all.length];
            if (next) next.click();
        }
    } else if (data.type === 'FOCUS_SEARCH') {
        const search = document.getElementById('player-search');
        if (search) { search.focus(); search.select(); }
    }
});

const updateDashboard = () => {
    const online = playersData.filter(p => p.online).length;
    const offline = playersData.filter(p => !p.online).length;
    
    // Top Bar Stats
    const topOnline = document.getElementById('stat-online');
    const topOffline = document.getElementById('stat-offline');
    if (topOnline) topOnline.textContent = online;
    if (topOffline) topOffline.textContent = offline;
    
    // Dashboard Stats (Fallback if still in DOM)
    const dashOnline = document.getElementById('stat-online-dash');
    const dashOffline = document.getElementById('stat-offline-dash');
    if (dashOnline) dashOnline.textContent = online;
    if (dashOffline) dashOffline.textContent = offline;
};

const updateAnnouncements = (announcements) => {
    const container = document.getElementById('dashboard-announcements');
    if (!container) return;
    
    container.innerHTML = '';
    if (!announcements || announcements.length === 0) {
        container.innerHTML = '<div class="text-center py-4 opacity-20 text-[9px] font-black uppercase tracking-widest">Aucune annonce récente</div>';
        return;
    }
    
    announcements.forEach(ann => {
        const div = document.createElement('div');
        div.className = 'bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:bg-black/60 transition-all cursor-pointer shadow-lg';
        div.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-[9px] font-black text-admin-gold uppercase tracking-wider">${ann.title || 'ANNONCE'}</span>
                <span class="text-[7px] font-bold text-white/20 uppercase">${ann.created_at || ''}</span>
            </div>
            <p class="text-[9px] text-white/70 leading-relaxed">${ann.message || ''}</p>
        `;
        container.appendChild(div);
    });
};

window.updateAnnouncements = updateAnnouncements;

// Close Menu
const closeMenu = () => {
    mainApp.style.display = 'none';
    mainApp.classList.add('hidden');
    fetch(`https://${GetParentResourceName()}/closeMenu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

if (closeBtn) closeBtn.addEventListener('click', closeMenu);

const refreshBtn = document.getElementById('refresh-players');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        fetch(`https://${GetParentResourceName()}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'server', action: 'refresh' })
        });
        if (icon) setTimeout(() => { icon.classList.remove('fa-spin'); }, 1000);
    });
}

// Escape key listener : ferme le menu staff principal OU le quick menu si l'un d'eux est visible.
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' && event.keyCode !== 27) return;

    // 1) Quick menu visible ? Fermer en priorité (overlay le plus haut)
    const quickMenu = document.getElementById('quick-menu');
    if (quickMenu && quickMenu.style.display !== 'none' && quickMenu.offsetParent !== null) {
        event.preventDefault();
        event.stopPropagation();
        fetch(`https://${GetParentResourceName()}/close_quick_menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        return;
    }

    // 2) Sinon, menu staff principal visible ? Le fermer.
    const mainPanel = document.getElementById('admin-panel') || document.getElementById('main-app');
    const isMainVisible = mainPanel && !mainPanel.classList.contains('hidden') && mainPanel.offsetParent !== null;
    if (isMainVisible) {
        event.preventDefault();
        event.stopPropagation();
        // Cache l'UI tout de suite côté NUI (le serveur recevra aussi via le callback)
        if (mainPanel) mainPanel.classList.add('hidden');
        fetch(`https://${GetParentResourceName()}/closeMenu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
});

// Tabs logic
window.activeTab = 'tab-dashboard';

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        // Track previous tab for cleanup
        const previousTab = window.activeTab;
        window.activeTab = targetId;

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const contentEl = document.getElementById(targetId);
        if (contentEl) {
            contentEl.classList.add('active');
        }

        // Keep menu wide as requested by user
        adminPanel.classList.remove('vertical');

        // Notify Lua side of tab change (so it can gate periodic sends)
        post('tab_changed', { tab: targetId, previous: previousTab });

        // Single unified refresh per tab (no duplicates)
        // Lazy : on demande les gros datasets uniquement quand ce tab les nécessite.
        switch (targetId) {
            case 'tab-dashboard':
                if (typeof updateDashboard === 'function') updateDashboard();
                if (typeof map !== 'undefined' && map) setTimeout(() => map.invalidateSize(), 100);
                break;
            case 'tab-players':
                if (typeof renderPlayers === 'function') renderPlayers();
                break;
            case 'tab-eco':
                if (typeof refreshEco === 'function') refreshEco();
                break;
            case 'tab-fleet':
                if (typeof refreshFleet === 'function') refreshFleet();
                break;
            case 'tab-inventory':
                if (typeof window.ensureLazyData === 'function') window.ensureLazyData('items');
                if (typeof searchInventory === 'function') searchInventory();
                break;
            case 'tab-anticheat':
                if (typeof refreshAnticheat === 'function') refreshAnticheat();
                break;
            case 'tab-anticipher':
                if (typeof refreshAntiCipher === 'function') refreshAntiCipher();
                break;
            case 'tab-console':
                if (typeof initServerConsole === 'function') initServerConsole();
                break;
            case 'tab-jobcreator':
            case 'tab-gangcreator':
            case 'tab-drugcreator':
                if (typeof window.ensureLazyData === 'function') window.ensureLazyData('items');
                if (typeof updateMarkerNameList === 'function') updateMarkerNameList();
                if (typeof renderMarkers === 'function') renderMarkers();
                break;
            case 'tab-robberycreator':
                if (typeof rcReloadList === 'function') rcReloadList();
                if (typeof rcSwitchType === 'function') rcSwitchType((window.rcState && window.rcState.currentType) || 'bank');
                break;
            case 'tab-zones':
                fetch(`https://${GetParentResourceName()}/get_zones`, { method: 'POST' });
                break;
            case 'tab-inventorycreator':
                // refreshInventoryCreator fait déjà son propre fetch — pas besoin de demander serverItems
                if (typeof refreshInventoryCreator === 'function') refreshInventoryCreator();
                break;
            case 'tab-logs':
                if (typeof window.ensureLazyData === 'function') window.ensureLazyData('logs');
                if (typeof renderLogs === 'function') renderLogs();
                break;
            case 'tab-resources':
                if (typeof window.ensureLazyData === 'function') window.ensureLazyData('resources');
                if (typeof renderResources === 'function') renderResources();
                break;
        }

        // Refermer le flyout après sélection d'un item de catégorie
        if (tab.classList.contains('flyout-item')) {
            document.querySelectorAll('.nav-category.open').forEach(c => c.classList.remove('open'));
        }
        // Marquer la catégorie parente comme contenant l'item actif
        if (typeof window.updateCategoryActiveState === 'function') window.updateCategoryActiveState();
    });
});

// ============================================================
// RESIZE HANDLE : poignée de redimensionnement coin bas-droit
// ============================================================
(function initResizeHandle() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    if (document.getElementById('yol-resize-handle')) return; // déjà présent

    const handle = document.createElement('div');
    handle.id = 'yol-resize-handle';
    handle.title = 'Redimensionner';
    handle.innerHTML = '<div class="grip"></div>';
    panel.appendChild(handle);

    const STORAGE_KEY = 'yol_admin_size';
    const MIN_W = 420, MIN_H = 400;
    let resizing = false;
    let startX = 0, startY = 0;
    let startW = 0, startH = 0;

    const onDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        const point = e.touches ? e.touches[0] : e;
        startX = point.clientX;
        startY = point.clientY;
        const rect = panel.getBoundingClientRect();
        startW = rect.width;
        startH = rect.height;
        panel.classList.add('is-resizing');
        handle.classList.add('resizing');
        document.body.classList.add('yol-resizing');
    };

    const onMove = (e) => {
        if (!resizing) return;
        const point = e.touches ? e.touches[0] : e;
        const maxW = window.innerWidth - 20;
        const maxH = window.innerHeight - 20;
        const newW = Math.max(MIN_W, Math.min(maxW, startW + (point.clientX - startX)));
        const newH = Math.max(MIN_H, Math.min(maxH, startH + (point.clientY - startY)));
        panel.style.width = newW + 'px';
        panel.style.height = newH + 'px';
        // Notifier les composants qui dépendent de la taille (map Leaflet, etc.)
        if (window.map && typeof window.map.invalidateSize === 'function') {
            window.map.invalidateSize();
        }
    };

    const onUp = () => {
        if (!resizing) return;
        resizing = false;
        panel.classList.remove('is-resizing');
        handle.classList.remove('resizing');
        document.body.classList.remove('yol-resizing');
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                width: panel.style.width,
                height: panel.style.height,
            }));
        } catch (_) {}
        if (window.map && typeof window.map.invalidateSize === 'function') {
            setTimeout(() => window.map.invalidateSize(), 100);
        }
    };

    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    // Restaure la dernière taille
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (saved && saved.width && saved.height) {
            // N'applique pas si on est en mode vertical (qui a sa propre taille)
            if (!panel.classList.contains('vertical-mode')) {
                panel.style.width = saved.width;
                panel.style.height = saved.height;
            }
        }
    } catch (_) {}
})();

// ============================================================
// MODE VERTICAL : auto-iconize boutons + tooltip au survol
// ============================================================
(function initVerticalTooltips() {
    // Iconify un bouton : extrait son texte → data-tooltip, le wrap en span pour masquage CSS
    const iconifyBtn = (btn) => {
        if (!btn || btn.dataset.vmodeApplied === '1') return;
        // Texte principal : un span existant prioritaire, sinon les text nodes directs
        let label = '';
        const existingSpan = btn.querySelector(':scope > span');
        if (existingSpan && existingSpan.textContent.trim()) {
            label = existingSpan.textContent.trim();
        } else {
            const txtNodes = Array.from(btn.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if (txtNodes.length) {
                label = txtNodes.map(n => n.textContent.trim()).join(' ').trim();
                // Wrap chaque text node dans un span pour qu'on puisse le cacher en mode vertical
                txtNodes.forEach(node => {
                    const sp = document.createElement('span');
                    sp.className = 'vmode-iconize-text';
                    sp.textContent = node.textContent;
                    node.parentNode.replaceChild(sp, node);
                });
            }
        }
        if (!label) return;
        if (!btn.hasAttribute('data-tooltip')) btn.setAttribute('data-tooltip', label);
        btn.classList.add('vmode-iconize');
        btn.dataset.vmodeApplied = '1';
    };

    const apply = () => {
        // 1) Catégories de configuration (sidebar interne du panel Configurations)
        document.querySelectorAll('.cfg-cat').forEach(btn => {
            if (btn.hasAttribute('data-tooltip')) return;
            const span = btn.querySelector('span');
            if (span && span.textContent.trim()) {
                btn.setAttribute('data-tooltip', span.textContent.trim());
            }
        });

        // 2) Boutons d'action principaux qui ont une icône + un texte
        const selectors = [
            '.perms-btn',                                  // panel Permissions
            '.cfg-btn',                                    // panel Configurations
            '#tab-permissions button:not(.perms-subtab)',  // tout bouton du panel Permissions (hors subtabs)
            '#tab-configurations [onclick]',               // boutons header Configurations (Recharger, Sauver, etc.)
            '#tab-server button.btn-action-lg',
            '#tab-vehicles button.btn-action-lg',
            '#tab-eco button.btn-action-lg',
            '#tab-fleet button.btn-action-lg',
        ];
        document.querySelectorAll(selectors.join(',')).forEach(btn => {
            // Ne pas iconifier les boutons sans icône <i>
            if (!btn.querySelector('i')) return;
            iconifyBtn(btn);
        });
    };
    apply();
    // Re-applique après render (boutons rendus en différé)
    setTimeout(apply, 400);
    setTimeout(apply, 1200);

    // Watcher pour les boutons ajoutés dynamiquement (ex. cartes joueur, items)
    const observer = new MutationObserver((mutations) => {
        let needsApply = false;
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                if (n.nodeType === 1 && (n.matches?.('.perms-btn, .cfg-btn, .btn-action-lg') || n.querySelector?.('.perms-btn, .cfg-btn, .btn-action-lg'))) {
                    needsApply = true; break;
                }
            }
            if (needsApply) break;
        }
        if (needsApply) apply();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================================
// Catégories dépliantes (Modérations / Administrations / etc.)
// ============================================================
(function initNavCategories() {
    const categories = document.querySelectorAll('.nav-category');
    if (!categories.length) return;

    const closeAllCategories = (except) => {
        categories.forEach(cat => {
            if (cat !== except) cat.classList.remove('open');
        });
    };

    categories.forEach(cat => {
        const btn = cat.querySelector('.nav-category-btn');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = cat.classList.contains('open');
            closeAllCategories();
            if (!isOpen) cat.classList.add('open');
        });
    });

    // Empêcher la fermeture lorsqu'on clique à l'intérieur d'un flyout
    document.querySelectorAll('.nav-flyout').forEach(fly => {
        fly.addEventListener('click', (e) => e.stopPropagation());
    });

    // Fermer toute catégorie ouverte au clic ailleurs sur la page
    document.addEventListener('click', () => closeAllCategories());

    // Highlight la catégorie qui contient l'onglet actif
    window.updateCategoryActiveState = () => {
        categories.forEach(cat => {
            const hasActive = !!cat.querySelector('.flyout-item.active');
            const btn = cat.querySelector('.nav-category-btn');
            if (btn) btn.dataset.hasActive = hasActive ? 'true' : 'false';
        });
    };
    window.updateCategoryActiveState();
})();

// Render Players List
const renderPlayers = (manualFilter = null) => {
window.renderPlayers = renderPlayers;

    const filter = (typeof manualFilter === 'string') ? manualFilter.toLowerCase() : (searchInput ? searchInput.value.toLowerCase() : '');
    playersListEl.innerHTML = '';
    
    playersData.filter(p => p.name.toLowerCase().includes(filter) || p.id.toString().includes(filter) || (p.license && p.license.includes(filter)))
    .forEach(player => {
        const div = document.createElement('div');
        div.className = `player-card bg-black/40 border border-white/5 p-2 rounded-lg flex items-center justify-between transition-all ${selectedPlayerId === player.id ? 'active' : ''} ${!player.online ? 'offline' : ''}`;
        
        const statusColor = player.online ? 'bg-emerald-400' : 'bg-red-400';
        
        div.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full ${statusColor}"></div>
                <span class="text-[11px] font-bold text-white/90 uppercase truncate">${player.name}</span>
            </div>
            <span class="text-[9px] font-black text-white/20">ID: ${player.id}</span>
        `;
        div.addEventListener('click', () => {
            selectPlayer(player.id, player.name, player.online);
            if (player.coords && map) {
                // Apply the same scaling as markers (GTA / 4)
                map.panTo([player.coords.y / 4, player.coords.x / 4]);
            }
        });
        playersListEl.appendChild(div);
    });
    
    if (playersData.length === 0) {
        playersListEl.innerHTML = '<div style="color: #64748b; text-align: center; padding: 20px;">' + _L('ui_no_players_found') + '</div>';
    }
};

if (searchInput) searchInput.addEventListener('input', renderPlayers);

// Action Buttons
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action], button[data-self], button[data-vehicle], button[data-server], button[data-weather], button[data-time]');
    if (!btn) return;

    const action = btn.dataset.action;
    const selfAction = btn.dataset.self;
    const weatherAction = btn.dataset.weather;
    const timeAction = btn.dataset.time;
    const vehicleAction = btn.dataset.vehicle;
    const serverAction = btn.dataset.server;

    let payload = {};

    if (action) {
        if (selectedPlayerId === null) return;
        payload = { type: 'player', action, target: selectedPlayerId };
    } else if (selfAction) {
        payload = { type: 'self', action: selfAction };
    } else if (vehicleAction) {
        payload = { type: 'vehicle', action: vehicleAction };
    } else if (serverAction) {
        payload = { type: 'server', action: serverAction };
    } else if (weatherAction) {
        payload = { type: 'server', action: 'weather', value: weatherAction };
    } else if (timeAction) {
        payload = { type: 'server', action: 'time', value: timeAction };
    }

    fetch(`https://${GetParentResourceName()}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
});

// ════════════════════════════════════════════
// FINANCIAL INTELLIGENCE (ECO)
// ════════════════════════════════════════════
window.refreshEco = () => {
    fetch(`https://${GetParentResourceName()}/get_eco_data`, { method: 'POST', body: JSON.stringify({}) });
};

window.inspectPlayerFromEco = (identifier) => {
    if (!identifier || identifier === 'Système') return;
    
    // Switch to players tab
    const playerTabBtn = document.querySelector('.nav-icon[data-tab="tab-players"]');
    if (playerTabBtn) playerTabBtn.click();
    
    // Try to find player in data
    const player = playersData.find(p => p.identifier === identifier || (p.license && p.license === identifier));
    if (player) {
        setTimeout(() => selectPlayer(player.id, player.name, player.online), 100);
    }
};

// ════════════════════════════════════════════
// INVENTORY GUARDIAN
// ════════════════════════════════════════════
let currentInventoryTarget = null;

window.searchInventory = () => {
    const val = document.getElementById('inv-search-player').value;
    fetch(`https://${GetParentResourceName()}/search_inventory_players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: val })
    });
};

const updateInvPlayerResults = (players) => {
    const container = document.getElementById('inv-player-results');
    container.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.className = 'bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 cursor-pointer flex justify-between items-center transition-all';
        div.innerHTML = `
            <div class="flex flex-col">
                <span class="text-[11px] font-bold text-white">${p.name}</span>
                <span class="text-[9px] text-white/40">ID: ${p.id}</span>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-white/20"></i>
        `;
        div.onclick = () => {
            currentInventoryTarget = p.id;
            document.getElementById('inv-target-name').textContent = p.name;
            document.getElementById('inv-target-id').textContent = `ID: ${p.id} | License: ${p.identifier}`;
            document.getElementById('inv-actions').style.display = 'flex';
            refreshInventory();
        };
        container.appendChild(div);
    });
};

const refreshInventory = () => {
    if (!currentInventoryTarget) return;
    fetch(`https://${GetParentResourceName()}/get_player_inventory`, {
        method: 'POST',
        body: JSON.stringify({ target: currentInventoryTarget })
    });
};

const updateInventoryGrid = (items) => {
    const container = document.getElementById('inv-grid-container');
    container.innerHTML = '';
    
    // ox_inventory items are usually an object or array
    const itemList = Array.isArray(items) ? items : Object.values(items);
    
    if (itemList.length === 0) {
        container.innerHTML = '<div class="col-span-5 py-20 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">Inventaire Vide</div>';
        return;
    }

    itemList.forEach(item => {
        if (!item) return;
        const div = document.createElement('div');
        div.className = 'bg-black/40 border border-white/10 rounded-xl p-2 flex flex-col items-center gap-2 group relative hover:border-blue-500/50 transition-all';
        
        // Item Image (using ox_inventory format)
        const imgUrl = `nui://ox_inventory/web/images/${item.name}.png`;
        
        div.innerHTML = `
            <div class="w-12 h-12 flex items-center justify-center">
                <img src="${imgUrl}" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" onerror="this.src='https://cdn-icons-png.flaticon.com/512/679/679821.png'">
            </div>
            <span class="text-[9px] font-bold text-white/80 text-center truncate w-full">${item.label}</span>
            <span class="absolute top-1 right-2 text-[8px] font-black text-blue-400">x${item.count || item.amount || 1}</span>
            
            <div class="absolute inset-0 bg-blue-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all rounded-xl">
                <button class="bg-white/20 hover:bg-white/40 p-2 rounded-lg" onclick="removeItemFromInv('${item.name}', ${item.slot})"><i class="fa-solid fa-trash text-white text-[10px]"></i></button>
                <button class="bg-white/20 hover:bg-white/40 p-2 rounded-lg" onclick="giveItemToStaff('${item.name}')"><i class="fa-solid fa-hand-holding-hand text-white text-[10px]"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
};

// ════════════════════════════════════════════
// ZONE ARCHITECT
// ════════════════════════════════════════════
let activeZoneId = null;

window.startZoneCreation = () => {
    const name = document.getElementById('zone-name-input').value;
    const type = document.getElementById('zone-type-input').value;
    if (!name) return;
    
    closeMenu();
    fetch(`https://${GetParentResourceName()}/start_zone_creation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
    });
};

// Helper : active/désactive visuellement les checkboxes de flags selon la sélection
function _refreshZoneFlagsState() {
    const hasSelection = !!activeZoneId;
    const hint = document.getElementById('zone-flags-hint');
    if (hint) hint.style.display = hasSelection ? 'none' : 'block';
    document.querySelectorAll('.zone-flag').forEach(cb => {
        cb.disabled = !hasSelection;
        cb.style.opacity = hasSelection ? '1' : '0.4';
        cb.style.cursor = hasSelection ? 'pointer' : 'not-allowed';
    });
}

function _selectZone(z, allZones) {
    activeZoneId = z.id;
    const editingStatus = document.getElementById('zone-editing-status');
    if (editingStatus) editingStatus.style.display = 'block';
    const pointsDisplay = document.getElementById('zone-points-display');
    if (pointsDisplay) pointsDisplay.textContent = z.data;

    // Pré-cocher les flags actuels de la zone
    let flags = {};
    try { flags = JSON.parse(z.flags || '{}'); } catch (e) { flags = {}; }
    document.querySelectorAll('.zone-flag').forEach(cb => {
        cb.checked = !!flags[cb.dataset.flag];
    });

    _refreshZoneFlagsState();
    updateZoneList(allZones); // Refresh visuel de la sélection
}

const updateZoneList = (zones) => {
    const list = document.getElementById('zone-list');
    if (!list) return;
    list.innerHTML = '';

    // Si la zone précédemment sélectionnée a été supprimée, on perd la sélection
    if (activeZoneId && !zones.find(z => z.id === activeZoneId)) {
        activeZoneId = null;
    }

    // Auto-sélection : si rien n'est sélectionné et qu'il y a des zones,
    // on sélectionne la dernière (la plus récente).
    if (!activeZoneId && zones.length > 0) {
        const lastZone = zones[zones.length - 1];
        // Async pour ne pas créer de boucle infinie (updateZoneList est appelé dans _selectZone)
        setTimeout(() => _selectZone(lastZone, zones), 0);
    }

    zones.forEach(z => {
        const div = document.createElement('div');
        const isActive = (activeZoneId === z.id);
        div.className = `bg-white/5 hover:bg-white/10 p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all`;
        div.style.borderColor = isActive ? '#F04C00' : 'rgba(255,255,255,0.05)';
        div.style.background = isActive ? 'rgba(240,76,0,0.08)' : '';
        div.innerHTML = `
            <div class="flex flex-col">
                <span class="text-[10px] font-bold uppercase" style="color:${isActive ? '#F04C00' : '#fff'}">${z.label}</span>
                <span class="text-[8px] text-white/30 uppercase tracking-widest">${z.type}Zone</span>
            </div>
            <i class="fa-solid ${isActive ? 'fa-check-circle' : 'fa-draw-polygon'} text-[12px]" style="color:${isActive ? '#F04C00' : 'rgba(255,255,255,0.2)'}"></i>
        `;
        div.onclick = () => _selectZone(z, zones);
        list.appendChild(div);
    });

    _refreshZoneFlagsState();
};

const deleteZone = () => {
    if (!activeZoneId) return;
    fetch(`https://${GetParentResourceName()}/delete_zone`, {
        method: 'POST',
        body: JSON.stringify({ id: activeZoneId })
    });
    activeZoneId = null;
    document.getElementById('zone-editing-status').style.display = 'none';
};

// ════════════════════════════════════════════
// FLEET REGISTRY
// ════════════════════════════════════════════
window.refreshFleet = () => {
    fetch(`https://${GetParentResourceName()}/get_fleet_data`, { method: 'POST', body: JSON.stringify({}) });
};

const updateFleetUI = (data) => {
    if (!data) return;
    document.getElementById('fleet-count-out').textContent = data.countOut || 0;
    document.getElementById('fleet-count-total').textContent = data.countTotal || 0;
    document.getElementById('fleet-most-used').textContent = data.mostUsedPlate || '---';
    document.getElementById('fleet-health').textContent = (data.avgHealth || 100) + '%';

    const tbody = document.getElementById('fleet-table-body');
    tbody.innerHTML = '';
    (data.vehicles || []).forEach(v => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-white/5 hover:bg-white/5 transition-colors';
        const isOut = v.status === 'out';
        tr.innerHTML = `
            <td class="px-6 py-4 font-black text-white">${v.plate}</td>
            <td class="px-6 py-4 uppercase text-[9px] font-bold text-white/60">${v.model}</td>
            <td class="px-6 py-4 font-bold">${v.ownerName || 'Inconnu'}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${isOut ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40 border border-white/10'}">${isOut ? 'Sorti' : 'Garage'}</span>
            </td>
            <td class="px-6 py-4">
                <div class="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full ${v.health > 70 ? 'bg-emerald-500' : (v.health > 30 ? 'bg-amber-500' : 'bg-rose-500')}" style="width: ${v.health}%"></div>
                </div>
            </td>
            <td class="px-6 py-4 text-right flex gap-2 justify-end">
                <button class="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all" title="TP vers véhicule" onclick="teleportToVehicle('${v.plate}')"><i class="fa-solid fa-location-dot text-[10px]"></i></button>
                <button class="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all" title="Donner clés" onclick="giveVehicleKey('${v.plate}')"><i class="fa-solid fa-key text-[10px]"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

// Module event handlers are now merged into the main listener above.
// Case handlers removed here.

// Helper actions
const removeItemFromInv = (name, slot) => {
    if (!currentInventoryTarget) return;
    fetch(`https://${GetParentResourceName()}/remove_inventory_item`, {
        method: 'POST',
        body: JSON.stringify({ target: currentInventoryTarget, item: name, slot: slot })
    });
};

const giveItemToStaff = (name) => {
    if (!currentInventoryTarget) return;
    fetch(`https://${GetParentResourceName()}/give_item_to_staff`, {
        method: 'POST',
        body: JSON.stringify({ target: currentInventoryTarget, item: name })
    });
};



// Additional listeners
document.getElementById('fleet-search-input')?.addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#fleet-table-body tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
});

window.teleportToVehicle = (plate) => {
    fetch(`https://${GetParentResourceName()}/teleportToVehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate })
    });
};

window.giveVehicleKey = (plate) => {
    fetch(`https://${GetParentResourceName()}/giveVehicleKey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate })
    });
};

window.impoundVehicle = (plate) => {
    fetch(`https://${GetParentResourceName()}/impoundVehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate })
    });
};


window.teleportToZone = () => {
    if (!activeZoneId) return;
    fetch(`https://${GetParentResourceName()}/teleportToZone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeZoneId })
    });
};

window.toggleZoneVisuals = () => {
    fetch(`https://${GetParentResourceName()}/toggleZoneVisuals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

window.deleteZone = deleteZone;
window.updateZoneList = updateZoneList;
window.updateInvPlayerResults = updateInvPlayerResults;
window.updateInventoryGrid = updateInventoryGrid;
window.updateFleetUI = updateFleetUI;
window.removeItemFromInv = removeItemFromInv;
window.giveItemToStaff = giveItemToStaff;
window.refreshInventory = refreshInventory;

window.selectPlayer = selectPlayer;
window.translateUI = translateUI;
window.initMap = initMap;

// Flag updates for zones
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('zone-flag')) {
        if (!activeZoneId) {
            // Pas de sélection → on annule le check et on alerte visuellement
            e.target.checked = !e.target.checked;
            const hint = document.getElementById('zone-flags-hint');
            if (hint) {
                hint.style.display = 'block';
                hint.style.animation = 'none';
                void hint.offsetWidth; // reflow
                hint.style.animation = 'zoneHintShake 0.4s ease';
            }
            return;
        }
        const flags = {};
        document.querySelectorAll('.zone-flag').forEach(f => {
            flags[f.dataset.flag] = f.checked;
        });
        fetch(`https://${GetParentResourceName()}/update_zone_flags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: activeZoneId, flags: JSON.stringify(flags) })
        });
    }
});

// Petite animation shake pour le hint quand on coche sans sélection
(function injectZoneShake() {
    if (document.getElementById('zone-shake-style')) return;
    const s = document.createElement('style');
    s.id = 'zone-shake-style';
    s.textContent = '@keyframes zoneHintShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }';
    document.head.appendChild(s);
})();

window.resourceAction = (action, resource) => {
    // Optimistic Update for immediate feedback
    const res = (window.serverResources || []).find(r => r.name === resource);
    if (res) {
        if (action === 'stop') res.status = 'stopping';
        else if (action === 'start') res.status = 'starting';
        else if (action === 'restart') res.status = 'stopping';
        if (typeof window.renderResources === 'function') window.renderResources(document.getElementById('res-search')?.value || '');
    }

    fetch(`https://${GetParentResourceName()}/resource_action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, resource })
    });
};


const updateEcoUI = (data) => {
    if (!data) return;
    const moneyEl = document.getElementById('eco-total-money');
    const bankEl = document.getElementById('eco-total-bank');
    const blackEl = document.getElementById('eco-total-black');
    const avgEl = document.getElementById('eco-avg-money');
    const richestEl = document.getElementById('eco-richest-name');

    const totalMoney = (data.totalMoney || 0);
    const totalBank = (data.totalBank || 0);
    const totalBlack = (data.totalBlack || 0);
    const totalWealth = totalMoney + totalBank;

    if (moneyEl) moneyEl.textContent = totalWealth.toLocaleString() + ' $';
    if (bankEl) bankEl.textContent = totalBank.toLocaleString() + ' $';
    if (blackEl) blackEl.textContent = totalBlack.toLocaleString() + ' $';
    
    if (avgEl) {
        const onlineCount = playersData.filter(p => p.online).length || 1;
        avgEl.textContent = Math.floor(totalWealth / onlineCount).toLocaleString() + ' $';
    }

    if (richestEl && data.topFortunes && data.topFortunes[0]) {
        richestEl.textContent = data.topFortunes[0].name;
    }

    const tbody = document.getElementById('eco-transactions-body');
    if (tbody) {
        tbody.innerHTML = '';
        if (data.transactions) {
            data.transactions.forEach(t => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-white/5 hover:bg-white/5';
                tr.innerHTML = `
                    <td class="py-3 font-mono opacity-50">${t.date}</td>
                    <td class="py-3 font-black uppercase text-white">${t.from}</td>
                    <td class="py-3 font-black uppercase text-white">${t.to}</td>
                    <td class="py-3 font-black text-emerald-400">${(t.amount || 0).toLocaleString()} $</td>
                    <td class="py-3 text-right flex gap-2 justify-end">
                        <button class="bg-white/5 hover:bg-blue-500/20 p-1.5 rounded text-blue-400 hover:text-white transition-all" onclick="inspectPlayerFromEco('${t.fromIdentifier}')" title="Inspecter l'expéditeur"><i class="fa-solid fa-eye"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    const topList = document.getElementById('eco-top-players');
    if (topList) {
        topList.innerHTML = '';
        if (data.topFortunes) {
            data.topFortunes.forEach((p, i) => {
                const el = document.createElement('div');
                el.className = 'bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between';
                el.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="w-5 h-5 rounded bg-admin-gold/20 text-admin-gold flex items-center justify-center text-[10px] font-black">${i+1}</span>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-black text-white uppercase">${p.name}</span>
                            <span class="text-[7px] font-bold text-white/30 uppercase">${p.job}</span>
                        </div>
                    </div>
                    <span class="text-[10px] font-black text-emerald-400">${(p.total || 0).toLocaleString()} $</span>
                `;
                topList.appendChild(el);
            });
        }
    }
};


const refreshEco = () => post('get_eco_data', {});
const refreshFleet = () => post('get_fleet_data', {});
const refreshDashboard = () => updateDashboard();

window.updateEcoUI = updateEcoUI;
window.updateFleetUI = updateFleetUI;
window.refreshEco = refreshEco;
window.refreshFleet = refreshFleet;
window.refreshDashboard = refreshDashboard;
window.updateDashboard = updateDashboard;
window.deleteAllVehicles = () => post('action', {type:'server', action:'delete_all_vehicles'});

// ════════════════════════════════════════════
// DYNAMIC BUTTONS (PLAYER & VEHICLE)
// ════════════════════════════════════════════
const createSlot = (icon, label, callback) => {
    const el = document.createElement('div');
    el.className = 'action-slot';
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${label}</span>`;
    el.onclick = callback;
    return el;
};

function initPlayerActions() {
    const cats = {
        'cat-health': [
            { i: 'fa-truck-medical', l: _L('ui_revive') || 'Revive', a: 'revive' },
            { i: 'fa-heart-circle-bolt', l: _L('ui_heal_action') || 'Heal', a: 'heal' },
            { i: 'fa-utensils', l: _L('ui_needs') || 'Besoins', a: 'foodwater' },
            { i: 'fa-skull', l: _L('ui_kill') || 'Tuer', a: 'kill' },
            { i: 'fa-hand-back-fist', l: _L('ui_slap') || 'Gifle', a: 'slap' },
            { i: 'fa-snowflake', l: _L('ui_freeze') || 'Freeze', a: 'freeze' },
            { i: 'fa-link', l: _L('ui_cuff') || 'Menotter', a: 'handcuff' },
            { i: 'fa-person-falling', l: _L('ui_ragdoll') || 'Ragdoll', a: 'ragdoll' },
        ],
        'cat-teleport': [
            { i: 'fa-paper-plane', l: _L('ui_goto') || 'Aller à', a: 'goto' },
            { i: 'fa-magnet', l: _L('ui_bring') || 'Amener', a: 'bring' },
            { i: 'fa-location-dot', l: _L('ui_coords') || 'Coords', a: 'setcoords' },
            { i: 'fa-rotate-left', l: _L('ui_return') || 'Retour', a: 'sendback' },
            { i: 'fa-ban', l: 'Ban', a: 'ban', c: 'action-slot-ban' }
        ],
        'cat-economy': [
            { i: 'fa-box-open', l: _L('ui_inventory') || 'Inventaire', a: 'inventory' },
            { i: 'fa-money-bill-transfer', l: _L('ui_set_money') || 'Set Money', a: 'setmoney' },
            { i: 'fa-hand-holding-dollar', l: _L('ui_give_money') || 'Give Money', a: 'givemoney' },
            { i: 'fa-sack-xmark', l: _L('ui_remove_money') || 'Rem. Money', a: 'removemoney' },
        ],
        'cat-admin': [
            { i: 'fa-user-pen', l: _L('ui_set_job') || 'Set Job', a: 'setjob' },
            { i: 'fa-user-secret', l: 'Set Gang', a: 'setgang' },
            // Set Group retiré : géré via le module Permissions (groupes Yol)
            { i: 'fa-mask', l: _L('ui_set_model') || 'Set Model', a: 'setmodel' },
            { i: 'fa-circle-info', l: _L('ui_infos') || 'Infos', a: 'copyid' },
        ]
    };

    for (const [id, actions] of Object.entries(cats)) {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '';
            actions.forEach(act => {
                const slot = createSlot(act.i, act.l, () => {
                    if (act.a === 'inventory') {
                        const invTab = document.querySelector('.nav-icon[data-tab="tab-inventory"]');
                        if (invTab) {
                            invTab.click();
                            const search = document.getElementById('inventory-search-input');
                            if (search) {
                                search.value = window.selectedPlayerId;
                                search.dispatchEvent(new Event('input'));
                            }
                        }
                    } else if (act.a === 'ban') {
                        const targetLicense = (window.selectedPlayer && window.selectedPlayer.license) || '';
                        if (typeof window.openManualAcBanModal === 'function') {
                            window.openManualAcBanModal(targetLicense, window.selectedPlayerId);
                        }
                    } else if (act.a === 'copyid') {
                        if (typeof window.openInfoModal === 'function') window.openInfoModal();
                    } else if (act.a === 'setjob') {
                        if (typeof window.openModal === 'function') window.openModal('setjob', 'Modifier Métier');
                    } else if (act.a === 'setgang') {
                        if (typeof window.openModal === 'function') window.openModal('setgang', 'Modifier Gang');
                    } else if (act.a === 'setmoney' || act.a === 'givemoney' || act.a === 'removemoney') {
                        const title = act.a === 'setmoney' ? 'Définir Argent' : (act.a === 'givemoney' ? 'Donner Argent' : 'Retirer Argent');
                        if (typeof window.openModal === 'function') window.openModal(act.a, title);
                    } else if (act.a === 'setgroup') {
                        if (typeof window.openModal === 'function') window.openModal('setgroup', 'Modifier Groupe');
                    } else if (act.a === 'setmodel') {
                        if (typeof window.openModal === 'function') window.openModal('setmodel', 'Modifier Modèle');
                    } else if (act.a === 'setcoords') {
                        if (typeof window.openModal === 'function') window.openModal('setcoords', 'Téléportation (X, Y, Z)');
                    } else {
                        post('action', { type: 'player', action: act.a, target: window.selectedPlayerId });
                    }
                });
                if (act.c) {
                    slot.classList.add(act.c);
                }
                container.appendChild(slot);
            });
        }
    }
};

function initVehicleActions() {
    // Grille unifiée d'actions véhicule (anciennement splittée en "Essentielles" + "Avancée")
    const actions = [
        { i: 'fa-wrench',          l: 'Réparer',    a: 'repair_veh' },
        { i: 'fa-arrows-rotate',   l: 'Retourner',  a: 'flip' },
        { i: 'fa-key',             l: 'Clés',       a: 'give_veh_key' },
        { i: 'fa-box-open',        l: 'Coffre',     a: 'trunk' },
        { i: 'fa-gas-pump',        l: 'Carburant',  a: 'fuel' },
        { i: 'fa-trash',           l: 'Supprimer',  a: 'dv_veh', danger: true }
    ];

    const grid = document.getElementById('vehicle-actions-grid');
    if (!grid) return;
    grid.innerHTML = '';
    actions.forEach(act => {
        const slot = createSlot(act.i, act.l, () => {
            const target = selectedPlayerId || -1;
            post('action', { type: 'player', action: act.a, target: target });
        });
        if (act.danger) slot.classList.add('action-slot-ban'); // réutilise le style danger existant
        grid.appendChild(slot);
    });
};

// Initial calls
initVehicleActions();
window.initPlayerActions = initPlayerActions;
window.initVehicleActions = initVehicleActions;

window.renderResources = (filter = '') => {
    const list = document.querySelector('#tab-resources tbody');
    if (!list) return;
    list.innerHTML = '';
    const resources = window.serverResources || [];
    resources.filter(r => r.name.toLowerCase().includes(filter.toLowerCase())).forEach(r => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-white/5 hover:bg-white/5 resource-row';
        
        let statusColor = 'rose';
        if (r.status === 'started') statusColor = 'emerald';
        else if (r.status === 'starting' || r.status === 'stopping') statusColor = 'amber';
        
        const isStarted = r.status === 'started';
        const isTransitioning = r.status === 'starting' || r.status === 'stopping';
        
        tr.innerHTML = `
            <td class="px-4 py-2 text-[10px] font-black text-white uppercase tracking-tight res-name-cell">${r.name}</td>
            <td class="px-4 py-2 text-center res-status-cell">
                <span class="bg-${statusColor}-500/20 text-${statusColor}-500 px-2 py-0.5 rounded text-[7px] font-black uppercase border border-${statusColor}-500/20">${r.status}</span>
            </td>
            <td class="px-4 py-2 text-right res-actions-cell">
                <div class="flex justify-end gap-1.5 items-center">
                    ${isTransitioning ? `
                        <i class="fa-solid fa-circle-notch fa-spin text-white/20 text-[10px] mr-2"></i>
                    ` : ( !isStarted ? `
                    <button class="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all border border-emerald-500/20 active:scale-90" title="Start" onclick="resourceAction('start', '${r.name}')">
                        <i class="fa-solid fa-play text-[10px]"></i>
                    </button>
                    ` : `
                    <button class="bg-white/10 hover:bg-white text-white hover:text-black w-8 h-8 rounded-lg flex items-center justify-center transition-all border border-white/10 active:scale-90" title="Restart" onclick="resourceAction('restart', '${r.name}')">
                        <i class="fa-solid fa-rotate text-xs"></i>
                    </button>
                    <button class="bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all border border-rose-500/20 active:scale-90" title="Stop" onclick="resourceAction('stop', '${r.name}')">
                        <i class="fa-solid fa-stop text-xs"></i>
                    </button>
                    `)}
                </div>
            </td>
        `;
        list.appendChild(tr);
    });
};

window.renderLogs = () => {
    const list = document.getElementById('staff-logs');
    if (!list) return;
    list.innerHTML = '';
    const logs = window.serverLogs || [];
    if (logs.length === 0) {
        list.innerHTML = `<div class="flex items-center justify-center p-20 opacity-20 flex-col gap-4"><i class="fa-solid fa-clock-rotate-left text-5xl"></i><span class="text-xs font-black uppercase tracking-widest">${_L('ui_no_logs_found') || 'Aucun log trouvé'}</span></div>`;
        return;
    }
    
    logs.forEach(log => {
        const div = document.createElement('div');
        const adminName = (log.firstname || log.lastname) ? `${log.firstname || ''} ${log.lastname || ''}`.trim() : (log.admin === 'Console' ? 'Console' : (log.admin || 'Inconnu'));
        
        let icon = 'fa-clipboard-list';
        let color = 'text-admin-gold';
        const act = (log.action || '').toLowerCase();
        
        if (act.includes('revive') || act.includes('heal')) { icon = 'fa-heart'; color = 'text-rose-400'; }
        else if (act.includes('food') || act.includes('water') || act.includes('fed')) { icon = 'fa-burger'; color = 'text-orange-400'; }
        else if (act.includes('ban') || act.includes('kick')) { icon = 'fa-gavel'; color = 'text-red-500'; }
        else if (act.includes('teleport') || act.includes('bring') || act.includes('goto')) { icon = 'fa-location-dot'; color = 'text-blue-400'; }
        else if (act.includes('vehicle') || act.includes('car')) { icon = 'fa-car'; color = 'text-zinc-300'; }
        else if (act.includes('item') || act.includes('weapon') || act.includes('money') || act.includes('give')) { icon = 'fa-gift'; color = 'text-emerald-400'; }
        else if (act.includes('job') || act.includes('gang')) { icon = 'fa-briefcase'; color = 'text-yellow-400'; }
        else if (act.includes('blackout') || act.includes('weather') || act.includes('time')) { icon = 'fa-cloud-moon'; color = 'text-indigo-400'; }
        else if (act.includes('freeze')) { icon = 'fa-snowflake'; color = 'text-cyan-400'; }

        // Format Date
        let dateStr = '';
        if (log.timestamp) {
            const dateObj = new Date(log.timestamp);
            if (!isNaN(dateObj)) {
                dateStr = dateObj.toLocaleString('fr-FR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }).replace(',', ' à');
            }
        } else if (log.date) {
            dateStr = log.date;
        }

        div.className = 'bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3 shadow-lg relative overflow-hidden transition-all hover:bg-black/60 hover:border-white/10 shrink-0';
        div.innerHTML = `
            <div class="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none">
                <i class="fa-solid ${icon} text-8xl"></i>
            </div>
            <div class="flex justify-between items-start border-b border-white/5 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/5 shadow-inner">
                        <i class="fa-solid ${icon} ${color}"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[11px] font-black text-white uppercase tracking-widest">${log.action || 'ACTION'}</span>
                        <span class="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Par: <span class="text-white/80">${adminName}</span></span>
                    </div>
                </div>
                ${dateStr ? `<div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 border border-white/5">
                    <i class="fa-regular fa-clock text-[9px] text-white/20"></i>
                    <span class="text-[9px] font-black text-white/40 uppercase">${dateStr}</span>
                </div>` : ''}
            </div>
            <div class="bg-black/20 p-3 rounded-lg border border-white/5 pl-4 relative">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-white/5 rounded-l-lg"></div>
                <p class="text-[11px] text-white/70 font-mono italic">"${log.details || log.message || ''}"</p>
            </div>
        `;
        list.appendChild(div);
    });
};

const project = (x, y) => [
    (y * window.mapCalibration.scaleY) + window.mapCalibration.offsetY,
    (x * window.mapCalibration.scaleX) + window.mapCalibration.offsetX
];

const syncMapMarkers = (targetMap, targetMarkers, players, vehicles) => {
    if (!targetMap || !targetMarkers) return;
    const activeIds = new Set();
    
    // Sync Players
    if (players && Array.isArray(players)) {
        players.forEach(p => {
            activeIds.add(p.id.toString());
            const [lat, lng] = project(p.coords.x, p.coords.y);
            
            let playerInfo = (window.allPlayers || []).find(pl => pl.id === p.id) || p;
            
            if (!targetMarkers[p.id]) {
                const marker = L.marker([lat, lng], {
                    icon: L.divIcon({ 
                        className: 'player-marker', 
                        html: `
                            <div class="relative w-5 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] border-2 border-black/40 flex items-center justify-center animate-pulse">
                                <i class="fa-solid fa-user-large text-[8px] text-white"></i>
                            </div>
                        `,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(targetMap);


                marker.on('mouseout', () => {
                    marker.closeTooltip();
                });

                marker.bindPopup(`
                    <div class="p-2 min-w-[200px] bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-white font-inter">
                        <div class="flex flex-col gap-1 mb-3">
                            <span class="text-[10px] font-black uppercase text-admin-gold tracking-widest">${playerInfo.name || 'Inconnu'}</span>
                            <span class="text-[8px] font-bold text-white/40 uppercase">ID: ${p.id} | Job: ${playerInfo.job || 'Civil'}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <button class="w-full py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all" onclick="selectPlayer(${p.id}, '${(playerInfo.name || 'Inconnu').replace(/'/g, "\\'")}', true)">Inspecter</button>
                            <button class="w-full py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-indigo-300 hover:text-white transition-all" onclick="post('action', {type:'player', action:'pip_start', target:${p.id}})">PiP Vidéo</button>
                        </div>
                    </div>
                `, { className: 'premium-popup', closeButton: false, offset: [0, -5] });
                
                targetMarkers[p.id] = marker;
            } else {
                targetMarkers[p.id].setLatLng([lat, lng]);
            }
        });
    }

    // Sync Vehicles
    if (vehicles && Array.isArray(vehicles)) {
        vehicles.forEach(v => {
            const vId = 'veh_' + (v.netId || v.id);
            activeIds.add(vId);
            const [lat, lng] = project(v.coords.x, v.coords.y);
            
            const enginePct = Math.max(0, Math.min(100, Math.floor((v.engine || 0) / 10)));
            const bodyPct = Math.max(0, Math.min(100, Math.floor((v.body || 0) / 10)));
            
            if (!targetMarkers[vId]) {
                targetMarkers[vId] = L.marker([lat, lng], {
                    icon: L.divIcon({ 
                        className: 'vehicle-marker', 
                        html: `
                            <div class="relative w-5 h-5 bg-admin-gold rounded-lg shadow-[0_0_10px_#D4AF37] border-2 border-black/40 flex items-center justify-center">
                                <i class="fa-solid fa-car text-[8px] text-black"></i>
                            </div>
                        `,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(targetMap);
                targetMarkers[vId].bindPopup(`
                    <div class="p-3 min-w-[180px] bg-black/85 backdrop-blur-md rounded-xl border border-white/10 text-white font-inter">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-[10px] font-black uppercase text-admin-gold tracking-widest">${v.name || 'Véhicule'}</span>
                            <span class="text-[8px] font-bold text-white/30 uppercase">ID: ${v.netId || '???'}</span>
                        </div>
                        <div class="flex flex-col gap-1 mb-3">
                            <div class="flex justify-between border-b border-white/5 pb-1">
                                <span class="text-[7px] font-black text-white/40 uppercase">Plaque</span>
                                <span class="text-[8px] font-bold text-white uppercase">${v.plate || '???'}</span>
                            </div>
                            <div class="flex justify-between border-b border-white/5 pb-1">
                                <span class="text-[7px] font-black text-white/40 uppercase">Proprio</span>
                                <span class="text-[8px] font-bold text-emerald-400 uppercase">${v.owner || 'Inconnu'}</span>
                            </div>
                            <div class="flex justify-between border-b border-white/5 pb-1">
                                <span class="text-[7px] font-black text-white/40 uppercase">État</span>
                                <span class="text-[8px] font-bold ${enginePct < 50 ? 'text-rose-500' : 'text-white'} uppercase">${enginePct}% / ${bodyPct}%</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-1.5">
                            <button class="py-1 bg-emerald-500/10 hover:bg-emerald-500/30 border border-emerald-500/20 rounded text-[7px] font-black uppercase transition-all" onclick="post('action', {type:'vehicle', action:'keys_remote', plate: '${v.plate}', model: '${v.name || 'car'}'})" title="Donner Clés"><i class="fa-solid fa-key"></i></button>
                            <button class="py-1 bg-admin-gold/10 hover:bg-admin-gold/30 border border-admin-gold/20 rounded text-[7px] font-black uppercase transition-all" onclick="post('action', {type:'vehicle', action:'tp', netId: ${v.netId}})" title="S'y Téléporter"><i class="fa-solid fa-location-arrow"></i></button>
                            <button class="py-1 bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/20 rounded text-[7px] font-black uppercase transition-all" onclick="post('action', {type:'vehicle', action:'dv', netId: ${v.netId}})" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `, { className: 'premium-popup', closeButton: false, offset: [0, -10] });
            } else {
                targetMarkers[vId].setLatLng([lat, lng]);
            }
        });
    }

    // Selective Cleanup
    Object.keys(targetMarkers).forEach(id => {
        const isVeh = id.toString().startsWith('veh_');
        if (players && !isVeh && !activeIds.has(id)) {
            targetMap.removeLayer(targetMarkers[id]);
            delete targetMarkers[id];
        }
        if (vehicles && isVeh && !activeIds.has(id)) {
            targetMap.removeLayer(targetMarkers[id]);
            delete targetMarkers[id];
        }
    });
};

window.project = project;
window.syncMapMarkers = syncMapMarkers;

window.tacticalMap = null;
window.tacticalMarkers = {};

const openTacticalMap = () => {
    const modal = document.getElementById('tactical-map-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        if (!window.tacticalMap) {
            window.tacticalMap = L.map('tactical-map', {
                crs: L.CRS.Simple,
                minZoom: -2,
                maxZoom: 2,
                zoomControl: true,
                attributionControl: false
            });
            const bounds = [[-3758, -4230], [7151, 5410]];
            L.imageOverlay('https://imagedelivery.net/xMNIukUvBnTcljSQ6wCsQg/d69bfcd1-773e-489a-201e-6ec358ec6500/MAPS', bounds).addTo(window.tacticalMap);
            window.tacticalMap.fitBounds(bounds);
            window.tacticalMap.setView([0, 0], 0);
        }
        window.tacticalMap.invalidateSize();
        if (window.serverConfig && window.serverConfig.staffCoords) {
            window.tacticalMap.setView(project(window.serverConfig.staffCoords.x, window.serverConfig.staffCoords.y), 1);
        }
    }, 100);
};

const closeTacticalMap = () => {
    document.getElementById('tactical-map-modal').classList.add('hidden');
};

window.openTacticalMap = openTacticalMap;
window.closeTacticalMap = closeTacticalMap;

const toggleMapExpand = () => openTacticalMap();
window.toggleMapExpand = toggleMapExpand;

window.toggleDev = (type) => {
    const dot = document.getElementById(`toggle-${type}-dot`);
    const bg = document.getElementById(`toggle-${type}`);
    if (!dot || !bg) return;
    
    const isActive = dot.classList.contains('translate-x-5');
    
    if (isActive) {
        dot.classList.remove('translate-x-5', 'bg-admin-gold');
        dot.classList.add('left-1', 'bg-black/40');
        bg.classList.remove('bg-admin-gold/20', 'border-admin-gold/30');
    } else {
        dot.classList.add('translate-x-5', 'bg-admin-gold');
        dot.classList.remove('left-1', 'bg-black/40');
        bg.classList.add('bg-admin-gold/20', 'border-admin-gold/30');
    }
    post('devAction', { action: 'toggle', type: type, state: !isActive });
};

window.copyCoords = (format) => {
    const x = document.getElementById('dev-coord-x').innerText;
    const y = document.getElementById('dev-coord-y').innerText;
    const z = document.getElementById('dev-coord-z').innerText;
    const h = document.getElementById('dev-coord-h').innerText;
    let text = "";
    if (format === 'vec3') text = `vector3(${x}, ${y}, ${z})`;
    else if (format === 'vec4') text = `vector4(${x}, ${y}, ${z}, ${h})`;
    else if (format === 'json') text = JSON.stringify({x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), h: parseFloat(h)});
    else if (format === 'lua') text = `{x = ${x}, y = ${y}, z = ${z}, h = ${h}}`;
    
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

// ════════════════════════════════════════════
// YOL_ANTICHEAT INTERFACE INTEGRATION
// ════════════════════════════════════════════
window.anticheatConfig = {};
window.anticheatFlags = [];
window.anticheatBans = [];
window.anticheatBansFiltered = [];

const acModules = [
    { key: 'noclip', label: 'NoClip Detector', desc: 'Détecte les déplacements aériens anormaux' },
    { key: 'godmode', label: 'GodMode Shield', desc: 'Vérifie l\'invincibilité et santé infinie' },
    { key: 'explosions', label: 'Anti-Explosions', desc: 'Bloque la création d\'explosions illégales' },
    { key: 'weapon', label: 'Weapon Spawn Check', desc: 'Détecte les armes générées illégalement' },
    { key: 'vehicle', label: 'Vehicle Spawn Guard', desc: 'Filtre le spawn anormal de véhicules' },
    { key: 'aimbot', label: 'Aimbot Blocker', desc: 'Analyse la précision de tir suspecte' },
    { key: 'ped', label: 'Ped Spawn Blocker', desc: 'Bloque le spam de Peds/PNJ' },
    { key: 'object', label: 'Object Spam Filter', desc: 'Empêche le spawn d\'objets géants/bloquants' },
    { key: 'triggers', label: 'Anti-Trigger Spam', desc: 'Protège les serveurs-events vulnérables' },
    { key: 'metadata', label: 'Metadata Integrity', desc: 'Contrôle l\'altération de vitesse/hauteur' },
    { key: 'antirevive', label: 'Anti-Revive Hack', desc: 'Vérifie la légitimité des réanimations' },
    { key: 'antistop', label: 'Anti-ResourceStop', desc: 'Bloque l\'arrêt de ressources essentielles' },
    { key: 'spectate', label: 'Anti-Spectate Mode', desc: 'Bloque l\'utilisation frauduleuse du mode spectateur' },
    { key: 'invisible', label: 'Anti-Invisibilité', desc: 'Détecte les joueurs invisibles hors staff' },
    { key: 'vision', label: 'Vision Spéciale', desc: 'Intercepte l\'activation thermique ou nocturne illégale' }
];

window.refreshAnticheat = () => {
    post('get_anticheat_data', {});
};

window.updateAnticheatUI = (data) => {
    if (!data) return;
    if (data.config) window.anticheatConfig = data.config;
    if (data.flags) window.anticheatFlags = data.flags;
    if (data.bans) {
        window.anticheatBans = data.bans;
        filterAcBans();
    }
    
    // Sync Advanced config settings input/select values
    if (data.settings) {
        const optBanMethod = document.getElementById('ac-opt-banmethod');
        const optSsThreshold = document.getElementById('ac-opt-ssthreshold');
        const optFlagWindow = document.getElementById('ac-opt-flagwindow');
        const optMasterInterval = document.getElementById('ac-opt-masterinterval');
        const optBypassAdmin = document.getElementById('ac-opt-bypassadmin');
        const optEntityLimit = document.getElementById('ac-opt-entitylimit');
        
        if (optBanMethod && data.settings.banMethod) optBanMethod.value = data.settings.banMethod;
        if (optSsThreshold && data.settings.screenshotThreshold !== undefined) optSsThreshold.value = data.settings.screenshotThreshold;
        if (optFlagWindow && data.settings.flagWindow !== undefined) optFlagWindow.value = data.settings.flagWindow;
        if (optMasterInterval && data.settings.masterInterval !== undefined) optMasterInterval.value = data.settings.masterInterval;
        if (optBypassAdmin && data.settings.bypassAdmin !== undefined) optBypassAdmin.value = String(data.settings.bypassAdmin);
        if (optEntityLimit && data.settings.entityLimit !== undefined) optEntityLimit.value = data.settings.entityLimit;
    }
    
    // Update stats counters
    let activeDetections = 0;
    if (window.anticheatConfig) {
        acModules.forEach(mod => {
            if (window.anticheatConfig[mod.key]) activeDetections++;
        });
    }
    
    const statDetections = document.getElementById('ac-stat-detections');
    const statSuspects = document.getElementById('ac-stat-suspects');
    const statBans = document.getElementById('ac-stat-bans');
    
    if (statDetections) statDetections.innerText = `${activeDetections} / 15`;
    if (statSuspects) statSuspects.innerText = window.anticheatFlags ? window.anticheatFlags.length : 0;
    if (statBans) statBans.innerText = window.anticheatBans ? window.anticheatBans.length : 0;
    
    renderAnticheatDetections();
    renderAnticheatFlags();
};

window.renderAnticheatDetections = () => {
    const container = document.getElementById('ac-detections-list');
    if (!container) return;
    container.innerHTML = '';
    
    acModules.forEach(mod => {
        const isEnabled = !!window.anticheatConfig[mod.key];
        const card = document.createElement('div');
        
        card.className = `flex items-center justify-between p-2 px-3 rounded-xl transition-all border cursor-help ${
            isEnabled 
                ? 'bg-emerald-950/20 border-emerald-500/30' 
                : 'bg-rose-950/20 border-rose-500/20'
        }`;
        card.title = mod.desc;
        
        card.innerHTML = `
            <div class="flex items-center gap-2 truncate max-w-[75%]">
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}"></span>
                <span class="text-[9px] font-black uppercase tracking-wider text-white truncate">${mod.label}</span>
            </div>
            <label class="ac-switch scale-[0.8] origin-right flex-shrink-0">
                <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleAcDetection('${mod.key}', this.checked)">
                <span class="ac-slider"></span>
            </label>
        `;
        container.appendChild(card);
    });
};

window.toggleAcDetection = (key, state) => {
    post('toggle_ac_detection', { key: key, state: state });
    window.anticheatConfig[key] = state;
    renderAnticheatDetections();
};

window.renderAnticheatFlags = () => {
    const container = document.getElementById('ac-suspects-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (!window.anticheatFlags || window.anticheatFlags.length === 0) {
        container.innerHTML = `<div class="text-center py-10 opacity-30 text-[8px] font-black uppercase tracking-widest text-white">Aucun suspect en session</div>`;
        return;
    }
    
    window.anticheatFlags.forEach(sus => {
        const card = document.createElement('div');
        card.className = 'bg-amber-950/20 border border-amber-500/30 rounded-xl p-2 flex flex-col gap-1.5 relative overflow-hidden ac-suspect-pulse';
        
        let reasonsHtml = '';
        if (Array.isArray(sus.reasons)) {
            sus.reasons.forEach(r => {
                reasonsHtml += `<span class="bg-black/40 border border-white/5 text-white text-[6px] font-black px-1 py-0.5 rounded uppercase tracking-wider">${r}</span>`;
            });
        }
        
        const jobLabel = sus.job || 'Inconnu';
        const gangLabel = sus.gang || 'Aucun';
        const cashVal = sus.money !== undefined ? sus.money.toLocaleString() : '0';
        const bankVal = sus.bank !== undefined ? sus.bank.toLocaleString() : '0';
        const pingVal = sus.ping !== undefined && sus.ping >= 0 ? `${sus.ping}ms` : 'N/A';
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex flex-col min-w-0 flex-1 pr-2">
                    <span class="text-[9px] font-black uppercase text-white truncate">${sus.name}</span>
                    <span class="text-[6px] text-white/40 font-mono leading-normal">ID: ${sus.source} | PING: ${pingVal} | FLAGS: ${sus.count || 1}</span>
                </div>
                <span class="bg-amber-500/20 border border-amber-400/40 text-[6px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-widest flex-shrink-0">SUSPECT</span>
            </div>
            
            <div class="flex flex-wrap gap-1 max-h-[30px] overflow-y-auto custom-scroll pr-1">
                ${reasonsHtml}
            </div>
            
            <!-- Informations Enrichies -->
            <div class="flex flex-col gap-0.5 border-t border-white/5 pt-1 text-[6px] font-bold text-white/50 uppercase">
                <div class="flex justify-between">
                    <span>Job: <strong class="text-white">${jobLabel}</strong></span>
                    <span>Gang: <strong class="text-white">${gangLabel}</strong></span>
                </div>
                <div class="flex justify-between">
                    <span>Cash: <strong class="text-emerald-400">${cashVal}$</strong></span>
                    <span>Banque: <strong class="text-sky-400">${bankVal}$</strong></span>
                </div>
            </div>
            
            <div class="grid grid-cols-4 gap-1 mt-1 pt-1 border-t border-white/5">
                <button onclick="acAction('goto', ${sus.source})" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded py-0.5 flex items-center justify-center text-[7px] font-black uppercase tracking-wider" title="Goto"><i class="fa-solid fa-location-arrow text-[8px]"></i></button>
                <button onclick="acAction('screenshot', ${sus.source})" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded py-0.5 flex items-center justify-center text-[7px] font-black uppercase tracking-wider" title="Screenshot"><i class="fa-solid fa-camera text-[8px]"></i></button>
                <button onclick="acAction('clear_flags', ${sus.source})" class="bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded py-0.5 flex items-center justify-center text-[7px] font-black uppercase tracking-wider" title="Reset Flags"><i class="fa-solid fa-rotate-left text-[8px]"></i></button>
                <button onclick="openManualAcBanModal('${sus.license || ''}', '${sus.source}')" class="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded py-0.5 flex items-center justify-center text-[7px] font-black uppercase tracking-wider" title="Ban"><i class="fa-solid fa-ban text-[8px]"></i></button>
            </div>
        `;
        container.appendChild(card);
    });
};

window.acAction = (action, source) => {
    if (action === 'goto') {
        post('action', { type: 'player', action: 'goto', target: source });
    } else if (action === 'screenshot') {
        post('trigger_ac_screenshot', { targetId: source });
    } else if (action === 'clear_flags') {
        post('clear_ac_flags', { targetId: source });
        window.anticheatFlags = window.anticheatFlags.filter(f => f.source != source);
        renderAnticheatFlags();
    }
};

window.filterAcBans = () => {
    const search = (document.getElementById('ac-bans-search').value || '').toLowerCase().trim();
    if (!search) {
        window.anticheatBansFiltered = window.anticheatBans;
    } else {
        window.anticheatBansFiltered = window.anticheatBans.filter(ban => {
            return (ban.license && ban.license.toLowerCase().includes(search)) ||
                   (ban.name && ban.name.toLowerCase().includes(search)) ||
                   (ban.reason && ban.reason.toLowerCase().includes(search)) ||
                   (ban.bannedby && ban.bannedby.toLowerCase().includes(search));
        });
    }
    renderAnticheatBans();
};

window.renderAnticheatBans = () => {
    const container = document.getElementById('ac-bans-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (!window.anticheatBansFiltered || window.anticheatBansFiltered.length === 0) {
        container.innerHTML = `<div class="text-center py-10 opacity-30 text-[8px] font-black uppercase tracking-widest text-white">Aucun ban enregistré</div>`;
        return;
    }
    
    window.anticheatBansFiltered.forEach(ban => {
        const card = document.createElement('div');
        card.className = 'bg-black/20 border border-white/5 rounded-xl p-2 flex flex-col gap-1.5 hover:border-white/20 transition-all';
        
        card.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex flex-col min-w-0 flex-1 pr-2">
                    <span class="text-[9px] font-black uppercase text-white truncate">${ban.name || 'Inconnu'}</span>
                    <span class="text-[6px] text-white/40 font-mono truncate" title="${ban.license}">${ban.license}</span>
                </div>
                <button onclick="unbanAcPlayer('${ban.license}')" class="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 w-5 h-5 flex items-center justify-center rounded transition-all flex-shrink-0" title="Pardonner (Débannir)">
                    <i class="fa-solid fa-unlock text-[8px]"></i>
                </button>
            </div>
            <div class="flex flex-col gap-0.5 border-t border-white/5 pt-1 text-[7px] text-white/70">
                <span class="font-medium leading-normal uppercase truncate" title="${ban.reason || 'Aucune raison'}">Raison: ${ban.reason || 'Aucune raison'}</span>
                <div class="flex justify-between items-center text-[6px] text-white/30 font-bold uppercase mt-0.5">
                    <span>Par: ${ban.bannedby || 'Anticheat'}</span>
                    <span>Le: ${ban.added ? new Date(ban.added).toLocaleDateString() : 'Date inconnue'}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};

window.unbanAcPlayer = (license) => {
    post('unban_ac_player', { license: license });
    window.anticheatBans = window.anticheatBans.filter(b => b.license !== license);
    filterAcBans();
};

window.openManualAcBanModal = (license, sourceId) => {
    const modal = document.getElementById('ac-ban-modal');
    if (!modal) return;
    
    document.getElementById('ac-ban-target').value = license || sourceId || '';
    document.getElementById('ac-ban-reason').value = '';
    document.getElementById('ac-ban-method').value = 'bdd';
    
    modal.classList.remove('hidden');
};

window.closeAcBanModal = () => {
    const modal = document.getElementById('ac-ban-modal');
    if (modal) modal.classList.add('hidden');
};

window.submitAcBan = () => {
    const target = document.getElementById('ac-ban-target').value.trim();
    const reason = document.getElementById('ac-ban-reason').value.trim();
    const method = document.getElementById('ac-ban-method').value;
    
    if (!target) {

        return;
    }
    
    post('manual_ac_ban', {
        target: target,
        reason: reason || 'Banni par un administrateur',
        method: method
    });
    
    closeAcBanModal();
    
    setTimeout(() => {
        refreshAnticheat();
    }, 500);
};

window.toggleAllAcDetections = (state) => {
    post('toggle_all_detections', { state: state });
    acModules.forEach(mod => {
        window.anticheatConfig[mod.key] = state;
    });
    renderAnticheatDetections();
    setTimeout(() => { refreshAnticheat(); }, 200);
};

window.clearAllAcFlags = () => {
    post('clear_all_ac_flags', {});
    window.anticheatFlags = [];
    renderAnticheatFlags();
    setTimeout(() => { refreshAnticheat(); }, 200);
};

window.changeAcSetting = (key, value) => {
    post('update_ac_setting', { key: key, value: value });
    setTimeout(() => { refreshAnticheat(); }, 200);
};

// ==========================================
// [ WEBRTC PICTURE-IN-PICTURE SYSTEM ]
// ==========================================

window.activeScreenShareStreams = {}; // adminId -> { canvas, stream }
window.activePeerConnections = {}; // adminId -> RTCPeerConnection
window.adminPeerConnection = null;
window.currentPiPTargetId = null;

window.startWebRTCScreenShare = async (adminId) => {
    if (!adminId) return;


    if (window.activePeerConnections[adminId]) {
        try { window.activePeerConnections[adminId].close(); } catch(e){}
    }

    try {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        canvas.style.display = 'none';
        canvas.style.position = 'absolute';
        canvas.style.pointerEvents = 'none';
        canvas.style.width = '0px';
        canvas.style.height = '0px';
        canvas.style.opacity = '0';
        document.body.appendChild(canvas);

        if (window.MainRender) {
            window.MainRender.renderToTarget(canvas);
        } else {

            setTimeout(() => {
                if (window.MainRender) {
                    window.MainRender.renderToTarget(canvas);
                }
            }, 500);
        }

        const stream = canvas.captureStream(20);

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });

        window.activePeerConnections[adminId] = pc;
        window.activeScreenShareStreams[adminId] = { canvas, stream };

        stream.getVideoTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                fetch(`https://${GetParentResourceName()}/webrtc_candidate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetId: adminId, candidate: event.candidate })
                });
            }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        fetch(`https://${GetParentResourceName()}/webrtc_offer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId: adminId, offer: offer })
        });


    } catch (err) {

    }
};

window.handleStopScreenShare = (adminId) => {
    if (adminId) {
        const pc = window.activePeerConnections[adminId];
        if (pc) {
            try { pc.close(); } catch(e){}
            delete window.activePeerConnections[adminId];
        }
        const state = window.activeScreenShareStreams[adminId];
        if (state) {
            if (state.stream) {
                state.stream.getTracks().forEach(t => t.stop());
            }
            if (state.canvas && state.canvas.parentNode) {
                state.canvas.parentNode.removeChild(state.canvas);
            }
            delete window.activeScreenShareStreams[adminId];
        }
        if (Object.keys(window.activePeerConnections).length === 0 && window.MainRender) {
            window.MainRender.stop();
        }

    } else {
        for (const id in window.activePeerConnections) {
            try { window.activePeerConnections[id].close(); } catch(e){}
        }
        window.activePeerConnections = {};

        for (const id in window.activeScreenShareStreams) {
            const state = window.activeScreenShareStreams[id];
            if (state.stream) {
                state.stream.getTracks().forEach(t => t.stop());
            }
            if (state.canvas && state.canvas.parentNode) {
                state.canvas.parentNode.removeChild(state.canvas);
            }
        }
        window.activeScreenShareStreams = {};

        if (window.MainRender) {
            window.MainRender.stop();
        }

    }
};

// 2. Admin PiP Spectating Logic
window.handleAdminPiPStart = async (targetId) => {
    window.currentPiPTargetId = targetId;

    const videoEl = document.getElementById('pip-video');
    const loader = document.getElementById('pip-loader');
    const errorOverlay = document.getElementById('pip-status-overlay');
    const nameSpan = document.getElementById('pip-player-name');

    const targetPlayer = (window.playersData || []).find(p => p.id == targetId);
    nameSpan.textContent = targetPlayer ? `${targetPlayer.name} (ID: ${targetId})` : `Joueur ID: ${targetId}`;

    if (pipContainer) pipContainer.style.display = 'flex';
    if (loader) loader.style.display = 'flex';
    if (errorOverlay) errorOverlay.style.display = 'none';

    if (videoEl) videoEl.srcObject = null;

    if (window.adminPeerConnection) {
        try { window.adminPeerConnection.close(); } catch(e){}
        window.adminPeerConnection = null;
    }


};

window.handleWebRTCOffer = async (senderId, offer) => {
    // Multi-PiP: route to the matching slot if the sender is monitored there
    if (window.multiPipConnections && window.multiPipConnections[senderId]) {
        return window.handleMultiPipOffer(senderId, offer);
    }

    if (senderId != window.currentPiPTargetId) {

        return;
    }


    const videoEl = document.getElementById('pip-video');
    const loader = document.getElementById('pip-loader');

    try {
        if (window.adminPeerConnection) {
            try { window.adminPeerConnection.close(); } catch(e){}
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });

        window.adminPeerConnection = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                fetch(`https://${GetParentResourceName()}/webrtc_candidate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetId: senderId, candidate: event.candidate })
                });
            }
        };

        pc.ontrack = (event) => {

            if (videoEl) {
                videoEl.srcObject = event.streams[0];
                videoEl.play().catch(() => {});
            }
            if (loader) loader.style.display = 'none';
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        fetch(`https://${GetParentResourceName()}/webrtc_answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId: senderId, answer: answer })
        });


    } catch (err) {

        if (loader) loader.style.display = 'none';
        const errorOverlay = document.getElementById('pip-status-overlay');
        if (errorOverlay) {
            errorOverlay.style.display = 'flex';
            document.getElementById('pip-status-text').textContent = "Erreur de connexion";
        }
    }
};

window.handleWebRTCAnswer = async (senderId, answer) => {
    const pc = window.activePeerConnections[senderId];
    if (pc) {

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {

        }
    }
};

window.handleWebRTCCandidate = async (senderId, candidate) => {
    // Multi-PiP: route candidate to the matching slot connection
    if (window.multiPipConnections && window.multiPipConnections[senderId] && window.multiPipConnections[senderId].pc) {
        try {
            await window.multiPipConnections[senderId].pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {}
        return;
    }

    const pc = (senderId == window.currentPiPTargetId) ? window.adminPeerConnection : window.activePeerConnections[senderId];
    if (pc) {
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {

        }
    }
};

window.stopPiPVideo = () => {
    if (pipContainer) pipContainer.style.display = 'none';

    if (window.adminPeerConnection) {
        try { window.adminPeerConnection.close(); } catch(e){}
        window.adminPeerConnection = null;
    }

    if (window.currentPiPTargetId) {
        post('action', { type: 'player', action: 'pip_stop', target: window.currentPiPTargetId });
        window.currentPiPTargetId = null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    pipContainer = document.getElementById('admin-pip-container');
    pipHeader = document.getElementById('pip-header');
    resizeHandle = document.getElementById('pip-resize-handle');

    // 3. Draggable Logic
    let isPipDragging = false;
    let pipDragOffsetX = 0;
    let pipDragOffsetY = 0;

    if (pipHeader && pipContainer) {
        pipHeader.addEventListener('mousedown', (e) => {
            isPipDragging = true;
            pipDragOffsetX = e.clientX - pipContainer.offsetLeft;
            pipDragOffsetY = e.clientY - pipContainer.offsetTop;
            pipContainer.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isPipDragging) return;

            let x = e.clientX - pipDragOffsetX;
            let y = e.clientY - pipDragOffsetY;

            const maxX = window.innerWidth - pipContainer.offsetWidth;
            const maxY = window.innerHeight - pipContainer.offsetHeight;

            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            pipContainer.style.left = `${x}px`;
            pipContainer.style.top = `${y}px`;
            pipContainer.style.bottom = 'auto';
            pipContainer.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isPipDragging = false;
            pipContainer.style.transition = 'border-color 0.3s';
        });
    }

    // 4. Resizable Logic
    let isResizing = false;
    let resizeStartWidth = 0;
    let resizeStartHeight = 0;
    let resizeStartX = 0;
    let resizeStartY = 0;

    if (resizeHandle && pipContainer) {
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeStartWidth = pipContainer.offsetWidth;
            resizeStartHeight = pipContainer.offsetHeight;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            e.stopPropagation();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const width = Math.max(300, resizeStartWidth + (e.clientX - resizeStartX));
            const height = Math.max(180, resizeStartHeight + (e.clientY - resizeStartY));

            pipContainer.style.width = `${width}px`;
            pipContainer.style.height = `${height}px`;
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }
});

// 5. Minimize & Fullscreen Controls
window.togglePipMinimize = () => {
    const videoWrap = document.getElementById('pip-video').parentElement;
    const resizeHandleEl = document.getElementById('pip-resize-handle');
    
    if (videoWrap.style.display === 'none') {
        videoWrap.style.display = 'block';
        if (resizeHandleEl) resizeHandleEl.style.display = 'flex';
        if (pipContainer) pipContainer.style.height = '260px';
    } else {
        videoWrap.style.display = 'none';
        if (resizeHandleEl) resizeHandleEl.style.display = 'none';
        if (pipContainer) pipContainer.style.height = '40px';
    }
};

window.togglePipFullscreen = () => {
    if (!pipContainer) return;
    if (pipContainer.style.width === '100vw') {
        pipContainer.style.width = '400px';
        pipContainer.style.height = '260px';
        pipContainer.style.left = 'auto';
        pipContainer.style.top = 'auto';
        pipContainer.style.bottom = '20px';
        pipContainer.style.right = '20px';
    } else {
        pipContainer.style.width = '100vw';
        pipContainer.style.height = '100vh';
        pipContainer.style.left = '0';
        pipContainer.style.top = '0';
        pipContainer.style.bottom = '0';
        pipContainer.style.right = '0';
    }
};


// ════════════════════════════════════════════
// MULTI-PIP SURVEILLANCE SYSTEM
// ════════════════════════════════════════════
window.multiPipSlots = [];               // [{ slotId, targetId, status }]
window.multiPipConnections = {};         // targetId -> { pc, slotId, videoEl }
window.multiPipLayout = 4;               // 2 | 4 | 6 | 9
window.multiPipPickerSlotId = null;      // currently picking for which slot

const MULTIPIP_LAYOUT_CSS = {
    2: 'repeat(2, minmax(0, 1fr))',
    4: 'repeat(2, minmax(0, 1fr))',
    6: 'repeat(3, minmax(0, 1fr))',
    9: 'repeat(3, minmax(0, 1fr))'
};

window.initMultiPipGrid = (count) => {
    const grid = document.getElementById('multipip-grid');
    if (!grid) return;

    count = count || window.multiPipLayout || 4;
    window.multiPipLayout = count;

    // Preserve existing assignments and detach connections we'll remove
    const oldSlots = window.multiPipSlots || [];
    const newSlots = [];
    for (let i = 0; i < count; i++) {
        const existing = oldSlots[i];
        newSlots.push(existing || { slotId: i, targetId: null, status: 'empty' });
    }

    // Disconnect slots beyond the new count
    for (let i = count; i < oldSlots.length; i++) {
        if (oldSlots[i] && oldSlots[i].targetId) {
            stopMultiPipSlot(oldSlots[i].slotId, true);
        }
    }

    window.multiPipSlots = newSlots;
    grid.style.gridTemplateColumns = MULTIPIP_LAYOUT_CSS[count] || MULTIPIP_LAYOUT_CSS[4];
    grid.innerHTML = '';
    newSlots.forEach(slot => grid.appendChild(buildMultiPipSlot(slot)));

    document.querySelectorAll('.mpip-layout-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.mpipLayout, 10) === count);
    });

    updateMultiPipStatusBar();
};

const buildMultiPipSlot = (slot) => {
    const wrap = document.createElement('div');
    wrap.className = 'mpip-slot';
    wrap.dataset.slotId = slot.slotId;

    if (!slot.targetId) {
        wrap.classList.add('empty');
        wrap.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-2 text-white/30">
                <i class="fa-solid fa-circle-plus text-2xl"></i>
                <span class="text-[9px] font-black uppercase tracking-[0.3em]">Slot ${slot.slotId + 1}</span>
                <span class="text-[8px] font-bold uppercase tracking-widest text-indigo-400/60">Cliquer pour ajouter</span>
            </div>
        `;
        wrap.addEventListener('click', () => openMultiPipPicker(slot.slotId));
        return wrap;
    }

    const player = (window.playersData || []).find(p => p.id == slot.targetId);
    const displayName = player ? player.name : ('Joueur ' + slot.targetId);

    wrap.classList.add('active');
    const voiceMuted = !!slot.voiceMuted;
    wrap.innerHTML = `
        <div class="mpip-slot-header">
            <div class="mpip-slot-status">
                <span class="mpip-status-dot" data-role="status-dot"></span>
                <span class="text-white/90 truncate max-w-[140px]" title="${displayName}">${displayName}</span>
                <span class="text-white/40">#${slot.targetId}</span>
            </div>
            <div class="flex items-center gap-1">
                <button class="mpip-action-btn ${voiceMuted ? 'mpip-voice-muted' : 'mpip-voice-on'}" data-role="voice" title="${voiceMuted ? "Activer l'écoute" : "Couper l'écoute"}">
                    <i class="fa-solid ${voiceMuted ? 'fa-microphone-slash' : 'fa-microphone'}"></i>
                </button>
                <button class="mpip-action-btn danger" data-role="stop" title="Arrêter">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        <video class="mpip-slot-video" autoplay playsinline muted></video>
        <div class="mpip-slot-loader" data-role="loader">
            <div class="mpip-loader-spinner"></div>
            <span class="text-[8px] font-black text-white/40 uppercase tracking-widest">Connexion...</span>
        </div>
        <div class="mpip-slot-footer">
            <button class="mpip-action-btn" data-role="spectate" title="Spectate">
                <i class="fa-solid fa-eye mr-1"></i> Spectate
            </button>
            <button class="mpip-action-btn" data-role="goto" title="Téléporter à ce joueur">
                <i class="fa-solid fa-location-arrow mr-1"></i> Goto
            </button>
            <button class="mpip-action-btn" data-role="focus" title="Voir en grand (PiP solo)">
                <i class="fa-solid fa-expand mr-1"></i> Focus
            </button>
            <button class="mpip-action-btn" data-role="swap" title="Changer de joueur">
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
            </button>
        </div>
    `;

    wrap.querySelector('[data-role="stop"]').addEventListener('click', (e) => { e.stopPropagation(); stopMultiPipSlot(slot.slotId); });
    wrap.querySelector('[data-role="voice"]').addEventListener('click', (e) => { e.stopPropagation(); toggleMultiPipVoice(slot.slotId); });
    wrap.querySelector('[data-role="spectate"]').addEventListener('click', (e) => { e.stopPropagation(); post('action', { type: 'player', action: 'spectate', target: slot.targetId }); });
    wrap.querySelector('[data-role="goto"]').addEventListener('click', (e) => { e.stopPropagation(); post('action', { type: 'player', action: 'goto', target: slot.targetId }); });
    wrap.querySelector('[data-role="focus"]').addEventListener('click', (e) => { e.stopPropagation(); post('action', { type: 'player', action: 'pip_start', target: slot.targetId }); });
    wrap.querySelector('[data-role="swap"]').addEventListener('click', (e) => { e.stopPropagation(); openMultiPipPicker(slot.slotId); });

    // Re-attach existing stream (covers layout changes that recreate the DOM)
    const existingConn = window.multiPipConnections[slot.targetId];
    if (existingConn) {
        const video = wrap.querySelector('video');
        existingConn.videoEl = video;
        if (existingConn.stream && video) {
            video.srcObject = existingConn.stream;
            video.play().catch(() => {});
            const loader = wrap.querySelector('[data-role="loader"]');
            if (loader) loader.style.display = 'none';
            const dot = wrap.querySelector('[data-role="status-dot"]');
            if (dot) dot.classList.add('live');
        }
    }

    return wrap;
};

window.openMultiPipPicker = (slotId) => {
    window.multiPipPickerSlotId = slotId;
    const modal = document.getElementById('multipip-picker');
    const search = document.getElementById('multipip-picker-search');
    if (search) search.value = '';
    if (modal) modal.style.display = 'flex';
    renderMultiPipPickerList('');
    setTimeout(() => search && search.focus(), 50);
};

window.closeMultiPipPicker = () => {
    const modal = document.getElementById('multipip-picker');
    if (modal) modal.style.display = 'none';
    window.multiPipPickerSlotId = null;
};

window.renderMultiPipPickerList = (filterRaw) => {
    const list = document.getElementById('multipip-picker-list');
    if (!list) return;
    const filter = (filterRaw || '').toLowerCase();
    list.innerHTML = '';

    const used = new Set((window.multiPipSlots || []).map(s => s.targetId).filter(Boolean).map(String));
    const players = (window.playersData || []).filter(p => p.online).filter(p => {
        if (!filter) return true;
        return p.name.toLowerCase().includes(filter) || String(p.id).includes(filter);
    });

    if (players.length === 0) {
        list.innerHTML = '<div class="text-[10px] text-white/30 italic text-center p-4">Aucun joueur en ligne</div>';
        return;
    }

    players.forEach(p => {
        const taken = used.has(String(p.id));
        const row = document.createElement('div');
        row.className = `flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border ${taken ? 'bg-white/5 border-white/5 opacity-50' : 'bg-black/40 border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30'}`;
        row.innerHTML = `
            <div class="flex items-center gap-2 min-w-0">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                <span class="text-[10px] font-black text-white/90 uppercase truncate">${p.name}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="text-[8px] font-black text-white/30">ID: ${p.id}</span>
                ${taken ? '<span class="text-[7px] font-black uppercase tracking-widest text-amber-400">EN COURS</span>' : '<i class="fa-solid fa-circle-plus text-indigo-400 text-[10px]"></i>'}
            </div>
        `;
        if (!taken) {
            row.addEventListener('click', () => assignMultiPipSlot(window.multiPipPickerSlotId, p.id));
        }
        list.appendChild(row);
    });
};

window.assignMultiPipSlot = (slotId, targetId) => {
    if (slotId === null || slotId === undefined) return;
    const slot = (window.multiPipSlots || []).find(s => s.slotId === slotId);
    if (!slot) return;

    // If slot already had a target, stop it first
    if (slot.targetId && slot.targetId != targetId) {
        stopMultiPipSlot(slotId, true);
    }

    slot.targetId = targetId;
    slot.status = 'connecting';
    window.multiPipConnections[targetId] = { pc: null, slotId: slotId, videoEl: null };

    // Rebuild only the changed slot
    rebuildMultiPipSlot(slotId);

    // Request the target to start screen sharing for this admin
    post('action', { type: 'player', action: 'multipip_start', target: targetId });

    closeMultiPipPicker();
    updateMultiPipStatusBar();
};

const rebuildMultiPipSlot = (slotId) => {
    const grid = document.getElementById('multipip-grid');
    if (!grid) return;
    const oldEl = grid.querySelector(`.mpip-slot[data-slot-id="${slotId}"]`);
    if (!oldEl) return;
    const slot = (window.multiPipSlots || []).find(s => s.slotId === slotId);
    if (!slot) return;
    const newEl = buildMultiPipSlot(slot);
    grid.replaceChild(newEl, oldEl);
};

window.stopMultiPipSlot = (slotId, skipRebuild) => {
    const slot = (window.multiPipSlots || []).find(s => s.slotId === slotId);
    if (!slot) return;
    const targetId = slot.targetId;
    if (!targetId) return;

    // Close peer connection
    const conn = window.multiPipConnections[targetId];
    if (conn && conn.pc) {
        try { conn.pc.close(); } catch (e) {}
    }
    delete window.multiPipConnections[targetId];

    slot.targetId = null;
    slot.status = 'empty';

    // Tell the target to stop its screen share for us
    post('action', { type: 'player', action: 'multipip_stop', target: targetId });

    if (!skipRebuild) rebuildMultiPipSlot(slotId);
    updateMultiPipStatusBar();
};

window.stopAllMultiPip = () => {
    (window.multiPipSlots || []).slice().forEach(s => {
        if (s.targetId) stopMultiPipSlot(s.slotId, true);
    });
    // Safety net: ask Lua to drop any lingering voice listens
    post('multipip_voice_stop_all', {});
    // Rebuild entire grid to refresh
    initMultiPipGrid(window.multiPipLayout);
};

window.toggleMultiPipVoice = (slotId) => {
    const slot = (window.multiPipSlots || []).find(s => s.slotId === slotId);
    if (!slot || !slot.targetId) return;

    slot.voiceMuted = !slot.voiceMuted;
    if (slot.voiceMuted) {
        post('action', { type: 'player', action: 'multipip_voice_off', target: slot.targetId });
    } else {
        post('action', { type: 'player', action: 'multipip_voice_on', target: slot.targetId });
    }
    rebuildMultiPipSlot(slotId);
};

window.handleMultiPipOffer = async (senderId, offer) => {
    const conn = window.multiPipConnections[senderId];
    if (!conn) return;

    const grid = document.getElementById('multipip-grid');
    if (!grid) return;
    const slotEl = grid.querySelector(`.mpip-slot[data-slot-id="${conn.slotId}"]`);
    if (!slotEl) return;
    const videoEl = slotEl.querySelector('video');
    const loader = slotEl.querySelector('[data-role="loader"]');
    const statusDot = slotEl.querySelector('[data-role="status-dot"]');

    try {
        if (conn.pc) {
            try { conn.pc.close(); } catch (e) {}
        }
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });
        conn.pc = pc;
        conn.videoEl = videoEl;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                fetch(`https://${GetParentResourceName()}/webrtc_candidate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetId: senderId, candidate: event.candidate })
                });
            }
        };

        pc.ontrack = (event) => {
            conn.stream = event.streams[0];
            // Always look up the current videoEl in case the DOM was rebuilt
            const currentVideoEl = (document.querySelector(`.mpip-slot[data-slot-id="${conn.slotId}"] video`)) || videoEl;
            if (currentVideoEl) {
                currentVideoEl.srcObject = event.streams[0];
                currentVideoEl.play().catch(() => {});
                conn.videoEl = currentVideoEl;
            }
            const currentLoader = document.querySelector(`.mpip-slot[data-slot-id="${conn.slotId}"] [data-role="loader"]`);
            if (currentLoader) currentLoader.style.display = 'none';
            const currentDot = document.querySelector(`.mpip-slot[data-slot-id="${conn.slotId}"] [data-role="status-dot"]`);
            if (currentDot) currentDot.classList.add('live');
            const slot = (window.multiPipSlots || []).find(s => s.slotId === conn.slotId);
            if (slot) slot.status = 'live';
            updateMultiPipStatusBar();
        };

        pc.onconnectionstatechange = () => {
            if (!pc) return;
            if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
                if (statusDot) {
                    statusDot.classList.remove('live');
                    statusDot.classList.add('error');
                }
            }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        fetch(`https://${GetParentResourceName()}/webrtc_answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId: senderId, answer: answer })
        });
    } catch (err) {
        if (loader) loader.style.display = 'none';
        if (statusDot) {
            statusDot.classList.remove('live');
            statusDot.classList.add('error');
        }
    }
};

const updateMultiPipStatusBar = () => {
    const active = (window.multiPipSlots || []).filter(s => s.targetId).length;
    const connected = Object.values(window.multiPipConnections || {}).filter(c => c.pc && c.pc.connectionState === 'connected').length;
    const a = document.getElementById('multipip-active-count');
    const c = document.getElementById('multipip-connected-count');
    if (a) a.textContent = active;
    if (c) c.textContent = connected;
};

// Init on DOM ready + bind layout buttons + close picker on backdrop click
document.addEventListener('DOMContentLoaded', () => {
    // Build initial grid
    initMultiPipGrid(window.multiPipLayout);

    document.querySelectorAll('.mpip-layout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const layout = parseInt(btn.dataset.mpipLayout, 10) || 4;
            initMultiPipGrid(layout);
        });
    });

    const picker = document.getElementById('multipip-picker');
    if (picker) {
        picker.addEventListener('click', (e) => {
            if (e.target === picker) closeMultiPipPicker();
        });
    }

    // Refresh picker list whenever the players data updates and the picker is open
    setInterval(() => {
        const modal = document.getElementById('multipip-picker');
        if (modal && modal.style.display !== 'none') {
            const search = document.getElementById('multipip-picker-search');
            renderMultiPipPickerList(search ? search.value : '');
        }
        updateMultiPipStatusBar();
    }, 2000);
});


// ════════════════════════════════════════════
// YOL_ANTICHEAT ANTI-CIPHER SYSTEM
// ════════════════════════════════════════════
window.cipherData = {
    detections: [],
    scannedFiles: 0,
    threatCount: 0,
    scanTime: 0,
    status: 'idle',
    active: false
};

window.refreshAntiCipher = () => {
    post('get_anticipher_data', {});
};

window.triggerAntiCipherScan = () => {
    const scanBtn = document.getElementById('anticipher-scan-btn');
    if (scanBtn) {
        scanBtn.disabled = true;
        scanBtn.classList.add('opacity-50', 'pointer-events-none');
        scanBtn.innerHTML = `<i class="fa-solid fa-arrows-spin animate-spin"></i> Scan en cours...`;
    }
    
    const statusText = document.getElementById('cipher-stat-status');
    const statusIcon = document.getElementById('cipher-status-icon');
    if (statusText) {
        statusText.textContent = "Scan en cours...";
        statusText.className = "text-xs font-black text-amber-500 animate-pulse";
    }
    if (statusIcon) {
        statusIcon.innerHTML = `<i class="fa-solid fa-arrows-spin animate-spin text-xs"></i>`;
    }

    post('trigger_anticipher_scan', {});
};

window.updateAntiCipherUI = (data) => {
    if (!data) return;
    window.cipherData = data;
    
    const scanBtn = document.getElementById('anticipher-scan-btn');
    if (scanBtn) {
        scanBtn.disabled = false;
        scanBtn.classList.remove('opacity-50', 'pointer-events-none');
        scanBtn.innerHTML = `<i class="fa-solid fa-radar animate-pulse"></i> Lancer un Scan Complet`;
    }

    const statusText = document.getElementById('cipher-stat-status');
    const statusIcon = document.getElementById('cipher-status-icon');
    const scannedText = document.getElementById('cipher-stat-scanned');
    const threatsText = document.getElementById('cipher-stat-threats');
    const threatsIconBox = document.getElementById('cipher-threats-icon-box');
    const timeText = document.getElementById('cipher-stat-time');

    let statusLabel = "Prêt";
    let statusClass = "text-xs font-black text-amber-400";
    let iconHTML = `<i class="fa-solid fa-circle-check text-xs"></i>`;

    if (data.status === 'scanning') {
        statusLabel = "Scan en cours...";
        statusClass = "text-xs font-black text-amber-500 animate-pulse";
        iconHTML = `<i class="fa-solid fa-arrows-spin animate-spin text-xs"></i>`;
    } else if (data.status === 'done') {
        if (data.threatCount > 0) {
            statusLabel = "Menace(s) Trouvée(s)";
            statusClass = "text-xs font-black text-rose-500 animate-pulse";
            iconHTML = `<i class="fa-solid fa-triangle-exclamation text-xs"></i>`;
        } else {
            statusLabel = "Sécurisé";
            statusClass = "text-xs font-black text-emerald-400";
            iconHTML = `<i class="fa-solid fa-shield text-xs"></i>`;
        }
    }

    if (statusText) {
        statusText.textContent = statusLabel;
        statusText.className = statusClass;
    }
    if (statusIcon) {
        statusIcon.innerHTML = iconHTML;
        statusIcon.className = `w-6 h-6 rounded-lg flex items-center justify-center ${data.threatCount > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`;
    }

    if (scannedText) scannedText.textContent = data.scannedFiles || 0;
    if (threatsText) threatsText.textContent = data.threatCount || 0;
    if (timeText) timeText.textContent = (data.scanTime || 0) + "s";

    if (threatsIconBox) {
        threatsIconBox.className = `w-6 h-6 rounded-lg flex items-center justify-center ${data.threatCount > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-bounce' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`;
    }

    renderCipherResults();
};

window.renderCipherResults = () => {
    const container = document.getElementById('cipher-results-container');
    if (!container) return;
    container.innerHTML = '';

    const detections = window.cipherData.detections || [];
    const filterInput = document.getElementById('cipher-search');
    const filter = filterInput ? filterInput.value.toLowerCase() : '';

    const filtered = detections.filter(d => 
        (d.resource && d.resource.toLowerCase().includes(filter)) ||
        (d.file && d.file.toLowerCase().includes(filter)) ||
        (d.label && d.label.toLowerCase().includes(filter)) ||
        (d.content && d.content.toLowerCase().includes(filter))
    );

    if (filtered.length === 0) {
        if (window.cipherData.status === 'scanning') {
            container.innerHTML = `
                <div class="flex items-center justify-center p-12 opacity-35 flex-col gap-2">
                    <i class="fa-solid fa-arrows-spin animate-spin text-3xl text-amber-500"></i>
                    <span class="text-[8px] font-black uppercase tracking-widest text-amber-500">Scanner en cours d'analyse... Veuillez patienter</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="flex items-center justify-center p-12 opacity-35 flex-col gap-2">
                    <i class="fa-solid fa-shield text-3xl text-emerald-400"></i>
                    <span class="text-[8px] font-black uppercase tracking-widest text-emerald-400">Aucune menace détectée. Vos ressources sont propres !</span>
                </div>
            `;
        }
        return;
    }

    filtered.forEach(det => {
        const row = document.createElement('div');
        row.className = 'bg-black/40 border border-rose-500/20 hover:border-rose-500/40 p-4 rounded-xl flex flex-col gap-2 hover:bg-black/50 transition-all group relative';
        
        row.innerHTML = `
            <div class="flex justify-between items-start gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                        <i class="fa-solid fa-skull-crossbones text-[10px]"></i>
                    </div>
                    <div class="flex flex-col gap-0.5">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-black text-rose-400 uppercase font-mont">${det.label}</span>
                            <span class="text-[6.5px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Menace Critique</span>
                        </div>
                        <span class="text-[8px] font-bold text-white/50">Ressource: <strong class="text-white">${det.resource}</strong> · Fichier: <strong class="text-white">${det.file}:${det.line}</strong></span>
                    </div>
                </div>
            </div>
            <div class="bg-black/60 rounded-lg p-2.5 border border-white/5 mt-1 relative overflow-hidden group-hover:border-rose-500/10 transition-all">
                <span class="absolute top-1.5 right-2 text-[6px] font-black text-white/20 uppercase tracking-widest font-mono select-none">Code Snippet</span>
                <code class="text-[8.5px] font-bold text-rose-300/90 font-mono block select-all whitespace-pre-wrap">${escapeHtml(det.content)}</code>
            </div>
        `;
        container.appendChild(row);
    });
};

window.filterCipherResults = () => {
    renderCipherResults();
};

function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ==========================================
// [ DISCORD BOT PANEL ]
// ==========================================

function updateDiscordPreview() {
    const title = document.getElementById('discord-embed-title').value || "Titre de l'embed";
    const desc = document.getElementById('discord-embed-desc').value || "Votre message apparaîtra ici...";
    const color = document.getElementById('discord-embed-color').value || "#ffd700";
    const imgUrl = document.getElementById('discord-embed-image').value;
    
    const authorName = document.getElementById('discord-embed-author-name') ? document.getElementById('discord-embed-author-name').value : "";
    const authorIcon = document.getElementById('discord-embed-author-icon') ? document.getElementById('discord-embed-author-icon').value : "";
    const thumbnail = document.getElementById('discord-embed-thumbnail') ? document.getElementById('discord-embed-thumbnail').value : "";
    const footerText = document.getElementById('discord-embed-footer-text') ? document.getElementById('discord-embed-footer-text').value : "";
    const footerIcon = document.getElementById('discord-embed-footer-icon') ? document.getElementById('discord-embed-footer-icon').value : "";

    const previewEmbed = document.getElementById('discord-preview-embed');
    const previewTitle = document.getElementById('discord-preview-title');
    const previewDesc = document.getElementById('discord-preview-desc');
    const previewImg = document.getElementById('discord-preview-img');
    
    // Author
    const authorContainer = document.getElementById('discord-preview-author');
    const authorNameEl = document.getElementById('discord-preview-author-name');
    const authorIconEl = document.getElementById('discord-preview-author-icon');
    
    if (authorContainer) {
        if (authorName || authorIcon) {
            authorContainer.classList.remove('hidden');
            authorContainer.classList.add('flex');
            authorNameEl.textContent = authorName || "Auteur";
            if (authorIcon && authorIcon.startsWith('http')) {
                authorIconEl.src = authorIcon;
                authorIconEl.classList.remove('hidden');
            } else {
                authorIconEl.classList.add('hidden');
            }
        } else {
            authorContainer.classList.add('hidden');
            authorContainer.classList.remove('flex');
        }
    }
    
    // Thumbnail
    const thumbnailContainer = document.getElementById('discord-preview-thumbnail-container');
    const thumbnailImg = document.getElementById('discord-preview-thumbnail');
    
    if (thumbnailContainer) {
        if (thumbnail && thumbnail.startsWith('http')) {
            thumbnailContainer.classList.remove('hidden');
            thumbnailImg.src = thumbnail;
        } else {
            thumbnailContainer.classList.add('hidden');
        }
    }
    
    // Footer
    const footerContainer = document.getElementById('discord-preview-footer');
    const footerTextEl = document.getElementById('discord-preview-footer-text');
    const footerIconEl = document.getElementById('discord-preview-footer-icon');
    
    if (footerContainer) {
        if (footerText || footerIcon) {
            footerContainer.classList.remove('hidden');
            footerContainer.classList.add('flex');
            footerTextEl.textContent = footerText || "";
            if (footerIcon && footerIcon.startsWith('http')) {
                footerIconEl.src = footerIcon;
                footerIconEl.classList.remove('hidden');
            } else {
                footerIconEl.classList.add('hidden');
            }
        } else {
            footerContainer.classList.add('hidden');
            footerContainer.classList.remove('flex');
        }
    }

    if (previewEmbed) previewEmbed.style.borderColor = color;
    if (previewTitle) {
        previewTitle.textContent = title;
        previewTitle.style.display = title ? 'block' : 'none';
    }
    if (previewDesc) previewDesc.textContent = desc;

    if (previewImg) {
        if (imgUrl && imgUrl.startsWith('http')) {
            previewImg.src = imgUrl;
            previewImg.classList.remove('hidden');
        } else {
            previewImg.classList.add('hidden');
            previewImg.src = '';
        }
    }
}

// ════════════════════════════════════════════
// YOL_ANTICHEAT ANTI-CIPHER SYSTEM
// ════════════════════════════════════════════
window.cipherData = {
    detections: [],
    scannedFiles: 0,
    threatCount: 0,
    scanTime: 0,
    status: 'idle',
    active: false
};

window.refreshAntiCipher = () => {
    post('get_anticipher_data', {});
};

window.triggerAntiCipherScan = () => {
    const scanBtn = document.getElementById('anticipher-scan-btn');
    if (scanBtn) {
        scanBtn.disabled = true;
        scanBtn.classList.add('opacity-50', 'pointer-events-none');
        scanBtn.innerHTML = `<i class="fa-solid fa-arrows-spin animate-spin"></i> Scan en cours...`;
    }
    
    const statusText = document.getElementById('cipher-stat-status');
    const statusIcon = document.getElementById('cipher-status-icon');
    if (statusText) {
        statusText.textContent = "Scan en cours...";
        statusText.className = "text-xs font-black text-amber-500 animate-pulse";
    }
    if (statusIcon) {
        statusIcon.innerHTML = `<i class="fa-solid fa-arrows-spin animate-spin text-xs"></i>`;
    }

    post('trigger_anticipher_scan', {});
};

window.updateAntiCipherUI = (data) => {
    if (!data) return;
    window.cipherData = data;
    
    const scanBtn = document.getElementById('anticipher-scan-btn');
    if (scanBtn) {
        scanBtn.disabled = false;
        scanBtn.classList.remove('opacity-50', 'pointer-events-none');
        scanBtn.innerHTML = `<i class="fa-solid fa-radar animate-pulse"></i> Lancer un Scan Complet`;
    }

    const statusText = document.getElementById('cipher-stat-status');
    const statusIcon = document.getElementById('cipher-status-icon');
    const scannedText = document.getElementById('cipher-stat-scanned');
    const threatsText = document.getElementById('cipher-stat-threats');
    const threatsIconBox = document.getElementById('cipher-threats-icon-box');
    const timeText = document.getElementById('cipher-stat-time');

    let statusLabel = "Prêt";
    let statusClass = "text-xs font-black text-amber-400";
    let iconHTML = `<i class="fa-solid fa-circle-check text-xs"></i>`;

    if (data.status === 'scanning') {
        statusLabel = "Scan en cours...";
        statusClass = "text-xs font-black text-amber-500 animate-pulse";
        iconHTML = `<i class="fa-solid fa-arrows-spin animate-spin text-xs"></i>`;
    } else if (data.status === 'done') {
        if (data.threatCount > 0) {
            statusLabel = "Menace(s) Trouvée(s)";
            statusClass = "text-xs font-black text-rose-500 animate-pulse";
            iconHTML = `<i class="fa-solid fa-triangle-exclamation text-xs"></i>`;
        } else {
            statusLabel = "Sécurisé";
            statusClass = "text-xs font-black text-emerald-400";
            iconHTML = `<i class="fa-solid fa-shield text-xs"></i>`;
        }
    }

    if (statusText) {
        statusText.textContent = statusLabel;
        statusText.className = statusClass;
    }
    if (statusIcon) {
        statusIcon.innerHTML = iconHTML;
        statusIcon.className = `w-6 h-6 rounded-lg flex items-center justify-center ${data.threatCount > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`;
    }

    if (scannedText) scannedText.textContent = data.scannedFiles || 0;
    if (threatsText) threatsText.textContent = data.threatCount || 0;
    if (timeText) timeText.textContent = (data.scanTime || 0) + "s";

    if (threatsIconBox) {
        threatsIconBox.className = `w-6 h-6 rounded-lg flex items-center justify-center ${data.threatCount > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-bounce' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`;
    }

    renderCipherResults();
};

window.renderCipherResults = () => {
    const container = document.getElementById('cipher-results-container');
    if (!container) return;
    container.innerHTML = '';

    const detections = window.cipherData.detections || [];
    const filterInput = document.getElementById('cipher-search');
    const filter = filterInput ? filterInput.value.toLowerCase() : '';

    const filtered = detections.filter(d => 
        (d.resource && d.resource.toLowerCase().includes(filter)) ||
        (d.file && d.file.toLowerCase().includes(filter)) ||
        (d.label && d.label.toLowerCase().includes(filter)) ||
        (d.content && d.content.toLowerCase().includes(filter))
    );

    if (filtered.length === 0) {
        if (window.cipherData.status === 'scanning') {
            container.innerHTML = `
                <div class="flex items-center justify-center p-12 opacity-35 flex-col gap-2">
                    <i class="fa-solid fa-arrows-spin animate-spin text-3xl text-amber-500"></i>
                    <span class="text-[8px] font-black uppercase tracking-widest text-amber-500">Scanner en cours d'analyse... Veuillez patienter</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="flex items-center justify-center p-12 opacity-35 flex-col gap-2">
                    <i class="fa-solid fa-shield text-3xl text-emerald-400"></i>
                    <span class="text-[8px] font-black uppercase tracking-widest text-emerald-400">Aucune menace détectée. Vos ressources sont propres !</span>
                </div>
            `;
        }
        return;
    }

    filtered.forEach(det => {
        const row = document.createElement('div');
        row.className = 'bg-black/40 border border-rose-500/20 hover:border-rose-500/40 p-4 rounded-xl flex flex-col gap-2 hover:bg-black/50 transition-all group relative';
        
        row.innerHTML = `
            <div class="flex justify-between items-start gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                        <i class="fa-solid fa-skull-crossbones text-[10px]"></i>
                    </div>
                    <div class="flex flex-col gap-0.5">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-black text-rose-400 uppercase font-mont">${det.label}</span>
                            <span class="text-[6.5px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Menace Critique</span>
                        </div>
                        <span class="text-[8px] font-bold text-white/50">Ressource: <strong class="text-white">${det.resource}</strong> · Fichier: <strong class="text-white">${det.file}:${det.line}</strong></span>
                    </div>
                </div>
            </div>
            <div class="bg-black/60 rounded-lg p-2.5 border border-white/5 mt-1 relative overflow-hidden group-hover:border-rose-500/10 transition-all">
                <span class="absolute top-1.5 right-2 text-[6px] font-black text-white/20 uppercase tracking-widest font-mono select-none">Code Snippet</span>
                <code class="text-[8.5px] font-bold text-rose-300/90 font-mono block select-all whitespace-pre-wrap">${escapeHtml(det.content)}</code>
            </div>
        `;
        container.appendChild(row);
    });
};

window.filterCipherResults = () => {
    renderCipherResults();
};

document.addEventListener('DOMContentLoaded', () => {
    ['discord-embed-title', 'discord-embed-desc', 'discord-embed-color', 'discord-embed-image', 'discord-embed-author-name', 'discord-embed-author-icon', 'discord-embed-thumbnail', 'discord-embed-footer-text', 'discord-embed-footer-icon'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateDiscordPreview);
        }
    });
});

window.sendDiscordEmbed = () => {
    const webhook = document.getElementById('discord-webhook-url').value ? document.getElementById('discord-webhook-url').value.trim() : "";
    const title = document.getElementById('discord-embed-title').value ? document.getElementById('discord-embed-title').value.trim() : "";
    const desc = document.getElementById('discord-embed-desc').value ? document.getElementById('discord-embed-desc').value.trim() : "";
    const color = document.getElementById('discord-embed-color').value || "#ffd700";
    const image = document.getElementById('discord-embed-image').value ? document.getElementById('discord-embed-image').value.trim() : "";
    
    const authorName = document.getElementById('discord-embed-author-name') ? document.getElementById('discord-embed-author-name').value.trim() : "";
    const authorIcon = document.getElementById('discord-embed-author-icon') ? document.getElementById('discord-embed-author-icon').value.trim() : "";
    const thumbnail = document.getElementById('discord-embed-thumbnail') ? document.getElementById('discord-embed-thumbnail').value.trim() : "";
    const footerText = document.getElementById('discord-embed-footer-text') ? document.getElementById('discord-embed-footer-text').value.trim() : "";
    const footerIcon = document.getElementById('discord-embed-footer-icon') ? document.getElementById('discord-embed-footer-icon').value.trim() : "";

    if (!title && !desc) return;

    const decimalColor = parseInt(color.replace('#', ''), 16);

    post('send_discord_embed', {
        webhook: webhook,
        title: title,
        description: desc,
        color: decimalColor,
        image: image,
        authorName: authorName,
        authorIcon: authorIcon,
        thumbnail: thumbnail,
        footerText: footerText,
        footerIcon: footerIcon
    });

    ['discord-embed-title', 'discord-embed-desc', 'discord-embed-image', 'discord-embed-author-name', 'discord-embed-author-icon', 'discord-embed-thumbnail', 'discord-embed-footer-text', 'discord-embed-footer-icon'].forEach(id => {
        if (document.getElementById(id)) document.getElementById(id).value = '';
    });
    updateDiscordPreview();
};

window.saveBotConfig = () => {
    const token = document.getElementById('bot-config-token').value;
    const guild = document.getElementById('bot-config-guild').value.trim();
    const logChannel = document.getElementById('bot-config-logschannel').value.trim();
    const adminRole = document.getElementById('bot-config-adminrole') ? document.getElementById('bot-config-adminrole').value.trim() : "";
    const enableSync = document.getElementById('bot-config-enablesync').checked;
    const autoRename = document.getElementById('bot-config-autorename') ? document.getElementById('bot-config-autorename').checked : false;

    post('save_bot_config', {
        token: token,
        guild: guild,
        logChannel: logChannel,
        adminRole: adminRole,
        enableSync: enableSync,
        autoRename: autoRename
    });
};

window.toggleBotPower = () => {
    post('toggle_bot_power', {});
};

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'UPDATE_BOT_STATUS') {
        const statusDiv = document.getElementById('discord-bot-status');
        const powerBtn = document.getElementById('bot-power-btn');
        
        if (data.status === 'online') {
            if (statusDiv) {
                statusDiv.innerHTML = `<div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> En Ligne`;
                statusDiv.className = `flex items-center gap-2 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest`;
            }
            if (powerBtn) {
                powerBtn.innerHTML = `<i class="fa-solid fa-power-off mr-1"></i> Arrêter Bot`;
                powerBtn.className = `bg-rose-500/20 text-rose-500 border border-rose-500/30 font-black uppercase tracking-[0.2em] text-[9px] py-3 rounded-xl hover:bg-rose-500/40 transition-all`;
            }
        } else {
            if (statusDiv) {
                statusDiv.innerHTML = `<div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> Hors Ligne`;
                statusDiv.className = `flex items-center gap-2 bg-rose-500/20 text-rose-500 border border-rose-500/30 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest`;
            }
            if (powerBtn) {
                powerBtn.innerHTML = `<i class="fa-solid fa-power-off mr-1"></i> Démarrer Bot`;
                powerBtn.className = `bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-black uppercase tracking-[0.2em] text-[9px] py-3 rounded-xl hover:bg-emerald-500/40 transition-all`;
            }
        }
        
        if (data.config) {
            const setVal = (id, v) => {
                const el = document.getElementById(id);
                if (el && typeof v === 'string') el.value = v;
            };
            setVal('bot-config-token', data.config.token || '');
            setVal('bot-config-guild', data.config.guild || '');
            setVal('bot-config-logschannel', data.config.logChannel || '');
            setVal('bot-config-adminrole', data.config.adminRole || '');
            if (document.getElementById('bot-config-enablesync')) {
                document.getElementById('bot-config-enablesync').checked = !!data.config.enableSync;
            }
            if (document.getElementById('bot-config-autorename')) {
                document.getElementById('bot-config-autorename').checked = !!data.config.autoRename;
            }
        }
    }
});

window.toggleDiscordAdvanced = () => {
    const adv = document.getElementById('discord-advanced-options');
    if (adv) {
        adv.classList.toggle('hidden');
    }
};

// =====================================================================
// SERVER CONSOLE PANEL
// Live stdout streaming + command execution. Hooks into UPDATE_CONSOLE_LOG
// messages dispatched by client/main.lua.
// =====================================================================
(() => {
    const MAX_LINES = 2000;
    const state = {
        booted: false,
        autoScroll: true,
        cmdCount: 0,
        lineCount: 0,
        history: [],
        historyIdx: -1,
    };

    const escapeHtml = (s) => String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // Strip FiveM ^N color codes (^1 red, ^2 green, ...) and convert
    // them to spans for nicer rendering.
    const colorize = (line) => {
        const colors = {
            '0': '#ffffff', '1': '#f87171', '2': '#34d399', '3': '#fbbf24',
            '4': '#60a5fa', '5': '#a78bfa', '6': '#f472b6', '7': '#9ca3af',
            '8': '#ef4444', '9': '#3b82f6',
        };
        let html = '';
        let cur = '';
        let curColor = null;
        const flush = () => {
            if (!cur) return;
            if (curColor && colors[curColor]) {
                html += `<span style="color:${colors[curColor]}">${escapeHtml(cur)}</span>`;
            } else {
                html += escapeHtml(cur);
            }
            cur = '';
        };
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '^' && i + 1 < line.length && colors[line[i+1]] !== undefined) {
                flush();
                curColor = line[i+1];
                i++;
            } else {
                cur += line[i];
            }
        }
        flush();
        return html;
    };

    // ─────────────────────────────────────────────────────────────────
    // Highlight des tags [XXX] et niveaux de log (ERROR, WARN, …)
    // Applique apres colorize : si un tag est dans un span ^N, le
    // span imbrique laisse la couleur du tag prendre le dessus (CSS).
    // L'echappement HTML a deja transforme les < et > donc nos regex
    // sur '[...]' ne traversent jamais une balise.
    // ─────────────────────────────────────────────────────────────────
    const TAG_RULES = [
        // Modules Yol
        { re: /\[console\]/g,                           color: '#34d399', bold: true }, // emerald
        { re: /\[Yol-AC(?: Admin)?\]/g,                 color: '#fb923c', bold: true }, // orange clair
        { re: /\[Yol-Admin\]/g,                         color: '#F04C00', bold: true }, // theme orange
        { re: /\[Yol-AC Watchdog\]/g,                   color: '#dc2626', bold: true }, // rouge
        // SQL / BDD
        { re: /\[AutoSQL Debug\]/g,                     color: '#a78bfa', bold: true }, // violet
        { re: /\[AutoSQL\]/g,                           color: '#06b6d4', bold: true }, // cyan
        { re: /\[oxmysql\]/gi,                          color: '#06b6d4', bold: true },
        { re: /\[MySQL\]/gi,                            color: '#06b6d4', bold: true },
        // Niveaux de log standards
        { re: /\[(?:FATAL|CRITICAL|CRIT)\]/gi,          color: '#dc2626', bold: true }, // rouge fonce
        { re: /\[(?:ERROR|ERREUR|ERR)\]/gi,             color: '#ef4444', bold: true }, // rouge
        { re: /\[(?:WARN|WARNING|ATTENTION)\]/gi,       color: '#fbbf24', bold: true }, // jaune
        { re: /\[(?:INFO|NOTICE)\]/gi,                  color: '#60a5fa', bold: true }, // bleu
        { re: /\[(?:DEBUG|TRACE|VERBOSE)\]/gi,          color: '#9ca3af', bold: true }, // gris
        { re: /\[(?:OK|SUCCESS|SUCCES|DONE)\]/gi,       color: '#10b981', bold: true }, // vert
        // Resources / system FiveM
        { re: /\[script:[^\]]+\]/g,                     color: '#a78bfa', bold: true }, // violet
        { re: /\[c-scripting-core\]/g,                  color: '#a78bfa', bold: true },
        { re: /\[citizen-server-impl\]/g,               color: '#a78bfa', bold: true },
        { re: /\[ resources \]/g,                       color: '#a78bfa', bold: true },
        // Status d'evenements
        { re: /\[ALERTE\]/gi,                           color: '#dc2626', bold: true },
        { re: /\[BLOQUE\]/gi,                           color: '#ef4444', bold: true },
        { re: /\[ACCES REFUSE\]/gi,                     color: '#ef4444', bold: true },
        { re: /\[RATE LIMIT\]/gi,                       color: '#fbbf24', bold: true },
        { re: /\[MENACE TROUVEE\]/gi,                   color: '#dc2626', bold: true },
    ];

    // Patterns generiques (apres les tags nommes)
    const GENERIC_RULES = [
        // Timestamps [12:34:56] ou [2024-01-01 12:34:56]
        { re: /\[(\d{2}:\d{2}:\d{2}(?:\.\d+)?)\]/g,
          replace: (_, m) => `<span style="color:#6b7280 !important">[${m}]</span>` },
        { re: /\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:Z|\.\d+)?)\]/g,
          replace: (_, m) => `<span style="color:#6b7280 !important">[${m}]</span>` },
        // URLs http(s)://
        { re: /(https?:\/\/[^\s<>"']+)/g,
          replace: (_, m) => `<span style="color:#60a5fa !important;text-decoration:underline">${m}</span>` },
        // Adresses IP:port
        { re: /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?)\b/g,
          replace: (_, m) => `<span style="color:#fbbf24 !important">${m}</span>` },
        // Tailles octets / Mo
        { re: /\b(\d+(?:\.\d+)?\s*(?:octets|bytes|KB|MB|GB|ms|s))\b/gi,
          replace: (_, m) => `<span style="color:#a78bfa !important">${m}</span>` },
    ];

    const highlightTags = (html) => {
        for (const r of TAG_RULES) {
            html = html.replace(r.re, (m) =>
                `<span style="color:${r.color} !important${r.bold ? ';font-weight:700 !important' : ''}">${m}</span>`);
        }
        for (const r of GENERIC_RULES) {
            html = html.replace(r.re, r.replace);
        }
        return html;
    };

    const appendLine = (line, kind) => {
        const out = document.getElementById('console-output');
        if (!out) return;
        const div = document.createElement('div');
        let cls = '';
        if (kind === 'stderr') cls = 'text-rose-300';
        else if (kind === 'cmd') cls = 'text-emerald-300 font-bold';
        else if (kind === 'system') cls = 'text-amber-300/80 italic';
        else cls = 'text-zinc-200/90';
        div.className = cls;
        // 1. colorize : codes ^N FiveM -> spans
        // 2. highlightTags : tags [XXX], niveaux, timestamps, URLs, IPs
        div.innerHTML = highlightTags(colorize(line));
        out.appendChild(div);

        state.lineCount++;
        // Cap buffer
        while (out.childElementCount > MAX_LINES) {
            out.removeChild(out.firstChild);
        }
        const bc = document.getElementById('console-buffer-count');
        if (bc) bc.textContent = Math.min(state.lineCount, MAX_LINES);
        const lc = document.getElementById('console-stat-lines');
        if (lc) lc.textContent = state.lineCount;

        if (state.autoScroll) out.scrollTop = out.scrollHeight;
    };

    window.initServerConsole = () => {
        if (state.booted) return;
        state.booted = true;

        // Set initial "connected" status
        const st = document.getElementById('console-stat-status');
        if (st) { st.textContent = 'Active'; st.classList.add('text-emerald-400'); }

        // Ask the backend to start streaming + flush its buffer
        fetch(`https://${GetParentResourceName()}/console_subscribe`, {
            method: 'POST',
            body: JSON.stringify({ subscribe: true })
        }).catch(() => {});

        // History keyboard nav
        const input = document.getElementById('console-input');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    if (state.history.length === 0) return;
                    state.historyIdx = Math.max(0, state.historyIdx - 1);
                    input.value = state.history[state.historyIdx] || '';
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    if (state.history.length === 0) return;
                    state.historyIdx = Math.min(state.history.length, state.historyIdx + 1);
                    input.value = state.history[state.historyIdx] || '';
                    e.preventDefault();
                }
            });
        }

        appendLine('[console] Stream connecté. Tapez une commande ci-dessous.', 'system');
    };

    window.executeConsoleCommand = (ev) => {
        ev.preventDefault();
        const input = document.getElementById('console-input');
        if (!input) return false;
        const cmd = (input.value || '').trim();
        if (!cmd) return false;

        state.history.push(cmd);
        if (state.history.length > 100) state.history.shift();
        state.historyIdx = state.history.length;
        state.cmdCount++;
        const cc = document.getElementById('console-stat-cmds');
        if (cc) cc.textContent = state.cmdCount;
        const last = document.getElementById('console-stat-last');
        if (last) last.textContent = cmd.length > 22 ? cmd.slice(0, 22) + '…' : cmd;

        appendLine('> ' + cmd, 'cmd');
        input.value = '';

        fetch(`https://${GetParentResourceName()}/console_execute`, {
            method: 'POST',
            body: JSON.stringify({ command: cmd })
        }).catch(() => {
            appendLine('[erreur] échec de l\'envoi de la commande', 'stderr');
        });
        return false;
    };

    window.clearConsoleOutput = () => {
        const out = document.getElementById('console-output');
        if (out) out.innerHTML = '';
        state.lineCount = 0;
        const bc = document.getElementById('console-buffer-count');
        if (bc) bc.textContent = 0;
        const lc = document.getElementById('console-stat-lines');
        if (lc) lc.textContent = 0;
    };

    window.toggleConsoleAutoScroll = () => {
        state.autoScroll = !state.autoScroll;
        const icon = document.getElementById('console-pause-icon');
        const label = document.getElementById('console-pause-label');
        if (state.autoScroll) {
            if (icon) icon.className = 'fa-solid fa-pause';
            if (label) label.textContent = 'Pause';
        } else {
            if (icon) icon.className = 'fa-solid fa-play';
            if (label) label.textContent = 'Reprendre';
        }
    };

    // Stream listener
    window.addEventListener('message', (event) => {
        const data = event.data || {};
        if (data.type !== 'UPDATE_CONSOLE_LOG') return;
        const lines = Array.isArray(data.lines) ? data.lines : [];
        for (const entry of lines) {
            const txt = typeof entry === 'string' ? entry : (entry.text || '');
            const kind = typeof entry === 'string' ? 'stdout' : (entry.kind || 'stdout');
            appendLine(txt, kind);
        }
    });
})();

// =====================================================================
// ITEMS & SHOPS CREATOR PANEL
// =====================================================================
let cachedItems = {};
let cachedShops = {};
let activeShopId = null;

window.refreshInventoryCreator = () => {
    fetch(`https://${GetParentResourceName()}/invcreator_getData`, {
        method: 'POST',
        body: JSON.stringify({})
    });
};

window.updateInventoryCreatorUI = (items, shops) => {
    cachedItems = items || {};
    cachedShops = shops || {};
    // Populate items list
    renderItemsList();
    
    // Populate shops selector
    const selector = document.getElementById('invcreator-shop-select');
    if (selector) {
        // Keep active shop selection if it still exists
        const prevActive = selector.value;
        selector.innerHTML = '<option value="" disabled selected>Choisir une boutique...</option>';
        Object.keys(cachedShops).sort().forEach(shopId => {
            const shop = cachedShops[shopId];
            const name = shop.name || shopId;
            const opt = document.createElement('option');
            opt.value = shopId;
            opt.textContent = `${name} (${shopId})`;
            selector.appendChild(opt);
        });
        if (prevActive && cachedShops[prevActive]) {
            selector.value = prevActive;
            selectActiveShop();
        } else {
            document.getElementById('invcreator-shop-config').classList.add('hidden');
            document.getElementById('invcreator-shop-placeholder').classList.remove('hidden');
        }
    }
};

const renderItemsList = () => {
    const listContainer = document.getElementById('invcreator-items-list');
    if (!listContainer) return;
    
    const filterText = document.getElementById('invcreator-item-search').value.toLowerCase();
    listContainer.innerHTML = '';
    
    const sortedItemKeys = Object.keys(cachedItems).sort((a, b) => {
        const labelA = (cachedItems[a].label || a).toLowerCase();
        const labelB = (cachedItems[b].label || b).toLowerCase();
        return labelA.localeCompare(labelB);
    });
    
    let count = 0;
    sortedItemKeys.forEach(itemId => {
        const item = cachedItems[itemId];
        const label = item.label || itemId;

        if (filterText && !itemId.includes(filterText) && !label.toLowerCase().includes(filterText)) {
            return;
        }

        count++;
        const card = document.createElement('div');
        card.className = "group flex justify-between items-center bg-black/45 border border-white/5 hover:border-orange-500/30 p-2.5 rounded-xl transition-all cursor-pointer";
        const customImage = (item.client && item.client.image) ? item.client.image : null;
        const imgPath = customImage ? customImage : `nui://ox_inventory/web/images/${itemId}.png`;
        const safeId = String(itemId).replace(/'/g, "\\'");
        card.innerHTML = `
            <div class="flex items-center gap-3 flex-1 min-w-0" onclick="openItemCreatorOverlay(true, '${safeId}')">
                <div class="w-10 h-10 shrink-0 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-orange-500/40 transition-all">
                    <img src="${imgPath}" class="max-w-full max-h-full object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="w-full h-full items-center justify-center text-white/25" style="display:none;">
                        <i class="fa-solid fa-cube text-sm"></i>
                    </div>
                </div>
                <div class="flex flex-col gap-0.5 min-w-0">
                    <span class="text-[10px] font-black text-white uppercase truncate">${label}</span>
                    <span class="text-[8px] font-bold text-white/30 uppercase tracking-wider truncate">${itemId}</span>
                </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span class="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-white/50 uppercase">${item.weight}g</span>
                ${item.stack ? '<span class="bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded text-[8px] font-bold text-emerald-400 uppercase">Pile</span>' : '<span class="bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded text-[8px] font-bold text-rose-400 uppercase">Unique</span>'}
                <button class="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-orange-400 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/25 transition-all" onclick="event.stopPropagation(); openItemCreatorOverlay(true, '${safeId}')" title="Modifier">
                    <i class="fa-solid fa-pen text-[9px]"></i>
                </button>
                <button class="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/25 transition-all" onclick="event.stopPropagation(); confirmDeleteItem('${safeId}')" title="Supprimer">
                    <i class="fa-solid fa-trash-can text-[9px]"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(card);
    });
    
    if (count === 0) {
        listContainer.innerHTML = `
            <div class="py-10 text-center opacity-30 flex flex-col items-center justify-center">
                <i class="fa-solid fa-box-open text-2xl mb-2"></i>
                <span class="text-[9px] font-black uppercase tracking-widest">Aucun item trouvé</span>
            </div>
        `;
    }
};

window.filterItemsList = () => {
    renderItemsList();
};

window.openItemCreatorOverlay = (show, editItemId = null) => {
    const overlay = document.getElementById('invcreator-item-overlay');
    if (!overlay) return;

    if (!show) {
        overlay.classList.add('hidden');
        return;
    }

    const form = document.getElementById('invcreator-item-form');
    form.reset();

    const titleEl = document.getElementById('invcreator-form-title');
    const submitLabel = document.getElementById('invcreator-form-submit-label');
    const submitIcon = document.getElementById('invcreator-form-submit-icon');
    const nameInput = document.getElementById('invcreator-form-name');
    const editingInput = document.getElementById('invcreator-form-editing');
    const imageDataInput = document.getElementById('invcreator-form-image-data');
    const previewImg = document.getElementById('invcreator-image-preview-img');
    const previewIcon = document.getElementById('invcreator-image-preview-icon');
    const clearBtn = document.getElementById('invcreator-image-clear');

    imageDataInput.value = '';
    previewImg.src = '';
    previewImg.style.display = 'none';
    previewIcon.style.display = '';
    clearBtn.classList.add('hidden');

    if (editItemId && cachedItems[editItemId]) {
        const item = cachedItems[editItemId];
        editingInput.value = editItemId;
        titleEl.textContent = 'Modifier l\'item';
        submitLabel.textContent = 'Enregistrer';
        submitIcon.className = 'fa-solid fa-floppy-disk text-[10px]';

        nameInput.value = editItemId;
        nameInput.readOnly = true;
        nameInput.classList.add('opacity-60', 'cursor-not-allowed');

        const setVal = (selector, value) => {
            const el = form.querySelector(selector);
            if (el) el.value = value == null ? '' : value;
        };

        setVal('[name="label"]', item.label || '');
        setVal('[name="weight"]', item.weight != null ? item.weight : 0);
        setVal('[name="stack"]', item.stack === false ? 'false' : 'true');
        setVal('[name="close"]', item.close === false ? 'false' : 'true');
        setVal('[name="description"]', item.description || '');

        setVal('[name="consume"]', item.consume != null ? item.consume : '');
        setVal('[name="allowArmed"]', item.allowArmed === true ? 'true' : 'false');
        setVal('[name="degrade"]', item.degrade != null ? item.degrade : '');
        setVal('[name="decay"]', item.decay === true ? 'true' : 'false');

        const client = item.client || {};
        const server = item.server || {};
        setVal('[name="clientEvent"]', client.event || '');
        setVal('[name="clientExport"]', client.export || '');
        setVal('[name="serverExport"]', server.export || '');
        setVal('[name="clientUsetime"]', client.usetime != null ? client.usetime : '');
        setVal('[name="clientCancel"]', client.cancel === true ? 'true' : 'false');
        setVal('[name="animDict"]', (client.anim && client.anim.dict) || '');
        setVal('[name="animClip"]', (client.anim && client.anim.clip) || '');

        const jsonOrEmpty = (val) => (val == null) ? '' : JSON.stringify(val, null, 2);
        setVal('[name="buttonsJson"]', jsonOrEmpty(item.buttons));
        setVal('[name="clientStatusJson"]', jsonOrEmpty(client.status));
        setVal('[name="clientPropJson"]', jsonOrEmpty(client.prop));
        setVal('[name="clientDisableJson"]', jsonOrEmpty(client.disable));

        const customImage = client.image ? client.image : null;
        const imgPath = customImage ? customImage : `nui://ox_inventory/web/images/${editItemId}.png`;
        previewImg.onerror = () => { previewImg.style.display = 'none'; previewIcon.style.display = ''; };
        previewImg.onload = () => { previewImg.style.display = ''; previewIcon.style.display = 'none'; };
        previewImg.src = imgPath;
    } else {
        editingInput.value = '';
        titleEl.textContent = 'Nouvel Item';
        submitLabel.textContent = 'Créer l\'item';
        submitIcon.className = 'fa-solid fa-plus text-[10px]';

        nameInput.readOnly = false;
        nameInput.classList.remove('opacity-60', 'cursor-not-allowed');
    }

    overlay.classList.remove('hidden');
};

window.toggleAdvancedJson = () => {
    const body = document.getElementById('invcreator-advanced-body');
    const chevron = document.getElementById('invcreator-advanced-chevron');
    const label = document.getElementById('invcreator-advanced-toggle-label');
    if (!body) return;
    const isHidden = body.classList.contains('hidden');
    if (isHidden) {
        body.classList.remove('hidden');
        chevron.className = 'fa-solid fa-chevron-up';
        label.textContent = 'Replier';
    } else {
        body.classList.add('hidden');
        chevron.className = 'fa-solid fa-chevron-down';
        label.textContent = 'Déplier';
    }
};

window.onItemImagePicked = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Image trop volumineuse (max 2 Mo).');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        document.getElementById('invcreator-form-image-data').value = dataUrl;
        const previewImg = document.getElementById('invcreator-image-preview-img');
        const previewIcon = document.getElementById('invcreator-image-preview-icon');
        previewImg.onerror = null;
        previewImg.onload = null;
        previewImg.src = dataUrl;
        previewImg.style.display = '';
        previewIcon.style.display = 'none';
        document.getElementById('invcreator-image-clear').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
};

window.clearItemImage = () => {
    document.getElementById('invcreator-form-image-data').value = '';
    document.getElementById('invcreator-image-file').value = '';
    const previewImg = document.getElementById('invcreator-image-preview-img');
    const previewIcon = document.getElementById('invcreator-image-preview-icon');
    previewImg.src = '';
    previewImg.style.display = 'none';
    previewIcon.style.display = '';
    document.getElementById('invcreator-image-clear').classList.add('hidden');
};

const tryParseJSON = (raw, fallback) => {
    if (raw == null) return fallback;
    const s = String(raw).trim();
    if (s === '') return fallback;
    try { return JSON.parse(s); } catch (e) { return undefined; }
};

window.submitNewItem = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const editingId = (formData.get('editing') || '').trim();
    const isEdit = !!editingId;

    // Parse JSON avancés (undefined si invalide, on alerte alors)
    const buttons = tryParseJSON(formData.get('buttonsJson'), null);
    const clientStatus = tryParseJSON(formData.get('clientStatusJson'), null);
    const clientProp = tryParseJSON(formData.get('clientPropJson'), null);
    const clientDisable = tryParseJSON(formData.get('clientDisableJson'), null);

    const invalidFields = [];
    if (buttons === undefined) invalidFields.push('buttons');
    if (clientStatus === undefined) invalidFields.push('client.status');
    if (clientProp === undefined) invalidFields.push('client.prop');
    if (clientDisable === undefined) invalidFields.push('client.disable');
    if (invalidFields.length > 0) {
        alert('JSON invalide dans : ' + invalidFields.join(', '));
        return;
    }

    const consumeRaw = (formData.get('consume') || '').trim();
    const degradeRaw = (formData.get('degrade') || '').trim();
    const usetimeRaw = (formData.get('clientUsetime') || '').trim();

    const clientExtra = {};
    if (clientStatus) clientExtra.status = clientStatus;
    if (clientProp) clientExtra.prop = clientProp;
    if (clientDisable) clientExtra.disable = clientDisable;

    const payload = {
        name: isEdit ? editingId : formData.get('name').trim().toLowerCase(),
        label: formData.get('label').trim(),
        weight: parseInt(formData.get('weight')) || 0,
        stack: formData.get('stack') === 'true',
        close: formData.get('close') === 'true',
        description: (formData.get('description') || '').trim(),
        imageData: formData.get('imageData') || '',

        consume: consumeRaw === '' ? null : parseFloat(consumeRaw),
        allowArmed: formData.get('allowArmed') === 'true',
        degrade: degradeRaw === '' ? null : parseFloat(degradeRaw),
        decay: formData.get('decay') === 'true',

        clientEvent: (formData.get('clientEvent') || '').trim(),
        clientExport: (formData.get('clientExport') || '').trim(),
        serverExport: (formData.get('serverExport') || '').trim(),
        clientUsetime: usetimeRaw === '' ? null : parseInt(usetimeRaw),
        clientCancel: formData.get('clientCancel') === 'true',
        animDict: (formData.get('animDict') || '').trim(),
        animClip: (formData.get('animClip') || '').trim(),

        buttons: buttons || null,
        clientExtra: clientExtra
    };

    if (!payload.name || !payload.label) return;

    const endpoint = isEdit ? 'invcreator_updateItem' : 'invcreator_createItem';
    fetch(`https://${GetParentResourceName()}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    openItemCreatorOverlay(false);
};

window.confirmDeleteItem = (itemId) => {
    if (!itemId || !cachedItems[itemId]) return;
    const label = cachedItems[itemId].label || itemId;
    if (!confirm(`Supprimer l'item "${label}" (${itemId}) ?\n\nL'image associée sera également supprimée.`)) return;

    fetch(`https://${GetParentResourceName()}/invcreator_deleteItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: itemId })
    });
};

window.openShopCreatorOverlay = (show) => {
    const overlay = document.getElementById('invcreator-shop-overlay');
    if (!overlay) return;
    const form = document.getElementById('invcreator-shop-form');
    if (show) {
        form.reset();
        overlay.classList.remove('hidden');
        setTimeout(() => {
            const idInput = form.querySelector('[name="shopId"]');
            if (idInput) idInput.focus();
        }, 50);
    } else {
        overlay.classList.add('hidden');
    }
};

window.submitNewShop = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const rawId = (formData.get('shopId') || '').trim();
    const cleanId = rawId.replace(/[^a-zA-Z0-9_]/g, '');
    if (!cleanId) {
        alert("ID invalide : utilise uniquement lettres, chiffres et underscore.");
        return;
    }
    if (cachedShops[cleanId]) {
        alert("Une boutique avec cet ID existe déjà.");
        return;
    }

    const name = (formData.get('shopName') || '').trim() || cleanId;
    const blipId = parseInt(formData.get('blipId'));
    const blipColour = parseInt(formData.get('blipColour'));
    const blipScale = parseFloat(formData.get('blipScale'));

    cachedShops[cleanId] = {
        name: name,
        blip: {
            id: !isNaN(blipId) ? blipId : 59,
            colour: !isNaN(blipColour) ? blipColour : 69,
            scale: !isNaN(blipScale) ? blipScale : 0.8
        },
        inventory: [],
        locations: [],
        targets: []
    };

    // Add option and select it
    const selector = document.getElementById('invcreator-shop-select');
    if (selector) {
        const opt = document.createElement('option');
        opt.value = cleanId;
        opt.textContent = `${name} (${cleanId})`;
        selector.appendChild(opt);
        selector.value = cleanId;
        selectActiveShop();
    }

    openShopCreatorOverlay(false);
};

// Normalise inventory en array, peu importe la forme reçue (array vs objet avec clés numériques)
const normalizeInventory = (inv) => {
    if (!inv) return [];
    if (Array.isArray(inv)) return inv;
    if (typeof inv === 'object') {
        // Cas tables Lua sérialisées en objet { "1": {...}, "2": {...} }
        const keys = Object.keys(inv);
        // Vérifier que toutes les clés sont numériques
        if (keys.every(k => /^\d+$/.test(k))) {
            return keys
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map(k => inv[k]);
        }
        return Object.values(inv);
    }
    return [];
};

window.selectActiveShop = () => {
    const selector = document.getElementById('invcreator-shop-select');
    if (!selector) return;

    const shopId = selector.value;
    const shop = cachedShops[shopId];
    if (!shop) return;

    activeShopId = shopId;

    // Hide placeholder, show config
    document.getElementById('invcreator-shop-placeholder').classList.add('hidden');
    document.getElementById('invcreator-shop-config').classList.remove('hidden');

    // Populate simple fields
    document.getElementById('shop-id-input').value = shopId;
    document.getElementById('shop-name-input').value = shop.name || '';
    document.getElementById('shop-blip-id').value = (shop.blip && shop.blip.id) || 59;
    document.getElementById('shop-blip-colour').value = (shop.blip && shop.blip.colour) || 69;
    document.getElementById('shop-blip-scale').value = (shop.blip && shop.blip.scale) || 0.8;

    // Populate items grid
    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    const items = normalizeInventory(shop.inventory);
    items.forEach((item) => {
        addShopItemRow(item.name, item.price, item.count, item.currency, item.slot);
    });

    // Populate locations
    renderShopLocations();
};

const normalizeLocation = (loc) => {
    if (!loc) return null;
    if (typeof loc.x === 'number') return { x: loc.x, y: loc.y, z: loc.z };
    // Cas array [x, y, z] (sérialisation alternative de vec3)
    if (Array.isArray(loc) && loc.length >= 3) return { x: loc[0], y: loc[1], z: loc[2] };
    return null;
};

window.renderShopLocations = () => {
    const container = document.getElementById('shop-locations-container');
    if (!container) return;
    container.innerHTML = '';

    if (!activeShopId || !cachedShops[activeShopId]) return;
    const shop = cachedShops[activeShopId];

    // Normalisation des locations en array de {x,y,z} pur (au cas où elles arrivent en objet ou array [x,y,z])
    let rawList = shop.locations;
    if (!Array.isArray(rawList)) {
        rawList = (rawList && typeof rawList === 'object') ? Object.values(rawList) : [];
    }
    const locations = rawList.map(normalizeLocation).filter(Boolean);
    shop.locations = locations; // on persiste la forme normalisée pour les opérations suivantes

    if (locations.length === 0) {
        container.innerHTML = `
            <div class="py-3 text-center opacity-30 flex flex-col items-center justify-center">
                <i class="fa-solid fa-map-location-dot text-lg mb-1"></i>
                <span class="text-[8.5px] font-black uppercase tracking-widest">Aucun point de vente</span>
            </div>
        `;
        return;
    }

    // Vérifie si la location idx a un target ox_target associé
    const targets = Array.isArray(shop.targets) ? shop.targets : [];
    const hasTargetForIdx = (idx) => {
        if (targets[idx] && targets[idx].loc) return true;
        // Sinon, cherche un target par coord proche
        const here = locations[idx];
        return targets.some(t => {
            if (!t || !t.loc) return false;
            const tl = normalizeLocation(t.loc);
            if (!tl) return false;
            return Math.abs(tl.x - here.x) < 2 && Math.abs(tl.y - here.y) < 2 && Math.abs(tl.z - here.z) < 3;
        });
    };

    locations.forEach((loc, idx) => {
        const hasTarget = hasTargetForIdx(idx);
        const row = document.createElement('div');
        row.className = "flex items-center justify-between gap-2 bg-black/40 border border-white/5 hover:border-orange-500/20 px-2.5 py-1.5 rounded-lg transition-all";
        const targetBadge = hasTarget
            ? `<span class="bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[7px] font-bold text-emerald-400 uppercase" title="Target ox_target présent">target ✓</span>`
            : `<button class="bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 px-1.5 py-0.5 rounded text-[7px] font-black text-amber-400 uppercase transition-all" onclick="shopAddTargetForLocation(${idx})" title="Créer un target ox_target par défaut ici">+ target</button>`;
        row.innerHTML = `
            <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="text-[9px] font-black text-orange-400/80 w-5 text-center">#${idx + 1}</span>
                <span class="text-[9px] font-mono text-white/70 truncate">X: ${loc.x.toFixed(2)} · Y: ${loc.y.toFixed(2)} · Z: ${loc.z.toFixed(2)}</span>
                ${targetBadge}
            </div>
            <div class="flex items-center gap-1">
                <button class="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-sky-400 hover:bg-sky-500/10 transition-all" onclick="shopTeleportToLocation(${idx})" title="Téléporter">
                    <i class="fa-solid fa-paper-plane text-[8px]"></i>
                </button>
                <button class="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all" onclick="shopRemoveLocation(${idx})" title="Supprimer">
                    <i class="fa-solid fa-trash-can text-[8px]"></i>
                </button>
            </div>
        `;
        container.appendChild(row);
    });
};

window.shopRegenerateTargets = () => {
    if (!activeShopId || !cachedShops[activeShopId]) return;
    const shop = cachedShops[activeShopId];
    const locations = Array.isArray(shop.locations) ? shop.locations.map(normalizeLocation).filter(Boolean) : [];
    if (locations.length === 0) {
        alert("Cette boutique n'a aucune location — ajoute d'abord des points de vente.");
        return;
    }
    if (!confirm(`Régénérer ${locations.length} target(s) au niveau du sol ?\n\nLes targets actuels seront remplacés. Utile si ox_target ne s'active pas (ex: Ammunation).`)) return;
    shop.targets = locations.map(buildDefaultTarget);
    renderShopLocations();
    alert("Targets régénérés. N'oublie pas de cliquer Enregistrer pour persister.");
};

window.shopAddTargetForLocation = (idx) => {
    if (!activeShopId || !cachedShops[activeShopId]) return;
    const shop = cachedShops[activeShopId];
    if (!Array.isArray(shop.locations) || !shop.locations[idx]) return;
    const loc = normalizeLocation(shop.locations[idx]);
    if (!loc) return;
    if (!Array.isArray(shop.targets)) shop.targets = [];
    shop.targets.push(buildDefaultTarget(loc));
    renderShopLocations();
};

window.deleteActiveShop = () => {
    if (!activeShopId) {
        alert('Aucune boutique sélectionnée.');
        return;
    }
    const shopId = activeShopId;
    const shop = cachedShops[shopId];
    const label = (shop && shop.name) || shopId;
    if (!confirm(`Supprimer définitivement la boutique "${label}" (${shopId}) ?\n\nElle disparaîtra du fichier shops.lua et de la map.`)) return;

    fetch(`https://${GetParentResourceName()}/invcreator_deleteShop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopType: shopId })
    });

    // Suppression optimiste côté UI (le serveur renverra de toute façon les fresh data)
    delete cachedShops[shopId];
    activeShopId = null;
    const selector = document.getElementById('invcreator-shop-select');
    if (selector) {
        const opt = selector.querySelector(`option[value="${shopId}"]`);
        if (opt) opt.remove();
        selector.value = '';
    }
    document.getElementById('invcreator-shop-config').classList.add('hidden');
    document.getElementById('invcreator-shop-placeholder').classList.remove('hidden');
};

window.shopAddCurrentPosition = () => {
    if (!activeShopId) return;
    fetch(`https://${GetParentResourceName()}/invcreator_shopGetCurrentPos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

window.shopPickLocation = () => {
    if (!activeShopId) return;
    fetch(`https://${GetParentResourceName()}/invcreator_shopPickLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

// Crée un target par défaut AU NIVEAU DU SOL, compatible ox_target.
// (Ne PAS soustraire 1.20m de z : la box doit englober le joueur debout, pas être sous le sol.)
const buildDefaultTarget = (loc) => ({
    loc: { x: loc.x, y: loc.y, z: loc.z },
    length: 0.7,
    width: 0.5,
    heading: 0.0,
    minZ: loc.z,
    maxZ: loc.z + 1.0,
    distance: 1.5
});

// Appelé depuis le client Lua après confirmation du raycast / position
window.invcreatorAddShopLocation = (loc) => {
    if (!activeShopId || !cachedShops[activeShopId]) return;
    const norm = normalizeLocation(loc);
    if (!norm) return;
    const shop = cachedShops[activeShopId];
    if (!Array.isArray(shop.locations)) shop.locations = [];
    if (!Array.isArray(shop.targets)) shop.targets = [];
    shop.locations.push(norm);
    // Ajoute aussi un target ox_target alignée sur la même position
    // (sinon l'armurier/shop avec useTarget ne peut pas être ouvert via E)
    shop.targets.push(buildDefaultTarget(norm));
    renderShopLocations();
};

window.shopRemoveLocation = (idx) => {
    if (!activeShopId || !cachedShops[activeShopId]) return;
    const shop = cachedShops[activeShopId];
    if (!Array.isArray(shop.locations) || idx < 0 || idx >= shop.locations.length) return;
    if (!confirm(`Supprimer le point de vente #${idx + 1} (location + target) ?`)) return;
    shop.locations.splice(idx, 1);
    // Si on a un target aligné 1-1 sur les locations, on le retire aussi
    if (Array.isArray(shop.targets) && shop.targets.length === shop.locations.length + 1) {
        shop.targets.splice(idx, 1);
    }
    renderShopLocations();
};

window.shopTeleportToLocation = (idx) => {
    if (!activeShopId || !cachedShops[activeShopId]) return;
    const shop = cachedShops[activeShopId];
    const loc = normalizeLocation(shop.locations && shop.locations[idx]);
    if (!loc) return;
    fetch(`https://${GetParentResourceName()}/invcreator_shopTeleport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: loc.x, y: loc.y, z: loc.z })
    });
};

window.addShopItemRow = (rawName, rawPrice, rawCount, rawCurrency, rawSlot) => {
    const container = document.getElementById('shop-items-container');
    if (!container) return;

    // Normalisation défensive : on ne laisse jamais "undefined" se retrouver dans value=
    const name = (rawName == null) ? '' : String(rawName);
    const price = (rawPrice == null || isNaN(rawPrice)) ? 0 : Number(rawPrice);
    const count = (rawCount == null || rawCount === '') ? '' : Number(rawCount);
    const currency = (rawCurrency == null) ? '' : String(rawCurrency);
    const slot = (rawSlot == null) ? '' : String(rawSlot);

    const row = document.createElement('div');
    row.className = "grid grid-cols-12 gap-2 items-center bg-black/30 border border-white/5 px-2 py-1.5 rounded-lg";
    row.dataset.slot = slot;

    // Item selector with options sorted alphabetically
    let optionsHtml = `<option value="" disabled ${!name ? 'selected' : ''}>Choisir...</option>`;
    const itemKeys = Object.keys(cachedItems).sort((a,b) => (cachedItems[a].label || a).localeCompare(cachedItems[b].label || b));
    // Si l'item référencé n'existe plus dans la registry, on l'ajoute quand même en tête pour préserver la valeur
    if (name && !cachedItems[name]) {
        optionsHtml += `<option value="${name}" selected>⚠ ${name} (introuvable)</option>`;
    }
    itemKeys.forEach(itemId => {
        optionsHtml += `<option value="${itemId}" ${itemId === name ? 'selected' : ''}>${cachedItems[itemId].label || itemId} (${itemId})</option>`;
    });
    
    row.innerHTML = `
        <div class="col-span-4">
            <select class="item-name-select w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-[9px] text-white outline-none focus:border-orange-500/30 font-bold">
                ${optionsHtml}
            </select>
        </div>
        <div class="col-span-3">
            <input class="item-price-input w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-[9px] text-white outline-none focus:border-orange-500/30" type="number" placeholder="Prix" value="${price}">
        </div>
        <div class="col-span-2">
            <input class="item-count-input w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-[9px] text-white outline-none focus:border-orange-500/30" type="number" placeholder="Aucune" value="${count !== undefined ? count : ''}">
        </div>
        <div class="col-span-2">
            <input class="item-currency-input w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-[9px] text-white outline-none focus:border-orange-500/30" type="text" placeholder="money" value="${currency || ''}">
        </div>
        <div class="col-span-1 text-right">
            <button type="button" class="text-rose-500/75 hover:text-rose-500" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-trash-can text-sm"></i></button>
        </div>
    `;
    
    container.appendChild(row);
};

window.saveActiveShopChanges = () => {
    if (!activeShopId) return;
    
    const shop = cachedShops[activeShopId];
    if (!shop) return;
    
    const name = document.getElementById('shop-name-input').value.trim();
    const blipId = parseInt(document.getElementById('shop-blip-id').value) || 59;
    const blipColour = parseInt(document.getElementById('shop-blip-colour').value) || 69;
    const blipScale = parseFloat(document.getElementById('shop-blip-scale').value) || 0.8;
    
    const inventory = [];
    const container = document.getElementById('shop-items-container');
    const rows = container.querySelectorAll('.grid');
    let skippedRows = 0;
    
    rows.forEach((row) => {
        const itemSelect = row.querySelector('.item-name-select');
        if (!itemSelect) return;
        const priceInput = row.querySelector('.item-price-input');
        const countInput = row.querySelector('.item-count-input');
        const currencyInput = row.querySelector('.item-currency-input');

        const itemName = itemSelect.value;
        const price = parseInt(priceInput.value) || 0;
        const count = countInput.value !== '' ? parseInt(countInput.value) : undefined;
        const currency = currencyInput.value.trim();

        if (itemName) {
            const entry = { name: itemName, price: price };
            if (count !== undefined && !isNaN(count) && count !== '') entry.count = count;
            if (currency) entry.currency = currency;
            inventory.push(entry);
        } else {
            skippedRows++;
        }
    });

    if (skippedRows > 0) {
        if (!confirm(`${skippedRows} ligne(s) sans item sélectionné seront ignorée(s) à la sauvegarde.\n\nContinuer quand même ?`)) {
            return;
        }
    }
    
    // Construct updated details
    const updatedDetails = {
        name: name,
        blip: { id: blipId, colour: blipColour, scale: blipScale },
        inventory: inventory,
        // Preserve locations/targets/models from previous config if they exist
        locations: shop.locations || [],
        targets: shop.targets || [],
        model: shop.model || undefined
    };
    
    const payload = {
        shopType: activeShopId,
        shopDetails: updatedDetails
    };
    
    fetch(`https://${GetParentResourceName()}/invcreator_saveShop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    // Mise à jour optimiste locale : le round-trip serveur peut prendre 1-2s
    // et l'utilisateur attendrait sans voir ses modifs. On reflète immédiatement.
    cachedShops[activeShopId] = updatedDetails;
    selectActiveShop();
};


