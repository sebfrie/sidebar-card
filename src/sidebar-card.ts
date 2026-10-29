// ------------------------------------------------------------------------------------------
//  SIDEBAR-CARD
// ------------------------------------------------------------------------------------------
//  https://github.com/DBuit/sidebar-card
// ------------------------------------------------------------------------------------------

// ##########################################################################################
// ###   Global constants
// ##########################################################################################

const SIDEBAR_CARD_TITLE = 'SIDEBAR-CARD';
const SIDEBAR_CARD_VERSION = '0.3.1';

// ##########################################################################################
// ###   Import dependencies
// ##########################################################################################

import { css, html, LitElement } from 'lit-element';
import { moreInfo } from 'card-tools/src/more-info';
import { hass, provideHass } from 'card-tools/src/hass';
import { subscribeRenderTemplate } from 'card-tools/src/templates';
import moment from 'moment/min/moment-with-locales';
import { forwardHaptic, navigate, toggleEntity } from 'custom-card-helpers';

// ##########################################################################################
// ###   Translations (editor and edit button)
// ##########################################################################################

const STRINGS: Record<string, Record<string, string>> = {
  en: {
    edit_sidebar: 'Edit sidebar',
    editor_title: 'Sidebar',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    loading: 'Loading editor…',
    save_error: 'Saving failed: ',
    section_header: 'Clock & date',
    section_menu: 'Menu',
    section_bottom: 'Pinned to the bottom',
    section_layout: 'Width & position',
    section_design: 'Design',
    section_advanced: 'Advanced',
    label_digitalClock: 'Digital clock',
    label_clock: 'Analog clock',
    label_date: 'Date',
    label_seconds: 'Show seconds',
    label_timeFormat: 'Time format',
    label_clockSize: 'Digital clock size',
    label_analogClockSize: 'Analog clock size',
    label_dateFormatPreset: 'Date format',
    label_dateFormat: 'Custom date format',
    label_viewMenu: 'Show the views of this dashboard',
    label_viewMenuExclude: 'Hide these views',
    label_sidebarMenu: 'Additional menu items',
    label_menuIcons: 'Menu icons',
    label_menuFontSize: 'Menu font size',
    label_template: 'Info text (template)',
    label_bottomButtons: 'Buttons / entities',
    label_bottomButtonsLayout: 'Layout',
    label_bottomButtonsShowName: 'Show names',
    label_bottomCard: 'Card (YAML)',
    label_widthUnit: 'Unit',
    label_width_desktop: 'Desktop',
    label_width_tablet: 'Tablet',
    label_width_mobile: 'Mobile',
    label_breakpoint_tablet: 'Tablet up to',
    label_breakpoint_mobile: 'Mobile up to',
    label_showRight: 'Show on the right',
    label_hideOnPath: 'Hide on these paths',
    label_background: 'Background',
    label_textColor: 'Text color',
    label_iconColor: 'Icon color',
    label_accentColor: 'Accent color (active)',
    label_dividerColor: 'Divider color',
    label_blur: 'Glass effect (blur)',
    label_style: 'Custom CSS',
    label_hideTopMenu: 'Hide the Home Assistant header',
    label_showTopMenuOnMobile: 'Keep the header on mobile',
    label_hideHassSidebar: 'Hide the Home Assistant sidebar',
    label_dockHassSidebar: 'Collapse the Home Assistant sidebar',
    label_debug: 'Debug output in the browser console',
    field_name: 'Name',
    field_icon: 'Icon',
    field_navigation_path: 'Target',
    field_conditional: 'Condition (template)',
    field_entity: 'Entity',
    field_tap_action: 'Tap action',
    field_hold_action: 'Hold action',
    opt_left: 'Left',
    opt_right: 'Right',
    opt_none: 'None',
    opt_row: 'Icon bar',
    opt_list: 'List',
    opt_percent: 'Percent of the screen',
    opt_pixel: 'Pixels',
    opt_time_24: '24 hours',
    opt_time_12: '12 hours',
    opt_time_12ampm: '12 hours with AM/PM',
    opt_date_custom: 'Custom format…',
    helper_dateFormat: 'Moment.js format, e.g. dddd, D MMMM',
    helper_width: '0 hides the sidebar on that screen size.',
    helper_hideOnPath: 'Path from the address bar, e.g. /dashboard-home/cameras',
    helper_template: 'Every line as <li>…</li>',
    helper_color: 'CSS color, e.g. #ffffff, rgba(0, 0, 0, 0.4) or var(--primary-color)',
    helper_blur:
      'Blurs the dashboard background (image or color) that shows through the sidebar. Only visible with a semi-transparent background, e.g. rgba(0, 0, 0, 0.4).',
    helper_hideTopMenu:
      'It stays visible in edit mode. To edit the dashboard, add ?edit=1 to its address; ?sidebarOff shows header and sidebar again until you switch views.',
    helper_hideHassSidebar: 'Removes it completely, including the menu button. ?sidebarOff in the address shows it again.',
    helper_dockHassSidebar: 'While this dashboard is open, the sidebar is folded away and opens with the menu button in the header.',
  },
  de: {
    edit_sidebar: 'Seitenleiste bearbeiten',
    editor_title: 'Seitenleiste',
    cancel: 'Abbrechen',
    save: 'Speichern',
    saving: 'Speichert…',
    loading: 'Editor wird geladen…',
    save_error: 'Speichern fehlgeschlagen: ',
    section_header: 'Uhr & Datum',
    section_menu: 'Menü',
    section_bottom: 'Unten fixiert',
    section_layout: 'Breite & Position',
    section_design: 'Design',
    section_advanced: 'Erweitert',
    label_digitalClock: 'Digitaluhr',
    label_clock: 'Analoge Uhr',
    label_date: 'Datum',
    label_seconds: 'Sekunden anzeigen',
    label_timeFormat: 'Zeitformat',
    label_clockSize: 'Größe der Digitaluhr',
    label_analogClockSize: 'Größe der Analoguhr',
    label_dateFormatPreset: 'Datumsformat',
    label_dateFormat: 'Eigenes Datumsformat',
    label_viewMenu: 'Views dieses Dashboards anzeigen',
    label_viewMenuExclude: 'Diese Views ausblenden',
    label_sidebarMenu: 'Zusätzliche Menüeinträge',
    label_menuIcons: 'Menü-Icons',
    label_menuFontSize: 'Schriftgröße Menü',
    label_template: 'Info-Text (Template)',
    label_bottomButtons: 'Buttons / Entitäten',
    label_bottomButtonsLayout: 'Darstellung',
    label_bottomButtonsShowName: 'Namen anzeigen',
    label_bottomCard: 'Karte (YAML)',
    label_widthUnit: 'Einheit',
    label_width_desktop: 'Desktop',
    label_width_tablet: 'Tablet',
    label_width_mobile: 'Mobil',
    label_breakpoint_tablet: 'Tablet bis',
    label_breakpoint_mobile: 'Mobil bis',
    label_showRight: 'Rechts anzeigen',
    label_hideOnPath: 'Auf diesen Pfaden ausblenden',
    label_background: 'Hintergrund',
    label_textColor: 'Textfarbe',
    label_iconColor: 'Icon-Farbe',
    label_accentColor: 'Akzentfarbe (aktiv)',
    label_dividerColor: 'Trennlinien',
    label_blur: 'Glas-Effekt (Unschärfe)',
    label_style: 'Eigenes CSS',
    label_hideTopMenu: 'Kopfleiste von Home Assistant ausblenden',
    label_showTopMenuOnMobile: 'Kopfleiste auf Mobilgeräten behalten',
    label_hideHassSidebar: 'Seitenleiste von Home Assistant ausblenden',
    label_dockHassSidebar: 'Seitenleiste von Home Assistant einklappen',
    label_debug: 'Debug-Ausgaben in der Browser-Konsole',
    field_name: 'Name',
    field_icon: 'Icon',
    field_navigation_path: 'Ziel',
    field_conditional: 'Bedingung (Template)',
    field_entity: 'Entität',
    field_tap_action: 'Aktion beim Tippen',
    field_hold_action: 'Aktion beim Halten',
    opt_left: 'Links',
    opt_right: 'Rechts',
    opt_none: 'Keine',
    opt_row: 'Icon-Leiste',
    opt_list: 'Liste',
    opt_percent: 'Prozent des Bildschirms',
    opt_pixel: 'Pixel',
    opt_time_24: '24 Stunden',
    opt_time_12: '12 Stunden',
    opt_time_12ampm: '12 Stunden mit AM/PM',
    opt_date_custom: 'Eigenes Format…',
    helper_dateFormat: 'Moment.js-Format, z. B. dddd, D. MMMM',
    helper_width: '0 blendet die Seitenleiste bei dieser Bildschirmgröße aus.',
    helper_hideOnPath: 'Pfad aus der Adresszeile, z. B. /dashboard-home/kameras',
    helper_template: 'Jede Zeile als <li>…</li>',
    helper_color: 'CSS-Farbe, z. B. #ffffff, rgba(0, 0, 0, 0.4) oder var(--primary-color)',
    helper_blur:
      'Zeichnet den Hintergrund des Dashboards (Bild oder Farbe), der durch die Seitenleiste durchscheint, unscharf. Nur sichtbar mit halbtransparentem Hintergrund, z. B. rgba(0, 0, 0, 0.4).',
    helper_hideTopMenu:
      'Im Bearbeitungsmodus bleibt sie sichtbar. Zum Bearbeiten ?edit=1 an die Adresse des Dashboards anhängen; ?sidebarOff zeigt Kopf- und Seitenleiste bis zum nächsten View-Wechsel wieder.',
    helper_hideHassSidebar: 'Blendet sie komplett aus, auch den Menü-Button. ?sidebarOff an der Adresse zeigt sie wieder.',
    helper_dockHassSidebar: 'Solange dieses Dashboard offen ist, ist sie eingeklappt und öffnet sich über den Menü-Button in der Kopfleiste.',
  },
};

function localize(key: string, hassObj?: any): string {
  const language = String((hassObj || hass() || {}).language || 'en').split('-')[0];
  const table = STRINGS[language] || STRINGS.en;
  return table[key] ?? STRINGS.en[key] ?? key;
}

// ##########################################################################################
// ###   Entity and action helpers
// ##########################################################################################

