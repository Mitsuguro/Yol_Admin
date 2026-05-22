// app.js - Global Logic
const defaultLocales = {
    "admin_menu": "Menu Admin",
    "error": "Erreur",
    "success": "Succès",
    "info": "Information",
    "action_success": "L'action a été effectuée avec succès.",
    "action_error": "Une erreur est survenue lors de l'action.",
    "no_permission": "Vous n'avez pas la permission d'utiliser cette commande.",
    
    // Notifications
    "noclip_on": "Noclip Activé",
    "noclip_off": "Noclip Désactivé",
    "godmode_on": "Godmode Activé",
    "godmode_off": "Godmode Désactivé",
    "invisible_on": "Invisibilité Activée",
    "invisible_off": "Invisibilité Désactivée",
    "blips_on": "Blips Joueurs Activés",
    "blips_off": "Blips Joueurs Désactivés",
    "healed": "Soigné",
    "armor_max": "Armure au max",
    "coords_copied": "Coords copiées: %s",
    "super_jump_on": "Super Jump Activé",
    "super_jump_off": "Super Jump Désactivé",
    "fast_run_on": "Fast Run Activé",
    "fast_run_off": "Fast Run Désactivé",
    "tp_map": "Téléporté sur la carte",
    "veh_spawned": "Véhicule Spawn",
    "model_invalid": "Modèle invalide",
    "veh_repaired": "Véhicule réparé",
    "veh_upgraded": "Véhicule amélioré au maximum",
    "not_in_veh": "Vous n'êtes pas dans un véhicule",
    "veh_deleted": "Véhicule supprimé",
    "veh_flipped": "Véhicule retourné",
    "veh_washed": "Véhicule lavé",
    "veh_locked": "Véhicule verrouillé",
    "veh_unlocked": "Véhicule déverrouillé",
    "boost_activated": "BOOST!",
    "plate_changed": "Plaque changée",
    "engine_on": "Moteur allumé",
    "engine_off": "Moteur éteint",
    "tags_on": "Tags Activés",
    "tags_off": "Tags Désactivés",
    
    // Dialogs
    "dialog_announce": "Annonce Serveur",
    "dialog_message": "Message",
    "dialog_unban": "Unban Joueur",
    "dialog_identifier": "Identifier (license:xxx)",
    "dialog_give_item": "Give Item",
    "dialog_select_item": "Sélectionner Item",
    "dialog_amount": "Montant",
    "dialog_set_job": "Set Job",
    "dialog_select_job": "Sélectionner Job",
    "dialog_grade": "Grade",
    "dialog_warn_player": "Warn Joueur",
    "dialog_reason": "Raison",
    "dialog_ban_player": "Ban Joueur",
    "dialog_duration": "Durée (ex: 1d, perm)",
    "dialog_kick_player": "Kick Joueur",
    "dialog_set_money": "Set Argent",
    "dialog_give_money": "Give Argent",
    "dialog_remove_money": "Remove Argent",
    "dialog_type": "Type",
    "dialog_set_model": "Set Modèle Joueur",
    "dialog_model_name": "Modèle (ex: mp_m_freemode_01)",
    "dialog_give_weapon": "Give Arme",
    "dialog_select_weapon": "Sélectionner Arme",
    "dialog_ammo": "Munitions",
    "dialog_jail_player": "Jail Joueur",
    "dialog_time_min": "Durée (minutes)",
    "dialog_set_coords": "Set Coords",
    "dialog_set_group": "Set Groupe",
    "dialog_slap_player": "Slap Joueur",
    "dialog_damage": "Dégâts",
    "dialog_send_message": "Envoyer Message",
    "dialog_spawn_veh": "Spawn Véhicule",
    "dialog_change_plate": "Changer Plaque",
    "dialog_new_plate": "Nouvelle Plaque (8 chars max)",
    
    // UI (NUI)
    "ui_dashboard": "Tableau de Bord",
    "ui_players": "Joueurs",
    "ui_server": "Serveur",
    "ui_vehicles": "Véhicules",
    "ui_logs": "Logs",
    "ui_settings": "Paramètres",
    "ui_search": "Rechercher...",
    "ui_online": "En Ligne",
    "ui_offline": "Hors Ligne",
    "ui_actions": "Actions",
    "ui_inventory": "Inventaire",
    "ui_stats": "Statistiques",
    "ui_kick": "Kick",
    "ui_ban": "Bannir",
    "ui_warn": "Avertir",
    "ui_revive": "Réanimer",
    "ui_heal": "Soigner",
    "ui_goto": "Aller à",
    "ui_bring": "Ramener",
    "ui_freeze": "Freeze",
    "ui_spectate": "Spectateur",
    "ui_needs": "Besoins",
    "ui_kill": "Tuer",
    "ui_infos": "Infos",
    "ui_signal_live": "SIGNAL LIVE...",
    "ui_select_player": "SÉLECTIONNEZ UN JOUEUR",
    "ui_no_job": "Sans emploi",
    "ui_no_players_found": "Aucun joueur trouvé",
    "ui_pin": "Epingler",
    "ui_map": "Carte",
    "ui_my_actions": "Mes Actions",
    "ui_global_actions": "Actions Globales",
    "ui_time": "Heure",
    "ui_weather": "Météo",
    "ui_player_management": "Gestion des joueurs",
    "ui_quick_actions": "Actions rapides sur",
    "ui_staff_notes": "Notes Staff",
    "ui_add_note": "Ajouter une note...",
    "ui_states": "États",
    "ui_administration": "Administration",
    "ui_current_vehicle": "Véhicule Actuel",
    "ui_owned_vehicles": "Véhicules Possédés",
    "ui_server_management": "Gestion Serveur",
    "ui_scripts_management": "Gestion des Scripts",
    "ui_staff_logs": "Logs Staff",
    "ui_scripts": "Scripts",
    
    // Actions
    "ui_heal_action": "Soigner",
    "ui_slap": "Gifle",
    "ui_cuff": "Menotter",
    "ui_ragdoll": "Ragdoll",
    "ui_coords": "Coords",
    "ui_return": "Retour",
    "ui_teleport": "Téléportation",
    "ui_economy": "Économie",
    "ui_give_item": "Donner Item",
    "ui_give_weapon": "Donner Arme",
    "ui_remove_weapons": "Retirer Armes",
    "ui_clear_inventory": "Vider Sac",
    "ui_set_gang": "Modifier Gang",
    "ui_set_group": "Set Group",
    "ui_set_model": "Modifier Modèle",
    "ui_jail": "Jail",
    "ui_repair": "Réparer",
    "ui_wash": "Laver",
    "ui_delete": "Supprimer",
    "ui_flip": "Retourner",
    "ui_engine": "Moteur",
    "ui_plate": "Plaque",
    "ui_lock": "Verrou",
    "ui_boost": "Boost",
    
    // Weather
    "ui_w_sun": "SOLEIL",
    "ui_w_clear": "CLAIR",
    "ui_w_clouds": "NUAGES",
    "ui_w_overcast": "COUVERT",
    "ui_w_rain": "PLUIE",
    "ui_w_thunder": "ORAGE",
    "ui_w_fog": "BROUILLARD",
    "ui_w_snow": "NEIGE",
    "ui_yes": "OUI",
    "ui_no": "NON",
    "ui_handcuffed": "Menotté",
    "ui_in_jail": "Prison",
    "ui_announce": "Annonce",
    "ui_announce_sent": "Annonce envoyée !",
    "ui_announce_msg": "Message de l'annonce",
    "ui_type_msg": "Tapez votre message ici...",
    "ui_loading_fleet": "Chargement de la flotte...",
    "ui_no_logs_found": "Aucun log trouvé",
    "ui_no_vehicles_registered": "Aucun véhicule enregistré",
    "ui_coords_copied": "Coordonnées copiées !",
    "ui_noclip": "Noclip",
    "ui_godmode": "Godmode",
    "ui_invisible": "Invisible",
    "ui_my_coords": "Mes Coords",
    "ui_bring_all": "Bring All",
    "ui_heal_all": "Heal All",
    "ui_revive_all": "Revive All",
    "ui_clear_area": "Clear Area",
    "ui_status": "Statut",
    "ui_active": "Actif",
    "ui_format": "Format",
    "ui_close": "Fermer"
};

