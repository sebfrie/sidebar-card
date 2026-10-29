// ------------------------------------------------------------------------------------------
//  SIDEBAR-CARD
// ------------------------------------------------------------------------------------------
//  https://github.com/DBuit/sidebar-card
// ------------------------------------------------------------------------------------------

// ##########################################################################################
// ###   Global constants
// ##########################################################################################

const SIDEBAR_CARD_TITLE = 'SIDEBAR-CARD';
const SIDEBAR_CARD_VERSION = '0.4.0';

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
    editor_title: 'Sidebar configuration',
    element_digitalClock: 'Digital clock',
    element_analogClock: 'Analog clock',
    element_date: 'Date',
    add_element: 'Add',
    edit_element: 'Edit',
    remove_element: 'Remove',
    move_element: 'Drag to move',
    no_elements: 'No clock and no date yet.',
    with_second_hand: 'with second hand',
    without_second_hand: 'without second hand',
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
    label_seconds: 'Show seconds',
    label_secondHand: 'Second hand',
    label_size: 'Size',
    label_formatPreset: 'Date format',
    label_format: 'Custom date format',
    label_glass: 'Glass effect',
    label_blur: 'Blur',
    label_timeFormat: 'Time format',
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
    helper_glass:
      'Makes the sidebar semi-transparent and blurs the dashboard background behind it. With your own background color, its transparency is used, e.g. rgba(0, 0, 0, 0.4).',
    helper_digitalSize: 'Largest size; the time always fits the sidebar.',
    helper_hideTopMenu:
      'It stays visible in edit mode. To edit the dashboard, add ?edit=1 to its address; ?sidebar=true shows the header and sidebar of Home Assistant again until the page is reloaded.',
    helper_hideHassSidebar: 'Removes it completely, including the menu button. ?sidebar=true in the address shows it again.',
    helper_dockHassSidebar: 'While this dashboard is open, only the narrow icon bar is shown; the menu button expands it.',
  },
  de: {
    edit_sidebar: 'Seitenleiste bearbeiten',
    editor_title: 'Seitenleiste anpassen',
    element_digitalClock: 'Digitaluhr',
    element_analogClock: 'Analoge Uhr',
    element_date: 'Datum',
    add_element: 'Hinzufügen',
    edit_element: 'Bearbeiten',
    remove_element: 'Entfernen',
    move_element: 'Zum Verschieben ziehen',
    no_elements: 'Noch keine Uhr und kein Datum.',
    with_second_hand: 'mit Sekundenzeiger',
    without_second_hand: 'ohne Sekundenzeiger',
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
    label_seconds: 'Sekunden anzeigen',
    label_secondHand: 'Sekundenzeiger',
    label_size: 'Größe',
    label_formatPreset: 'Datumsformat',
    label_format: 'Eigenes Datumsformat',
    label_glass: 'Glas-Effekt',
    label_blur: 'Unschärfe',
    label_timeFormat: 'Zeitformat',
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
    helper_glass:
      'Macht die Seitenleiste halbtransparent und den Dashboard-Hintergrund dahinter unscharf. Bei eigener Hintergrundfarbe zählt deren Transparenz, z. B. rgba(0, 0, 0, 0.4).',
    helper_digitalSize: 'Höchstgröße; die Uhrzeit passt immer in die Seitenleiste.',
    helper_hideTopMenu:
      'Im Bearbeitungsmodus bleibt sie sichtbar. Zum Bearbeiten ?edit=1 an die Adresse des Dashboards anhängen; ?sidebar=true zeigt Kopf- und Seitenleiste von Home Assistant bis zum Neuladen wieder.',
    helper_hideHassSidebar: 'Blendet sie komplett aus, auch den Menü-Button. ?sidebar=true an der Adresse zeigt sie wieder.',
    helper_dockHassSidebar: 'Solange dieses Dashboard offen ist, zeigt Home Assistant nur die schmale Icon-Leiste; der Menü-Button klappt sie auf.',
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

// Clocks and dates at the top of the sidebar, in the order of the list; each type has its own options
const ELEMENT_TYPES: Record<string, { icon: string; defaults: Record<string, any> }> = {
  digitalClock: { icon: 'mdi:clock-digital', defaults: { timeFormat: '24', seconds: false, size: 60 } },
  analogClock: { icon: 'mdi:clock-outline', defaults: { seconds: true, size: 220 } },
  date: { icon: 'mdi:calendar-today', defaults: { size: 22 } },
};

// the elements list, or the one older configs describe with digitalClock, clock and date
function elementsOf(config: any): any[] {
  if (Array.isArray(config.elements)) return config.elements.filter((element) => element && ELEMENT_TYPES[element.type]);
  const seconds = showSeconds(config);
  const elements: any[] = [];
  if (config.digitalClock) elements.push({ type: 'digitalClock', timeFormat: timeFormatOf(config), seconds, size: config.clockSize });
  if (config.clock) elements.push({ type: 'analogClock', seconds, size: config.analogClockSize });
  if (config.date) elements.push({ type: 'date', format: config.dateFormat });
  return elements.map((element) => {
    Object.keys(element).forEach((key) => element[key] === undefined && delete element[key]);
    return element;
  });
}

const GLASS_BLUR = 12;

// glass: semi-transparent and blurring; older configs only had blur
function isGlass(config: any) {
  return config.glass !== undefined ? !!config.glass : Number(config.blur) > 0;
}

function elementOption(element: any, key: string) {
  return element[key] !== undefined && element[key] !== null && element[key] !== '' ? element[key] : ELEMENT_TYPES[element.type].defaults[key];
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
    const editMode = this._isEditMode();

    return html`
      ${c.style
        ? html`
            <style>
              ${c.style}
            </style>
          `
        : ''}
      <div class="sidebar-inner${isGlass(c) ? ' glass' : ''}${editMode ? ' editing' : ''}${c.showRight ? ' right' : ''}">
        ${editMode
          ? html`
              <button class="edit-sidebar" title="${localize('edit_sidebar', this.hass)}" @click=${() => this._openEditor()}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
            `
          : ''}
        <div class="sidebar-main">
          ${elementsOf(c).map((element) => this._renderElement(element))}
          ${c.title
            ? html`
                <h1 class="title">${c.title}</h1>
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

  _renderElement(element: any) {
    const size = elementOption(element, 'size');
    const seconds = !!elementOption(element, 'seconds');
    if (element.type === 'digitalClock') {
      const time = formatTime(this._now, elementOption(element, 'timeFormat'), seconds);
      return html`
        <h1 class="digitalClock${seconds ? ' with-seconds' : ''}" style="--sb-size: ${size}px">${time}</h1>
      `;
    }
    if (element.type === 'analogClock') {
      const now = this._now;
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const secs = now.getSeconds();
      return html`
        <div class="clock" style="--sb-size: ${size}px">
          <div class="wrap">
            <span class="hour" style="transform: rotate(${hours * 30 + minutes * 0.5}deg)"></span>
            <span class="minute" style="transform: rotate(${minutes * 6 + secs * 0.1}deg)"></span>
            ${seconds
              ? html`
                  <span class="second" style="transform: rotate(${secs * 6}deg)"></span>
                `
              : ''}
            <span class="dot"></span>
          </div>
        </div>
      `;
    }
    const language = languageOf(this.hass);
    const date = moment(this._now)
      .locale(language)
      .format(element.format || datePresets(language)[0]);
    return html`
      <h2 class="date" style="--sb-size: ${size}px">${date}</h2>
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
    if (elementsOf(this.config || {}).length > 0) {
      this._now = new Date();
    }
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
      '--sidebar-blur': isGlass(c) ? `${c.blur || GLASS_BLUR}px` : undefined,
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
        color: var(--sb-text);
        background: var(--sidebar-background, var(--ha-card-background, var(--card-background-color, #fff)));
      }
      /* semi-transparent, blurring the dashboard background that shows through */
      .sidebar-inner.glass {
        background: var(
          --sidebar-background,
          color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #fff)) 55%, transparent)
        );
        -webkit-backdrop-filter: blur(var(--sidebar-blur, 12px));
        backdrop-filter: blur(var(--sidebar-blur, 12px));
      }
      /* above the view, so the edit flag sticking out of the sidebar can be tapped */
      .sidebar-inner.editing {
        z-index: 3;
      }
      .sidebar-main {
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden auto;
        padding: var(--sb-padding);
        scrollbar-width: thin;
        container-type: inline-size;
      }
      .sidebar-footer {
        flex: 0 0 auto;
        padding: 12px var(--sb-padding) var(--sb-padding);
        border-top: 1px solid var(--sb-divider);
      }

      /* edit mode: a flag sticking out of the sidebar's outer edge */
      .edit-sidebar {
        position: absolute;
        top: 16px;
        left: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 48px;
        padding: 0 2px 0 0;
        border: none;
        border-radius: 0 12px 12px 0;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
        cursor: pointer;
        --mdc-icon-size: 22px;
      }
      .sidebar-inner.right .edit-sidebar {
        left: auto;
        right: 100%;
        padding: 0 0 0 2px;
        border-radius: 12px 0 0 12px;
        box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.25);
      }
      .edit-sidebar:hover {
        filter: brightness(1.1);
      }

      /* clocks, dates, title */
      h1,
      h2 {
        margin: 0 0 16px;
        color: var(--sb-text);
        cursor: default;
      }
      h1 {
        font-size: 32px;
        line-height: 1.1;
        font-weight: 200;
      }
      /* the size is a maximum: the time always fits the sidebar's width */
      h1.digitalClock {
        font-size: min(var(--sb-size, 60px), 36cqw);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      h1.digitalClock.with-seconds {
        font-size: min(var(--sb-size, 60px), 22cqw);
      }
      h2.date {
        font-size: var(--sb-size, 22px);
        line-height: 1.2;
        font-weight: 300;
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
        width: min(100%, var(--sb-size, 220px));
        aspect-ratio: 1;
        margin: 4px auto 20px;
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
  widthUnit: '%',
  menuFontSize: 18,
  blur: GLASS_BLUR,
};
const DEFAULT_BREAKPOINTS = { tablet: 1024, mobile: 768 };
const DEFAULT_WIDTH_PERCENT = 25;
// switches that are off by default and not stored when off
const OFF_BY_DEFAULT = ['viewMenu', 'bottomButtonsShowName', 'showRight', 'hideTopMenu', 'showTopMenuOnMobile', 'hideHassSidebar', 'dockHassSidebar', 'debug'];
const CUSTOM_DATE_FORMAT = 'custom';
const WIDTH_KEYS = ['desktop', 'tablet', 'mobile'];
// older keys the elements list replaces
const LEGACY_KEYS = [
  'digitalClock',
  'clock',
  'date',
  'seconds',
  'timeFormat',
  'clockSize',
  'analogClockSize',
  'dateFormat',
  'digitalClockWithSeconds',
  'twelveHourVersion',
  'period',
];

function isEmpty(value: any) {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// one element as the form shows it: every default filled in, the date format split into preset and custom text
function toElementFormData(element: any, language: string) {
  const data = Object.assign({}, ELEMENT_TYPES[element.type].defaults, element);
  if (element.type === 'date') {
    const presets = datePresets(language);
    if (!data.format) data.format = presets[0];
    data.formatPreset = presets.includes(data.format) ? data.format : CUSTOM_DATE_FORMAT;
  }
  return data;
}

function fromElementFormData(data: any, language: string) {
  const element = Object.assign({}, data);
  const defaults = ELEMENT_TYPES[element.type].defaults;
  if (element.type === 'date') {
    if (element.formatPreset && element.formatPreset !== CUSTOM_DATE_FORMAT) element.format = element.formatPreset;
    delete element.formatPreset;
    if (element.format === datePresets(language)[0]) delete element.format;
  }
  Object.keys(element).forEach((key) => {
    if (key !== 'type' && (isEmpty(element[key]) || element[key] === defaults[key])) delete element[key];
  });
  return element;
}

// The form uses one width object plus a unit and shows every default; the stored config may be shorter
function toFormData(config: any, hassObj: any) {
  const source = config || {};
  const language = languageOf(hassObj);
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

  data.elements = elementsOf(source).map((element) => toElementFormData(element, language));
  LEGACY_KEYS.forEach((key) => delete data[key]);
  data.glass = isGlass(source);

  Object.keys(EDITOR_DEFAULTS).forEach((key) => {
    if (isEmpty(data[key])) data[key] = EDITOR_DEFAULTS[key];
  });
  if (data.hideOnPath !== undefined && !Array.isArray(data.hideOnPath)) data.hideOnPath = [data.hideOnPath];
  if (data.viewMenuExclude !== undefined) data.viewMenuExclude = ([] as any[]).concat(data.viewMenuExclude).map(String);
  return data;
}

function fromFormData(formData: any, hassObj: any) {
  const data = Object.assign({}, formData);
  const language = languageOf(hassObj);
  data.elements = (data.elements || []).map((element) => fromElementFormData(element, language));
  if (!data.glass) {
    delete data.glass;
    delete data.blur;
  }

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
  OFF_BY_DEFAULT.forEach((key) => data[key] === false && delete data[key]);
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
    result[key] = toUnit === 'px' ? Math.min(600, Math.round(((value / 100) * screen) / 10) * 10) : Math.min(50, Math.round((value / screen) * 100));
  });
  return result;
}

const slider = (min: number, max: number, step: number, unit: string) => ({ number: { min, max, step, mode: 'slider', unit_of_measurement: unit } });
const dropdown = (options: any[]) => ({ select: { mode: 'dropdown', options } });

function elementSchema(element: any, hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  const language = languageOf(hassObj);
  const now = new Date();
  if (element.type === 'digitalClock') {
    return [
      {
        name: 'timeFormat',
        selector: dropdown(['24', '12', '12ampm'].map((format) => ({ value: format, label: `${t('opt_time_' + format)} (${formatTime(now, format, false)})` }))),
      },
      { name: 'seconds', selector: { boolean: {} } },
      { name: 'size', selector: slider(32, 120, 2, 'px'), __helper: t('helper_digitalSize') },
    ];
  }
  if (element.type === 'analogClock') {
    return [
      { name: 'seconds', selector: { boolean: {} }, __label: t('label_secondHand') },
      { name: 'size', selector: slider(100, 400, 10, 'px') },
    ];
  }
  const options = [
    ...datePresets(language).map((format) => ({
      value: format,
      label: moment(now)
        .locale(language)
        .format(format),
    })),
    { value: CUSTOM_DATE_FORMAT, label: t('opt_date_custom') },
  ];
  return [
    { name: 'formatPreset', selector: dropdown(options) },
    ...(element.formatPreset === CUSTOM_DATE_FORMAT ? [{ name: 'format', selector: { text: {} }, __helper: t('helper_dateFormat') }] : []),
    { name: 'size', selector: slider(14, 40, 1, 'px') },
  ];
}

function elementSummary(element: any, hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  const language = languageOf(hassObj);
  const now = new Date();
  if (element.type === 'digitalClock') return `${formatTime(now, element.timeFormat, element.seconds)} · ${element.size} px`;
  if (element.type === 'analogClock') return `${element.size} px · ${t(element.seconds ? 'with_second_hand' : 'without_second_hand')}`;
  const format = element.formatPreset === CUSTOM_DATE_FORMAT ? element.format : element.formatPreset;
  return `${moment(now)
    .locale(language)
    .format(format || datePresets(language)[0])} · ${element.size} px`;
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
  const views = (lovelace && lovelace.config && Array.isArray(lovelace.config.views) ? lovelace.config.views : []).map((view, index) => ({
    value: view.path !== undefined && view.path !== null && view.path !== '' ? String(view.path) : String(index),
    label: view.title || view.path || String(index + 1),
  }));
  const color = (name: string) => ({ name, selector: { text: {} }, __helper: t('helper_color') });
  const widthSelector = data.widthUnit === 'px' ? slider(0, 600, 10, 'px') : slider(0, 50, 1, '%');

  return [
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
        { name: 'glass', selector: { boolean: {} }, __helper: t('helper_glass') },
        ...(data.glass ? [{ name: 'blur', selector: slider(2, 30, 1, 'px') }] : []),
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
  _expanded = -1;
  _addOpen = false;
  _schemaKey = '';
  _schema: any[] = [];
  _elementSchemas = new Map<string, any[]>();

  static get properties() {
    return {
      hass: { attribute: false },
      side: { type: String, reflect: true },
      _data: { attribute: false },
      _ready: { attribute: false },
      _saving: { attribute: false },
      _error: { attribute: false },
      _expanded: { attribute: false },
      _addOpen: { attribute: false },
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
      d.viewMenu,
      d.bottomButtonsLayout,
      d.widthUnit,
      d.glass,
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

  _getElementSchema(element: any) {
    const key = [element.type, element.formatPreset === CUSTOM_DATE_FORMAT, this.hass && this.hass.language].join('|');
    if (!this._elementSchemas.has(key)) this._elementSchemas.set(key, elementSchema(element, this.hass));
    return this._elementSchemas.get(key);
  }

  render() {
    const t = (key: string) => localize(key, this.hass);
    return html`
      <div class="panel" role="dialog" aria-label="${t('editor_title')}">
        <div class="header">
          <button class="icon" title="${t('cancel')}" @click=${() => this._close(false)}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <h2>${t('editor_title')}</h2>
        </div>
        <div class="content">
          ${this._ready
            ? html`
                ${this._renderElements()}
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

  // clocks and dates: add, reorder by dragging the handle, open one to change it
  _renderElements() {
    const t = (key: string) => localize(key, this.hass);
    const elements = this._data.elements || [];
    return html`
      <ha-expansion-panel outlined expanded class="elements-panel">
        <ha-icon slot="leading-icon" icon="mdi:clock-outline"></ha-icon>
        <div slot="header" role="heading" aria-level="3">${t('section_header')}</div>
        <div class="elements-content">
          <div class="elements">
            ${elements.map(
              (element, index) => html`
                <div class="element${this._expanded === index ? ' expanded' : ''}">
                  <div class="element-row">
                    <span class="handle" title="${t('move_element')}" @pointerdown=${(ev) => this._dragStart(ev, index)}>
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </span>
                    <ha-icon class="element-icon" .icon=${ELEMENT_TYPES[element.type].icon}></ha-icon>
                    <div class="element-info" @click=${() => this._toggleElement(index)}>
                      <span class="element-name">${t('element_' + element.type)}</span>
                      <span class="element-summary">${elementSummary(element, this.hass)}</span>
                    </div>
                    <button class="icon" title="${t('edit_element')}" @click=${() => this._toggleElement(index)}>
                      <ha-icon .icon=${this._expanded === index ? 'mdi:chevron-up' : 'mdi:pencil'}></ha-icon>
                    </button>
                    <button class="icon" title="${t('remove_element')}" @click=${() => this._removeElement(index)}>
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                  </div>
                  ${this._expanded === index
                    ? html`
                        <div class="element-form">
                          <ha-form
                            .hass=${this.hass}
                            .data=${element}
                            .schema=${this._getElementSchema(element)}
                            .computeLabel=${this._computeLabel}
                            .computeHelper=${this._computeHelper}
                            @value-changed=${(ev) => this._elementChanged(ev, index)}
                          ></ha-form>
                        </div>
                      `
                    : ''}
                </div>
              `,
            )}
          </div>
          ${elements.length === 0
            ? html`
                <p class="hint">${t('no_elements')}</p>
              `
            : ''}
          ${this._addOpen
            ? html`
                <div class="add-menu">
                  ${Object.keys(ELEMENT_TYPES).map(
                    (type) => html`
                      <button class="add-option" @click=${() => this._addElement(type)}>
                        <ha-icon .icon=${ELEMENT_TYPES[type].icon}></ha-icon>
                        <span>${t('element_' + type)}</span>
                      </button>
                    `,
                  )}
                </div>
              `
            : ''}
          <button class="add-button" @click=${() => (this._addOpen = !this._addOpen)}>
            <ha-icon .icon=${this._addOpen ? 'mdi:close' : 'mdi:plus'}></ha-icon>
            <span>${this._addOpen ? t('cancel') : t('add_element')}</span>
          </button>
        </div>
      </ha-expansion-panel>
    `;
  }

  _setElements(elements: any[]) {
    this._update(Object.assign({}, this._data, { elements }));
  }

  _toggleElement(index: number) {
    this._expanded = this._expanded === index ? -1 : index;
  }

  _addElement(type: string) {
    const elements = [...(this._data.elements || []), toElementFormData({ type }, languageOf(this.hass))];
    this._addOpen = false;
    this._expanded = elements.length - 1;
    this._setElements(elements);
  }

  _removeElement(index: number) {
    const elements = [...(this._data.elements || [])];
    elements.splice(index, 1);
    if (this._expanded === index) this._expanded = -1;
    else if (this._expanded > index) this._expanded -= 1;
    this._setElements(elements);
  }

  _moveElement(from: number, to: number) {
    const elements = [...(this._data.elements || [])];
    const [moved] = elements.splice(from, 1);
    elements.splice(to, 0, moved);
    if (this._expanded === from) this._expanded = to;
    else if (this._expanded > from && this._expanded <= to) this._expanded -= 1;
    else if (this._expanded < from && this._expanded >= to) this._expanded += 1;
    this._setElements(elements);
  }

  _elementChanged(ev: any, index: number) {
    ev.stopPropagation();
    const elements = [...(this._data.elements || [])];
    const previous = elements[index];
    const element = Object.assign({}, ev.detail.value);
    // a chosen preset is copied into the custom field, so "custom" starts from it
    if (element.formatPreset !== previous.formatPreset && element.formatPreset !== CUSTOM_DATE_FORMAT) element.format = element.formatPreset;
    elements[index] = element;
    this._setElements(elements);
  }

  // pointer events work with mouse and touch; the other rows make room while one is dragged
  _dragStart(ev: PointerEvent, index: number) {
    const handle = ev.currentTarget as HTMLElement;
    const list = this.shadowRoot && (this.shadowRoot as any).querySelector('.elements');
    const rows = list ? (Array.from(list.children) as HTMLElement[]) : [];
    if (rows.length < 2) return;
    ev.preventDefault();
    const rects = rows.map((row) => row.getBoundingClientRect());
    const dragged = rows[index];
    const step = rects[index].height + 8;
    const startY = ev.clientY;
    let target = index;
    list.classList.add('sorting');
    dragged.classList.add('dragging');
    handle.setPointerCapture(ev.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const dy = moveEvent.clientY - startY;
      dragged.style.transform = `translateY(${dy}px)`;
      const center = rects[index].top + rects[index].height / 2 + dy;
      target = index;
      for (let i = index + 1; i < rects.length; i++) if (center > rects[i].top + rects[i].height / 2) target = i;
      for (let i = index - 1; i >= 0; i--) if (center < rects[i].top + rects[i].height / 2) target = i;
      rows.forEach((row, i) => {
        if (i === index) return;
        const shift = index < target && i > index && i <= target ? -step : index > target && i >= target && i < index ? step : 0;
        row.style.transform = shift ? `translateY(${shift}px)` : '';
      });
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      list.classList.remove('sorting');
      dragged.classList.remove('dragging');
      rows.forEach((row) => (row.style.transform = ''));
      if (target !== index) this._moveElement(index, target);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  _valueChanged(ev: any) {
    ev.stopPropagation();
    const previous = this._data;
    const data = Object.assign({}, ev.detail.value, { elements: previous.elements });
    if (data.widthUnit !== previous.widthUnit && data.width) {
      data.width = convertWidth(data.width, data.widthUnit);
    }
    this._update(data);
  }

  _update(data: any) {
    this._data = data;
    // the panel moves to the other side together with the sidebar
    this.side = data.showRight ? 'left' : 'right';
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
      /* like ha-dialog-header: close button first, then the title */
      .header {
        display: flex;
        align-items: center;
        gap: 4px;
        min-height: 64px;
        padding: 0 8px;
        padding-top: env(safe-area-inset-top);
        box-sizing: border-box;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      h2 {
        flex: 1;
        min-width: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: var(--ha-font-size-xl, 20px);
        font-weight: var(--ha-font-weight-medium, 500);
        line-height: 1.2;
        color: var(--primary-text-color, #212121);
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
        margin: 0 0 8px;
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
        line-height: 20px;
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
        flex: none;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--primary-text-color, #212121);
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

      /* clocks and dates, styled like the expandable sections of ha-form */
      .elements-panel {
        display: block;
        margin-bottom: 24px;
        --expansion-panel-content-padding: 0;
        border-radius: var(--ha-border-radius-md, 8px);
        --ha-card-border-radius: var(--ha-border-radius-md, 8px);
      }
      .elements-panel:not(:defined) {
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding: 12px;
      }
      .elements-panel > ha-icon {
        color: var(--secondary-text-color, #727272);
      }
      .elements-content {
        padding: 12px;
      }
      .elements {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .element {
        position: relative;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: var(--ha-border-radius-md, 8px);
        background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
      }
      .elements.sorting .element:not(.dragging) {
        transition: transform 0.15s ease;
      }
      .element.dragging {
        z-index: 1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }
      .element-row {
        display: flex;
        align-items: center;
        gap: 4px;
        min-height: 56px;
        padding-right: 4px;
      }
      .handle {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        width: 40px;
        color: var(--secondary-text-color, #727272);
        cursor: grab;
        touch-action: none;
      }
      .element.dragging .handle {
        cursor: grabbing;
      }
      .element-icon {
        flex: none;
        color: var(--secondary-text-color, #727272);
      }
      .element-info {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-width: 0;
        padding: 8px 4px 8px 12px;
        cursor: pointer;
      }
      .element-name {
        font-size: 15px;
        line-height: 20px;
      }
      .element-summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        line-height: 18px;
      }
      .element-form {
        padding: 8px 16px 16px;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      .add-menu {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .add-option,
      .add-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 16px 0 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
      }
      .add-option {
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        background: transparent;
        color: var(--primary-text-color, #212121);
      }
      .add-option ha-icon {
        color: var(--secondary-text-color, #727272);
      }
      .add-button {
        margin-top: 12px;
        border: none;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-color, #03a9f4);
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
    !isHassUiForced() &&
    !(sidebarConfig.showTopMenuOnMobile === true && width <= (sidebarConfig.breakpoints?.mobile ?? 768))
  );
}

// hides or restores the HA sidebar
function setHassSidebarHidden(hidden: boolean) {
  withoutAnimation(() => applyHassSidebarHidden(hidden));
}

function applyHassSidebarHidden(hidden: boolean) {
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

// ?sidebar=true shows the HA header and sidebar again until the page is reloaded, ?sidebar=false hides them again
// (?sidebarOff is the older name)
let hassUiForced = false;
function isHassUiForced() {
  const value = getParameterByName('sidebar');
  if (value !== null) hassUiForced = value === '' || value === 'true' || value === '1';
  if (getParameterByName('sidebarOff') !== null) hassUiForced = true;
  return hassUiForced;
}

// switches the HA sidebar without its slide animation
function withoutAnimation(change: () => void) {
  const homeAssistant: any = document.querySelector('home-assistant');
  const names = ['--ha-animation-duration-fast', '--ha-animation-duration-normal', '--ha-animation-duration-slow'];
  if (homeAssistant) names.forEach((name) => homeAssistant.style.setProperty(name, '0ms'));
  change();
  clearTimeout((withoutAnimation as any).timer);
  (withoutAnimation as any).timer = setTimeout(() => {
    if (homeAssistant) names.forEach((name) => homeAssistant.style.removeProperty(name));
  }, 600);
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

// 'docked' (expanded), 'auto' (narrow icon bar) or 'always_hidden' (behind the menu button)
function dockHassSidebar(dock: string) {
  withoutAnimation(() =>
    document
      .querySelector('home-assistant')
      ?.dispatchEvent(new CustomEvent('hass-dock-sidebar', { detail: { dock }, bubbles: true, composed: true })),
  );
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

// dockHassSidebar collapses the HA sidebar to its narrow icon bar while this dashboard is shown
function applyDock(state: SidebarState | null, wanted: boolean) {
  const homeAssistant: any = document.querySelector('home-assistant');
  const docked = homeAssistant && homeAssistant.hass ? homeAssistant.hass.dockedSidebar : undefined;
  const before = readDockBefore();
  if (wanted) {
    if (before === null) writeDockBefore(docked && docked !== 'auto' ? docked : 'unchanged');
    if (docked !== 'auto') dockHassSidebar('auto');
    if (state) state.docked = true;
  } else if ((state && state.docked) || before !== null) {
    // only if nobody changed it meanwhile; 0.3.1 used always_hidden
    if (before && before !== 'unchanged' && (docked === 'auto' || docked === 'always_hidden')) dockHassSidebar(before);
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
  const forced = isHassUiForced();
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

  // only when the option changes, so the menu button can still expand the HA sidebar;
  // also puts back what an earlier visit (or version) left collapsed
  const wantDock = config.dockHassSidebar === true && !forced;
  if (wantDock !== state.docked || (!wantDock && readDockBefore() !== null)) applyDock(state, wantDock);

  const hideHassSidebar =
    config.hideHassSidebar === true && !forced && !(config.showTopMenuOnMobile === true && width <= config.breakpoints.mobile);
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