// tapping these toggles them; everything else opens more-info
const TOGGLE_DOMAINS = ['light', 'switch', 'fan', 'input_boolean', 'automation', 'siren', 'humidifier', 'script', 'group'];
const INACTIVE_STATES = ['off', 'unavailable', 'unknown', 'closed', 'locked', 'idle', 'standby', 'paused', 'not_home', 'docked', 'disarmed', 'none'];
// their state is a value, not on/off
const VALUE_DOMAINS = ['sensor', 'input_number', 'number', 'input_text', 'text', 'input_select', 'select', 'input_datetime', 'datetime', 'date', 'time', 'weather', 'sun', 'zone', 'event', 'button', 'input_button', 'scene', 'image', 'update', 'counter'];

function computeDomain(entityId: string) {
  return String(entityId).split('.')[0];
}

function isActiveState(stateObj: any) {
  if (!stateObj) return false;
  if (VALUE_DOMAINS.includes(computeDomain(stateObj.entity_id))) return false;
  return !INACTIVE_STATES.includes(stateObj.state);
}

function formatState(hassObj: any, stateObj: any) {
  try {
    if (hassObj && typeof hassObj.formatEntityState === 'function') return hassObj.formatEntityState(stateObj);
  } catch {
    // fall back to the raw state
  }
  const unit = stateObj.attributes && stateObj.attributes.unit_of_measurement;
  return unit ? `${stateObj.state} ${unit}` : stateObj.state;
}

function defaultTapAction(entity?: string) {
  if (!entity) return { action: 'none' };
  return TOGGLE_DOMAINS.includes(computeDomain(entity)) ? { action: 'toggle' } : { action: 'more-info' };
}

// Home Assistant (2023.7+) runs any card action for us, including confirmations and perform-action
function fireHassAction(node: HTMLElement, config: any, action: 'tap' | 'hold') {
  const event: any = new Event('hass-action', { bubbles: true, composed: true });
  event.detail = { config, action };
  node.dispatchEvent(event);
}