const _L = (key) => (window.locales && window.locales[key]) ? window.locales[key] : (defaultLocales[key] ? defaultLocales[key] : key);
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
    isDragging = false;
});

// Opacity Logic
if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
        adminPanel.style.opacity = e.target.value;
    });
}

// NUI Message listener
window.addEventListener('message', (event) => {
    const data = event.data;
    // console.log('NUI Message received:', data.type, data);
    
    if (data.type === 'START_SCREEN_SHARE') {
        window.startWebRTCScreenShare(data.adminId);
        return;
    }
    if (data.type === 'START_ADMIN_PIP') {
        handleAdminPiPStart(data.target);
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
        }
        window.playersData = data.players || [];
        window.allPlayers = window.playersData;
        window.serverJobs = data.jobs || [];
        window.serverGangs = data.config ? data.config.gangs || [] : [];
        window.serverItems = data.items || [];
        window.serverLogs = data.logs || [];
        window.serverResources = data.resources || [];
        window.serverConfig = data.config || {};
        
        // Populate items datalist
        const itemDatalist = document.getElementById('all-items-list');
        if (itemDatalist) {
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
            } else if (typeof window.serverItems === 'object') {
                // Fallback for object format
                Object.entries(window.serverItems).forEach(([name, label]) => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = `${typeof label === 'string' ? label : (label.label || name)} (${name})`;
                    itemDatalist.appendChild(opt);
                });
            }
        }
        
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
                }
            });
            // Marker update is handled by the animation frame loop
        }
    } else if (data.type === 'UPDATE_ECO') {
        updateEcoUI(data.data);
    } else if (data.type === 'UPDATE_INV_RESULTS') {
        if (typeof updateInvPlayerResults === 'function') updateInvPlayerResults(data.players);
    } else if (data.type === 'UPDATE_INVENTORY') {
        if (typeof updateInventoryGrid === 'function') updateInventoryGrid(data.items);
    } else if (data.type === 'UPDATE_ZONES') {
        if (typeof updateZoneList === 'function') updateZoneList(data.zones);
    } else if (data.type === 'UPDATE_FLEET') {
        updateFleetUI(data.data);
    } else if (data.type === 'UPDATE_ANNOUNCEMENTS') {
        updateAnnouncements(data.announcements);
    } else if (data.type === 'UPDATE_ANTICHEAT_DATA') {
        updateAnticheatUI(data.data);
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

document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && mainApp.style.display !== 'none') {
        closeMenu();
    }
});

