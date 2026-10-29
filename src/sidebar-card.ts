// ------------------------------------------------------------------------------------------
//  SIDEBAR-CARD
// ------------------------------------------------------------------------------------------
//  https://github.com/DBuit/sidebar-card
// ------------------------------------------------------------------------------------------

// ##########################################################################################
// ###   Global constants
// ##########################################################################################

const SIDEBAR_CARD_TITLE = 'SIDEBAR-CARD';
const SIDEBAR_CARD_VERSION = '0.10.1';

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
    add_sidebar: 'Add sidebar',
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
    edit: 'Edit',
    delete: 'Delete',
    deleted: 'Successfully deleted',
    delete_error: 'Deleting failed',
    undo: 'Undo',
    section_header: 'Clock & date',
    section_menu: 'Menu',
    section_bottom: 'Footer',
    section_layout: 'Width & position',
    section_design: 'Design',
    section_advanced: 'Advanced',
    label_seconds: 'Show seconds',
    label_secondHand: 'Second hand',
    label_size: 'Size',
    label_formatPreset: 'Date format',
    label_format: 'Custom date format',
    label_glass: 'Glass effect',
    label_blur: 'Blur strength',
    label_timeFormat: 'Time format',
    label_viewMenu: 'Show the views of this dashboard',
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
    placeholder_path: '/dashboard-home/cameras',
    label_menuIconSize: 'Menu icon size',
    label_menuIconGap: 'Space between icon and text',
    label_dividers: 'Show divider lines',
    label_menuOffsetTop: 'Space above the menu',
    label_menuOffsetBottom: 'Space below the menu',
    label_color: 'Color',
    label_handsColor: 'Color of the hands',
    label_secondsColor: 'Color of the second hand',
    helper_template: 'Every line as <li>…</li>',
    label_timeZone: 'Time zone',
    opt_tz_local: 'This device',
    opt_tz_server: 'Home Assistant',
    reset_default: 'Reset to default',
    label_menuItemSpacing: 'Space between menu items',
    label_menuPosition: 'Menu position',
    label_elements: '',
    opt_pos_top: 'Top',
    opt_pos_center: 'Middle',
    opt_pos_bottom: 'Bottom',
    helper_timeZone: 'Empty: the time zone of Home Assistant{zone}',
    opt_color_theme: 'From the theme',
    new_menu_item: 'New menu item',
    new_button: 'New button',
    show_view: 'Show in the menu',
    hide_view: 'Hide from the menu',
    helper_bottomCard:
      'Any Home Assistant card at the very bottom of the sidebar, below the buttons. type: the card type, cardOptions: the settings of the card, cardStyle: (optional) CSS for the card. Example: type: tile, cardOptions: {entity: sensor.outside}',
    label_shadow: 'Shadow',
    label_shadowSize: 'Shadow size',
    helper_shadow: 'Casts a shadow onto the dashboard next to the sidebar.',
    helper_glass:
      'Makes the sidebar semi-transparent and blurs the dashboard background behind it. With your own background color, its transparency is used, e.g. rgba(0, 0, 0, 0.4).',
    helper_digitalSize: 'Largest size; the time always fits the sidebar.',
    helper_hideTopMenu:
      'It stays visible in edit mode. To edit the dashboard, add ?edit=1 to its address; ?haUi=true shows the header and sidebar of Home Assistant again until the page is reloaded.',
    helper_hideHassSidebar: 'Removes it completely, including the menu button. ?haUi=true in the address shows it again.',
    helper_dockHassSidebar: 'While this dashboard is open, only the narrow icon bar is shown; the menu button expands it.',
  },
  de: {
    edit_sidebar: 'Seitenleiste bearbeiten',
    add_sidebar: 'Seitenleiste hinzufügen',
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
    edit: 'Bearbeiten',
    delete: 'Löschen',
    deleted: 'Erfolgreich gelöscht',
    delete_error: 'Löschen fehlgeschlagen',
    undo: 'Rückgängig',
    section_header: 'Uhr & Datum',
    section_menu: 'Menü',
    section_bottom: 'Fußzeile',
    section_layout: 'Breite & Position',
    section_design: 'Design',
    section_advanced: 'Erweitert',
    label_seconds: 'Sekunden anzeigen',
    label_secondHand: 'Sekundenzeiger',
    label_size: 'Größe',
    label_formatPreset: 'Datumsformat',
    label_format: 'Eigenes Datumsformat',
    label_glass: 'Glas-Effekt',
    label_blur: 'Stärke der Unschärfe',
    label_timeFormat: 'Zeitformat',
    label_viewMenu: 'Views dieses Dashboards anzeigen',
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
    placeholder_path: '/dashboard-home/kameras',
    label_menuIconSize: 'Größe der Menü-Icons',
    label_menuIconGap: 'Abstand zwischen Icon und Text',
    label_dividers: 'Trennlinien anzeigen',
    label_menuOffsetTop: 'Abstand über dem Menü',
    label_menuOffsetBottom: 'Abstand unter dem Menü',
    label_color: 'Farbe',
    label_handsColor: 'Farbe der Zeiger',
    label_secondsColor: 'Farbe des Sekundenzeigers',
    helper_template: 'Jede Zeile als <li>…</li>',
    label_timeZone: 'Zeitzone',
    opt_tz_local: 'Dieses Gerät',
    opt_tz_server: 'Home Assistant',
    reset_default: 'Auf Standard zurücksetzen',
    label_menuItemSpacing: 'Abstand zwischen Menüeinträgen',
    label_menuPosition: 'Position des Menüs',
    label_elements: '',
    opt_pos_top: 'Oben',
    opt_pos_center: 'Mitte',
    opt_pos_bottom: 'Unten',
    helper_timeZone: 'Leer: Zeitzone von Home Assistant{zone}',
    opt_color_theme: 'Aus dem Theme',
    new_menu_item: 'Neuer Menüeintrag',
    new_button: 'Neuer Button',
    show_view: 'Im Menü anzeigen',
    hide_view: 'Im Menü ausblenden',
    helper_bottomCard:
      'Eine beliebige Home-Assistant-Karte ganz unten in der Seitenleiste, unter den Buttons. type: der Kartentyp, cardOptions: die Einstellungen der Karte, cardStyle: (optional) CSS für die Karte. Beispiel: type: tile, cardOptions: {entity: sensor.aussen}',
    label_shadow: 'Schatten',
    label_shadowSize: 'Stärke des Schattens',
    helper_shadow: 'Wirft einen Schatten auf das Dashboard neben der Seitenleiste.',
    helper_glass:
      'Macht die Seitenleiste halbtransparent und den Dashboard-Hintergrund dahinter unscharf. Bei eigener Hintergrundfarbe zählt deren Transparenz, z. B. rgba(0, 0, 0, 0.4).',
    helper_digitalSize: 'Höchstgröße; die Uhrzeit passt immer in die Seitenleiste.',
    helper_hideTopMenu:
      'Im Bearbeitungsmodus bleibt sie sichtbar. Zum Bearbeiten ?edit=1 an die Adresse des Dashboards anhängen; ?haUi=true zeigt Kopf- und Seitenleiste von Home Assistant bis zum Neuladen wieder.',
    helper_hideHassSidebar: 'Blendet sie komplett aus, auch den Menü-Button. ?haUi=true an der Adresse zeigt sie wieder.',
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
  digitalClock: { icon: 'mdi:clock-digital', defaults: { timeFormat: '24', seconds: false, size: 60, timeZone: '', color: '' } },
  analogClock: { icon: 'mdi:clock-outline', defaults: { seconds: true, size: 220, timeZone: '', color: '', secondsColor: '' } },
  date: { icon: 'mdi:calendar-today', defaults: { size: 22, timeZone: '', color: '' } },
};

// empty is the time zone of Home Assistant, 'local' this device's, anything else an IANA name
function resolveTimeZone(timeZone: string, hassObj: any) {
  if (timeZone === 'local') return undefined;
  if (!timeZone || timeZone === 'server') return hassObj && hassObj.config ? hassObj.config.time_zone || undefined : undefined;
  return timeZone;
}

const zoneFormatters = new Map<string, Intl.DateTimeFormat | null>();

