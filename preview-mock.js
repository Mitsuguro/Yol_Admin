// preview-mock.js — Mock FiveM NUI environment pour preview standalone (file:// ou http local)
// Ce fichier n'est utilisé que pour la prévisualisation. En production FiveM, il peut être retiré.
(function () {
    if (window.__YOL_PREVIEW_MOCK__) return;
    window.__YOL_PREVIEW_MOCK__ = true;

    // ---------- 0. Pré-charge la config par défaut visible dans le panneau Configurations
    // (couleurs, opacités, arrondi) - lue au boot par l'init() inline du index.html
    try {
        const previewCfg = {
            language: 'fr', theme: 'orange', accentColor: '#3B82F6',
            opacity: 92, radius: 8, density: 'normal', fontScale: '1',
            verticalMode: false, blur: true, glow: false,
            bgColor: '#24292E', moduleColor: '#000000',
            sidebarColor: '#000000', topbarColor: '#000000',
            moduleOpacity: 40, sidebarOpacity: 35, bgGradient: true,
            autoRefresh: true, persistTab: true, escClose: true,
            debug: false, tooltips: true,
            confirmKick: true, confirmBan: true, confirmVeh: true, confirmMoney: true,
            richNotif: true, notifSound: false, sounds: false,
            notifPos: 'top-right', notifDuration: 5000, notifStack: 5, notifVolume: 50,
            markerStyle: 'pulse', mapRefresh: 2000,
            colorOnline: '#10B981', colorAdmin: '#3B82F6',
            tracking: true, showOffline: true, showRpNames: true,
            hideIps: false, hideLicenses: false, hideDiscord: false, hideSteam: false,
            anonymous: false, screenshotBlur: false,
            animQuality: 'full', lazy: 'on',
            reduceMotion: false, noBlur: false, cacheAssets: true, mpipFps: 30,
            tabRefresh: 5000, apiTimeout: 10000, maxRetries: 3, logsMax: 500,
            defaultWebhook: '', gcacCompat: true, experimental: false, autoupdate: true,
        };
        localStorage.setItem('yol_admin_config', JSON.stringify(previewCfg));
    } catch (_) { }

    // ---------- 1. Mock GetParentResourceName ----------
    if (typeof window.GetParentResourceName !== 'function') {
        window.GetParentResourceName = function () { return 'Yol_Admin'; };
    }

    // ---------- 2. Intercept fetch vers les endpoints NUI ----------
    // Datasets simulés retournés selon l'endpoint
    const FAKE_VEHICLES = [
        // Berlines
        { model: 'asea',     label: 'Asea',      category: 'sedans',   imported: false },
        { model: 'asterope', label: 'Asterope',  category: 'sedans',   imported: false },
        { model: 'fugitive', label: 'Fugitive',  category: 'sedans',   imported: false },
        { model: 'glendale', label: 'Glendale',  category: 'sedans',   imported: false },
        { model: 'ingot',    label: 'Ingot',     category: 'sedans',   imported: false },
        { model: 'intruder', label: 'Intruder',  category: 'sedans',   imported: false },
        { model: 'oracle',   label: 'Oracle',    category: 'sedans',   imported: false },
        { model: 'premier',  label: 'Premier',   category: 'sedans',   imported: false },
        { model: 'primo',    label: 'Primo',     category: 'sedans',   imported: false },
        { model: 'regina',   label: 'Regina',    category: 'sedans',   imported: false },
        { model: 'stanier',  label: 'Stanier',   category: 'sedans',   imported: false },
        { model: 'stratum',  label: 'Stratum',   category: 'sedans',   imported: false },
        { model: 'tailgater',label: 'Tailgater', category: 'sedans',   imported: false },
        { model: 'warrener', label: 'Warrener',  category: 'sedans',   imported: false },
        { model: 'washington',label:'Washington',category: 'sedans',   imported: false },
        // SUV
        { model: 'baller',   label: 'Baller',    category: 'suvs',     imported: false },
        { model: 'cavalcade',label: 'Cavalcade', category: 'suvs',     imported: false },
        { model: 'contender',label: 'Contender', category: 'suvs',     imported: false },
        { model: 'dubsta',   label: 'Dubsta',    category: 'suvs',     imported: false },
        { model: 'fq2',      label: 'FQ 2',      category: 'suvs',     imported: false },
        { model: 'granger',  label: 'Granger',   category: 'suvs',     imported: false },
        { model: 'huntley',  label: 'Huntley S', category: 'suvs',     imported: false },
        { model: 'landstalker',label:'Landstalker',category: 'suvs',   imported: false },
        { model: 'patriot',  label: 'Patriot',   category: 'suvs',     imported: false },
        { model: 'radi',     label: 'Radius',    category: 'suvs',     imported: false },
        { model: 'rocoto',   label: 'Rocoto',    category: 'suvs',     imported: false },
        // Sport
        { model: 'alpha',    label: 'Alpha',     category: 'sports',   imported: false },
        { model: 'banshee',  label: 'Banshee',   category: 'sports',   imported: false },
        { model: 'buffalo',  label: 'Buffalo',   category: 'sports',   imported: false },
        { model: 'carbonizzare',label:'Carbonizzare',category:'sports',imported: false },
        { model: 'comet2',   label: 'Comet',     category: 'sports',   imported: false },
        { model: 'coquette', label: 'Coquette',  category: 'sports',   imported: false },
        { model: 'feltzer2', label: 'Feltzer',   category: 'sports',   imported: false },
        { model: 'furoregt', label: 'Furore GT', category: 'sports',   imported: false },
        { model: 'jester',   label: 'Jester',    category: 'sports',   imported: false },
        { model: 'kuruma',   label: 'Kuruma',    category: 'sports',   imported: false },
        { model: 'lynx',     label: 'Lynx',      category: 'sports',   imported: false },
        { model: 'massacro', label: 'Massacro',  category: 'sports',   imported: false },
        { model: 'rapidgt',  label: 'Rapid GT',  category: 'sports',   imported: false },
        { model: 'sultanrs', label: 'Sultan RS', category: 'sports',   imported: false },
        { model: 'verlierer2',label: 'Verlierer',category: 'sports',   imported: false },
        // Supers
        { model: 'adder',    label: 'Adder',     category: 'super',    imported: false },
        { model: 'banshee2', label: 'Banshee 900R',category: 'super',  imported: false },
        { model: 'bullet',   label: 'Bullet',    category: 'super',    imported: false },
        { model: 'cheetah',  label: 'Cheetah',   category: 'super',    imported: false },
        { model: 'entityxf', label: 'Entity XF', category: 'super',    imported: false },
        { model: 'infernus', label: 'Infernus',  category: 'super',    imported: false },
        { model: 'osiris',   label: 'Osiris',    category: 'super',    imported: false },
        { model: 'reaper',   label: 'Reaper',    category: 'super',    imported: false },
        { model: 't20',      label: 'T20',       category: 'super',    imported: false },
        { model: 'turismor', label: 'Turismo R', category: 'super',    imported: false },
        { model: 'vacca',    label: 'Vacca',     category: 'super',    imported: false },
        { model: 'voltic',   label: 'Voltic',    category: 'super',    imported: false },
        { model: 'zentorno', label: 'Zentorno',  category: 'super',    imported: false },
        // Motos
        { model: 'akuma',    label: 'Akuma',     category: 'motorcycles',imported: false },
        { model: 'bati',     label: 'Bati 801',  category: 'motorcycles',imported: false },
        { model: 'carbonrs', label: 'Carbon RS', category: 'motorcycles',imported: false },
        { model: 'double',   label: 'Double T',  category: 'motorcycles',imported: false },
        { model: 'hakuchou', label: 'Hakuchou',  category: 'motorcycles',imported: false },
        { model: 'pcj',      label: 'PCJ 600',   category: 'motorcycles',imported: false },
        { model: 'ruffian',  label: 'Ruffian',   category: 'motorcycles',imported: false },
        { model: 'sanchez',  label: 'Sanchez',   category: 'motorcycles',imported: false },
        { model: 'vader',    label: 'Vader',     category: 'motorcycles',imported: false },
        // Imports custom
        { model: 'gtr34',    label: 'Skyline GTR R34', category: 'sports', imported: true, resource: 'gc_pack_jdm' },
        { model: 'supra2020',label: 'Toyota Supra 2020',category:'sports', imported: true, resource: 'gc_pack_jdm' },
        { model: 'mclaren720',label:'McLaren 720S',category:'super',imported: true, resource: 'gc_pack_exotic' },
        { model: 'lamborghini_huracan',label:'Lambo Huracán',category:'super',imported: true, resource: 'gc_pack_exotic' }
    ];

    const FAKE_INVENTORY = [
        { name: 'water',     label: 'Bouteille d\'eau', count: 5, slot: 1, weight: 200,  metadata: {} },
        { name: 'bread',     label: 'Pain',             count: 3, slot: 2, weight: 150,  metadata: {} },
        { name: 'phone',     label: 'Téléphone',        count: 1, slot: 3, weight: 200,  metadata: { battery: 78 } },
        { name: 'radio',     label: 'Radio',            count: 1, slot: 4, weight: 300,  metadata: {} },
        { name: 'bandage',   label: 'Bandage',          count: 8, slot: 5, weight: 50,   metadata: {} },
        { name: 'cash',      label: 'Argent',           count: 4250, slot: 6, weight: 0, metadata: {} },
        { name: 'lockpick',  label: 'Crochet',          count: 2, slot: 7, weight: 100,  metadata: {} },
        { name: 'weapon_pistol', label: 'Pistolet',     count: 1, slot: 8, weight: 1000, metadata: { ammo: 17, serial: 'AB12CD34' } },
        { name: 'ammo_pistol', label: 'Munitions 9mm',  count: 50, slot: 9, weight: 10,  metadata: {} }
    ];

    const FAKE_INV_PLAYERS = window.__demoPlayersCache || []; // rempli juste après

    const FAKE_ZONES = [
        { id: 1, name: 'Safe Zone Spawn', center: { x: -425.0, y: -1140.0, z: 30.0 }, radius: 50, color: '#10b981', flags: { no_weapon: true, godmode: true } },
        { id: 2, name: 'PvP Arena',       center: { x: 1145.0, y: -3196.0, z: 6.0 },  radius: 80, color: '#dc2626', flags: { no_weapon: false } },
        { id: 3, name: 'Hospital Pillbox',center: { x: 295.0, y: -1446.0, z: 30.0 },  radius: 40, color: '#3b82f6', flags: { no_weapon: true } },
        { id: 4, name: 'LSPD Mission Row',center: { x: 425.0, y: -979.0, z: 30.0 },   radius: 60, color: '#f04c00', flags: {} }
    ];

    const origFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        try {
            const url = (typeof input === 'string') ? input : (input && input.url) || '';
            const m = url.match(/^https?:\/\/Yol_Admin\/(.+)$/i);
            if (m) {
                const endpoint = m[1].split('?')[0];
                let payload = {};
                switch (endpoint) {
                    case 'get_all_vehicles':
                        payload = FAKE_VEHICLES;
                        break;
                    case 'get_player_inventory':
                        payload = FAKE_INVENTORY;
                        // trigger l'UI grid d'inspection
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_INVENTORY',
                            items: FAKE_INVENTORY
                        }, '*'), 50);
                        break;
                    case 'search_inventory_players':
                        payload = window.__demoPlayersCache || [];
                        // trigger l'event que l'UI attend
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_INV_RESULTS',
                            players: window.__demoPlayersCache || []
                        }, '*'), 50);
                        break;
                    case 'get_eco_data':
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_ECO',
                            data: window.__demoEcoData
                        }, '*'), 100);
                        break;
                    case 'get_fleet_data':
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_FLEET',
                            data: window.__demoFleetData
                        }, '*'), 100);
                        break;
                    case 'get_zones':
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_ZONES',
                            zones: FAKE_ZONES
                        }, '*'), 100);
                        break;
                    case 'get_bot_status':
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_BOT_STATUS',
                            status: 'offline',
                            config: { token: '', guildId: '', channelLogs: '' }
                        }, '*'), 100);
                        break;
                    case 'doorlock:getDoors':
                        setTimeout(() => window.postMessage({
                            type: 'UPDATE_DOORLOCKS',
                            doors: window.__demoDoorsCache || []
                        }, '*'), 150);
                        break;
                    case 'doorlock:toggleState': {
                        const body = init && init.body ? JSON.parse(init.body) : {};
                        if (body && body.id != null) {
                            setTimeout(() => window.postMessage({
                                type: 'UPDATE_DOORLOCK_STATE',
                                id: body.id,
                                state: body.state
                            }, '*'), 80);
                        }
                        break;
                    }
                    case 'request_lazy_data': {
                        const body = init && init.body ? JSON.parse(init.body) : {};
                        setTimeout(() => window.postMessage({
                            type: 'RECEIVE_LAZY_DATA',
                            dataset: body.dataset,
                            payload: body.dataset === 'items' ? (window.__demoItemsCache || [])
                                  : body.dataset === 'logs'  ? (window.__demoLogsCache  || [])
                                  : body.dataset === 'resources' ? (window.__demoResourcesCache || [])
                                  : []
                        }, '*'), 100);
                        break;
                    }
                }
                return Promise.resolve(new Response(JSON.stringify(payload), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
        } catch (_) { }
        return origFetch(input, init);
    };

    // ---------- 3. Mock MainRender (script.js Three.js n'est pas chargé) ----------
    window.MainRender = window.MainRender || {
        renderToTarget: function () { },
        stop: function () { }
    };

    // ---------- 4. Boot : background visible + SHOW_MENU ----------
    function bootPreview() {
        // Background visible : sans FiveM derrière, le body transparent montre du blanc
        const bgStyle = document.createElement('style');
        bgStyle.textContent = `
            html, body { background: #0a0a0a !important; }
            body::before {
                content: '';
                position: fixed; inset: 0;
                background: url('bg.jpg') center center / cover no-repeat;
                opacity: 0.7;
                z-index: -1;
                pointer-events: none;
            }
        `;
        document.head.appendChild(bgStyle);

        // Traductions FR extraites de locales/fr.lua
        const localesFR = {
            "admin_menu": "Menu Admin",
            "error": "Erreur",
            "success": "Succès",
            "info": "Information",
            "action_success": "L'action a été effectuée avec succès.",
            "action_error": "Une erreur est survenue lors de l'action.",
            "no_permission": "Vous n'avez pas la permission d'utiliser cette commande.",
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
            "ui_dashboard": "Tableau de Bord",
            "ui_players": "Joueurs",
            "ui_server": "Serveur",
            "ui_vehicles": "Véhicules",
            "ui_logs": "Logs",
            "ui_settings": "Paramètres",
            "ui_search": "Rechercher...",
            "ui_online": "En Ligne",
            "ui_offline": "Hors-Ligne",
            "ui_actions": "Actions",
            "ui_inventory": "Inventaire",
            "ui_stats": "Statistiques",
            "ui_kick": "Kick",
            "ui_ban": "Ban",
            "ui_warn": "Warn",
            "ui_revive": "Revive",
            "ui_heal": "Soigner",
            "ui_goto": "Aller À",
            "ui_bring": "Ramener",
            "ui_freeze": "Freeze",
            "ui_spectate": "Spectate",
            "ui_needs": "Besoins",
            "ui_kill": "Kill",
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
            "ui_heal_action": "Heal",
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
            "ui_set_money": "Set Argent",
            "ui_give_money": "Give Argent",
            "ui_remove_money": "Retirer $",
            "ui_set_job": "Set Job",
            "ui_set_group": "Set Group",
            "ui_set_model": "Set Model",
            "ui_jail": "Jail",
            "ui_repair": "Réparer",
            "ui_wash": "Laver",
            "ui_delete": "Supprimer",
            "ui_flip": "Retourner",
            "ui_engine": "Moteur",
            "ui_plate": "Plaque",
            "ui_lock": "Verrou",
            "ui_boost": "Boost",
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

        // Envoi du SHOW_MENU avec config minimale pour afficher le panneau
        const cfg = {
            locales: localesFR,
            userPerms: ['*'],
            anticheatActive: false,
            loadingscreenAvailable: true,
            staffName: 'Preview Admin',
            gangs: [],
            drugs: [],
            ui: {
                PrimaryGradient: '#3B82F6',
                SecondaryGradient: '#3B82F6',
                OutlineColor: 'rgba(59, 130, 246, 0.9)'
            },
            richPresence: {}
        };

        // ============== JOUEURS DÉMO ==============
        const demoPlayers = [
            { id: 1,  name: 'Lucas Martin',       rpName: 'Lucas Martin',       job: 'police',      grade: 4, coords: { x: 425.1, y: -979.5, z: 30.7 },   health: 200, armor: 100, identifiers: ['steam:110000112345abc', 'license:abc123def', 'discord:284729385729'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 42 },
            { id: 2,  name: 'Sophie Dubois',      rpName: 'Sophie Dubois',      job: 'ambulance',   grade: 3, coords: { x: 295.5, y: -1446.4, z: 29.9 },  health: 180, armor: 50,  identifiers: ['steam:110000122456bcd', 'license:bcd234efg', 'discord:294839485729'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 58 },
            { id: 3,  name: 'Marc Bernard',       rpName: 'Marc "Skull" Bernard', job: 'unemployed', grade: 0, coords: { x: -1037.5, y: -2737.6, z: 20.2 }, health: 200, armor: 0,   identifiers: ['steam:110000132567cde', 'license:cde345fgh', 'discord:304938291847'], online: true,  handcuffed: true,  frozen: false, dead: false, ping: 71 },
            { id: 4,  name: 'Emma Leroy',         rpName: 'Emma Leroy',         job: 'mechanic',    grade: 2, coords: { x: -211.0, y: -1322.3, z: 31.3 },  health: 200, armor: 30,  identifiers: ['steam:110000142678def', 'license:def456ghi', 'discord:482917392847'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 35 },
            { id: 5,  name: 'Thomas Petit',       rpName: 'Tommy P',            job: 'taxi',        grade: 1, coords: { x: 902.5, y: -169.1, z: 74.1 },    health: 165, armor: 0,   identifiers: ['steam:110000152789efg', 'license:efg567hij', 'discord:583927481629'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 48 },
            { id: 6,  name: 'Léa Moreau',         rpName: 'Léa Moreau',         job: 'realestate',  grade: 3, coords: { x: -119.4, y: -606.7, z: 36.3 },   health: 200, armor: 0,   identifiers: ['steam:110000162890fgh', 'license:fgh678ijk', 'discord:694028592741'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 28 },
            { id: 7,  name: 'Hugo Garnier',       rpName: 'Hugo "Drift" Garnier', job: 'tuner',     grade: 4, coords: { x: 1145.6, y: -3196.6, z: 6.0 },   health: 200, armor: 75,  identifiers: ['steam:110000172901ghi', 'license:ghi789jkl', 'discord:705139603852'], online: true,  handcuffed: false, frozen: true,  dead: false, ping: 95 },
            { id: 8,  name: 'Camille Roux',       rpName: 'Camille R.',         job: 'lawyer',      grade: 5, coords: { x: -1389.5, y: -468.8, z: 72.0 },  health: 200, armor: 0,   identifiers: ['steam:110000183012hij', 'license:hij890klm', 'discord:816240714963'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 22 },
            { id: 9,  name: 'Antoine Faure',      rpName: 'Tony Faure',         job: 'civilian',    grade: 0, coords: { x: -47.3, y: -1758.4, z: 29.4 },   health: 0,   armor: 0,   identifiers: ['steam:110000193123ijk', 'license:ijk901lmn', 'discord:927351825074'], online: true,  handcuffed: false, frozen: false, dead: true,  ping: 67 },
            { id: 10, name: 'Julie Chevalier',    rpName: 'Julie C.',           job: 'police',      grade: 2, coords: { x: 441.8, y: -982.3, z: 30.7 },    health: 200, armor: 100, identifiers: ['steam:110000204234jkl', 'license:jkl012mno', 'discord:038462936185'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 45 },
            { id: 11, name: 'Nathan Lemaire',     rpName: 'Nate L.',            job: 'civilian',    grade: 0, coords: { x: 1729.2, y: 6414.1, z: 35.0 },   health: 150, armor: 0,   identifiers: ['steam:110000215345klm', 'license:klm123nop', 'discord:149573047296'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 88 },
            { id: 12, name: 'Manon Picard',       rpName: 'Manon P.',           job: 'journalist',  grade: 2, coords: { x: -598.5, y: -928.2, z: 23.9 },   health: 200, armor: 0,   identifiers: ['steam:110000226456lmn', 'license:lmn234opq', 'discord:250684158307'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 33 },
            { id: 13, name: 'Romain Lefevre',     rpName: 'Romain "Lefty"',     job: 'mechanic',    grade: 4, coords: { x: -347.3, y: -133.4, z: 39.0 },   health: 200, armor: 50,  identifiers: ['steam:110000237567mno', 'license:mno345pqr', 'discord:361795269418'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 51 },
            { id: 14, name: 'Chloé Vincent',      rpName: 'Chloé V.',           job: 'ambulance',   grade: 1, coords: { x: 1153.6, y: -1526.1, z: 35.4 },  health: 200, armor: 25,  identifiers: ['steam:110000248678nop', 'license:nop456qrs', 'discord:472806370529'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 41 },
            { id: 15, name: 'Mathieu Henry',      rpName: 'Matt "Iron" Henry',  job: 'mafia',       grade: 5, coords: { x: 974.5, y: -141.8, z: 74.4 },    health: 200, armor: 100, identifiers: ['steam:110000259789opq', 'license:opq567rst', 'discord:583917481630'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 76 },
            { id: 16, name: 'Elise Marchand',     rpName: 'Elise M.',           job: 'civilian',    grade: 0, coords: { x: -1845.1, y: -1213.6, z: 13.0 }, health: 200, armor: 0,   identifiers: ['steam:110000260890pqr', 'license:pqr678stu', 'discord:694028592741'], online: false, handcuffed: false, frozen: false, dead: false, ping: 0 },
            { id: 17, name: 'Bastien Girard',     rpName: 'Bast G.',            job: 'farmer',      grade: 2, coords: { x: 2375.4, y: 5183.2, z: 49.3 },   health: 195, armor: 0,   identifiers: ['steam:110000271901qrs', 'license:qrs789tuv', 'discord:705139603852'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 110 },
            { id: 18, name: 'Sarah Nicolas',      rpName: 'Sarah N.',           job: 'doctor',      grade: 4, coords: { x: 309.4, y: -593.3, z: 43.3 },    health: 200, armor: 0,   identifiers: ['steam:110000282012rst', 'license:rst890uvw', 'discord:816240714963'], online: true,  handcuffed: false, frozen: false, dead: false, ping: 26 }
        ];

        // ============== JOBS / GANGS / DRUGS ==============
        const demoJobs = [
            { name: 'unemployed', label: 'Sans emploi',  grades: [{ grade: 0, label: 'Chômeur' }] },
            { name: 'civilian',   label: 'Civil',        grades: [{ grade: 0, label: 'Citoyen' }, { grade: 1, label: 'Résident' }] },
            { name: 'police',     label: 'LSPD',         grades: [{ grade: 0, label: 'Cadet' }, { grade: 1, label: 'Officier' }, { grade: 2, label: 'Sergent' }, { grade: 3, label: 'Lieutenant' }, { grade: 4, label: 'Chef' }] },
            { name: 'ambulance',  label: 'EMS',          grades: [{ grade: 0, label: 'Étudiant' }, { grade: 1, label: 'Interne' }, { grade: 2, label: 'Médecin' }, { grade: 3, label: 'Chirurgien' }, { grade: 4, label: 'Directeur' }] },
            { name: 'doctor',     label: 'Hôpital',      grades: [{ grade: 0, label: 'Stagiaire' }, { grade: 1, label: 'Médecin' }, { grade: 4, label: 'Chef de Service' }] },
            { name: 'mechanic',   label: 'Mécanicien',   grades: [{ grade: 0, label: 'Apprenti' }, { grade: 2, label: 'Mécano' }, { grade: 4, label: 'Patron' }] },
            { name: 'taxi',       label: 'Taxi',         grades: [{ grade: 0, label: 'Chauffeur' }, { grade: 1, label: 'Vétéran' }] },
            { name: 'lawyer',     label: 'Avocat',       grades: [{ grade: 0, label: 'Étudiant' }, { grade: 5, label: 'Partner' }] },
            { name: 'realestate', label: 'Immobilier',   grades: [{ grade: 0, label: 'Agent' }, { grade: 3, label: 'Directeur' }] },
            { name: 'tuner',      label: 'Tuner Shop',   grades: [{ grade: 0, label: 'Apprenti' }, { grade: 4, label: 'Boss' }] },
            { name: 'farmer',     label: 'Fermier',      grades: [{ grade: 0, label: 'Ouvrier' }, { grade: 2, label: 'Patron' }] },
            { name: 'journalist', label: 'Journaliste',  grades: [{ grade: 0, label: 'Stagiaire' }, { grade: 2, label: 'Reporter' }] },
            { name: 'mafia',      label: 'Mafia',        grades: [{ grade: 0, label: 'Soldat' }, { grade: 3, label: 'Caporegime' }, { grade: 5, label: 'Don' }] }
        ];

        const demoGangs = [
            { name: 'ballas',     label: 'Ballas',       color: '#9333ea' },
            { name: 'families',   label: 'Families',     color: '#16a34a' },
            { name: 'vagos',      label: 'Vagos',        color: '#eab308' },
            { name: 'lostmc',     label: 'Lost MC',      color: '#dc2626' },
            { name: 'marabunta',  label: 'Marabunta',    color: '#0891b2' }
        ];

        const demoDrugs = [
            { name: 'weed',       label: 'Cannabis',     price: 250 },
            { name: 'coke',       label: 'Cocaïne',      price: 850 },
            { name: 'meth',       label: 'Méthamphétamine', price: 1200 },
            { name: 'heroin',     label: 'Héroïne',      price: 1500 },
            { name: 'opium',      label: 'Opium',        price: 950 },
            { name: 'ecstasy',    label: 'Ecstasy',      price: 600 }
        ];

        // ============== ITEMS (inventaire serveur) ==============
        const demoItems = [
            { name: 'water',         label: 'Bouteille d\'eau',    weight: 200,  rare: false, canRemove: true },
            { name: 'bread',         label: 'Pain',                weight: 150,  rare: false, canRemove: true },
            { name: 'sandwich',      label: 'Sandwich',            weight: 350,  rare: false, canRemove: true },
            { name: 'cola',          label: 'eCola',               weight: 250,  rare: false, canRemove: true },
            { name: 'beer',          label: 'Bière',               weight: 500,  rare: false, canRemove: true },
            { name: 'whisky',        label: 'Whisky',              weight: 800,  rare: false, canRemove: true },
            { name: 'phone',         label: 'Téléphone',           weight: 200,  rare: false, canRemove: true },
            { name: 'radio',         label: 'Radio',               weight: 300,  rare: false, canRemove: true },
            { name: 'lockpick',      label: 'Crochet',             weight: 100,  rare: false, canRemove: true },
            { name: 'rope',          label: 'Corde',               weight: 500,  rare: false, canRemove: true },
            { name: 'bandage',       label: 'Bandage',             weight: 50,   rare: false, canRemove: true },
            { name: 'medkit',        label: 'Trousse médicale',    weight: 800,  rare: false, canRemove: true },
            { name: 'cash',          label: 'Argent liquide',      weight: 0,    rare: false, canRemove: true },
            { name: 'black_money',   label: 'Argent sale',         weight: 0,    rare: true,  canRemove: true },
            { name: 'gold_bar',      label: 'Lingot d\'or',        weight: 5000, rare: true,  canRemove: true },
            { name: 'diamond',       label: 'Diamant',             weight: 50,   rare: true,  canRemove: true },
            { name: 'rolex',         label: 'Rolex',               weight: 100,  rare: true,  canRemove: true },
            { name: 'weapon_pistol', label: 'Pistolet',            weight: 1000, rare: false, canRemove: true },
            { name: 'weapon_smg',    label: 'SMG',                 weight: 3000, rare: true,  canRemove: true },
            { name: 'weapon_ak47',   label: 'AK-47',               weight: 4500, rare: true,  canRemove: true },
            { name: 'ammo_pistol',   label: 'Munitions 9mm',       weight: 10,   rare: false, canRemove: true },
            { name: 'ammo_rifle',    label: 'Munitions 5.56',      weight: 15,   rare: false, canRemove: true },
            { name: 'weed_bag',      label: 'Sachet de weed',      weight: 100,  rare: true,  canRemove: true },
            { name: 'coke_bag',      label: 'Sachet de coke',      weight: 80,   rare: true,  canRemove: true },
            { name: 'meth_bag',      label: 'Sachet de meth',      weight: 80,   rare: true,  canRemove: true },
            { name: 'fish',          label: 'Poisson',             weight: 600,  rare: false, canRemove: true },
            { name: 'meat',          label: 'Viande',              weight: 800,  rare: false, canRemove: true },
            { name: 'wood',          label: 'Bois',                weight: 1500, rare: false, canRemove: true },
            { name: 'iron',          label: 'Fer',                 weight: 1200, rare: false, canRemove: true },
            { name: 'copper',        label: 'Cuivre',              weight: 1000, rare: false, canRemove: true },
            { name: 'gold',          label: 'Or brut',             weight: 800,  rare: true,  canRemove: true },
            { name: 'gas_can',       label: 'Bidon d\'essence',    weight: 2000, rare: false, canRemove: true },
            { name: 'repair_kit',    label: 'Kit de réparation',   weight: 1500, rare: false, canRemove: true },
            { name: 'binoculars',    label: 'Jumelles',            weight: 400,  rare: false, canRemove: true },
            { name: 'cigarette',     label: 'Cigarettes',          weight: 50,   rare: false, canRemove: true },
            { name: 'lighter',       label: 'Briquet',             weight: 30,   rare: false, canRemove: true }
        ];

        // ============== LOGS STAFF ==============
        const _now = Date.now();
        const _mkLog = (off, type, admin, target, action, reason) => ({
            id: _now - off,
            time: new Date(_now - off).toISOString(),
            timestamp: _now - off,
            type: type,
            admin: admin,
            target: target,
            action: action,
            reason: reason || ''
        });
        const demoLogs = [
            _mkLog(60000,      'kick',   'AdminYol',     'Marc Bernard',     'Kick',          'AFK depuis 30min'),
            _mkLog(180000,     'ban',    'AdminYol',     'CheaterX',         'Ban permanent', 'Aimbot détecté par anti-cheat'),
            _mkLog(360000,     'warn',   'ModoSarah',    'Antoine Faure',    'Warn',          'Insulte sur le chat OOC'),
            _mkLog(600000,     'jail',   'AdminYol',     'Mathieu Henry',    'Jail 30min',    'Combat log'),
            _mkLog(900000,     'revive', 'EMSChief',     'Sophie Dubois',    'Revive',        'Bug de réanimation'),
            _mkLog(1500000,    'heal',   'AdminYol',     'Lucas Martin',     'Heal',          'Test commande'),
            _mkLog(2400000,    'tp',     'ModoSarah',    'Nathan Lemaire',   'Teleport',      'Bloqué sous map'),
            _mkLog(3600000,    'money',  'AdminYol',     'Hugo Garnier',     'Set Money 5000', 'Compensation bug bank'),
            _mkLog(5400000,    'item',   'AdminYol',     'Camille Roux',     'Give item: bandage x10', 'Restock test'),
            _mkLog(7200000,    'noclip', 'AdminYol',     'self',             'Noclip ON',     ''),
            _mkLog(10800000,   'spawn',  'ModoSarah',    'self',             'Spawn adder',   'Test véhicule'),
            _mkLog(14400000,   'kick',   'ModoSarah',    'GriefBoy42',       'Kick',          'Pneus crevés à des innocents'),
            _mkLog(21600000,   'ban',    'AdminYol',     'DupeBugger',       'Ban 7j',        'Exploit dupe argent'),
            _mkLog(28800000,   'warn',   'ModoSarah',    'Romain Lefevre',   'Warn',          'RDM en zone safe'),
            _mkLog(43200000,   'jail',   'AdminYol',     'Bastien Girard',   'Jail 15min',    'Powergaming'),
            _mkLog(64800000,   'spec',   'ModoSarah',    'Mathieu Henry',    'Spectate',      'Suspect de cheat'),
            _mkLog(86400000,   'heal',   'EMSChief',     'Léa Moreau',       'Heal',          'Bug de soin EMS'),
            _mkLog(129600000,  'reload', 'AdminYol',     'system',           'Restart resource: es_extended', ''),
            _mkLog(172800000,  'ban',    'AdminYol',     'ToxicPlayer',      'Ban permanent', 'Récidive insultes racistes'),
            _mkLog(216000000,  'tp',     'AdminYol',     'Julie Chevalier',  'Bring',         'Aide intervention')
        ];

        // ============== RESOURCES SERVEUR ==============
        const demoResources = [
            { name: 'es_extended',           status: 'started', version: '1.10.6' },
            { name: 'ox_lib',                status: 'started', version: '3.18.0' },
            { name: 'ox_inventory',          status: 'started', version: '2.43.2' },
            { name: 'ox_target',             status: 'started', version: '1.13.0' },
            { name: 'ox_doorlock',           status: 'started', version: '1.5.0' },
            { name: 'oxmysql',               status: 'started', version: '2.10.1' },
            { name: 'Yol_Admin',             status: 'started', version: '2.0.0' },
            { name: 'Yol_Anticheat',         status: 'started', version: '1.4.2' },
            { name: 'Yol_Clothing',          status: 'started', version: '1.2.0' },
            { name: 'PolyZone',              status: 'started', version: '1.0.0' },
            { name: 'spawnmanager',          status: 'started', version: '1.0.0' },
            { name: 'sessionmanager',        status: 'started', version: '1.0.0' },
            { name: 'chat',                  status: 'started', version: '1.0.0' },
            { name: 'mapmanager',            status: 'started', version: '1.0.0' },
            { name: 'fivem',                 status: 'started', version: '1.0.0' },
            { name: 'hardcap',               status: 'started', version: '1.0.0' },
            { name: 'rconlog',               status: 'started', version: '1.0.0' },
            { name: 'scoreboard',            status: 'started', version: '1.0.0' },
            { name: 'webpack',               status: 'started', version: '1.0.0' },
            { name: 'screenshot-basic',      status: 'started', version: '1.0.0' },
            { name: 'pma-voice',             status: 'started', version: '7.1.0' },
            { name: 'qb-target',             status: 'stopped', version: '1.0.0' },
            { name: 'old_inventory',         status: 'stopped', version: '0.9.0' },
            { name: 'broken_resource',       status: 'error',   version: 'N/A' },
            { name: 'esx_jobs',              status: 'started', version: '1.6.0' },
            { name: 'esx_society',           status: 'started', version: '1.6.0' },
            { name: 'esx_addonaccount',      status: 'started', version: '1.0.0' },
            { name: 'esx_billing',           status: 'started', version: '1.0.0' },
            { name: 'esx_garage',            status: 'started', version: '1.0.0' },
            { name: 'esx_vehicleshop',       status: 'started', version: '1.0.0' },
            { name: 'esx_phone',             status: 'started', version: '1.0.0' },
            { name: 'esx_realestate',        status: 'started', version: '1.0.0' },
            { name: 'esx_status',            status: 'started', version: '1.0.0' },
            { name: 'esx_basicneeds',        status: 'started', version: '1.0.0' },
            { name: 'esx_menu_default',      status: 'started', version: '1.0.0' },
            { name: 'esx_menu_dialog',       status: 'started', version: '1.0.0' },
            { name: 'esx_menu_list',         status: 'started', version: '1.0.0' },
            { name: 'esx_skin',              status: 'started', version: '1.0.0' },
            { name: 'skinchanger',           status: 'started', version: '1.0.0' },
            { name: 'mysql-async',           status: 'stopped', version: '3.3.6' },
            { name: 'baseevents',            status: 'started', version: '1.0.0' },
            { name: 'monitor',               status: 'started', version: '1.0.0' },
            { name: 'txAdmin',               status: 'started', version: '7.2.2' }
        ];

        // ============== FLOTTE VÉHICULES ==============
        const demoVehicles = [
            { plate: 'LSPD 001', model: 'police3',  ownerName: 'Lucas Martin',     status: 'out',    health: 95 },
            { plate: 'LSPD 002', model: 'police2',  ownerName: 'Julie Chevalier',  status: 'out',    health: 88 },
            { plate: 'LSPD 003', model: 'police',   ownerName: 'LSPD',             status: 'garage', health: 100 },
            { plate: 'EMS  001', model: 'ambulance',ownerName: 'Sophie Dubois',    status: 'out',    health: 72 },
            { plate: 'EMS  002', model: 'lguard',   ownerName: 'Chloé Vincent',    status: 'out',    health: 100 },
            { plate: 'EMS  003', model: 'ambulance',ownerName: 'EMS',              status: 'garage', health: 60 },
            { plate: 'FIRE 001', model: 'firetruk', ownerName: 'Pompiers',         status: 'garage', health: 100 },
            { plate: 'AB123CD',  model: 'adder',    ownerName: 'Mathieu Henry',    status: 'out',    health: 100 },
            { plate: 'EF456GH',  model: 'sultanrs', ownerName: 'Hugo Garnier',     status: 'out',    health: 45 },
            { plate: 'IJ789KL',  model: 'kuruma',   ownerName: 'Marc Bernard',     status: 'garage', health: 25 },
            { plate: 'MN012OP',  model: 'comet5',   ownerName: 'Camille Roux',     status: 'garage', health: 100 },
            { plate: 'QR345ST',  model: 'baller',   ownerName: 'Léa Moreau',       status: 'out',    health: 90 },
            { plate: 'UV678WX',  model: 'taxi',     ownerName: 'Thomas Petit',     status: 'out',    health: 78 },
            { plate: 'YZ901AB',  model: 'sandking', ownerName: 'Bastien Girard',   status: 'garage', health: 65 },
            { plate: 'CD234EF',  model: 'banshee',  ownerName: 'Romain Lefevre',   status: 'out',    health: 50 },
            { plate: 'GH567IJ',  model: 'futo',     ownerName: 'Nathan Lemaire',   status: 'garage', health: 100 },
            { plate: 'KL890MN',  model: 'panto',    ownerName: 'Manon Picard',     status: 'garage', health: 95 },
            { plate: 'OP123QR',  model: 'jester',   ownerName: 'Antoine Faure',    status: 'out',    health: 15 },
            { plate: 'ST456UV',  model: 'oracle',   ownerName: 'Sarah Nicolas',    status: 'garage', health: 100 },
            { plate: 'WX789YZ',  model: 't20',      ownerName: 'Elise Marchand',   status: 'garage', health: 100 }
        ];

        // ============== ANNONCES ==============
        const demoAnnouncements = [
            { id: 1, author: 'AdminYol',  message: 'Bienvenue sur GrandCity ! Lisez le règlement avant de jouer.', timestamp: _now - 3600000 },
            { id: 2, author: 'ModoSarah', message: 'Event Course de rue ce soir 21h au Cypress Flats !',          timestamp: _now - 7200000 },
            { id: 3, author: 'AdminYol',  message: 'Maintenance prévue demain 6h-8h du matin.',                   timestamp: _now - 14400000 }
        ];

        cfg.gangs = demoGangs;
        cfg.drugs = demoDrugs;

        // ============== INVENTORY CREATOR (items & shops) ==============
        const demoCreatorItems = {};
        demoItems.forEach(it => {
            demoCreatorItems[it.name] = {
                label: it.label,
                weight: it.weight,
                rare: it.rare,
                close: !it.canRemove,
                description: ''
            };
        });

        const demoCreatorShops = {
            'general_24_7': {
                name: '24/7',
                blip: { sprite: 52, color: 2, scale: 0.8 },
                locations: [{ x: 25.7, y: -1347.3, z: 29.5 }, { x: -3038.9, y: 585.9, z: 7.9 }],
                inventory: [
                    { name: 'water', price: 5 },
                    { name: 'bread', price: 8 },
                    { name: 'sandwich', price: 15 },
                    { name: 'cola', price: 5 },
                    { name: 'phone', price: 250 },
                    { name: 'bandage', price: 25 }
                ]
            },
            'liquor_store': {
                name: 'LTD Gasoline',
                blip: { sprite: 76, color: 5, scale: 0.7 },
                locations: [{ x: 1135.8, y: -982.3, z: 46.4 }],
                inventory: [
                    { name: 'beer', price: 12 },
                    { name: 'whisky', price: 80 },
                    { name: 'cigarette', price: 8 },
                    { name: 'lighter', price: 3 }
                ]
            },
            'ammunation': {
                name: 'Ammu-Nation',
                blip: { sprite: 110, color: 1, scale: 0.9 },
                locations: [{ x: -662.1, y: -935.3, z: 21.8 }],
                inventory: [
                    { name: 'weapon_pistol', price: 4500 },
                    { name: 'ammo_pistol', price: 5 },
                    { name: 'ammo_rifle', price: 8 }
                ]
            },
            'tool_shop': {
                name: 'Hardware Store',
                blip: { sprite: 402, color: 3, scale: 0.7 },
                locations: [{ x: 2748.5, y: 3473.4, z: 55.7 }],
                inventory: [
                    { name: 'lockpick', price: 350 },
                    { name: 'rope', price: 75 },
                    { name: 'repair_kit', price: 1200 },
                    { name: 'gas_can', price: 450 }
                ]
            }
        };

        // ============== ECO (Financial Intelligence) ==============
        const demoEcoData = {
            totalMoney: 12500000,
            totalBank: 87340000,
            totalBlack: 2150000,
            topFortunes: [
                { name: 'Mathieu Henry',   job: 'mafia',     total: 8750000, identifier: 'steam:110000259789opq' },
                { name: 'Camille Roux',    job: 'lawyer',    total: 6200000, identifier: 'steam:110000183012hij' },
                { name: 'Léa Moreau',      job: 'realestate',total: 4850000, identifier: 'steam:110000162890fgh' },
                { name: 'Hugo Garnier',    job: 'tuner',     total: 3650000, identifier: 'steam:110000172901ghi' },
                { name: 'Romain Lefevre',  job: 'mechanic',  total: 2950000, identifier: 'steam:110000237567mno' }
            ],
            transactions: [
                { date: '2026-05-31 14:32', from: 'Mathieu Henry',   to: 'Camille Roux',    amount: 250000, fromIdentifier: 'steam:110000259789opq' },
                { date: '2026-05-31 13:18', from: 'Lucas Martin',    to: 'Sophie Dubois',   amount: 1200,   fromIdentifier: 'steam:110000112345abc' },
                { date: '2026-05-31 12:45', from: 'Léa Moreau',      to: 'Emma Leroy',      amount: 85000,  fromIdentifier: 'steam:110000162890fgh' },
                { date: '2026-05-31 11:02', from: 'Hugo Garnier',    to: 'Romain Lefevre',  amount: 45000,  fromIdentifier: 'steam:110000172901ghi' },
                { date: '2026-05-31 09:55', from: 'Antoine Faure',   to: 'Marc Bernard',    amount: 750,    fromIdentifier: 'steam:110000193123ijk' },
                { date: '2026-05-30 22:38', from: 'Thomas Petit',    to: 'Manon Picard',    amount: 320,    fromIdentifier: 'steam:110000152789efg' },
                { date: '2026-05-30 21:14', from: 'Julie Chevalier', to: 'Lucas Martin',    amount: 8500,   fromIdentifier: 'steam:110000204234jkl' },
                { date: '2026-05-30 18:47', from: 'Nathan Lemaire',  to: 'Bastien Girard',  amount: 1850,   fromIdentifier: 'steam:110000215345klm' }
            ]
        };

        // ============== FLEET ==============
        const avgHealth = Math.round(demoVehicles.reduce((s, v) => s + v.health, 0) / demoVehicles.length);
        const out = demoVehicles.filter(v => v.status === 'out').length;
        const demoFleetData = {
            countOut: out,
            countTotal: demoVehicles.length,
            mostUsedPlate: 'LSPD 001',
            avgHealth: avgHealth,
            vehicles: demoVehicles
        };

        // ============== DOORLOCKS ==============
        const demoDoors = [
            { id: 1,  name: 'LSPD - Entrée principale',  state: 1, coords: { x: 434.7, y: -980.6, z: 30.7 },   groups: { police: 0 }, model: -1215222675 },
            { id: 2,  name: 'LSPD - Cellule 1',          state: 1, coords: { x: 461.3, y: -993.6, z: 24.9 },   groups: { police: 2 }, model: 631614199 },
            { id: 3,  name: 'LSPD - Cellule 2',          state: 1, coords: { x: 461.3, y: -996.6, z: 24.9 },   groups: { police: 2 }, model: 631614199 },
            { id: 4,  name: 'LSPD - Armurerie',          state: 1, coords: { x: 452.7, y: -983.7, z: 30.7 },   groups: { police: 3 }, model: -1320876379 },
            { id: 5,  name: 'EMS - Entrée Pillbox',      state: 0, coords: { x: 307.4, y: -1433.5, z: 29.9 },  groups: { ambulance: 0 }, model: -555839968 },
            { id: 6,  name: 'EMS - Salle d\'opération',  state: 1, coords: { x: 333.0, y: -1394.9, z: 32.5 },  groups: { ambulance: 2 }, model: -555839968 },
            { id: 7,  name: 'Mécano - Garage',           state: 0, coords: { x: -347.3, y: -133.4, z: 39.0 },  groups: { mechanic: 0 }, model: -1834160129 },
            { id: 8,  name: 'Mafia - QG porte',          state: 1, coords: { x: 974.5, y: -141.8, z: 74.4 },   groups: { mafia: 3 }, model: -1320876379 },
            { id: 9,  name: 'Casino - VIP',              state: 1, coords: { x: 974.0, y: 70.0, z: 115.0 },    groups: {}, model: -555839968 },
            { id: 10, name: 'Banque centrale - Coffre',  state: 1, coords: { x: 253.7, y: 222.4, z: 102.0 },   groups: { police: 4 }, model: 631614199 },
            { id: 11, name: 'Aéroport - Hangar 1',       state: 0, coords: { x: -1090.5, y: -3000.8, z: 13.5 }, groups: {}, model: -1215222675 },
            { id: 12, name: 'Avocat - Cabinet',          state: 0, coords: { x: -1389.5, y: -468.8, z: 72.0 }, groups: { lawyer: 0 }, model: -1834160129 },
            { id: 13, name: 'Tuner Shop - Atelier',      state: 0, coords: { x: 1145.6, y: -3196.6, z: 6.0 },  groups: { tuner: 0 }, model: -555839968 },
            { id: 14, name: 'Ferme - Grange',            state: 0, coords: { x: 2375.4, y: 5183.2, z: 49.3 },  groups: { farmer: 0 }, model: -1320876379 },
            { id: 15, name: 'Prison - Cellule A1',       state: 1, coords: { x: 1690.5, y: 2565.8, z: 45.6 },  groups: { police: 1 }, model: 631614199 }
        ];

        // Stocke pour le fetch interceptor
        window.__demoPlayersCache   = demoPlayers;
        window.__demoItemsCache     = demoItems;
        window.__demoLogsCache      = demoLogs;
        window.__demoResourcesCache = demoResources;
        window.__demoEcoData        = demoEcoData;
        window.__demoFleetData      = demoFleetData;
        window.__demoDoorsCache     = demoDoors;

        window.postMessage({
            type: 'SHOW_MENU',
            config: cfg,
            players: demoPlayers,
            jobs: demoJobs,
            items: demoItems,
            logs: demoLogs,
            resources: demoResources
        }, '*');

        // Update positions un peu après pour rafraîchir + push tous les autres datasets
        setTimeout(() => {
            window.postMessage({ type: 'UPDATE_POSITIONS', players: demoPlayers }, '*');
            window.postMessage({ type: 'UPDATE_FLEET', data: demoFleetData }, '*');
            window.postMessage({ type: 'UPDATE_ANNOUNCEMENTS', announcements: demoAnnouncements }, '*');
            window.postMessage({ type: 'UPDATE_ECO', data: demoEcoData }, '*');
            window.postMessage({
                type: 'UPDATE_INVCREATOR_DATA',
                items: demoCreatorItems,
                shops: demoCreatorShops
            }, '*');
            window.postMessage({ type: 'UPDATE_ZONES', zones: FAKE_ZONES }, '*');

            // Inventaire d'inspection (pour Inventory Guardian, en cas d'inspect direct)
            window.postMessage({ type: 'UPDATE_INV_RESULTS', players: demoPlayers }, '*');

            // Portes (Doorlock Manager)
            window.postMessage({ type: 'UPDATE_DOORLOCKS', doors: demoDoors }, '*');
        }, 400);

        // ============== CONSOLE LIVE (UPDATE_CONSOLE) ==============
        const consoleLines = [
            { msg: '[Yol_Admin] Resource started successfully', type: 'info' },
            { msg: '[oxmysql] Database connection pool: 10 active', type: 'info' },
            { msg: '[es_extended] Loaded 18 player(s) from database', type: 'info' },
            { msg: '[chat] Player Lucas Martin connected', type: 'info' },
            { msg: '[script:Yol_Anticheat] Scan complete - 0 violations', type: 'info' },
            { msg: '[txAdmin] HB success: 200', type: 'info' },
            { msg: '[ox_inventory] Stash "trunk_LSPD_001" loaded (12 items)', type: 'info' },
            { msg: '[pma-voice] Voice mode set to "talking" for player 7', type: 'info' },
            { msg: '[script:Yol_Admin] /tp executed by AdminYol → player 14', type: 'warn' },
            { msg: '[script:esx_phone] Message sent: player 8 → player 2', type: 'info' },
            { msg: 'WARN: Deprecated native used in resource old_inventory', type: 'warn' },
            { msg: '[script:Yol_Anticheat] Suspicious speed detected: player 11 (cleared)', type: 'warn' },
            { msg: '[txAdmin] Player kicked: GriefBoy42 (Reason: AFK)', type: 'info' },
            { msg: 'ERROR: Failed to load resource: broken_resource', type: 'error' }
        ];
        let cIdx = 0;
        setTimeout(function pushConsole() {
            if (cIdx < consoleLines.length) {
                const l = consoleLines[cIdx++];
                window.postMessage({ type: 'UPDATE_CONSOLE', message: l.msg, logType: l.type }, '*');
                setTimeout(pushConsole, 600 + Math.random() * 800);
            }
        }, 1200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootPreview);
    } else {
        bootPreview();
    }
})();