// Tabs logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        tabs.forEach(t => t.classList.remove('active'));
        
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const contentEl = document.getElementById(targetId);
        if (contentEl) {
            contentEl.classList.add('active');
            
            // Tab-specific refreshes
            if (targetId === 'tab-dashboard') {
                if (typeof map !== 'undefined' && map) setTimeout(() => map.invalidateSize(), 100);
                if (typeof updateDashboard === 'function') updateDashboard();
            } else if (targetId === 'tab-eco') {
                if (typeof refreshEco === 'function') refreshEco();
            } else if (targetId === 'tab-jobcreator' || targetId === 'tab-gangcreator') {
                if (typeof updateMarkerNameList === 'function') updateMarkerNameList();
                if (typeof renderMarkers === 'function') renderMarkers();
            } else if (targetId === 'tab-players') {
                if (typeof renderPlayers === 'function') renderPlayers();
            } else if (targetId === 'tab-anticheat') {
                if (typeof refreshAnticheat === 'function') refreshAnticheat();
            }
        }
        
        // Refresh data based on tab
        if (targetId === 'tab-dashboard') {
            if (typeof refreshDashboard === 'function') refreshDashboard();
        } else if (targetId === 'tab-eco') {
            if (typeof refreshEco === 'function') refreshEco();
        } else if (targetId === 'tab-fleet') {
            if (typeof refreshFleet === 'function') refreshFleet();
        } else if (targetId === 'tab-inventory') {
            if (typeof searchInventory === 'function') searchInventory();
        } else if (targetId === 'tab-anticheat') {
            if (typeof refreshAnticheat === 'function') refreshAnticheat();
        }

        // Keep menu wide as requested by user
        adminPanel.classList.remove('vertical');
        
        if (targetId === 'tab-dashboard' && map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }

        // Data fetching for specific modules
        const module = tab.dataset.module;
        if (module === 'eco') refreshEco();
        if (module === 'fleet') refreshFleet();
        if (module === 'zones') fetch(`https://${GetParentResourceName()}/get_zones`, { method: 'POST' });
    });
});

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
    const playerTabBtn = document.querySelector('button[onclick*="players"]');
    if (playerTabBtn) playerTabBtn.click();
    
    // Try to find player in data
    const player = playersData.find(p => p.identifier === identifier);
    if (player) {
        selectPlayer(player.id);
    }
};