// a Date whose local fields show the wall clock of the time zone, so moment and the clock hands can use it as is
function zonedDate(date: Date, timeZone?: string) {
  if (!timeZone) return date;
  if (!zoneFormatters.has(timeZone)) {
    try {
      zoneFormatters.set(
        timeZone,
        new Intl.DateTimeFormat('en-US', {
          timeZone,
          hourCycle: 'h23',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
      );
    } catch {
      zoneFormatters.set(timeZone, null); // unknown time zone: device time
    }
  }
  const formatter = zoneFormatters.get(timeZone);
  if (!formatter) return date;
  const parts: Record<string, number> = {};
  formatter.formatToParts(date).forEach((part) => (parts[part.type] = Number(part.value)));
  return new Date(parts.year, parts.month - 1, parts.day, parts.hour % 24, parts.minute, parts.second);
}

// the IANA time zones of the browser, with their current offset
function timeZoneOptions() {
  const supported = (Intl as any).supportedValuesOf;
  const zones: string[] = supported
    ? supported('timeZone')
    : ['Europe/Berlin', 'Europe/London', 'Europe/Paris', 'Europe/Madrid', 'Europe/Rome', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'UTC'];
  const now = new Date();
  return zones.map((zone) => {
    let offset = '';
    try {
      const part = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' } as any)
        .formatToParts(now)
        .find((item) => item.type === 'timeZoneName');
      offset = part ? part.value.replace('GMT', 'UTC') : '';
    } catch {
      // older browsers without shortOffset
    }
    return { value: zone, label: offset ? `${zone.replace(/_/g, ' ')} (${offset})` : zone.replace(/_/g, ' ') };
  });
}

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

// the icons of Home Assistant's card menu (@mdi/js), drawn by ha-svg-icon like there
const MDI_PENCIL =
  'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';
const MDI_DELETE = 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';

const GLASS_BLUR = 12;
const SHADOW_SIZE = 12;
const MENU_ITEM_SPACING = 4;

// without their own value, menu icons and their gap grow with the menu font (as the CSS does)
function autoIconSize(fontSize: number) {
  return Math.max(24, Math.round((Number(fontSize) || 18) * 1.3));
}
function autoIconGap(fontSize: number) {
  return Math.round((Number(fontSize) || 18) * 0.75);
}

// theme color names (as HA's color picker stores them) become theme variables
const THEME_COLORS = [
  'primary',
  'accent',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'light-grey',
  'grey',
  'dark-grey',
  'blue-grey',
  'black',
  'white',
];
function cssColor(color: any) {
  if (color === undefined || color === null || color === '' || color === 'theme') return undefined;
  return THEME_COLORS.includes(color) ? `var(--${color}-color)` : String(color);
}

// falls towards the dashboard
function shadowCss(config: any) {
  const size = Number(config.shadowSize) || SHADOW_SIZE;
  const offset = Math.round(size / 3) * (config.showRight ? -1 : 1);
  return `${offset}px 0 ${size}px rgba(0, 0, 0, 0.3)`;
}

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
  _hover = false;
  _touchStarted = false;
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
      _hover: { attribute: false },
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
    document.removeEventListener('click', this._documentClicked);
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
      <div
        class="sidebar-inner${isGlass(c) ? ' glass' : ''}${c.dividers === false ? ' no-dividers' : ''}${c.shadow ? ' shadow' : ''}${editMode ? ' editing' : ''}${this._editor ? ' editor-open' : ''}${c.showRight ? ' right' : ''}"
        @mouseenter=${() => this._pointerEnter()}
        @mouseleave=${() => (this._hover = false)}
        @touchstart=${() => this._touchStart()}
        @touchend=${() => setTimeout(() => (this._touchStarted = false), 10)}
        @click=${() => this._pointerClick()}
      >
        <div class="sidebar-main" ?inert=${editMode}>
          ${elementsOf(c).map((element) => this._renderElement(element))}
          ${c.title
            ? html`
                <h1 class="title">${c.title}</h1>
              `
            : ''}
          <div class="menu-block ${['center', 'bottom'].includes(c.menuPosition) ? c.menuPosition : 'top'}">
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
        </div>
        ${showFooter
          ? html`
              <div class="sidebar-footer" ?inert=${editMode}>
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
        ${editMode ? this._renderEditControls(c) : ''}
      </div>
    `;
  }

  // like Home Assistant's cards in edit mode: a pencil over the sidebar on hover, a menu in the flag
  _renderEditControls(c: any) {
    const editText = haText(this.hass, 'ui.panel.lovelace.editor.edit_card.edit', 'edit');
    const deleteText = haText(this.hass, 'ui.panel.lovelace.editor.edit_card.delete', 'delete');
    return html`
      <div class="edit-overlay${this._hover ? ' visible' : ''}">
        <div
          class="control"
          role="button"
          tabindex="0"
          aria-label="${localize('edit_sidebar', this.hass)}"
          @click=${(ev) => this._overlayClick(ev)}
          @keydown=${(ev) => this._overlayClick(ev)}
        >
          <div class="control-overlay"></div>
          <ha-icon icon="mdi:pencil"></ha-icon>
        </div>
      </div>
      <ha-dropdown class="edit-menu" placement="${c.showRight ? 'bottom-end' : 'bottom-start'}" @wa-select=${(ev) => this._menuSelect(ev)}>
        <button slot="trigger" class="edit-sidebar" aria-label="${localize('edit_sidebar', this.hass)}">
          <ha-icon icon="mdi:dots-vertical"></ha-icon>
        </button>
        <ha-dropdown-item value="edit">
          <ha-svg-icon slot="icon" .path=${MDI_PENCIL}></ha-svg-icon>
          ${editText}
        </ha-dropdown-item>
        <wa-divider></wa-divider>
        <ha-dropdown-item value="delete" variant="danger">
          ${deleteText}
          <ha-svg-icon slot="icon" .path=${MDI_DELETE}></ha-svg-icon>
        </ha-dropdown-item>
      </ha-dropdown>
    `;
  }

  // the same hover and touch handling as Home Assistant's hui-card-edit-mode
  _pointerEnter() {
    if (!this._touchStarted && this._isEditMode()) this._hover = true;
  }

  _touchStart() {
    if (!this._isEditMode()) return;
    this._touchStarted = true;
    this._hover = true;
    document.addEventListener('click', this._documentClicked);
  }

  _pointerClick() {
    if (!this._isEditMode()) return;
    this._hover = true;
    document.addEventListener('click', this._documentClicked);
  }

  _documentClicked = (ev: any) => {
    this._hover = ev.composedPath().includes(this);
    document.removeEventListener('click', this._documentClicked);
  };

  _overlayClick(ev: any) {
    if (ev.defaultPrevented) return;
    if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    ev.stopPropagation();
    this._openEditor();
  }

  _menuSelect(ev: any) {
    const action = ev.detail && ev.detail.item && ev.detail.item.value;
    if (action === 'edit') this._openEditor();
    else if (action === 'delete') deleteSidebarWithToast();
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
    const now = zonedDate(this._now, resolveTimeZone(elementOption(element, 'timeZone'), this.hass));
    const color = cssColor(element.color);
    if (element.type === 'digitalClock') {
      const time = formatTime(now, elementOption(element, 'timeFormat'), seconds);
      return html`
        <h1 class="digitalClock${seconds ? ' with-seconds' : ''}" style="--sb-size: ${size}px;${color ? ` color: ${color};` : ''}">${time}</h1>
      `;
    }
    if (element.type === 'analogClock') {
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const secs = now.getSeconds();
      const secondsColor = cssColor(element.secondsColor);
      const style =
        `--sb-size: ${size}px;` +
        (color ? ` --clock-hands-color: ${color}; --clock-middle-border: ${color};` : '') +
        (secondsColor ? ` --clock-seconds-hand-color: ${secondsColor};` : '');
      return html`
        <div class="clock" style="${style}">
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
    const date = moment(now)
      .locale(language)
      .format(element.format || datePresets(language)[0]);
    return html`
      <h2 class="date" style="--sb-size: ${size}px;${color ? ` color: ${color};` : ''}">${date}</h2>
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
      '--sidebar-background': cssColor(c.background),
      '--sidebar-text-color': cssColor(c.textColor),
      '--sidebar-icon-color': cssColor(c.iconColor),
      '--sidebar-selected-icon-color': cssColor(c.accentColor),
      '--sidebar-divider-color': cssColor(c.dividerColor),
      '--sidebar-menu-gap': c.menuItemSpacing !== undefined && c.menuItemSpacing !== null && c.menuItemSpacing !== '' ? `${c.menuItemSpacing}px` : undefined,
      '--sidebar-shadow': c.shadow ? shadowCss(c) : undefined,
      '--sidebar-blur': isGlass(c) ? `${c.blur || GLASS_BLUR}px` : undefined,
      '--sidebar-menu-font-size': c.menuFontSize ? `${c.menuFontSize}px` : undefined,
      '--sidebar-menu-icon-size': c.menuIconSize ? `${c.menuIconSize}px` : undefined,
      '--sidebar-menu-icon-gap': c.menuIconGap !== undefined && c.menuIconGap !== null && c.menuIconGap !== '' ? `${c.menuIconGap}px` : undefined,
      '--sidebar-menu-offset': c.menuOffset ? `${c.menuOffset}px` : undefined,
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
    // a sidebar added from the header is not in the dashboard yet
    const draft = !!(current && current.card === this && current.draft);
    const stored = (draft ? current!.config : (lovelace.rawConfig || lovelace.config || {}).sidebar) || {};
    // the preview stays visible while editing: no overlay, no focused pencil keeping it up
    this._hover = false;
    const focused = this.shadowRoot && this.shadowRoot.activeElement;
    if (focused && typeof focused.blur === 'function') focused.blur();
    const editor: any = document.createElement('sidebar-card-editor');
    editor.hass = this.hass;
    editor.lovelace = lovelace;
    editor.isNew = draft;
    editor.originalConfig = clone(stored);
    editor.side = stored.showRight ? 'left' : 'right';
    editor.onPreview = (config: any) => previewSidebar(config);
    editor.onClose = (saved: boolean) => {
      this._editor = null;
      this.requestUpdate();
      endPreview(saved);
    };
    // inside home-assistant, so dialogs opened by the form (e.g. list items) reach the dialog manager
    const homeAssistant: any = document.querySelector('home-assistant');
    (homeAssistant && homeAssistant.shadowRoot ? homeAssistant.shadowRoot : document.body).appendChild(editor);
    this._editor = editor;
    this.requestUpdate();
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
      /* above the view, so the shadow falls onto it */
      .sidebar-inner.shadow {
        z-index: 1;
        box-shadow: var(--sidebar-shadow);
      }
      /* above the view, so the edit flag sticking out of the sidebar can be tapped */
      .sidebar-inner.editing {
        z-index: 3;
      }
      .sidebar-main {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden auto;
        padding: var(--sb-padding);
        scrollbar-width: thin;
        container-type: inline-size;
      }
      /* menuPosition: right after the clocks, in the middle of the free space or at its bottom */
      .menu-block.top {
        margin-top: var(--sidebar-menu-offset, 0px);
      }
      .menu-block.center {
        margin-block: auto;
      }
      .menu-block.bottom {
        margin-top: auto;
        margin-bottom: var(--sidebar-menu-offset, 0px);
      }
      .no-dividers .sidebarMenu,
      .no-dividers .sidebar-footer {
        border-color: transparent;
      }
      .sidebar-footer {
        flex: 0 0 auto;
        padding: 12px var(--sb-padding) var(--sb-padding);
        border-top: 1px solid var(--sb-divider);
      }

      /* edit mode: a flag sticking out of the sidebar's outer edge, colored like the flags of HA's sections */
      /* the flag with the menu sticks out of the sidebar's outer edge (ha-dropdown itself has display: contents) */
      .edit-sidebar {
        position: absolute;
        top: 16px;
        left: 100%;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 44px;
        padding: 0;
        border: none;
        border-radius: 0 var(--ha-border-radius-xl, 16px) var(--ha-border-radius-xl, 16px) 0;
        background: var(--secondary-background-color, #e5e5e5);
        color: var(--primary-text-color, #212121);
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .sidebar-inner.right .edit-sidebar {
        left: auto;
        right: 100%;
        border-radius: var(--ha-border-radius-xl, 16px) 0 0 var(--ha-border-radius-xl, 16px);
      }
      .edit-sidebar:hover {
        filter: brightness(0.95);
      }
      /* the size of the icons in Home Assistant's own menus; the item colors them (red for delete) */
      ha-dropdown-item {
        --mdc-icon-size: 24px;
      }
      /* as hui-card-edit-mode draws it over cards */
      .edit-overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        opacity: 0;
        pointer-events: none;
        transition: opacity 180ms ease-in-out;
      }
      .edit-overlay.visible,
      .edit-overlay:focus-within {
        opacity: 1;
        pointer-events: auto;
      }
      .editor-open .edit-overlay {
        opacity: 0;
        pointer-events: none;
      }
      .edit-overlay .control {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        outline: none;
      }
      .edit-overlay .control-overlay {
        position: absolute;
        inset: 0;
        opacity: 0.8;
        background-color: var(--primary-background-color, #fafafa);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      .edit-overlay ha-icon {
        display: flex;
        position: relative;
        padding: 8px;
        border-radius: 50%;
        color: var(--primary-text-color, #212121);
        background: var(--secondary-background-color, #e5e5e5);
        --mdc-icon-size: 20px;
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
        display: flex;
        flex-direction: column;
        gap: var(--sidebar-menu-gap, 4px);
        list-style: none;
        margin: 20px 0;
        padding: 16px 0;
        border-top: 1px solid var(--sb-divider);
        border-bottom: 1px solid var(--sb-divider);
      }
      /* spacing in em, so large font sizes get room as well */
      .sidebarMenu li {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--sidebar-menu-icon-gap, 0.75em);
        margin: 0;
        padding: 0.5em 0.85em;
        border-radius: var(--sidebar-item-radius, 12px);
        color: var(--sb-text);
        font-size: var(--sidebar-menu-font-size, 18px);
        line-height: 1.35;
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
        padding-block: 0.1em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sidebarMenu li ha-icon {
        flex: none;
        color: var(--sb-icon);
        --mdc-icon-size: var(--sidebar-menu-icon-size, max(24px, 1.3em));
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
  menuPosition: 'top',
  bottomButtonsLayout: 'row',
  widthUnit: '%',
  menuFontSize: 18,
  menuItemSpacing: MENU_ITEM_SPACING,
  menuOffset: 0,
  blur: GLASS_BLUR,
  shadowSize: SHADOW_SIZE,
};
const DEFAULT_BREAKPOINTS = { tablet: 1024, mobile: 768 };
const DEFAULT_WIDTH_PERCENT = 25;
const DEFAULT_WIDTH_PX = 300;
// switches that are off by default and not stored when off
const OFF_BY_DEFAULT = ['viewMenu', 'bottomButtonsShowName', 'showRight', 'shadow', 'hideTopMenu', 'showTopMenuOnMobile', 'hideHassSidebar', 'dockHassSidebar', 'debug'];
const COLOR_KEYS = ['background', 'textColor', 'iconColor', 'accentColor', 'dividerColor'];
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

// drops empty fields of list items (menu items, buttons)
function compactItem(item: any) {
  const result: any = {};
  Object.keys(item || {}).forEach((key) => {
    if (!isEmpty(item[key])) result[key] = item[key];
  });
  return result;
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
    if (key !== 'type' && (isEmpty(element[key]) || element[key] === defaults[key] || element[key] === 'theme')) delete element[key];
  });
  if (element.type === 'analogClock' && element.seconds === false) delete element.secondsColor;
  // type first, so the YAML reads well
  return Object.assign({ type: element.type }, element);
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
    if (typeof width[key] !== 'number') width[key] = unit === 'px' ? DEFAULT_WIDTH_PX : DEFAULT_WIDTH_PERCENT;
  });
  data.width = width;
  data.widthUnit = unit;
  data.breakpoints = Object.assign({}, DEFAULT_BREAKPOINTS, data.breakpoints || {});

  data.elements = elementsOf(source).map((element) => toElementFormData(element, language));
  LEGACY_KEYS.forEach((key) => delete data[key]);
  data.glass = isGlass(source);
  data.dividers = source.dividers !== false;
  data.sidebarMenu = Array.isArray(data.sidebarMenu) ? data.sidebarMenu.filter((item) => item && typeof item === 'object') : [];
  data.bottomButtons = Array.isArray(data.bottomButtons) ? data.bottomButtons.filter((item) => item && typeof item === 'object') : [];

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
  data.sidebarMenu = (data.sidebarMenu || []).map(compactItem).filter((item) => !isEmpty(item));
  data.bottomButtons = (data.bottomButtons || []).map(compactItem).filter((item) => !isEmpty(item));
  if (!data.glass) {
    delete data.glass;
    delete data.blur;
  }
  if (!data.shadow) delete data.shadowSize;
  // divider lines are on unless switched off
  if (data.dividers !== false) delete data.dividers;
  if (data.menuPosition === 'center') delete data.menuOffset;
  // icon size and gap equal to what the font size gives are not stored, so they keep following it
  const fontSize = data.menuFontSize || EDITOR_DEFAULTS.menuFontSize;
  if (data.menuIcons === 'none' || data.menuIconSize === autoIconSize(fontSize)) delete data.menuIconSize;
  if (data.menuIcons === 'none' || data.menuIconGap === autoIconGap(fontSize)) delete data.menuIconGap;
  data.hideOnPath = (data.hideOnPath || []).map((path) => String(path).trim()).filter((path) => path !== '');
  // "from the theme" is the color picker's default
  COLOR_KEYS.forEach((key) => data[key] === 'theme' && delete data[key]);

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

// a slider with a button that puts the default back; rendered by ha-form as "ha-form-sidebar_slider"
const slider = (name: string, min: number, max: number, step: number, unit: string, defaultValue: number, extra: any = {}) =>
  Object.assign({ name, type: 'sidebar_slider', min, max, step, unit, default: defaultValue }, extra);
// required: HA's dropdown then has no clear button, so it is never empty
const dropdown = (name: string, options: any[], extra: any = {}) =>
  Object.assign({ name, required: true, selector: { select: { mode: 'dropdown', options } } }, extra);

// small pictures for HA's select boxes, in a light and a dark variant
function svgImage(body: (line: string, fill: string) => string) {
  const make = (line: string, fill: string) =>
    'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 56">${body(line, fill)}</svg>`);
  return { src: make('#9e9e9e', '#c8c8c8'), src_dark: make('#8a8a8a', '#5c5c5c') };
}

const ICON_BAR_IMAGE = svgImage(
  (line, fill) =>
    `<rect x="4" y="12" width="88" height="32" rx="7" fill="none" stroke="${line}" stroke-width="2"/>` +
    [12, 38, 64].map((x) => `<rect x="${x}" y="18" width="20" height="20" rx="5" fill="${fill}"/><circle cx="${x + 10}" cy="28" r="4.5" fill="${line}"/>`).join(''),
);
const LIST_IMAGE = svgImage(
  (line, fill) =>
    `<rect x="4" y="4" width="88" height="48" rx="7" fill="none" stroke="${line}" stroke-width="2"/>` +
    [16, 28, 40]
      .map((y) => `<circle cx="16" cy="${y}" r="4" fill="${line}"/><rect x="26" y="${y - 2.5}" width="36" height="5" rx="2.5" fill="${fill}"/><rect x="68" y="${y - 2.5}" width="16" height="5" rx="2.5" fill="${fill}"/>`)
      .join(''),
);

let timeZoneList: any[] | null = null;

function timeZoneSelectOptions(hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  if (!timeZoneList) timeZoneList = timeZoneOptions();
  let device = '';
  try {
    device = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // unknown
  }
  return [{ value: 'local', label: device ? `${t('opt_tz_local')} (${device.replace(/_/g, ' ')})` : t('opt_tz_local') }, ...timeZoneList];
}

// searchable, takes names it does not know, and may stay empty: then the time zone of Home Assistant
function timeZoneField(hassObj: any) {
  const server = hassObj && hassObj.config && hassObj.config.time_zone ? ` (${String(hassObj.config.time_zone).replace(/_/g, ' ')})` : '';
  return {
    name: 'timeZone',
    selector: { select: { mode: 'dropdown', custom_value: true, options: timeZoneSelectOptions(hassObj) } },
    __helper: localize('helper_timeZone', hassObj).replace('{zone}', server),
  };
}

// HA's color picker with "from the theme" as its default, as in the design section
function colorField(name: string, themeColor: string, hassObj: any, extra: any = {}) {
  return Object.assign(
    {
      name,
      selector: {
        ui_color: { default_color: 'theme', extra_options: [{ value: 'theme', label: localize('opt_color_theme', hassObj), display_color: themeColor }] },
      },
    },
    extra,
  );
}

function elementSchema(element: any, hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  const language = languageOf(hassObj);
  const now = new Date();
  const defaults = ELEMENT_TYPES[element.type].defaults;
  const textColor = 'var(--primary-text-color, #212121)';
  if (element.type === 'digitalClock') {
    return [
      dropdown(
        'timeFormat',
        ['24', '12', '12ampm'].map((format) => ({ value: format, label: `${t('opt_time_' + format)} (${formatTime(now, format, false)})` })),
      ),
      { name: 'seconds', selector: { boolean: {} } },
      slider('size', 32, 120, 2, 'px', defaults.size, { __helper: t('helper_digitalSize') }),
      colorField('color', textColor, hassObj),
      timeZoneField(hassObj),
    ];
  }
  if (element.type === 'analogClock') {
    return [
      { name: 'seconds', selector: { boolean: {} }, __label: t('label_secondHand') },
      slider('size', 100, 400, 10, 'px', defaults.size),
      colorField('color', textColor, hassObj, { __label: t('label_handsColor') }),
      ...(element.seconds ? [colorField('secondsColor', '#ff4b3e', hassObj)] : []),
      timeZoneField(hassObj),
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
    dropdown('formatPreset', options),
    ...(element.formatPreset === CUSTOM_DATE_FORMAT ? [{ name: 'format', selector: { text: {} }, __helper: t('helper_dateFormat') }] : []),
    slider('size', 14, 40, 1, 'px', defaults.size),
    colorField('color', textColor, hassObj),
    timeZoneField(hassObj),
  ];
}

function zoneSummary(element: any, hassObj: any) {
  const timeZone = element.timeZone || '';
  if (!timeZone) return '';
  if (timeZone === 'local') return localize('opt_tz_local', hassObj);
  if (timeZone === 'server') return localize('opt_tz_server', hassObj);
  return timeZone
    .split('/')
    .pop()
    .replace(/_/g, ' ');
}

function elementSummary(element: any, hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  const language = languageOf(hassObj);
  const now = zonedDate(new Date(), resolveTimeZone(element.timeZone, hassObj));
  const zone = zoneSummary(element, hassObj);
  let text: string;
  if (element.type === 'digitalClock') text = formatTime(now, element.timeFormat, element.seconds);
  else if (element.type === 'analogClock') text = t(element.seconds ? 'with_second_hand' : 'without_second_hand');
  else {
    const format = element.formatPreset === CUSTOM_DATE_FORMAT ? element.format : element.formatPreset;
    text = moment(now)
      .locale(language)
      .format(format || datePresets(language)[0]);
  }
  return zone ? `${text} · ${zone}` : text;
}

// keeps the dropdowns of a clock or date filled and copies a chosen preset into the custom field
function normalizeElement(element: any, previous: any) {
  ['timeFormat', 'formatPreset'].forEach((key) => {
    if (key in previous && isEmpty(element[key])) element[key] = previous[key];
  });
  if (element.formatPreset !== previous.formatPreset && element.formatPreset !== CUSTOM_DATE_FORMAT) element.format = element.formatPreset;
  return element;
}

function menuItemSchema(hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  return [
    { name: 'name', selector: { text: {} }, __label: t('field_name') },
    { name: 'icon', selector: { icon: {} }, __label: t('field_icon') },
    { name: 'navigation_path', selector: { navigation: {} }, __label: t('field_navigation_path') },
    { name: 'conditional', selector: { text: {} }, __label: t('field_conditional'), __helper: t('helper_conditional') },
  ];
}

function buttonSchema(hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  return [
    { name: 'entity', selector: { entity: {} }, __label: t('field_entity') },
    { name: 'name', selector: { text: {} }, __label: t('field_name') },
    { name: 'icon', selector: { icon: {} }, __label: t('field_icon') },
    { name: 'tap_action', selector: { ui_action: {} }, __label: t('field_tap_action') },
    { name: 'hold_action', selector: { ui_action: {} }, __label: t('field_hold_action') },
  ];
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

// the views a menu can show: no subviews
function menuViews(lovelace: any) {
  const views = lovelace && lovelace.config && Array.isArray(lovelace.config.views) ? lovelace.config.views : [];
  return views
    .map((view, index) => ({
      value: view.path !== undefined && view.path !== null && view.path !== '' ? String(view.path) : String(index),
      label: view.title || view.path || String(index + 1),
      icon: view.icon || 'mdi:view-dashboard-outline',
      subview: !!view.subview,
    }))
    .filter((view) => !view.subview);
}

function buildEditorSchema(data: any, lovelace: any, hassObj: any) {
  const t = (key: string) => localize(key, hassObj);
  const views = menuViews(lovelace);
  // HA's own color picker: theme colors with a swatch, or any CSS color typed in; shows the theme default when empty
  const color = (name: string, themeColor: string) => ({
    name,
    selector: { ui_color: { default_color: 'theme', extra_options: [{ value: 'theme', label: t('opt_color_theme'), display_color: themeColor }] } },
  });
  const px = data.widthUnit === 'px';
  const width = (name: string, extra: any = {}) =>
    px ? slider(name, 0, 600, 10, 'px', DEFAULT_WIDTH_PX, extra) : slider(name, 0, 50, 1, '%', DEFAULT_WIDTH_PERCENT, extra);
  const language = languageOf(hassObj);

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
          type: 'sidebar_list',
          name: 'elements',
          addTypes: Object.keys(ELEMENT_TYPES).map((type) => ({ type, icon: ELEMENT_TYPES[type].icon, label: t('element_' + type) })),
          newItem: (type: string) => toElementFormData({ type }, language),
          itemIcon: (item: any) => ELEMENT_TYPES[item.type].icon,
          itemName: (item: any) => t('element_' + item.type),
          itemSummary: (item: any) => elementSummary(item, hassObj),
          itemSchema: (item: any) => elementSchema(item, hassObj),
          itemSchemaKey: (item: any) => [item.type, item.formatPreset === CUSTOM_DATE_FORMAT, !!item.seconds].join('|'),
          normalizeItem: normalizeElement,
          emptyText: t('no_elements'),
        },
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
        ...(data.viewMenu && views.length > 0
          ? [{ type: 'sidebar_views', name: 'viewMenuExclude', views, base: '/' + ((lovelace && lovelace.urlPath) || window.location.pathname.split('/')[1]) }]
          : []),
        {
          type: 'sidebar_list',
          name: 'sidebarMenu',
          newItem: () => ({ name: '', icon: '', navigation_path: '' }),
          itemIcon: (item: any) => item.icon || 'mdi:link-variant',
          itemName: (item: any) => item.name || t('new_menu_item'),
          itemSummary: (item: any) => item.navigation_path || item.url_path || item.action || '',
          itemSchema: () => menuItemSchema(hassObj),
        },
        dropdown('menuPosition', [
          { value: 'top', label: t('opt_pos_top') },
          { value: 'center', label: t('opt_pos_center') },
          { value: 'bottom', label: t('opt_pos_bottom') },
        ]),
        dropdown('menuIcons', [
          { value: 'left', label: t('opt_left') },
          { value: 'right', label: t('opt_right') },
          { value: 'none', label: t('opt_none') },
        ]),
        slider('menuFontSize', 12, 40, 1, 'px', EDITOR_DEFAULTS.menuFontSize),
        ...(data.menuIcons !== 'none'
          ? [
              // the default follows the font size; "reset" clears the value so it keeps following
              slider('menuIconSize', 16, 64, 1, 'px', autoIconSize(data.menuFontSize), { resetToEmpty: true }),
              slider('menuIconGap', 0, 40, 1, 'px', autoIconGap(data.menuFontSize), { resetToEmpty: true }),
            ]
          : []),
        slider('menuItemSpacing', 0, 24, 1, 'px', EDITOR_DEFAULTS.menuItemSpacing),
        ...(data.menuPosition !== 'center'
          ? [
              slider('menuOffset', 0, 200, 2, 'px', EDITOR_DEFAULTS.menuOffset, {
                __label: t(data.menuPosition === 'bottom' ? 'label_menuOffsetBottom' : 'label_menuOffsetTop'),
              }),
            ]
          : []),
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
          type: 'sidebar_list',
          name: 'bottomButtons',
          newItem: () => ({}),
          itemIcon: (item: any) => item.icon || 'mdi:gesture-tap-button',
          itemEntity: (item: any) => item.entity,
          itemName: (item: any) => {
            const stateObj = item.entity && hassObj && hassObj.states ? hassObj.states[item.entity] : undefined;
            return item.name || (stateObj ? stateObj.attributes.friendly_name : item.entity) || t('new_button');
          },
          itemSummary: (item: any) => (item.entity && (item.name || (hassObj && hassObj.states && hassObj.states[item.entity])) ? item.entity : ''),
          itemSchema: () => buttonSchema(hassObj),
        },
        {
          name: 'bottomButtonsLayout',
          required: true,
          selector: {
            select: {
              mode: 'box',
              box_max_columns: 2,
              options: [
                { value: 'row', label: t('opt_row'), image: ICON_BAR_IMAGE },
                { value: 'list', label: t('opt_list'), image: LIST_IMAGE },
              ],
            },
          },
        },
        ...(data.bottomButtonsLayout !== 'list' ? [{ name: 'bottomButtonsShowName', selector: { boolean: {} } }] : []),
        { name: 'bottomCard', selector: { object: {} }, __helper: t('helper_bottomCard') },
      ],
    },
    {
      type: 'expandable',
      name: '',
      flatten: true,
      title: t('section_layout'),
      icon: 'mdi:arrow-expand-horizontal',
      schema: [
        dropdown('widthUnit', [
          { value: '%', label: t('opt_percent') },
          { value: 'px', label: t('opt_pixel') },
        ]),
        {
          type: 'grid',
          name: 'width',
          column_min_width: '100%',
          schema: [
            width('desktop', { __label: t('label_width_desktop') }),
            width('tablet', { __label: t('label_width_tablet') }),
            width('mobile', { __label: t('label_width_mobile'), __helper: t('helper_width') }),
          ],
        },
        {
          type: 'grid',
          name: 'breakpoints',
          column_min_width: '100%',
          schema: [
            slider('tablet', 600, 2000, 8, 'px', DEFAULT_BREAKPOINTS.tablet, { __label: t('label_breakpoint_tablet') }),
            slider('mobile', 320, 1200, 8, 'px', DEFAULT_BREAKPOINTS.mobile, { __label: t('label_breakpoint_mobile') }),
          ],
        },
        { name: 'showRight', selector: { boolean: {} } },
        { type: 'sidebar_paths', name: 'hideOnPath', placeholder: t('placeholder_path') },
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
          schema: [
            color('background', 'var(--card-background-color, #fff)'),
            color('textColor', 'var(--primary-text-color, #212121)'),
            color('iconColor', 'var(--secondary-text-color, #727272)'),
            color('accentColor', 'var(--primary-color, #03a9f4)'),
            ...(data.dividers ? [color('dividerColor', 'var(--divider-color, #e0e0e0)')] : []),
          ],
        },
        { name: 'dividers', selector: { boolean: {} } },
        { name: 'glass', selector: { boolean: {} }, __helper: t('helper_glass') },
        ...(data.glass ? [slider('blur', 2, 30, 1, 'px', GLASS_BLUR)] : []),
        { name: 'shadow', selector: { boolean: {} }, __helper: t('helper_shadow') },
        ...(data.shadow ? [slider('shadowSize', 2, 40, 1, 'px', SHADOW_SIZE)] : []),
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

// Styles shared by the list fields of the editor (clocks and dates, menu items, buttons, views)
const listStyles = css`
  :host {
    display: block;
  }
  /* a subheading above the list */
  .label {
    margin-bottom: 8px;
    color: var(--primary-text-color, #212121);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .item {
    position: relative;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: var(--ha-border-radius-md, 8px);
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
  }
  .items.sorting .item:not(.dragging) {
    transition: transform 0.15s ease;
  }
  .item.dragging {
    z-index: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  .item.off .item-icon,
  .item.off .info {
    opacity: 0.45;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 56px;
    padding: 0 4px 0 12px;
  }
  .handle {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    width: 32px;
    margin-left: -8px;
    color: var(--secondary-text-color, #727272);
    cursor: move;
    touch-action: none;
  }
  .item-icon {
    display: flex;
    flex: none;
    color: var(--secondary-text-color, #727272);
  }
  .info {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    padding: 8px 4px 8px 12px;
    cursor: pointer;
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--primary-text-color, #212121);
    font-size: var(--ha-font-size-m, 14px);
    line-height: 20px;
  }
  .summary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--secondary-text-color, #727272);
    font-size: var(--ha-font-size-s, 12px);
    line-height: 16px;
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
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color, #727272);
  }
  button.icon:hover {
    background: rgba(127, 127, 127, 0.12);
  }
  .item-form {
    padding: 8px 16px 16px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  ha-form {
    display: block;
  }
  .hint {
    margin: 0 0 8px;
    color: var(--secondary-text-color, #727272);
    font-size: var(--ha-font-size-m, 14px);
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

// A list for ha-form ("type: sidebar_list"): add with a button, drag by the handle, open an entry to change it.
// The schema brings the parts that differ: newItem, itemIcon, itemName, itemSummary, itemSchema, addTypes, ...
class SidebarListField extends LitElement {
  hass: any;
  schema: any;
  data: any;
  label = '';
  computeLabel: any;
  computeHelper: any;
  _expanded = -1;
  _addOpen = false;
  _schemas = new Map<string, any[]>();

  static get properties() {
    return {
      hass: { attribute: false },
      schema: { attribute: false },
      data: { attribute: false },
      label: { attribute: false },
      computeLabel: { attribute: false },
      computeHelper: { attribute: false },
      _expanded: { attribute: false },
      _addOpen: { attribute: false },
    };
  }

  get _items(): any[] {
    return Array.isArray(this.data) ? this.data : [];
  }

  _itemSchema(item: any) {
    const s = this.schema;
    const key = s.itemSchemaKey ? s.itemSchemaKey(item) : 'item';
    if (!this._schemas.has(key)) this._schemas.set(key, s.itemSchema(item));
    return this._schemas.get(key);
  }

  render() {
    const s = this.schema || {};
    const t = (key: string) => localize(key, this.hass);
    const items = this._items;
    return html`
      ${this.label
        ? html`
            <div class="label">${this.label}</div>
          `
        : ''}
      <div class="items">${items.map((item, index) => this._renderItem(item, index))}</div>
      ${items.length === 0 && s.emptyText
        ? html`
            <p class="hint">${s.emptyText}</p>
          `
        : ''}
      ${s.addTypes && this._addOpen
        ? html`
            <div class="add-menu">
              ${s.addTypes.map(
                (option) => html`
                  <button class="add-option" @click=${() => this._add(option.type)}>
                    <ha-icon .icon=${option.icon}></ha-icon>
                    <span>${option.label}</span>
                  </button>
                `,
              )}
            </div>
          `
        : ''}
      <button class="add-button" @click=${() => (s.addTypes ? (this._addOpen = !this._addOpen) : this._add())}>
        <ha-icon .icon=${this._addOpen ? 'mdi:close' : 'mdi:plus'}></ha-icon>
        <span>${this._addOpen ? t('cancel') : t('add_element')}</span>
      </button>
    `;
  }

  _renderItem(item: any, index: number) {
    const s = this.schema;
    const t = (key: string) => localize(key, this.hass);
    const expanded = this._expanded === index;
    const entity = s.itemEntity ? s.itemEntity(item) : undefined;
    const stateObj = entity && this.hass && this.hass.states ? this.hass.states[entity] : undefined;
    const summary = s.itemSummary ? s.itemSummary(item) : '';
    return html`
      <div class="item${expanded ? ' expanded' : ''}">
        <div class="row">
          <span class="handle" title="${t('move_element')}" @pointerdown=${(ev) => this._dragStart(ev, index)}>
            <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
          </span>
          <span class="item-icon">
            ${stateObj && customElements.get('ha-state-icon')
              ? html`
                  <ha-state-icon .hass=${this.hass} .stateObj=${stateObj} .icon=${item.icon}></ha-state-icon>
                `
              : html`
                  <ha-icon .icon=${s.itemIcon(item)}></ha-icon>
                `}
          </span>
          <div class="info" @click=${() => this._toggle(index)}>
            <span class="name">${s.itemName(item)}</span>
            ${summary
              ? html`
                  <span class="summary">${summary}</span>
                `
              : ''}
          </div>
          <button class="icon" title="${t('edit_element')}" @click=${() => this._toggle(index)}>
            <ha-icon .icon=${expanded ? 'mdi:chevron-up' : 'mdi:pencil'}></ha-icon>
          </button>
          <button class="icon" title="${t('remove_element')}" @click=${() => this._remove(index)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        ${expanded
          ? html`
              <div class="item-form">
                <ha-form
                  .hass=${this.hass}
                  .data=${item}
                  .schema=${this._itemSchema(item)}
                  .computeLabel=${this.computeLabel}
                  .computeHelper=${this.computeHelper}
                  @value-changed=${(ev) => this._itemChanged(ev, index)}
                ></ha-form>
              </div>
            `
          : ''}
      </div>
    `;
  }

  _fire(items: any[]) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: items }, bubbles: true }));
  }

  _toggle(index: number) {
    this._expanded = this._expanded === index ? -1 : index;
  }

  _add(type?: string) {
    const items = [...this._items, this.schema.newItem(type)];
    this._addOpen = false;
    this._expanded = items.length - 1;
    this._fire(items);
  }

  _remove(index: number) {
    const items = [...this._items];
    items.splice(index, 1);
    if (this._expanded === index) this._expanded = -1;
    else if (this._expanded > index) this._expanded -= 1;
    this._fire(items);
  }

  _move(from: number, to: number) {
    const items = [...this._items];
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    if (this._expanded === from) this._expanded = to;
    else if (this._expanded > from && this._expanded <= to) this._expanded -= 1;
    else if (this._expanded < from && this._expanded >= to) this._expanded += 1;
    this._fire(items);
  }

  _itemChanged(ev: any, index: number) {
    ev.stopPropagation();
    const items = [...this._items];
    let item = Object.assign({}, ev.detail.value);
    if (this.schema.normalizeItem) item = this.schema.normalizeItem(item, items[index]);
    items[index] = item;
    this._fire(items);
  }

  // pointer events work with mouse and touch; the other rows make room while one is dragged
  _dragStart(ev: PointerEvent, index: number) {
    const handle = ev.currentTarget as HTMLElement;
    const list = this.shadowRoot && (this.shadowRoot as any).querySelector('.items');
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
      if (target !== index) this._move(index, target);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  updated() {
    // the action editor of an opened entry renders a moment later
    [0, 150, 500, 1200].forEach((delay) => setTimeout(() => hideScriptHelp(this.shadowRoot), delay));
  }

  static get styles() {
    return listStyles;
  }
}

if (!customElements.get('ha-form-sidebar_list')) customElements.define('ha-form-sidebar_list', SidebarListField);

// HA's action editor links its help button to /actions/<action>, a page that does not exist for one's own scripts
// (script.<name>); hide that button there, keep it for the real script actions
const SCRIPT_HELP_CSS = `.description a[href*="/actions/script."]:not([href$="script.turn_on"]):not([href$="script.turn_off"]):not([href$="script.toggle"]):not([href$="script.reload"]) { display: none !important; }`;

function findDeep(root: any, localName: string, found: any[] = [], depth = 0) {
  if (!root || depth > 12) return found;
  root.querySelectorAll('*').forEach((element: any) => {
    if (element.localName === localName) found.push(element);
    if (element.shadowRoot) findDeep(element.shadowRoot, localName, found, depth + 1);
  });
  return found;
}

function hideScriptHelp(root: any) {
  findDeep(root, 'ha-service-control').forEach((control: any) => {
    const shadow = control.shadowRoot;
    if (!shadow || control.__sidebarScriptHelp) return;
    control.__sidebarScriptHelp = true;
    const style = document.createElement('style');
    style.textContent = SCRIPT_HELP_CSS;
    // before Lit's own content, which Lit leaves alone
    shadow.prepend(style);
  });
}

// The views of the dashboard for ha-form ("type: sidebar_views"), each with an eye to show or hide it in the menu.
// The value is the list of hidden view paths; the views come with the schema, so added or deleted views show up at once.
class SidebarViewsField extends LitElement {
  hass: any;
  schema: any;
  data: any;

  static get properties() {
    return {
      hass: { attribute: false },
      schema: { attribute: false },
      data: { attribute: false },
    };
  }

  render() {
    const t = (key: string) => localize(key, this.hass);
    const hidden = Array.isArray(this.data) ? this.data.map(String) : [];
    const views = (this.schema && this.schema.views) || [];
    return html`
      <div class="items">
        ${views.map((view) => {
          const off = hidden.includes(view.value);
          return html`
            <div class="item${off ? ' off' : ''}">
              <div class="row">
                <span class="item-icon"><ha-icon .icon=${view.icon}></ha-icon></span>
                <div class="info">
                  <span class="name">${view.label}</span>
                  <span class="summary">${this.schema.base}/${view.value}</span>
                </div>
                <button class="icon" title="${t(off ? 'show_view' : 'hide_view')}" @click=${() => this._toggle(view.value)}>
                  <ha-icon .icon=${off ? 'mdi:eye-off' : 'mdi:eye'}></ha-icon>
                </button>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  _toggle(path: string) {
    const hidden = Array.isArray(this.data) ? this.data.map(String) : [];
    const value = hidden.includes(path) ? hidden.filter((item) => item !== path) : [...hidden, path];
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true }));
  }

  static get styles() {
    return [
      listStyles,
      css`
        .row {
          padding-left: 16px;
          min-height: 52px;
        }
        .info {
          cursor: default;
        }
      `,
    ];
  }
}

if (!customElements.get('ha-form-sidebar_views')) customElements.define('ha-form-sidebar_views', SidebarViewsField);

// Paths for ha-form ("type: sidebar_paths") under a subheading: one field per path, a delete button each, plus to add
class SidebarPathsField extends LitElement {
  hass: any;
  schema: any;
  data: any;
  label = '';
  _selector = { text: {} };

  static get properties() {
    return {
      hass: { attribute: false },
      schema: { attribute: false },
      data: { attribute: false },
      label: { attribute: false },
    };
  }

  get _paths(): string[] {
    return Array.isArray(this.data) ? this.data : [];
  }

  render() {
    const t = (key: string) => localize(key, this.hass);
    return html`
      ${this.label
        ? html`
            <div class="label">${this.label}</div>
          `
        : ''}
      <div class="paths">
        ${this._paths.map(
          (path, index) => html`
            <div class="path-row">
              <ha-selector
                class="path"
                .hass=${this.hass}
                .selector=${this._selector}
                .value=${path}
                .placeholder=${this.schema && this.schema.placeholder}
                @value-changed=${(ev) => this._changed(ev, index)}
              ></ha-selector>
              <button class="icon" title="${t('remove_element')}" @click=${() => this._remove(index)}>
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `,
        )}
      </div>
      <button class="add-button" @click=${() => this._fire([...this._paths, ''])}>
        <ha-icon icon="mdi:plus"></ha-icon>
        <span>${t('add_element')}</span>
      </button>
    `;
  }

  _fire(value: string[]) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true }));
  }

  _changed(ev: any, index: number) {
    ev.stopPropagation();
    const paths = [...this._paths];
    paths[index] = ev.detail.value || '';
    this._fire(paths);
  }

  _remove(index: number) {
    const paths = [...this._paths];
    paths.splice(index, 1);
    this._fire(paths);
  }

  static get styles() {
    return [
      listStyles,
      css`
        .paths {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .path-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        /* without the space HA's text field keeps below itself for hints, so the button sits in its middle */
        .path {
          display: block;
          flex: 1 1 auto;
          min-width: 0;
          --ha-input-padding-bottom: 0px;
        }
        .paths:empty + .add-button {
          margin-top: 0;
        }
      `,
    ];
  }
}

if (!customElements.get('ha-form-sidebar_paths')) customElements.define('ha-form-sidebar_paths', SidebarPathsField);

// A slider field for ha-form ("type: sidebar_slider") with a button on the right that puts the default back.
// ha-form renders unknown field types as <ha-form-TYPE> and passes schema, data, label, helper and hass.
class SidebarSliderField extends LitElement {
  hass: any;
  schema: any;
  data: any;
  label = '';
  helper = '';
  disabled = false;
  _selectorFor: any = null;
  _selector: any = null;
  _slider: any = null;
  _lastLive: any = undefined;

  static get properties() {
    return {
      hass: { attribute: false },
      schema: { attribute: false },
      data: { attribute: false },
      label: { attribute: false },
      helper: { attribute: false },
      disabled: { type: Boolean },
    };
  }

  _getSelector() {
    if (this._selectorFor !== this.schema) {
      const s = this.schema || {};
      this._selectorFor = this.schema;
      this._selector = { number: { min: s.min, max: s.max, step: s.step, mode: 'slider', unit_of_measurement: s.unit } };
    }
    return this._selector;
  }

  render() {
    const s = this.schema || {};
    const value = typeof this.data === 'number' ? this.data : s.default;
    return html`
      ${this.label
        ? html`
            <div class="label">${this.label}</div>
          `
        : ''}
      <div class="row" @input=${(ev) => this._onInput(ev)}>
        <ha-selector
          class="slider"
          .hass=${this.hass}
          .selector=${this._getSelector()}
          .value=${value}
          .disabled=${this.disabled}
          .required=${false}
          @value-changed=${(ev) => this._changed(ev)}
        ></ha-selector>
        <button
          class="reset"
          title="${localize('reset_default', this.hass)}"
          ?disabled=${this.disabled || value === s.default}
          @click=${() => this._fire(s.resetToEmpty ? undefined : s.default)}
        >
          <ha-icon icon="mdi:restore"></ha-icon>
        </button>
      </div>
      ${this.helper
        ? html`
            <div class="helper">${this.helper}</div>
          `
        : ''}
    `;
  }

  _changed(ev: any) {
    ev.stopPropagation();
    this._lastLive = undefined;
    this._fire(ev.detail.value);
  }

  // HA's slider reports its value only when it is let go; its input events come while it is dragged
  _onInput(ev: any) {
    const source: any = ev.composedPath().find((el: any) => el && el.tagName && ['HA-SLIDER', 'WA-SLIDER', 'INPUT'].includes(el.tagName));
    if (source) this._live(source.value);
  }

  _live(raw: any) {
    const value = Number(raw);
    if (raw === '' || raw === null || raw === undefined || isNaN(value) || value === this._lastLive) return;
    this._lastLive = value;
    this._fire(value);
  }

  updated() {
    this._hookSlider(0);
  }

  // in case the slider's input events do not leave its shadow root, listen on the slider itself
  _hookSlider(attempt: number) {
    const selector: any = this.shadowRoot && (this.shadowRoot as any).querySelector('ha-selector');
    const number: any = selector && selector.shadowRoot && selector.shadowRoot.querySelector('ha-selector-number');
    const slider: any = number && number.shadowRoot && number.shadowRoot.querySelector('ha-slider');
    if (slider) {
      if (slider !== this._slider) {
        this._slider = slider;
        slider.addEventListener('input', (ev) => {
          ev.stopPropagation();
          this._live(slider.value);
        });
      }
    } else if (selector && attempt < 30) {
      requestAnimationFrame(() => this._hookSlider(attempt + 1));
    }
  }

  _fire(value: any) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true }));
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .label {
        color: var(--primary-text-color, #212121);
      }
      .row {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .slider {
        display: block;
        flex: 1 1 auto;
        min-width: 0;
      }
      .reset {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--secondary-text-color, #727272);
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .reset:hover:not([disabled]) {
        background: rgba(127, 127, 127, 0.12);
        color: var(--primary-text-color, #212121);
      }
      .reset[disabled] {
        opacity: 0.35;
        cursor: default;
      }
      .helper {
        padding-left: 16px;
        color: var(--secondary-text-color, #727272);
        font-size: 12px;
        line-height: 16px;
      }
    `;
  }
}

if (!customElements.get('ha-form-sidebar_slider')) customElements.define('ha-form-sidebar_slider', SidebarSliderField);


class SidebarCardEditor extends LitElement {
  hass: any;
  lovelace: any;
  originalConfig: any = {};
  side = 'right';
  onPreview: any = null;
  onClose: any = null;
  isNew = false; // not in the dashboard yet: nothing to delete
  _data: any = {};
  _ready = false;
  _saving = false;
  _error = '';
  _schemaKey = '';
  _schema: any[] = [];

  static get properties() {
    return {
      hass: { attribute: false },
      lovelace: { attribute: false },
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
    const key = JSON.stringify([
      this.hass && this.hass.language,
      d.viewMenu,
      d.menuIcons,
      d.menuFontSize,
      d.menuPosition,
      d.dividers,
      d.bottomButtonsLayout,
      d.widthUnit,
      d.glass,
      d.shadow,
      d.hideTopMenu,
      // views added or deleted in Home Assistant show up right away
      menuViews(this.lovelace).map((view) => [view.value, view.label, view.icon]),
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
          <button class="icon" title="${t('cancel')}" @click=${() => this._close(false)}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <h2>${t('editor_title')}</h2>
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
          ${this.isNew
            ? ''
            : html`
                <button class="danger" ?disabled=${this._saving} @click=${() => this._delete()}>${t('delete')}</button>
              `}
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
    // dropdowns never end up empty
    ['menuIcons', 'menuPosition', 'bottomButtonsLayout', 'widthUnit'].forEach((key) => {
      if (isEmpty(data[key])) data[key] = previous[key] || EDITOR_DEFAULTS[key];
    });
    if (data.widthUnit !== previous.widthUnit && data.width) {
      data.width = convertWidth(data.width, data.widthUnit);
    }
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

  // like deleting a card: gone right away, Home Assistant's undo brings it back
  async _delete() {
    this._saving = true;
    this._error = '';
    try {
      const lovelace = getLovelace() || this.lovelace;
      const deleted = await deleteSidebar();
      this._close(true);
      if (deleted) showDeletedToast(lovelace);
    } catch (err) {
      this._error = localize('delete_error', this.hass) + ': ' + ((err && (err as any).message) || err);
      this._saving = false;
    }
  }

  _close(saved: boolean) {
    if (this.hasAttribute('closing')) return;
    // slides out to the edge of the screen first
    this.setAttribute('closing', '');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      this.remove();
      if (this.onClose) this.onClose(saved);
    };
    this.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 400);
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
        animation: slide-in-right 0.22s cubic-bezier(0.2, 0, 0, 1);
      }
      :host([side='left']) {
        right: auto;
        left: 0;
        animation-name: slide-in-left;
      }
      :host([closing]) {
        animation: slide-out-right 0.18s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      :host([side='left'][closing]) {
        animation-name: slide-out-left;
      }
      @keyframes slide-in-right {
        from {
          transform: translateX(100%);
        }
      }
      @keyframes slide-in-left {
        from {
          transform: translateX(-100%);
        }
      }
      @keyframes slide-out-right {
        to {
          transform: translateX(100%);
        }
      }
      @keyframes slide-out-left {
        to {
          transform: translateX(-100%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host,
        :host([closing]) {
          animation: none;
        }
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
      /* room for the scrollbar from the start, so nothing jumps sideways when it appears */
      .content {
        flex: 1 1 auto;
        overflow-y: auto;
        scrollbar-gutter: stable;
        padding: 16px 12px 16px 20px;
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
      button.danger {
        height: 40px;
        margin-right: auto;
        padding: 0 16px;
        border: none;
        border-radius: 20px;
        background: transparent;
        color: var(--error-color, #db4437);
        font-size: 14px;
        font-weight: 500;
      }
      button.danger:hover {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      .danger ~ .error {
        margin-right: 0;
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

// ?haUi=true shows the HA header and sidebar again until the page is reloaded, ?haUi=false hides them again
let hassUiForced = false;
function isHassUiForced() {
  const value = getParameterByName('haUi');
  if (value !== null) hassUiForced = value === '' || value === 'true' || value === '1';
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
  draft: boolean; // added from the header button and not saved yet
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
  // a new sidebar that was not saved goes away again
  if (current.draft && !saved) {
    teardownSidebar();
    return;
  }
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
  if (state.card._editor) state.card._editor.lovelace = lovelace;
  // edit mode on/off changes the header height; HA renders it a moment later
  [0, 150, 500].forEach((delay) => setTimeout(() => relayout(state), delay));

  const sidebarConfig = lovelace.config && lovelace.config.sidebar;
  if (!sidebarConfig) {
    if (!state.draft) teardownSidebar();
    return;
  }
  state.draft = false;
  const json = JSON.stringify(sidebarConfig);
  if (json !== state.configJson) {
    state.config = clone(sidebarConfig);
    state.configJson = json;
    if (!state.previewing) applyConfig(state, state.config);
  }
}

// ##########################################################################################
// ###   Deleting the sidebar
// ##########################################################################################

// Home Assistant's own wording where it has one, so the menu reads like the one of the cards
function haText(hassObj: any, haKey: string, key: string) {
  const text = hassObj && typeof hassObj.localize === 'function' ? hassObj.localize(haKey) : '';
  return text || localize(key, hassObj);
}

// removes the sidebar from the dashboard config; true when something was stored
async function deleteSidebar() {
  if (current && current.draft) {
    teardownSidebar();
    return false;
  }
  const lovelace = getLovelace();
  const stored = lovelace && (lovelace.rawConfig || lovelace.config);
  if (!stored || !stored.sidebar || typeof lovelace.saveConfig !== 'function') return false;
  const config = Object.assign({}, stored);
  delete config.sidebar;
  // hui-root puts the old config on its undo stack, like for any other change
  await lovelace.saveConfig(config);
  return true;
}

function showDeletedToast(lovelace: any) {
  if (!lovelace || typeof lovelace.showToast !== 'function') return;
  const hassObj = hass();
  lovelace.showToast({
    id: 'lovelace-edit',
    message: haText(hassObj, 'ui.common.successfully_deleted', 'deleted'),
    duration: 8000,
    action: {
      action: () => window.dispatchEvent(new CustomEvent('undo-change')),
      text: haText(hassObj, 'ui.common.undo', 'undo'),
    },
  });
}

async function deleteSidebarWithToast() {
  const lovelace = getLovelace();
  try {
    if (await deleteSidebar()) showDeletedToast(lovelace);
  } catch (err) {
    error2console('deleteSidebar', 'Deleting the sidebar failed', err);
    if (lovelace && typeof lovelace.showToast === 'function') {
      lovelace.showToast({ id: 'lovelace-edit', message: haText(hass(), 'ui.common.deleting_failed', 'delete_error') });
    }
  }
}

// ##########################################################################################
// ###   Sidebar button in the header while editing the dashboard
// ##########################################################################################

const HEADER_BUTTON_ID = 'sidebar-card-header-button';
const HEADER_TOOLTIP_ID = 'sidebar-card-header-tooltip';
// what the header button adds to a dashboard without sidebar
const DEFAULT_SIDEBAR = { viewMenu: true, elements: [{ type: 'digitalClock' }, { type: 'date' }] };
const MDI_DOCK_LEFT = 'M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M20 18H9V6H20Z';
const MDI_DOCK_RIGHT = 'M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M15 18H4V6H15Z';
let observedHeader: any = null;
let headerObserver: MutationObserver | null = null;

function isEditable(lovelace: any) {
  return !!(
    lovelace &&
    lovelace.editMode &&
    lovelace.mode !== 'yaml' &&
    typeof lovelace.saveConfig === 'function' &&
    isCurrentDashboard(lovelace)
  );
}

// HA renders a new toolbar each time edit mode starts, so the button is put back whenever it is missing
function ensureHeaderButton() {
  const root = getRoot();
  const shadow = root && root.shadowRoot;
  if (!shadow) return;
  // right when HA renders the edit mode toolbar, not up to 500 ms later
  const header = shadow.querySelector('.header');
  if (header && header !== observedHeader && typeof MutationObserver !== 'undefined') {
    if (headerObserver) headerObserver.disconnect();
    headerObserver = new MutationObserver(() => ensureHeaderButton());
    headerObserver.observe(header, { childList: true, subtree: true });
    observedHeader = header;
  }
  const lovelace = getLovelace();
  const actions = isEditable(lovelace) ? shadow.querySelector('.edit-mode .action-items') : null;
  let button: any = shadow.getElementById(HEADER_BUTTON_ID);
  let tooltip: any = shadow.getElementById(HEADER_TOOLTIP_ID);
  if (!actions || (button && button.parentNode !== actions)) {
    if (button) button.remove();
    if (tooltip) tooltip.remove();
    if (!actions) return;
    button = tooltip = null;
  }
  if (!button) {
    button = document.createElement('ha-icon-button');
    button.id = HEADER_BUTTON_ID;
    button.addEventListener('click', onHeaderButtonClick);
    // HA's tooltip like the buttons next to it; without it the browser shows the label
    if (customElements.get('ha-tooltip')) {
      button.setAttribute('hide-title', '');
      tooltip = document.createElement('ha-tooltip');
      tooltip.id = HEADER_TOOLTIP_ID;
      tooltip.setAttribute('placement', 'bottom');
      tooltip.setAttribute('for', HEADER_BUTTON_ID);
    }
    // in front of undo/redo, outside the part Home Assistant renders into
    if (tooltip) actions.prepend(button, tooltip);
    else actions.prepend(button);
  }
  const sidebarConfig = (current && current.applied) || lovelace.config.sidebar;
  const label = localize(sidebarConfig ? 'edit_sidebar' : 'add_sidebar', hass());
  const path = sidebarConfig && sidebarConfig.showRight ? MDI_DOCK_RIGHT : MDI_DOCK_LEFT;
  if (button.label !== label) button.label = label;
  if (button.path !== path) button.path = path;
  if (tooltip && tooltip.textContent !== label) tooltip.textContent = label;
}

// opens the sidebar settings; a dashboard without sidebar gets the default one, kept when saved
function onHeaderButtonClick() {
  const lovelace = getLovelace();
  if (!isEditable(lovelace)) return;
  const open = () => {
    if (current && current.wrapper.isConnected) current.card._openEditor();
  };
  if (current && current.wrapper.isConnected) {
    open();
    return;
  }
  buildSidebar(lovelace.config.sidebar ? undefined : clone(DEFAULT_SIDEBAR)).then(open);
}

// ##########################################################################################
// ###   The Sidebar Card code base initialisation
// ##########################################################################################

// draft: a sidebar config to show on a dashboard that has none (not saved until the editor saves it)
async function buildSidebar(draft?: any) {
  // startup, location-changed and the watcher can all get here; build only once (#152)
  if (building) return;
  building = true;
  try {
    await doBuildSidebar(draft);
  } catch (err) {
    error2console('buildSidebar', 'Building the sidebar failed', err);
  } finally {
    building = false;
  }
}

async function doBuildSidebar(draft?: any) {
  const lovelace = await getConfig();
  if (current && !current.wrapper.isConnected) dropState(current);
  const stored = lovelace.config.sidebar;
  if (!stored && !draft) {
    log2console('buildSidebar', 'No sidebar in config found!');
    return;
  }

  const sidebarConfig = clone(stored || draft);
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
    configJson: stored ? JSON.stringify(stored) : '',
    applied: sidebarConfig,
    previewing: !stored,
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
    draft: !stored,
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
setInterval(() => {
  checkLovelace();
  ensureHeaderButton();
}, 500);