function normalizePath(path: string) {
  let result = String(path || '').split(/[?#]/)[0];
  try {
    result = decodeURI(result);
  } catch {
    // keep the encoded path
  }
  result = result.replace(/\/+$/, '');
  return result || '/';
}

function clone(value: any) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function languageOf(hassObj?: any) {
  return String((hassObj || hass() || {}).language || 'en');
}

// "seconds" applies to both clocks; older configs had digitalClockWithSeconds (digital only, analog always ticked)
function showSeconds(config: any) {
  if (config.seconds !== undefined) return !!config.seconds;
  if (config.digitalClockWithSeconds !== undefined) return !!config.digitalClockWithSeconds;
  return !config.digitalClock && !!config.clock;
}

// '24', '12' or '12ampm'; older configs had twelveHourVersion + period
function timeFormatOf(config: any) {
  if (['24', '12', '12ampm'].includes(config.timeFormat)) return config.timeFormat;
  return config.twelveHourVersion ? (config.period ? '12ampm' : '12') : '24';
}

function formatTime(date: Date, format: string, seconds: boolean) {
  const pad = (value: number) => (value < 10 ? '0' : '') + value;
  let hours = date.getHours();
  let suffix = '';
  if (format !== '24') {
    if (format === '12ampm') suffix = hours >= 12 ? ' pm' : ' am';
    hours = hours % 12 || 12;
  }
  let time = (format === '24' ? pad(hours) : String(hours)) + ':' + pad(date.getMinutes());
  if (seconds) time += ':' + pad(date.getSeconds());
  return time + suffix;
}

// the five date formats offered in the editor; the first one is the default
function datePresets(language: string) {
  return language.split('-')[0] === 'de'
    ? ['dddd, D. MMMM', 'dddd, D. MMMM YYYY', 'D. MMMM YYYY', 'dd, D.M.', 'DD.MM.YYYY']
    : ['dddd, MMMM D', 'dddd, MMMM D, YYYY', 'MMMM D, YYYY', 'ddd, MMM D', 'L'];
}

// ##########################################################################################
// ###   The actual Sidebar Card element
// ##########################################################################################

class SidebarCard extends LitElement {
  /* **************************************** *
   *        Element's local properties        *
   * **************************************** */

  config: any = {};
  hass: any;
  lovelace: any = null;
  shadowRoot: any;
  _now: Date = new Date();
  _templateNodes: any[] = [];
  _templateKey = '';
  _templateUnsub: any = null;
  _bottomCardEl: any = null;
  _bottomCardKey = '';
  _tickInterval: any = null;
  _holdTimer: any = null;
  _held = false;
  _editor: any = null;
  _warnedTemplates = new Set<string>();
  _resizeObserver: any = null;
  _boundLocationChange: any;
  _boundResize: any;

  /* **************************************** *
   *        Element's public properties       *
   * **************************************** */

  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
      lovelace: { attribute: false },
      _now: { attribute: false },
      _templateNodes: { attribute: false },
      _bottomCardEl: { attribute: false },
    };
  }

  /* **************************************** *
   *           Element constructor            *
   * **************************************** */

  constructor() {
    super();
    // re-render marks the active menu item
    this._boundLocationChange = () => this.requestUpdate();
    this._boundResize = () => this.updateSidebarSize();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('location-changed', this._boundLocationChange);
    window.addEventListener('popstate', this._boundLocationChange);
    window.addEventListener('resize', this._boundResize, true);
    if (!this._tickInterval) {
      this._tickInterval = setInterval(() => this._tick(), 1000);
    }
    // sizes the fixed inner part whenever the sidebar column changes, e.g. shown again after hideOnPath (#78)
    if (!this._resizeObserver && typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this.updateSidebarSize());
      this._resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // a replaced dashboard must not keep its timers, listeners and subscriptions alive
    window.removeEventListener('location-changed', this._boundLocationChange);
    window.removeEventListener('popstate', this._boundLocationChange);
    window.removeEventListener('resize', this._boundResize, true);
    clearInterval(this._tickInterval);
    this._tickInterval = null;
    clearTimeout(this._holdTimer);
    this._unsubscribeTemplate();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  setConfig(config: any) {
    this.config = Object.assign({}, config);

    const templateKey = this.config.template ? JSON.stringify([this.config.template, this.config.entity_ids]) : '';
    if (templateKey !== this._templateKey) {
      this._templateKey = templateKey;
      this._unsubscribeTemplate();
      this._templateNodes = [];
      if (this.config.template) {
        this._subscribeTemplate();
      }
    }
  }

  getCardSize() {
    return 1;
  }

  /* **************************************** *
   *   Element's HTML renderer (lit-element)  *
   * **************************************** */

  render() {
    const c = this.config || {};
    const items = this._menuItems();
    const buttons = Array.isArray(c.bottomButtons) ? c.bottomButtons.filter((b) => b && typeof b === 'object') : [];
    const layout = c.bottomButtonsLayout === 'list' ? 'list' : 'row';
    const iconPosition = ['left', 'right', 'none'].includes(c.menuIcons) ? c.menuIcons : 'left';
    const showFooter = buttons.length > 0 || !!c.bottomCard;

    return html`
      ${c.style
        ? html`
            <style>
              ${c.style}
            </style>
          `
        : ''}
      <div class="sidebar-inner${c.blur ? ' blur' : ''}">
        ${this._isEditMode()
          ? html`
              <button class="edit-sidebar" title="${localize('edit_sidebar', this.hass)}" @click=${() => this._openEditor()}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
            `
          : ''}
        <div class="sidebar-main">
          ${c.digitalClock
            ? html`
                <h1 class="digitalClock${c.title ? ' with-title' : ''}${showSeconds(c) ? ' with-seconds' : ''}">${this._timeString()}</h1>
              `
            : ''}
          ${c.clock ? this._renderAnalogClock() : ''}
          ${c.title
            ? html`
                <h1 class="title">${c.title}</h1>
              `
            : ''}
          ${c.date
            ? html`
                <h2 class="date">${this._dateString()}</h2>
              `
            : ''}
          ${items.length > 0
            ? html`
                <ul class="sidebarMenu icons-${iconPosition}">
                  ${items.map((item) => this._renderMenuItem(item, iconPosition))}
                </ul>
              `
            : ''}
          ${c.template
            ? html`
                <ul class="template">
                  ${this._templateNodes}
                </ul>
              `
            : ''}
        </div>
        ${showFooter
          ? html`
              <div class="sidebar-footer">
                ${buttons.length > 0
                  ? html`
                      <div class="buttons ${layout}">
                        ${buttons.map((button) => this._renderButton(button, layout, c.bottomButtonsShowName === true))}
                      </div>
                    `
                  : ''}
                ${c.bottomCard
                  ? html`
                      <div class="bottom">${this._bottomCardEl || ''}</div>
                    `
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  _renderMenuItem(item: any, iconPosition: string) {
    return html`
      <li class="${this._isActive(item) ? 'active' : ''}" data-path="${item.navigation_path || ''}" @click=${() => this._menuAction(item)}>
        ${item.icon && iconPosition !== 'none'
          ? html`
              <ha-icon .icon=${item.icon}></ha-icon>
            `
          : ''}
        <span>${item.name}</span>
      </li>
    `;
  }

  _renderAnalogClock() {
    const now = this._now;
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return html`
      <div class="clock">
        <div class="wrap">
          <span class="hour" style="transform: rotate(${hours * 30 + minutes * 0.5}deg)"></span>
          <span class="minute" style="transform: rotate(${minutes * 6 + seconds * 0.1}deg)"></span>
          ${showSeconds(this.config)
            ? html`
                <span class="second" style="transform: rotate(${seconds * 6}deg)"></span>
              `
            : ''}
          <span class="dot"></span>
        </div>
      </div>
    `;
  }

  _renderButton(button: any, layout: string, showName: boolean) {
    const stateObj = button.entity && this.hass ? this.hass.states[button.entity] : undefined;
    const name = button.name || (stateObj ? stateObj.attributes.friendly_name || button.entity : button.entity || '');
    const classes = `sb-button${isActiveState(stateObj) ? ' on' : ''}${stateObj && stateObj.state === 'unavailable' ? ' unavailable' : ''}`;
    const icon =
      stateObj && customElements.get('ha-state-icon')
        ? html`
            <ha-state-icon .hass=${this.hass} .stateObj=${stateObj} .icon=${button.icon}></ha-state-icon>
          `
        : html`
            <ha-icon .icon=${button.icon || (stateObj && stateObj.attributes.icon) || 'mdi:gesture-tap-button'}></ha-icon>
          `;

    return html`
      <button
        class="${classes}"
        title="${name}"
        @pointerdown=${() => this._pointerDown(button)}
        @pointerup=${() => clearTimeout(this._holdTimer)}
        @pointerleave=${() => clearTimeout(this._holdTimer)}
        @pointercancel=${() => clearTimeout(this._holdTimer)}
        @contextmenu=${(e) => e.preventDefault()}
        @click=${() => this._buttonClick(button)}
      >
        <span class="sb-icon">${icon}</span>
        ${layout === 'list' || showName
          ? html`
              <span class="sb-name">${name}</span>
            `
          : ''}
        ${layout === 'list' && stateObj
          ? html`
              <span class="sb-state">${formatState(this.hass, stateObj)}</span>
            `
          : ''}
      </button>
    `;
  }

  /* **************************************** *
   *              Clock and date              *
   * **************************************** */

  _tick() {
    const c = this.config || {};
    if (c.clock || c.digitalClock || c.date) {
      this._now = new Date();
    }
  }

  _timeString() {
    return formatTime(this._now, timeFormatOf(this.config), showSeconds(this.config));
  }

  _dateString() {
    const language = languageOf(this.hass);
    return moment(this._now)
      .locale(language)
      .format(this.config.dateFormat || datePresets(language)[0]);
  }

  /* **************************************** *
   *                   Menu                   *
   * **************************************** */

  _menuItems() {
    const c = this.config || {};
    const items: any[] = [];
    if (c.viewMenu) items.push(...this._viewItems());
    if (Array.isArray(c.sidebarMenu)) items.push(...c.sidebarMenu.filter((item) => item && typeof item === 'object'));
    return items.filter((item) => this._evaluateVisibleCondition(item.conditional, this.hass));
  }

  _dashboardPath() {
    const lovelace = this.lovelace;
    const urlPath = lovelace && lovelace.urlPath ? lovelace.urlPath : window.location.pathname.split('/')[1] || 'lovelace';
    return '/' + urlPath;
  }

  // one menu item per view: title and icon come from the view itself
  _viewItems() {
    const lovelace = this.lovelace;
    const views = lovelace && lovelace.config && Array.isArray(lovelace.config.views) ? lovelace.config.views : [];
    const exclude = ([] as any[]).concat(this.config.viewMenuExclude || []).map(String);
    const userId = this.hass && this.hass.user ? this.hass.user.id : undefined;
    const base = this._dashboardPath();

    return views
      .map((view, index) => ({ view, index, path: view.path !== undefined && view.path !== null && view.path !== '' ? String(view.path) : String(index) }))
      .filter(({ view, path }) => {
        if (view.subview || exclude.includes(path)) return false;
        if (view.visible === false) return false;
        if (Array.isArray(view.visible) && userId && !view.visible.some((entry) => entry && entry.user === userId)) return false;
        return true;
      })
      .map(({ view, index, path }) => ({
        action: 'navigate',
        navigation_path: `${base}/${path}`,
        name: view.title || view.path || String(index + 1),
        icon: view.icon || 'mdi:view-dashboard-outline',
        _viewIndex: index,
      }));
  }

  _isActive(item: any) {
    if (item.state && this.hass) {
      const stateObj = this.hass.states[item.state];
      if (stateObj && stateObj.state != 'off' && stateObj.state != 'unavailable') return true;
    }
    if (this.config.updateMenu === false) return false;
    const action = item.action || (item.navigation_path ? 'navigate' : '');
    if (action !== 'navigate' || !item.navigation_path) return false;

    const current = normalizePath(window.location.pathname);
    if (normalizePath(item.navigation_path) === current) return true;
    if (item._viewIndex !== undefined) {
      const base = this._dashboardPath();
      // a view is also reachable by its index, the first one by the bare dashboard path
      if (current === `${base}/${item._viewIndex}`) return true;
      if (item._viewIndex === 0 && current === base) return true;
    }
    return false;
  }

  _menuAction(item: any) {
    const action = item.action || (item.navigation_path ? 'navigate' : undefined);
    if (!action || ['navigate', 'url', 'more-info', 'toggle', 'call-service', 'service-js'].includes(action)) {
      this._customAction(Object.assign({}, item, { action }));
    } else {
      // perform-action, assist, fire-dom-event, ...
      fireHassAction(this, { entity: item.entity, tap_action: item }, 'tap');
    }
  }

  _evaluateVisibleCondition(template: string | undefined, hassObj: any): boolean {
    if (!template) return true;
    if (!hassObj) return true;

    // Clean outer braces and whitespace
    const cleaned = String(template)
      .trim()
      .replace(/^{{\s*|\s*}}$/g, '')
      .trim();

    try {
      // --- is_state('entity', 'value') ---
      const matchState = cleaned.match(/is_state\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\)/);
      if (matchState) {
        const [, entityId, expected] = matchState;
        return hassObj.states[entityId]?.state === expected;
      }

      // --- is_state_attr('entity', 'attr', 'value') ---
      const matchAttr = cleaned.match(/is_state_attr\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\)/);
      if (matchAttr) {
        const [, entityId, attr, expected] = matchAttr;
        return hassObj.states[entityId]?.attributes?.[attr] === expected;
      }

      // --- states['entity_id'] == 'value' ---
      const matchEquals = cleaned.match(/states\[['"]([^'"]+)['"]\]\s*==\s*['"]([^'"]+)['"]/);
      if (matchEquals) {
        const [, entityId, expected] = matchEquals;
        return hassObj.states[entityId]?.state === expected;
      }

      // ---  Handle simple comparisons, e.g. "states['sensor.temp'] | int > 20"
      const numericMatch = cleaned.match(/states\[['"]([^'"]+)['"]\]\s*\|\s*(int|float)\s*([<>]=?|==)\s*([\d.]+)/);
      if (numericMatch) {
        const [, entityId, type, operator, thresholdStr] = numericMatch;
        const raw = hassObj.states[entityId]?.state;
        if (raw === undefined) return false;
        const num = type === 'float' ? parseFloat(raw) : parseInt(raw, 10);
        const threshold = parseFloat(thresholdStr);

        switch (operator) {
          case '>':
            return num > threshold;
          case '<':
            return num < threshold;
          case '>=':
            return num >= threshold;
          case '<=':
            return num <= threshold;
          case '==':
            return num == threshold;
          default:
            return false;
        }
      }

      // the menu is rendered every second, so warn only once per expression
      if (!this._warnedTemplates.has(cleaned)) {
        this._warnedTemplates.add(cleaned);
        console.warn('sidebar-card: could not parse visible template:', cleaned);
      }
      return true;
    } catch (err) {
      console.error('sidebar-card: visible template evaluation error:', err);
      return true; // fail open
    }
  }

  _customAction(tapAction: any) {
    switch (tapAction.action) {
      case 'more-info':
        if (tapAction.entity || tapAction.camera_image) {
          moreInfo(tapAction.entity ? tapAction.entity : tapAction.camera_image!);
        }
        break;
      case 'navigate':
        if (tapAction.navigation_path) {
          navigate(window, tapAction.navigation_path);
        }
        break;
      case 'url':
        if (tapAction.url_path) {
          window.open(tapAction.url_path);
        }
        break;
      case 'toggle':
        if (tapAction.entity) {
          toggleEntity(this.hass, tapAction.entity!);
          forwardHaptic('success');
        }
        break;
      case 'call-service': {
        if (!tapAction.service) {
          forwardHaptic('failure');
          return;
        }
        const [domain, service] = tapAction.service.split('.', 2);
        this.hass.callService(domain, service, tapAction.service_data);
        forwardHaptic('success');
        break;
      }
      case 'service-js':
        if (tapAction.service) {
          try {
            const code = tapAction.service.toString().replace(/^\[\[\[\s*|\s*\]\]\]$/g, '');
            const func = new Function(code);
            func.call(this);
            forwardHaptic('success');
          } catch {
            forwardHaptic('failure');
          }
        } else {
          error2console('service-js', 'no service code found');
        }
        break;
    }
  }

  /* **************************************** *
   *              Bottom buttons              *
   * **************************************** */

  _pointerDown(button: any) {
    this._held = false;
    clearTimeout(this._holdTimer);
    this._holdTimer = setTimeout(() => {
      this._held = true;
      this._buttonAction(button, 'hold');
    }, 500);
  }

  _buttonClick(button: any) {
    clearTimeout(this._holdTimer);
    if (this._held) {
      this._held = false;
      return;
    }
    this._buttonAction(button, 'tap');
  }

  _buttonAction(button: any, action: 'tap' | 'hold') {
    fireHassAction(
      this,
      {
        entity: button.entity,
        tap_action: button.tap_action || defaultTapAction(button.entity),
        hold_action: button.hold_action || { action: button.entity ? 'more-info' : 'none' },
      },
      action,
    );
  }

  /* **************************************** *
   *        Templates and bottom card         *
   * **************************************** */

  _subscribeTemplate() {
    const key = this._templateKey;
    try {
      this._templateUnsub = subscribeRenderTemplate(
        null,
        (res) => {
          if (key !== this._templateKey) return;
          const regex = /<(?:li|div)(?:\s+(?:class|id)\s*=\s*"([^"]*)")*\s*>([^<]*)<\/(?:li|div)>/g;
          // a template that renders no <li>/<div> must not throw (#108)
          const lines = String(res).match(regex) || [];
          // build the nodes once, the sidebar re-renders every second for the clock
          this._templateNodes = lines.map((line) => createElementFromHTML(line));
        },
        {
          template: this.config.template,
          variables: { config: this.config },
          entity_ids: this.config.entity_ids,
        },
      );
      Promise.resolve(this._templateUnsub).catch((err) => error2console('template', 'Template error', err));
    } catch (err) {
      error2console('template', 'Template subscription failed', err);
    }
  }

  _unsubscribeTemplate() {
    if (this._templateUnsub) {
      Promise.resolve(this._templateUnsub)
        .then((unsub) => typeof unsub === 'function' && unsub())
        .catch(() => undefined);
      this._templateUnsub = null;
    }
  }

  async _ensureBottomCard() {
    const bottomCard = this.config.bottomCard;
    const key = bottomCard ? JSON.stringify(bottomCard) : '';
    if (key === this._bottomCardKey) return;
    this._bottomCardKey = key;
    if (!bottomCard) {
      this._bottomCardEl = null;
      return;
    }

    const card = Object.assign({ type: bottomCard.type }, bottomCard.cardOptions);
    log2console('bottomCard', 'Bottom card: ', card);
    if (!card.type) {
      error2console('bottomCard', 'Bottom card config error!');
      this._bottomCardEl = null;
      return;
    }
    // hui-card loads built-in cards on demand and waits for custom cards to be defined,
    // a bare document.createElement() often had no setConfig yet (#90, #146, #147)
    await customElements.whenDefined('hui-card');
    if (key !== this._bottomCardKey) return;
    const cardElement: any = document.createElement('hui-card');
    cardElement.config = card;
    cardElement.hass = this.hass || hass();
    this._bottomCardEl = cardElement;

    if (bottomCard.cardStyle && bottomCard.cardStyle != '') {
      const style = bottomCard.cardStyle;
      let iterations = 0;
      const interval = setInterval(function() {
        // the actual card is the child of hui-card; skip the placeholder shown while it loads
        const innerCard = cardElement.firstElementChild;
        if (innerCard && innerCard.shadowRoot && innerCard.localName !== 'hui-error-card') {
          window.clearInterval(interval);
          const styleElement = document.createElement('style');
          styleElement.innerHTML = style;
          innerCard.shadowRoot.appendChild(styleElement);
        } else if (++iterations === 50) {
          window.clearInterval(interval);
        }
      }, 100);
    }
  }

  /* **************************************** *
   *            Lifecycle helpers             *
   * **************************************** */

  firstUpdated() {
    provideHass(this);
    this.updateSidebarSize();
  }

  updated(changedProps: any) {
    if (changedProps.has('config')) {
      this._applyDesign();
      this._ensureBottomCard();
    }
    if (changedProps.has('hass')) {
      if (this._bottomCardEl) this._bottomCardEl.hass = this.hass;
      if (this._editor) this._editor.hass = this.hass;
    }
  }

  // design options are CSS custom properties, so a theme or the style option can still override the defaults
  _applyDesign() {
    const c = this.config || {};
    const properties: Record<string, string | undefined> = {
      '--sidebar-background': c.background,
      '--sidebar-text-color': c.textColor,
      '--sidebar-icon-color': c.iconColor,
      '--sidebar-selected-icon-color': c.accentColor,
      '--sidebar-divider-color': c.dividerColor,
      '--sidebar-blur': c.blur ? `${c.blur}px` : undefined,
      '--sidebar-clock-size': c.clockSize ? `${c.clockSize}px` : undefined,
      '--sidebar-analog-clock-size': c.analogClockSize ? `${c.analogClockSize}px` : undefined,
      '--sidebar-menu-font-size': c.menuFontSize ? `${c.menuFontSize}px` : undefined,
    };
    Object.keys(properties).forEach((name) => {
      const value = properties[name];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        this.style.setProperty(name, String(value));
      } else {
        this.style.removeProperty(name);
      }
    });
  }

  updateSidebarSize() {
    const sidebarInner = this.shadowRoot && this.shadowRoot.querySelector('.sidebar-inner');
    const headerHeightPx = getHeaderHeightPx();

    if (sidebarInner) {
      sidebarInner.style.width = this.offsetWidth + 'px';
      if (isTopMenuHidden(this.config, document.body.clientWidth, !!(this.lovelace && this.lovelace.editMode))) {
        sidebarInner.style.height = `${window.innerHeight}px`;
        sidebarInner.style.top = '0px';
      } else {
        sidebarInner.style.height = `calc(${window.innerHeight}px - ` + headerHeightPx + `)`;
        sidebarInner.style.top = headerHeightPx;
      }
    }
  }

  _isEditMode() {
    const lovelace = this.lovelace;
    return !!(lovelace && lovelace.editMode && lovelace.mode !== 'yaml' && typeof lovelace.saveConfig === 'function');
  }

  _openEditor() {
    if (this._editor) return;
    const lovelace = this.lovelace;
    const stored = (lovelace.rawConfig || lovelace.config || {}).sidebar || {};
    const editor: any = document.createElement('sidebar-card-editor');
    editor.hass = this.hass;
    editor.lovelace = lovelace;
    editor.originalConfig = clone(stored);
    editor.side = stored.showRight ? 'left' : 'right';
    editor.onPreview = (config: any) => previewSidebar(config);
    editor.onClose = (saved: boolean) => {
      this._editor = null;
      endPreview(saved);
    };
    // inside home-assistant, so dialogs opened by the form (e.g. list items) reach the dialog manager
    const homeAssistant: any = document.querySelector('home-assistant');
    (homeAssistant && homeAssistant.shadowRoot ? homeAssistant.shadowRoot : document.body).appendChild(editor);
    this._editor = editor;
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        --sb-text: var(--sidebar-text-color, var(--primary-text-color, #212121));
        --sb-icon: var(--sidebar-icon-color, var(--secondary-text-color, #727272));
        --sb-accent: var(--sidebar-selected-icon-color, var(--primary-color, #03a9f4));
        --sb-divider: var(--sidebar-divider-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
        --sb-padding: var(--sidebar-padding, 20px);
      }
      .sidebar-inner {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        position: fixed;
        width: 0;
        overflow: hidden;
        color: var(--sb-text);
        background: var(--sidebar-background, var(--ha-card-background, var(--card-background-color, #fff)));
      }
      .sidebar-inner.blur {
        -webkit-backdrop-filter: blur(var(--sidebar-blur, 0px));
        backdrop-filter: blur(var(--sidebar-blur, 0px));
      }
      .sidebar-main {
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden auto;
        padding: var(--sb-padding);
        scrollbar-width: thin;
      }
      .sidebar-footer {
        flex: 0 0 auto;
        padding: 12px var(--sb-padding) var(--sb-padding);
        border-top: 1px solid var(--sb-divider);
      }

      /* edit mode */
      .edit-sidebar {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        cursor: pointer;
      }
      .edit-sidebar:hover {
        filter: brightness(1.1);
      }

      /* clock, title, date */
      h1 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 32px;
        line-height: 1.1;
        font-weight: 200;
        color: var(--sb-text);
        cursor: default;
      }
      h1.digitalClock {
        font-size: var(--sidebar-clock-size, 60px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      h1.digitalClock.with-seconds {
        font-size: calc(var(--sidebar-clock-size, 60px) * 0.8);
      }
      h1.digitalClock.with-title {
        margin-bottom: 0;
      }
      h2 {
        margin: 0;
        font-size: 22px;
        line-height: 1.2;
        font-weight: 300;
        color: var(--sb-text);
        cursor: default;
      }

      /* menu */
      .sidebarMenu {
        list-style: none;
        margin: 20px 0;
        padding: 16px 0;
        border-top: 1px solid var(--sb-divider);
        border-bottom: 1px solid var(--sb-divider);
      }
      .sidebarMenu li {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
        margin: 2px 0;
        padding: 10px 16px;
        border-radius: var(--sidebar-item-radius, 12px);
        color: var(--sb-text);
        font-size: var(--sidebar-menu-font-size, 18px);
        line-height: 24px;
        font-weight: 400;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      .sidebarMenu.icons-right li {
        flex-direction: row-reverse;
      }
      .sidebarMenu li span {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sidebarMenu li ha-icon {
        flex: none;
        color: var(--sb-icon);
      }
      .sidebarMenu li::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s;
      }
      .sidebarMenu li:hover::before {
        opacity: 0.06;
      }
      .sidebarMenu li.active {
        color: var(--sidebar-selected-text-color, var(--sb-text));
        font-weight: 500;
      }
      .sidebarMenu li.active ha-icon {
        color: var(--sb-accent);
      }
      .sidebarMenu li.active::before {
        background: var(--sb-accent);
        opacity: 0.14;
      }

      /* template */
      .template {
        margin: 0;
        padding: 0;
        list-style: none;
        color: var(--sb-text);
      }
      .template li {
        display: block;
        color: inherit;
        font-size: 16px;
        line-height: 22px;
        font-weight: 300;
        white-space: normal;
      }

      /* bottom buttons */
      .buttons.row {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
        gap: 8px;
      }
      .buttons.list {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .sb-button {
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        margin: 0;
        padding: 8px;
        border: none;
        border-radius: 12px;
        background: var(--sidebar-button-background, rgba(127, 127, 127, 0.12));
        color: var(--sb-text);
        font: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        user-select: none;
      }
      .buttons.row .sb-button {
        flex-direction: column;
        justify-content: center;
        min-height: 52px;
      }
      .buttons.list .sb-button {
        width: 100%;
        gap: 12px;
        padding: 8px 12px;
        background: transparent;
        text-align: left;
      }
      .sb-button::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        pointer-events: none;
      }
      .sb-button:hover::before {
        opacity: 0.06;
      }
      .sb-button.on::before {
        background: var(--sb-accent);
        opacity: 0.16;
      }
      .sb-button.unavailable {
        opacity: 0.45;
      }
      .sb-icon {
        display: flex;
        color: var(--sb-icon);
      }
      .sb-button.on .sb-icon {
        color: var(--sb-accent);
      }
      .sb-name {
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .buttons.row .sb-name {
        font-size: 11px;
        line-height: 13px;
      }
      .buttons.list .sb-name {
        flex: 1 1 auto;
        font-size: 15px;
      }
      .sb-state {
        flex: none;
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        white-space: nowrap;
      }
      .bottom {
        display: flex;
      }
      .bottom > * {
        flex: 1 1 auto;
      }
      .buttons + .bottom {
        margin-top: 12px;
      }

      /* analog clock */
      .clock {
        position: relative;
        box-sizing: border-box;
        width: min(100%, var(--sidebar-analog-clock-size, 220px));
        aspect-ratio: 1;
        margin: 20px auto;
        border-radius: 100%;
        background: var(--face-color, var(--sidebar-background, var(--card-background-color, #fff)));
        border: 5px solid var(--face-border-color, transparent);
        box-shadow: inset 2px 3px 8px 0 rgba(0, 0, 0, 0.1);
      }
      .clock .wrap {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
      .clock .minute,
      .clock .hour {
        position: absolute;
        height: 28%;
        width: 6px;
        margin: auto;
        top: -27%;
        left: 0;
        bottom: 0;
        right: 0;
        background: var(--clock-hands-color, var(--sb-text));
        transform-origin: bottom center;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
        z-index: 1;
      }
      .clock .minute {
        height: 41%;
        width: 4px;
        top: -38%;
      }
      .clock .second {
        position: absolute;
        top: -48%;
        height: 48%;
        width: 2px;
        margin: auto;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: 4px;
        background: var(--clock-seconds-hand-color, #ff4b3e);
        transform-origin: bottom center;
        z-index: 1;
      }
      .clock .dot {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 12px;
        height: 12px;
        border-radius: 100px;
        background: var(--clock-middle-background, var(--face-color, var(--sidebar-background, var(--card-background-color, #fff))));
        border: 2px solid var(--clock-middle-border, var(--sb-text));
        margin: auto;
        z-index: 1;
      }
    `;
  }
}

customElements.define('sidebar-card', SidebarCard);

// ##########################################################################################
// ###   The sidebar editor (opened from the sidebar in edit mode)
// ##########################################################################################

// Defaults the editor shows in its fields; values equal to them are not stored
const EDITOR_DEFAULTS: Record<string, any> = {
  menuIcons: 'left',
  bottomButtonsLayout: 'row',
  timeFormat: '24',
  widthUnit: '%',
  clockSize: 60,
  analogClockSize: 220,
  menuFontSize: 18,
  blur: 0,
};
const DEFAULT_BREAKPOINTS = { tablet: 1024, mobile: 768 };
const DEFAULT_WIDTH_PERCENT = 25;
const CUSTOM_DATE_FORMAT = 'custom';
const WIDTH_KEYS = ['desktop', 'tablet', 'mobile'];
// keys the editor replaces by seconds, timeFormat and dateFormat
const LEGACY_KEYS = ['digitalClockWithSeconds', 'twelveHourVersion', 'period'];

function isEmpty(value: any) {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// The form uses one width object plus a unit and shows every default; the stored config may be shorter
function toFormData(config: any, hassObj: any) {
  const source = config || {};
  const data = clone(source) || {};
  let unit = data.widthUnit;
  const parse = (value: any) => {
    if (typeof value === 'string') {
      const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(px|%)?$/);
      if (match) {
        if (match[2] === 'px' && !unit) unit = 'px';
        return Number(match[1]);
      }
    }
    return value;
  };
  let width: any = {};
  if (data.width !== undefined && data.width !== null) {
    if (typeof data.width === 'object') {
      WIDTH_KEYS.forEach((key) => (width[key] = parse(data.width[key])));
    } else {
      const value = parse(data.width);
      width = { desktop: value, tablet: value, mobile: value };
    }
  }
  unit = unit || '%';
  WIDTH_KEYS.forEach((key) => {
    if (typeof width[key] !== 'number') width[key] = unit === 'px' ? 300 : DEFAULT_WIDTH_PERCENT;
  });
  data.width = width;
  data.widthUnit = unit;
  data.breakpoints = Object.assign({}, DEFAULT_BREAKPOINTS, data.breakpoints || {});

  data.seconds = showSeconds(source);
  data.timeFormat = timeFormatOf(source);
  LEGACY_KEYS.forEach((key) => delete data[key]);

  const presets = datePresets(languageOf(hassObj));
  if (!data.dateFormat) data.dateFormat = presets[0];
  data.dateFormatPreset = presets.includes(data.dateFormat) ? data.dateFormat : CUSTOM_DATE_FORMAT;

  Object.keys(EDITOR_DEFAULTS).forEach((key) => {
    if (isEmpty(data[key])) data[key] = EDITOR_DEFAULTS[key];
  });
  if (data.hideOnPath !== undefined && !Array.isArray(data.hideOnPath)) data.hideOnPath = [data.hideOnPath];
  if (data.viewMenuExclude !== undefined) data.viewMenuExclude = ([] as any[]).concat(data.viewMenuExclude).map(String);
  return data;
}

function fromFormData(formData: any, hassObj: any) {
  const data = Object.assign({}, formData);
  const presets = datePresets(languageOf(hassObj));
  if (data.dateFormatPreset && data.dateFormatPreset !== CUSTOM_DATE_FORMAT) data.dateFormat = data.dateFormatPreset;
  delete data.dateFormatPreset;
  if (data.dateFormat === presets[0]) delete data.dateFormat;

  const unit = data.widthUnit || '%';
  if (data.width && typeof data.width === 'object') {
    const width = Object.assign({}, data.width);
    WIDTH_KEYS.forEach((key) => isEmpty(width[key]) && delete width[key]);
    const isDefault = unit === '%' && WIDTH_KEYS.every((key) => width[key] === DEFAULT_WIDTH_PERCENT);
    data.width = isDefault ? undefined : width;
  }
  if (data.breakpoints && typeof data.breakpoints === 'object') {
    const breakpoints = Object.assign({}, data.breakpoints);
    Object.keys(breakpoints).forEach((key) => {
      if (isEmpty(breakpoints[key]) || breakpoints[key] === DEFAULT_BREAKPOINTS[key]) delete breakpoints[key];
    });
    data.breakpoints = breakpoints;
  }
  Object.keys(EDITOR_DEFAULTS).forEach((key) => {
    if (data[key] === EDITOR_DEFAULTS[key]) delete data[key];
  });
  LEGACY_KEYS.forEach((key) => delete data[key]);

  const config: any = {};
  Object.keys(data).forEach((key) => {
    if (!isEmpty(data[key])) config[key] = data[key];
  });
  return config;
}

// keeps the visible width roughly the same when the unit is switched
function convertWidth(width: any, toUnit: string) {
  const screen = window.innerWidth || 1280;
  const result: any = {};
  WIDTH_KEYS.forEach((key) => {
    const value = Number(width[key]);
    if (isNaN(value)) return;
    result[key] = toUnit === 'px' ? Math.min(600, Math.round((value / 100) * screen / 10) * 10) : Math.min(50, Math.round((value / screen) * 100));
  });
  return result;
}

// ha-form is loaded on demand by Home Assistant; the tile card editor pulls it in
async function loadHaForm() {
  if (customElements.get('ha-form')) return;
  try {
    const helpers = await (window as any).loadCardHelpers?.();
    if (helpers) {
      helpers.createCardElement({ type: 'tile', entity: 'sun.sun' });
      await customElements.whenDefined('hui-tile-card');
      const tileCard: any = customElements.get('hui-tile-card');
      if (tileCard && tileCard.getConfigElement) await tileCard.getConfigElement();
    }
  } catch (err) {
    error2console('loadHaForm', 'Could not preload the form', err);
  }
  await Promise.race([customElements.whenDefined('ha-form'), sleep(5000)]);
}

function buildEditorSchema(data: any, lovelace: any, hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  const language = languageOf(hassObj);
  const now = new Date();
  const views = (lovelace && lovelace.config && Array.isArray(lovelace.config.views) ? lovelace.config.views : []).map((view, index) => ({
    value: view.path !== undefined && view.path !== null && view.path !== '' ? String(view.path) : String(index),
    label: view.title || view.path || String(index + 1),
  }));
  const color = (name: string) => ({ name, selector: { text: {} }, __helper: t('helper_color') });
  const slider = (min: number, max: number, step: number, unit: string) => ({ number: { min, max, step, mode: 'slider', unit_of_measurement: unit } });
  const dropdown = (options: any[]) => ({ select: { mode: 'dropdown', options } });
  const widthSelector = data.widthUnit === 'px' ? slider(0, 600, 10, 'px') : slider(0, 50, 1, '%');
  const timeOptions = ['24', '12', '12ampm'].map((format) => ({ value: format, label: `${t('opt_time_' + format)} (${formatTime(now, format, false)})` }));
  const dateOptions = [
    ...datePresets(language).map((format) => ({
      value: format,
      label: moment(now)
        .locale(language)
        .format(format),
    })),
    { value: CUSTOM_DATE_FORMAT, label: t('opt_date_custom') },
  ];

  return [
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_header'),
      icon: 'mdi:clock-outline',
      expanded: true,
      schema: [
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'digitalClock', selector: { boolean: {} } },
            { name: 'clock', selector: { boolean: {} } },
            { name: 'date', selector: { boolean: {} } },
          ],
        },
        ...(data.digitalClock || data.clock ? [{ name: 'seconds', selector: { boolean: {} } }] : []),
        ...(data.digitalClock
          ? [
              { name: 'timeFormat', selector: dropdown(timeOptions) },
              { name: 'clockSize', selector: slider(32, 120, 2, 'px') },
            ]
          : []),
        ...(data.clock ? [{ name: 'analogClockSize', selector: slider(100, 400, 10, 'px') }] : []),
        ...(data.date ? [{ name: 'dateFormatPreset', selector: dropdown(dateOptions) }] : []),
        ...(data.date && data.dateFormatPreset === CUSTOM_DATE_FORMAT
          ? [{ name: 'dateFormat', selector: { text: {} }, __helper: t('helper_dateFormat') }]
          : []),
      ],
    },
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_menu'),
      icon: 'mdi:menu',
      schema: [
        { name: 'viewMenu', selector: { boolean: {} } },
        ...(data.viewMenu && views.length > 0 ? [{ name: 'viewMenuExclude', selector: { select: { multiple: true, mode: 'list', options: views } } }] : []),
        {
          name: 'sidebarMenu',
          selector: {
            object: {
              multiple: true,
              label_field: 'name',
              description_field: 'navigation_path',
              fields: {
                name: { label: t('field_name'), required: true, selector: { text: {} } },
                icon: { label: t('field_icon'), selector: { icon: {} } },
                navigation_path: { label: t('field_navigation_path'), selector: { navigation: {} } },
                conditional: { label: t('field_conditional'), selector: { text: {} } },
              },
            },
          },
        },
        {
          name: 'menuIcons',
          selector: dropdown([
            { value: 'left', label: t('opt_left') },
            { value: 'right', label: t('opt_right') },
            { value: 'none', label: t('opt_none') },
          ]),
        },
        { name: 'menuFontSize', selector: slider(12, 28, 1, 'px') },
        { name: 'template', selector: { template: {} }, __helper: t('helper_template') },
      ],
    },
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_bottom'),
      icon: 'mdi:dock-bottom',
      schema: [
        {
          name: 'bottomButtons',
          selector: {
            object: {
              multiple: true,
              label_field: 'name',
              description_field: 'entity',
              fields: {
                entity: { label: t('field_entity'), selector: { entity: {} } },
                name: { label: t('field_name'), selector: { text: {} } },
                icon: { label: t('field_icon'), selector: { icon: {} } },
                tap_action: { label: t('field_tap_action'), selector: { ui_action: {} } },
                hold_action: { label: t('field_hold_action'), selector: { ui_action: {} } },
              },
            },
          },
        },
        {
          name: 'bottomButtonsLayout',
          selector: dropdown([
            { value: 'row', label: t('opt_row') },
            { value: 'list', label: t('opt_list') },
          ]),
        },
        ...(data.bottomButtonsLayout !== 'list' ? [{ name: 'bottomButtonsShowName', selector: { boolean: {} } }] : []),
        { name: 'bottomCard', selector: { object: {} } },
      ],
    },
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_layout'),
      icon: 'mdi:arrow-expand-horizontal',
      schema: [
        {
          name: 'widthUnit',
          selector: dropdown([
            { value: '%', label: t('opt_percent') },
            { value: 'px', label: t('opt_pixel') },
          ]),
        },
        {
          type: 'grid',
          name: 'width',
          column_min_width: '100%',
          schema: [
            { name: 'desktop', selector: widthSelector, __label: t('label_width_desktop') },
            { name: 'tablet', selector: widthSelector, __label: t('label_width_tablet') },
            { name: 'mobile', selector: widthSelector, __label: t('label_width_mobile'), __helper: t('helper_width') },
          ],
        },
        {
          type: 'grid',
          name: 'breakpoints',
          column_min_width: '100%',
          schema: [
            { name: 'tablet', selector: slider(600, 2000, 8, 'px'), __label: t('label_breakpoint_tablet') },
            { name: 'mobile', selector: slider(320, 1200, 8, 'px'), __label: t('label_breakpoint_mobile') },
          ],
        },
        { name: 'showRight', selector: { boolean: {} } },
        { name: 'hideOnPath', selector: { text: { multiple: true } }, __helper: t('helper_hideOnPath') },
      ],
    },
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_design'),
      icon: 'mdi:palette-outline',
      schema: [
        {
          type: 'grid',
          name: '',
          schema: [color('background'), color('textColor'), color('iconColor'), color('accentColor'), color('dividerColor')],
        },
        { name: 'blur', selector: slider(0, 30, 1, 'px'), __helper: t('helper_blur') },
        { name: 'style', selector: { text: { multiline: true } } },
      ],
    },
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_advanced'),
      icon: 'mdi:cog-outline',
      schema: [
        { name: 'hideTopMenu', selector: { boolean: {} }, __helper: t('helper_hideTopMenu') },
        ...(data.hideTopMenu ? [{ name: 'showTopMenuOnMobile', selector: { boolean: {} } }] : []),
        { name: 'hideHassSidebar', selector: { boolean: {} }, __helper: t('helper_hideHassSidebar') },
        { name: 'dockHassSidebar', selector: { boolean: {} }, __helper: t('helper_dockHassSidebar') },
        { name: 'debug', selector: { boolean: {} } },
      ],
    },
  ];
}

class SidebarCardEditor extends LitElement {
  hass: any;
  lovelace: any;
  originalConfig: any = {};
  side = 'right';
  onPreview: any = null;
  onClose: any = null;
  _data: any = {};
  _ready = false;
  _saving = false;
  _error = '';
  _schemaKey = '';
  _schema: any[] = [];

  static get properties() {
    return {
      hass: { attribute: false },
      side: { type: String, reflect: true },
      _data: { attribute: false },
      _ready: { attribute: false },
      _saving: { attribute: false },
      _error: { attribute: false },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._data = toFormData(this.originalConfig, this.hass);
    loadHaForm().then(() => {
      this._ready = true;
    });
  }

  _computeLabel = (schema: any) => schema.__label || localize('label_' + schema.name, this.hass);

  _computeHelper = (schema: any) => schema.__helper;

  _getSchema() {
    const d = this._data;
    const views = this.lovelace && this.lovelace.config ? this.lovelace.config.views : [];
    const key = JSON.stringify([
      this.hass && this.hass.language,
      d.digitalClock,
      d.clock,
      d.date,
      d.dateFormatPreset === CUSTOM_DATE_FORMAT,
      d.viewMenu,
      d.bottomButtonsLayout,
      d.widthUnit,
      d.hideTopMenu,
      (views || []).map((view) => [view.path, view.title]),
    ]);
    // a stable schema keeps the focus in the field that is being typed into
    if (key !== this._schemaKey) {
      this._schemaKey = key;
      this._schema = buildEditorSchema(d, this.lovelace, this.hass);
    }
    return this._schema;
  }

  render() {
    const t = (key: string) => localize(key, this.hass);
    return html`
      <div class="panel" role="dialog" aria-label="${t('editor_title')}">
        <div class="header">
          <ha-icon icon="mdi:dock-left"></ha-icon>
          <h2>${t('editor_title')}</h2>
          <button class="icon" title="${t('cancel')}" @click=${() => this._close(false)}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="content">
          ${this._ready
            ? html`
                <ha-form
                  .hass=${this.hass}
                  .data=${this._data}
                  .schema=${this._getSchema()}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${(ev) => this._valueChanged(ev)}
                ></ha-form>
              `
            : html`
                <p class="hint">${t('loading')}</p>
              `}
        </div>
        <div class="footer">
          ${this._error
            ? html`
                <span class="error">${this._error}</span>
              `
            : ''}
          <button class="secondary" ?disabled=${this._saving} @click=${() => this._close(false)}>${t('cancel')}</button>
          <button class="primary" ?disabled=${this._saving} @click=${() => this._save()}>${this._saving ? t('saving') : t('save')}</button>
        </div>
      </div>
    `;
  }

  _valueChanged(ev: any) {
    ev.stopPropagation();
    const previous = this._data;
    const data = Object.assign({}, ev.detail.value);
    // a chosen preset is copied into the custom field, so "custom" starts from it
    if (data.dateFormatPreset !== previous.dateFormatPreset && data.dateFormatPreset !== CUSTOM_DATE_FORMAT) {
      data.dateFormat = data.dateFormatPreset;
    }
    if (data.widthUnit !== previous.widthUnit && data.width) {
      data.width = convertWidth(data.width, data.widthUnit);
    }
    this._data = data;
    if (this.onPreview) this.onPreview(fromFormData(data, this.hass));
  }

  async _save() {
    this._saving = true;
    this._error = '';
    try {
      const config = fromFormData(this._data, this.hass);
      // the latest dashboard config, so changes made in the HA editor meanwhile are kept
      const lovelace = getLovelace() || this.lovelace;
      const stored = lovelace.rawConfig || lovelace.config;
      await lovelace.saveConfig(Object.assign({}, stored, { sidebar: config }));
      this._close(true);
    } catch (err) {
      this._error = localize('save_error', this.hass) + ((err && (err as any).message) || err);
      this._saving = false;
    }
  }

  _close(saved: boolean) {
    this.remove();
    if (this.onClose) this.onClose(saved);
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 6;
        display: flex;
        width: min(460px, 100vw);
        font-family: var(--ha-font-family-body, Roboto, Noto, sans-serif);
        color: var(--primary-text-color, #212121);
      }
      :host([side='left']) {
        right: auto;
        left: 0;
      }
      .panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
      }
      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 8px 12px 20px;
        padding-top: calc(12px + env(safe-area-inset-top));
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      .header ha-icon {
        color: var(--primary-color, #03a9f4);
      }
      h2 {
        flex: 1;
        margin: 0;
        font-size: 20px;
        font-weight: 400;
      }
      .content {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 16px 20px;
      }
      ha-form {
        display: block;
      }
      .hint {
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        line-height: 18px;
      }
      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 20px;
        padding-bottom: calc(12px + env(safe-area-inset-bottom));
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      .error {
        margin-right: auto;
        color: var(--error-color, #db4437);
        font-size: 13px;
      }
      button {
        font: inherit;
        cursor: pointer;
      }
      button.icon {
        display: flex;
        padding: 8px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--secondary-text-color, #727272);
      }
      button.icon:hover {
        background: rgba(127, 127, 127, 0.12);
      }
      button.primary,
      button.secondary {
        height: 40px;
        padding: 0 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
      }
      button.primary {
        border: none;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
      }
      button.secondary {
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        background: transparent;
        color: var(--primary-color, #03a9f4);
      }
      button[disabled] {
        opacity: 0.5;
        cursor: default;
      }
    `;
  }
}

customElements.define('sidebar-card-editor', SidebarCardEditor);

// ##########################################################################################
// ###   The default CSS of the Sidebar Card element
// ##########################################################################################

// the sidebar width as CSS length: numbers use widthUnit (default %), strings are used as they are
function resolveWidth(sidebarConfig: any, screenWidth: number) {
  let width: any = 25;
  if (typeof sidebarConfig.width == 'number' || typeof sidebarConfig.width == 'string') {
    width = sidebarConfig.width;
  } else if (sidebarConfig.width && typeof sidebarConfig.width == 'object') {
    if (screenWidth <= sidebarConfig.breakpoints.mobile) {
      width = sidebarConfig.width.mobile;
    } else if (screenWidth <= sidebarConfig.breakpoints.tablet) {
      width = sidebarConfig.width.tablet;
    } else {
      width = sidebarConfig.width.desktop;
    }
  }
  if (width === undefined || width === null || String(width).trim() === '') width = 25;
  if (/^\d+(\.\d+)?$/.test(String(width).trim())) {
    return `${String(width).trim()}${sidebarConfig.widthUnit === 'px' ? 'px' : '%'}`;
  }
  return String(width).trim();
}

function createCSS(sidebarConfig: any, screenWidth: number, editMode = false) {
  const hideTopMenu = isTopMenuHidden(sidebarConfig, screenWidth, editMode);
  const headerHeightPx = getHeaderHeightPx();
  const sidebarWidth = resolveWidth(sidebarConfig, screenWidth);
  const hidden = parseFloat(sidebarWidth) === 0;

  return `
    #customSidebarWrapper {
      display:flex;
      flex-direction:row;
      overflow:hidden;
    }
    #customSidebar.hide {
      display:none!important;
      width:0!important;
    }
    #view.hideSidebar {
      width:100%!important;
    }
    #customSidebar {
      flex:0 0 ${sidebarWidth};
      width:${sidebarWidth};
      min-width:0;
      overflow:hidden;
      order:${sidebarConfig.showRight ? 2 : 0};
      ${hidden ? 'display:none;' : ''}
      ${hideTopMenu ? '' : 'margin-top: calc(' + headerHeightPx + ' + env(safe-area-inset-top));'}
    }
    #view {
      flex:1 1 0;
      min-width:0;
      width:auto;
      order:1;
      ${hideTopMenu ? 'padding-top:0!important;margin-top:0!important;' : ''}
    }
  `;
}

// ##########################################################################################
// ###   Helper methods
// ##########################################################################################

function getLovelace() {
  const root = getRoot();
  if (root && root.lovelace) {
    const ll = root.lovelace;
    ll.current_view = root.___curView;
    return ll;
  }
  return null;
}

// true when the shown dashboard is the one in the address bar, not the one we are navigating away from
function isCurrentDashboard(lovelace: any) {
  if (lovelace.urlPath === undefined) return true;
  return (lovelace.urlPath ?? 'lovelace') === window.location.pathname.split('/')[1];
}

function isDebug() {
  const lovelace = getLovelace();
  return !!(lovelace && lovelace.config && lovelace.config.sidebar && lovelace.config.sidebar.debug === true);
}

function log2console(method: string, message: string, object?: any) {
  if (isDebug()) {
    console.info(`%c${SIDEBAR_CARD_TITLE}: %c ${method.padEnd(24)} -> %c ${message}`, 'color: chartreuse; background: black; font-weight: 700;', 'color: yellow; background: black; font-weight: 700;', '', object);
  }
}

function error2console(method: string, message: string, object?: any) {
  if (isDebug()) {
    console.error(`%c${SIDEBAR_CARD_TITLE}: %c ${method.padEnd(24)} -> %c ${message}`, 'color: red; background: black; font-weight: 700;', 'color: white; background: black; font-weight: 700;', 'color:red', object);
  }
}

// Returns the root element
function getRoot() {
  let root: any = document.querySelector('home-assistant');
  root = root && root.shadowRoot;
  root = root && root.querySelector('home-assistant-main');
  root = root && root.shadowRoot;
  root = root && root.querySelector('ha-drawer partial-panel-resolver');
  root = (root && root.shadowRoot) || root;
  root = root && root.querySelector('ha-panel-lovelace');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hui-root');

  return root;
}

// return var(--header-height) from #view element
// We need to take from the div#view element in case of "kiosk-mode" module installation that defined new CSS var(--header-height) as local new variable, not available in div#customSidebar
function getHeaderHeightPx() {
  let headerHeightPx = '0px';
  const root = getRoot();
  if (!root || !root.shadowRoot) {
    return headerHeightPx; // Fallback for Safari LOG entry: (evaluating 'root.shadowRoot')
  }
  const view = root.shadowRoot.getElementById('view');
  if (view) {
    headerHeightPx = window.getComputedStyle(view).paddingTop;
  }
  return headerHeightPx;
}

// Returns the Home Assistant Sidebar element
function getSidebar() {
  let sidebar: any = document.querySelector('home-assistant');
  sidebar = sidebar && sidebar.shadowRoot;
  sidebar = sidebar && sidebar.querySelector('home-assistant-main');
  sidebar = sidebar && sidebar.shadowRoot;
  sidebar = sidebar && sidebar.querySelector('ha-drawer ha-sidebar');

  return sidebar;
}

// Returns the Home Assistant ha-drawer element that holds the HA sidebar
function getDrawer() {
  let drawer: any = document.querySelector('home-assistant');
  drawer = drawer && drawer.shadowRoot;
  drawer = drawer && drawer.querySelector('home-assistant-main');
  drawer = drawer && drawer.shadowRoot;
  return drawer && drawer.querySelector('ha-drawer');
}

// Returns the Home Assistant app-drawer layout element (HA before 2026.6)
function getAppDrawerLayout() {
  const drawer = getDrawer();
  return drawer && drawer.shadowRoot && drawer.shadowRoot.querySelector('.mdc-drawer-app-content');
}

// Returns the Home Assistant app-drawer element (HA before 2026.6)
function getAppDrawer() {
  const drawer = getDrawer();
  return drawer && drawer.shadowRoot && drawer.shadowRoot.querySelector('.mdc-drawer');
}

// true when the HA header should be hidden at this screen width; in edit mode it stays, so "Done" can be reached
function isTopMenuHidden(sidebarConfig: any, width: number, editMode = false) {
  return (
    !editMode &&
    sidebarConfig.hideTopMenu === true &&
    getParameterByName('sidebarOff') == null &&
    !(sidebarConfig.showTopMenuOnMobile === true && width <= (sidebarConfig.breakpoints?.mobile ?? 768))
  );
}

// hides or restores the HA sidebar
function setHassSidebarHidden(hidden: boolean) {
  const hassSidebar = getSidebar();
  if (hassSidebar) {
    hassSidebar.style.display = hidden ? 'none' : '';
  }
  const appDrawerLayout = getAppDrawerLayout();
  if (appDrawerLayout) {
    appDrawerLayout.style.marginLeft = hidden ? '0' : '';
    appDrawerLayout.style.paddingLeft = hidden ? '0' : '';
  }
  const appDrawer = getAppDrawer();
  if (appDrawer) {
    appDrawer.style.display = hidden ? 'none' : '';
  }
  // Since HA 2026.6 ha-drawer keeps a column of --ha-sidebar-width for the sidebar,
  // which stayed as an empty white bar when only ha-sidebar was hidden (#155)
  const drawer = getDrawer();
  if (drawer) {
    if (hidden) {
      drawer.style.setProperty('--ha-sidebar-width', '0px');
      drawer.style.setProperty('--ha-top-app-bar-width', '100%');
    } else {
      drawer.style.removeProperty('--ha-sidebar-width');
      drawer.style.removeProperty('--ha-top-app-bar-width');
    }
    const drawerRoot = drawer.shadowRoot;
    const shellStyle = drawerRoot && drawerRoot.getElementById('sidebarCardHideHassSidebar');
    if (hidden && drawerRoot && !shellStyle) {
      const style = document.createElement('style');
      style.id = 'sidebarCardHideHassSidebar';
      // the empty sidebar column still draws its border line
      style.textContent = '.sidebar-shell { display: none !important; }';
      // prepend: Lit clears everything after its own marker when the drawer switches to/from modal
      drawerRoot.prepend(style);
    } else if (!hidden && shellStyle) {
      shellStyle.remove();
    }
  }
}

// Returns a query parameter by its name
function getParameterByName(name: string, url = window.location.href) {
  const parameterName = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + parameterName + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// true when hideOnPath lists the current path; accepts a single path and ignores trailing slashes (#153)
function isPathHidden(sidebarConfig: any) {
  if (!sidebarConfig.hideOnPath) return false;
  const trim = (path: string) => String(path).replace(/\/+$/, '');
  return ([] as any[])
    .concat(sidebarConfig.hideOnPath)
    .map(trim)
    .includes(trim(window.location.pathname));
}

// the sidebar config with default breakpoints
function withDefaults(sidebarConfig: any) {
  const config = Object.assign({}, sidebarConfig);
  config.breakpoints = Object.assign({ tablet: 1024, mobile: 768 }, sidebarConfig.breakpoints || {});
  return config;
}

function isValidWidth(sidebarConfig: any) {
  const width = sidebarConfig.width;
  if (width === undefined || width === null) return true;
  if (typeof width === 'number') return width >= 0 && (sidebarConfig.widthUnit === 'px' || width < 100);
  return typeof width === 'string' || typeof width === 'object';
}

function createElementFromHTML(htmlString: string) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

// non-blocking sleep function
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// the next animation frame, or a short timeout in background tabs where frames do not run
function nextFrame() {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, 100);
    requestAnimationFrame(() => {
      clearTimeout(timeout);
      resolve(undefined);
    });
  });
}

// Checks every frame at first, so the sidebar is in place before Home Assistant paints the view
// (the cards jumped to the right when it came 500 ms later); slower after 10 s, e.g. on other pages
async function poll(check: () => any, timeoutMs = Infinity) {
  const start = Date.now();
  for (;;) {
    const value = check();
    if (value) return value;
    const elapsed = Date.now() - start;
    if (elapsed > timeoutMs) return null;
    if (elapsed < 10000) await nextFrame();
    else await sleep(500);
  }
}

// gets the lovelace config of the dashboard that is shown
function getConfig() {
  return poll(() => {
    const lovelace = getLovelace();
    return lovelace && isCurrentDashboard(lovelace) ? lovelace : null;
  });
}

// ##########################################################################################
// ###   The sidebar that is currently built
// ##########################################################################################

interface SidebarState {
  lovelace: any;
  config: any; // as stored in the dashboard
  configJson: string;
  applied: any; // shown right now, the editor's preview while it is open
  previewing: boolean;
  appLayout: any;
  wrapper: any;
  sidebar: any;
  contentContainer: any;
  style: any;
  card: any;
  listeners: any[];
  observers: any[];
  relayoutPending: boolean;
  hassSidebarHidden: boolean;
  headerHidden: boolean;
  docked: boolean;
}

let current: SidebarState | null = null;
let building = false;

function addListener(state: SidebarState, target: any, type: string, handler: any, options?: any) {
  target.addEventListener(type, handler, options);
  state.listeners.push([target, type, handler, options]);
}

// HA keeps the docked state per browser; remember what it was so we can put it back
const DOCK_STORAGE_KEY = 'sidebar-card-dock-before';

function dockHassSidebar(dock: string) {
  document
    .querySelector('home-assistant')
    ?.dispatchEvent(new CustomEvent('hass-dock-sidebar', { detail: { dock }, bubbles: true, composed: true }));
}

function readDockBefore() {
  try {
    return localStorage.getItem(DOCK_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeDockBefore(value: string | null) {
  try {
    if (value === null) localStorage.removeItem(DOCK_STORAGE_KEY);
    else localStorage.setItem(DOCK_STORAGE_KEY, value);
  } catch {
    // private mode: nothing to remember
  }
}

// dockHassSidebar folds the HA sidebar away (like the profile setting "always hidden") while this dashboard is shown
function applyDock(state: SidebarState | null, wanted: boolean) {
  const homeAssistant: any = document.querySelector('home-assistant');
  const docked = homeAssistant && homeAssistant.hass ? homeAssistant.hass.dockedSidebar : undefined;
  const before = readDockBefore();
  if (wanted) {
    if (before === null) writeDockBefore(docked && docked !== 'always_hidden' ? docked : 'unchanged');
    if (docked !== 'always_hidden') dockHassSidebar('always_hidden');
    if (state) state.docked = true;
  } else if ((state && state.docked) || before !== null) {
    if (before && before !== 'unchanged' && docked === 'always_hidden') dockHassSidebar(before);
    writeDockBefore(null);
    if (state) state.docked = false;
  }
}

// hides (if requested) the HA header, HA footer and/or HA sidebar, sizes the sidebar and hides it on hideOnPath
function updateStyling(state: SidebarState, sidebarConfig: any) {
  // listeners of a dashboard that is not shown anymore must not restyle the current one
  if (!state.appLayout.isConnected) return;
  const config = withDefaults(sidebarConfig);
  const width = document.body.clientWidth;
  const offParam = getParameterByName('sidebarOff');
  const editMode = !!(state.lovelace && state.lovelace.editMode);
  const hideTopMenu = isTopMenuHidden(config, width, editMode);

  const root = getRoot();
  // SAFETY CHECK: the HA UI root (or its shadowRoot) may not be ready yet — e.g. a
  // resize event firing mid-render in Firefox. Bail out instead of crashing. Fixes #149.
  if (!root || !root.shadowRoot) {
    error2console('updateStyling', 'Root element or shadowRoot not found!');
    return;
  }

  // only touch the header when we hide it or hid it before, kiosk tools may hide it themselves
  if (hideTopMenu || state.headerHidden) {
    const hassHeader = root.shadowRoot.querySelector('.header');
    const hassFooter = root.shadowRoot.querySelector('ch-footer') || root.shadowRoot.querySelector('app-footer');
    log2console('updateStyling', `Action: ${hideTopMenu ? 'Hide' : 'Show'} Home Assistant header and footer!`);
    if (hassHeader) hassHeader.style.display = hideTopMenu ? 'none' : '';
    if (hassFooter) hassFooter.style.display = hideTopMenu ? 'none' : '';
    state.contentContainer.style.minHeight = hideTopMenu ? '100vh' : '';
    state.headerHidden = hideTopMenu;
  }

  // measure the header height without our own padding override
  if (!hideTopMenu && state.style.textContent.includes('padding-top:0')) state.style.textContent = '';
  const css = createCSS(config, width, editMode);
  if (state.style.textContent !== css) state.style.textContent = css;

  applyDock(state, config.dockHassSidebar === true && offParam == null);

  const hideHassSidebar =
    config.hideHassSidebar === true && offParam == null && !(config.showTopMenuOnMobile === true && width <= config.breakpoints.mobile);
  if (hideHassSidebar || state.hassSidebarHidden) {
    // keep the HA sidebar usable when its menu button is shown on mobile (#74, #145)
    setHassSidebarHidden(hideHassSidebar);
    state.hassSidebarHidden = hideHassSidebar;
  }

  const pathHidden = isPathHidden(config);
  state.contentContainer.classList.toggle('hideSidebar', pathHidden);
  state.sidebar.classList.toggle('hide', pathHidden);
  if (pathHidden) log2console('updateStyling', 'Disable sidebar for this path');
}

// measures the header again and sizes the sidebar, e.g. after edit mode added or removed its tab bar
function relayout(state: SidebarState) {
  if (current !== state) return;
  updateStyling(state, state.applied);
  state.card.updateSidebarSize();
}

function scheduleRelayout(state: SidebarState) {
  if (state.relayoutPending) return;
  state.relayoutPending = true;
  requestAnimationFrame(() => {
    state.relayoutPending = false;
    relayout(state);
  });
}

// shows a sidebar config, either the stored one or the editor's preview
function applyConfig(state: SidebarState, sidebarConfig: any) {
  state.applied = sidebarConfig;
  state.card.setConfig(sidebarConfig);
  relayout(state);
}

function previewSidebar(sidebarConfig: any) {
  if (!current) return;
  current.previewing = true;
  applyConfig(current, sidebarConfig);
}

function endPreview(saved: boolean) {
  if (!current) return;
  current.previewing = false;
  // when saved, the watcher picks up the new dashboard config
  if (!saved) applyConfig(current, current.config);
}

// forgets a sidebar whose dashboard is gone
function dropState(state: SidebarState) {
  state.listeners.forEach(([target, type, handler, options]) => target.removeEventListener(type, handler, options));
  state.listeners = [];
  state.observers.forEach((observer) => observer.disconnect());
  state.observers = [];
  if (state.docked) applyDock(state, false);
  if (state.hassSidebarHidden) {
    setHassSidebarHidden(false);
    state.hassSidebarHidden = false;
  }
  if (current === state) current = null;
}

// removes the sidebar and puts the view back where Home Assistant had it
function teardownSidebar() {
  const state = current;
  if (!state) return;
  dropState(state);
  const view = state.contentContainer;
  if (view.parentNode === state.wrapper && state.wrapper.parentNode) {
    state.wrapper.parentNode.insertBefore(view, state.wrapper);
  }
  view.classList.remove('hideSidebar');
  if (state.headerHidden) {
    const root = getRoot();
    const hassHeader = root && root.shadowRoot && root.shadowRoot.querySelector('.header');
    if (hassHeader) hassHeader.style.display = '';
    view.style.minHeight = '';
  }
  state.wrapper.remove();
  state.style.remove();
}

// follows dashboard changes: saved sidebar config, added views, edit mode on/off
function checkLovelace() {
  const state = current;
  if (!state) {
    const lovelace = getLovelace();
    if (lovelace && lovelace.config && isCurrentDashboard(lovelace)) {
      // a sidebar was added to the dashboard that is shown right now
      if (lovelace.config.sidebar) buildSidebar();
      // the HA sidebar was folded away by a dashboard that is gone (e.g. after a reload elsewhere)
      else if (readDockBefore() !== null) applyDock(null, false);
    }
    return;
  }
  if (!state.wrapper.isConnected) {
    dropState(state);
    return;
  }
  const lovelace = getLovelace();
  if (!lovelace || lovelace === state.lovelace || !isCurrentDashboard(lovelace)) return;
  state.lovelace = lovelace;
  state.card.lovelace = lovelace;
  // edit mode on/off changes the header height; HA renders it a moment later
  [0, 150, 500].forEach((delay) => setTimeout(() => relayout(state), delay));

  const sidebarConfig = lovelace.config && lovelace.config.sidebar;
  if (!sidebarConfig) {
    teardownSidebar();
    return;
  }
  const json = JSON.stringify(sidebarConfig);
  if (json !== state.configJson) {
    state.config = clone(sidebarConfig);
    state.configJson = json;
    if (!state.previewing) applyConfig(state, state.config);
  }
}

// ##########################################################################################
// ###   The Sidebar Card code base initialisation
// ##########################################################################################

async function buildSidebar() {
  // startup, location-changed and the watcher can all get here; build only once (#152)
  if (building) return;
  building = true;
  try {
    await doBuildSidebar();
  } catch (err) {
    error2console('buildSidebar', 'Building the sidebar failed', err);
  } finally {
    building = false;
  }
}

async function doBuildSidebar() {
  const lovelace = await getConfig();
  if (current && !current.wrapper.isConnected) dropState(current);
  if (!lovelace.config.sidebar) {
    log2console('buildSidebar', 'No sidebar in config found!');
    return;
  }

  const sidebarConfig = clone(lovelace.config.sidebar);
  if (!isValidWidth(sidebarConfig)) {
    error2console('buildSidebar', 'Error sidebar in width config!');
    return;
  }

  const root = getRoot();
  // SAFETY CHECK: Only continue if root and shadowRoot are valid
  if (!root || !root.shadowRoot) {
    error2console('buildSidebar', 'Root element or shadowRoot not found!');
    return;
  }
  await root.updateComplete;
  // wait (every frame) until hui-root has rendered the view, but only for this dashboard
  const appLayout = await poll(() => {
    if (getRoot() !== root) return 'gone';
    const layout = root.shadowRoot.querySelector('div');
    return layout && layout.querySelector('#view') ? layout : null;
  }, 10000);
  // Nothing below awaits before the wrapper is in the DOM, so this check cannot race.
  if (!appLayout || appLayout === 'gone' || appLayout.querySelector('#customSidebarWrapper')) {
    return;
  }

  const style: any = document.createElement('style');
  style.setAttribute('id', 'customSidebarStyle');
  style.type = 'text/css';
  appLayout.appendChild(style);

  // wrap #view and put the sidebar next to it; the order (left/right) is set by CSS
  const contentContainer = appLayout.querySelector('#view');
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'customSidebarWrapper');
  contentContainer.parentNode.insertBefore(wrapper, contentContainer);
  const sidebar = document.createElement('div');
  sidebar.setAttribute('id', 'customSidebar');
  wrapper.appendChild(sidebar);
  wrapper.appendChild(contentContainer);

  const card: any = document.createElement('sidebar-card');
  card.lovelace = lovelace;
  card.setConfig(sidebarConfig);
  card.hass = hass();
  sidebar.appendChild(card);

  const state: SidebarState = {
    lovelace,
    config: sidebarConfig,
    configJson: JSON.stringify(lovelace.config.sidebar),
    applied: sidebarConfig,
    previewing: false,
    appLayout,
    wrapper,
    sidebar,
    contentContainer,
    style,
    card,
    listeners: [],
    observers: [],
    relayoutPending: false,
    hassSidebarHidden: false,
    headerHidden: false,
    docked: false,
  };
  current = state;

  addListener(state, window, 'resize', () => relayout(state), true);
  // right away, so hideOnPath shows the sidebar again on the next view (#78); once more after HA re-rendered the header
  addListener(state, window, 'location-changed', () => {
    relayout(state);
    setTimeout(() => relayout(state), 150);
  });
  addListener(state, window, 'popstate', () => setTimeout(() => relayout(state), 0));
  if (typeof ResizeObserver !== 'undefined') {
    // the header grows and shrinks with edit mode, the view's top padding with it
    const observer = new ResizeObserver(() => scheduleRelayout(state));
    const header = root.shadowRoot.querySelector('.header');
    if (header) observer.observe(header);
    observer.observe(contentContainer);
    state.observers.push(observer);
  }
  relayout(state);
}

// show console message on init
console.info(
  `%c  ${SIDEBAR_CARD_TITLE.padEnd(24)}%c
  Version: ${SIDEBAR_CARD_VERSION.padEnd(9)}      `,
  'color: chartreuse; background: black; font-weight: 700;',
  'color: white; background: dimgrey; font-weight: 700;',
);

buildSidebar();
// The new panel is not rendered yet when location-changed fires, so checking the DOM here missed
// dashboards opened from another page (#112, #137). buildSidebar waits for it and skips built ones.
window.addEventListener('location-changed', () => buildSidebar());
setInterval(checkLovelace, 500);