window.updateEcoUI = (data) => {
    if (!data) return;
    document.getElementById('eco-total-money').textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(data.totalMoney || 0);
    document.getElementById('eco-avg-money').textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(data.avgMoney || 0);
    document.getElementById('eco-richest-name').textContent = data.richestName || 'N/A';
    document.getElementById('eco-total-black').textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(data.totalBlack || 0);

    const tbody = document.getElementById('eco-transactions-body');
    tbody.innerHTML = '';
    (data.transactions || []).forEach(tx => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-white/5 hover:bg-white/5 transition-colors';
        tr.innerHTML = `
            <td class="py-3 text-white/40">${tx.date}</td>
            <td class="py-3 font-bold">${tx.from}</td>
            <td class="py-3 font-bold">${tx.to}</td>
            <td class="py-3 font-black text-emerald-400">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(tx.amount)}</td>
            <td class="py-3 text-right">
                <button class="w-8 h-8 bg-white/5 hover:bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 hover:text-white transition-all" onclick="inspectPlayerFromEco('${tx.fromIdentifier}')" title="Inspecter le joueur"><i class="fa-solid fa-eye text-[11px]"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const topList = document.getElementById('eco-top-players');
    topList.innerHTML = '';
    (data.topPlayers || []).forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-[10px] font-black text-white/20">#${i+1}</span>
                <span class="text-[11px] font-bold">${p.name}</span>
            </div>
            <span class="text-[10px] font-black text-emerald-400">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(p.money)}</span>
        `;
        topList.appendChild(div);
    });
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
// Smooth Update Loop for Markers
function markerLoop() {
    if (map && !adminPanel.classList.contains('hidden')) {
        // Removed dead call
    }
    requestAnimationFrame(markerLoop);
}
requestAnimationFrame(markerLoop);

window.renderPlayers = renderPlayers;
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
                    <td class="py-3 text-right">
                        <button class="bg-white/5 hover:bg-white/10 p-1.5 rounded" onclick="post('action', {type:'server', action:'get_transaction_details', id:'${t.id}'})"><i class="fa-solid fa-circle-info"></i></button>
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
            { i: 'fa-ban', l: _L('ui_ban') || 'Bannir', a: 'ban', c: 'action-slot-ban' }
        ],
        'cat-economy': [
            { i: 'fa-box-open', l: _L('ui_inventory') || 'Inventaire', a: 'inventory' },
            { i: 'fa-money-bill-transfer', l: _L('ui_set_money') || 'Set Money', a: 'setmoney' },
            { i: 'fa-hand-holding-dollar', l: _L('ui_give_money') || 'Give Money', a: 'givemoney' },
            { i: 'fa-sack-xmark', l: _L('ui_remove_money') || 'Rem. Money', a: 'removemoney' },
        ],
        'cat-admin': [
            { i: 'fa-user-pen', l: _L('ui_set_job') || 'Set Job', a: 'setjob' },
            { i: 'fa-user-secret', l: _L('ui_set_gang') || 'Modifier Gang', a: 'setgang' },
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
    const essentials = [
        { i: 'fa-wrench', l: 'Réparer', a: 'repair_veh' },
        { i: 'fa-trash', l: 'Supprimer', a: 'dv_veh' },
        { i: 'fa-arrows-rotate', l: 'Retourner', a: 'flip' },
        { i: 'fa-key', l: 'Clés', a: 'give_veh_key' }
    ];
    
    const advanced = [
        { i: 'fa-box-open', l: 'Coffre', a: 'trunk' },
        { i: 'fa-gas-pump', l: 'Carburant', a: 'fuel' }
    ];

    const essentialGrid = document.getElementById('vehicle-actions-grid');
    const manageGrid = document.getElementById('vehicle-manage-grid');
    
    if (essentialGrid) {
        essentialGrid.innerHTML = '';
        essentials.forEach(act => essentialGrid.appendChild(createSlot(act.i, act.l, () => {
            const target = selectedPlayerId || -1;
            post('action', { type: 'player', action: act.a, target: target });
        })));
    }
    
    if (manageGrid) {
        manageGrid.innerHTML = '';
        advanced.forEach(act => manageGrid.appendChild(createSlot(act.i, act.l, () => {
            const target = selectedPlayerId || -1;
            post('action', { type: 'player', action: act.a, target: target });
        })));
    }
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
        const adminName = (log.firstname || log.lastname) ? `${log.firstname} ${log.lastname}` : 'Console';
        div.className = 'bg-black/60 border border-white/5 p-4 rounded-xl flex flex-col gap-2 shadow-lg';
        div.innerHTML = `
            <div class="flex justify-between items-center border-b border-white/5 pb-2">
                <div class="flex flex-col">
                    <span class="text-[10px] font-black text-admin-gold uppercase tracking-wider">${log.action || 'ACTION'}</span>
                    <span class="text-[8px] font-bold text-white/40 uppercase">Par: ${adminName}</span>
                </div>
                <span class="text-[8px] font-bold text-white/20 uppercase bg-black/40 px-2 py-1 rounded">${log.date || ''}</span>
            </div>
            <p class="text-[10px] text-white/80 italic">"${log.details || log.message || ''}"</p>
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

// Removed redundant syncMapMarkers definition

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

