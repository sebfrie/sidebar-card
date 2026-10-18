// ------------------------------------------------------------------------------------------
//  SIDEBAR-CARD
// ------------------------------------------------------------------------------------------
//  https://github.com/DBuit/sidebar-card
// ------------------------------------------------------------------------------------------

// ##########################################################################################
// ###   Global constants
// ##########################################################################################

const SIDEBAR_CARD_TITLE = 'SIDEBAR-CARD';
const SIDEBAR_CARD_VERSION = '0.2.0';

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
// ###   The actual Sidebar Card element
// ##########################################################################################

class SidebarCard extends LitElement {
  /* **************************************** *
   *        Element's local properties        *
   * **************************************** */

  config: any;
  hass: any;
  shadowRoot: any;
  renderCard: any;
  templateLines: any = [];
  clock = false;
  updateMenu = true;
  digitalClock = false;
  twelveHourVersion = false;
  digitalClockWithSeconds = false;
  period = false;
  date = false;
  dateFormat = 'DD MMMM';
  bottomCard: any = null;

  // Markus:
  // Stores the setInterval handle for the periodic clock update
  // Stores the setInterval handle for the periodic date update
  // Stores the bound event handler function for the 'location-changed' event, used to update the active menu item with the correct `this` context
  _clockInterval: any = null;
  _dateInterval: any = null;
  _boundLocationChange: any;
  _boundResize: any;

  /* **************************************** *
   *        Element's public properties       *
   * **************************************** */

  static get properties() {
    return {
      hass: {},
      config: {},
      active: {},
    };
  }

  /* **************************************** *
   *           Element constructor            *
   * **************************************** */

  //Markus:
  // Binds the location change handler to update the active menu item with a short delay
  constructor() {
    super();
    this._boundLocationChange = () => {
        setTimeout(() => {
          this._updateActiveMenu();
          // the sidebar may have been shown again by hideOnPath (#78)
          this.updateSidebarSize();
        }, 50);
    };
    this._boundResize = () => {
      setTimeout(() => this.updateSidebarSize(), 1);
    };
  }

  connectedCallback() {
      super.connectedCallback();
      // Starts the observer for URL changes
      window.addEventListener('location-changed', this._boundLocationChange);
      window.addEventListener('resize', this._boundResize, true);

      // Start timers if they are configured and not already running.
      if ((this.config.clock || this.config.digitalClock) && !this._clockInterval) {
        const inc = 1000;
        // Delay the first run slightly to ensure the DOM is ready.
        setTimeout(() => this._runClock(), 50);
        this._clockInterval = setInterval(() => this._runClock(), inc);
      }
      if (this.config.date && !this._dateInterval) {
        // every minute, so the date flips close to midnight (#143)
        const inc = 1000 * 60;
        // Delay the first run slightly to ensure the DOM is ready.
        setTimeout(() => this._runDate(), 50);
        this._dateInterval = setInterval(() => this._runDate(), inc);
      }

      this._updateActiveMenu();
    }

  disconnectedCallback() {
    super.disconnectedCallback();
    // a replaced dashboard must not keep its timers and listeners alive
    window.removeEventListener('location-changed', this._boundLocationChange);
    window.removeEventListener('resize', this._boundResize, true);
    clearInterval(this._clockInterval);
    clearInterval(this._dateInterval);
    this._clockInterval = null;
    this._dateInterval = null;
  }

  /* **************************************** *
   *   Element's HTML renderer (lit-element)  *
   * **************************************** */

  render() {
    const sidebarMenu = this.config.sidebarMenu;
    const title = 'title' in this.config ? this.config.title : false;
    const addStyle = 'style' in this.config;

    this.clock = this.config.clock ? this.config.clock : false;
    this.digitalClock = this.config.digitalClock ? this.config.digitalClock : false;
    this.digitalClockWithSeconds = this.config.digitalClockWithSeconds ? this.config.digitalClockWithSeconds : false;
    this.twelveHourVersion = this.config.twelveHourVersion ? this.config.twelveHourVersion : false;
    this.period = this.config.period ? this.config.period : false;
    this.date = this.config.date ? this.config.date : false;
    this.dateFormat = this.config.dateFormat ? this.config.dateFormat : 'DD MMMM';
    this.bottomCard = this.config.bottomCard ? this.config.bottomCard : null;
    this.updateMenu = this.config.hasOwnProperty('updateMenu') ? this.config.updateMenu : true;

    return html`
      ${addStyle
        ? html`
            <style>
              ${this.config.style}
            </style>
          `
        : html``}

      <div class="sidebar-inner">
        ${this.digitalClock
          ? html`
              <h1 class="digitalClock${title ? ' with-title' : ''}${this.digitalClockWithSeconds ? ' with-seconds' : ''}"></h1>
            `
          : html``}
        ${this.clock
          ? html`
              <div class="clock">
                <div class="wrap">
                  <span class="hour"></span>
                  <span class="minute"></span>
                  <span class="second"></span>
                  <span class="dot"></span>
                </div>
              </div>
            `
          : html``}
        ${title
          ? html`
              <h1 class="title">${title}</h1>
            `
          : html``}
        ${this.date
          ? html`
              <h2 class="date"></h2>
            `
          : html``}
        ${sidebarMenu && sidebarMenu.length > 0
          ? html`
              <ul class="sidebarMenu">
                ${(sidebarMenu || []).filter(item => this._evaluateVisibleCondition(item.conditional, this.hass)).map((sidebarMenuItem) => {
                  return html`
                    <li @click="${(e) => this._menuAction(e)}" class="${sidebarMenuItem.state && this.hass.states[sidebarMenuItem.state].state != 'off' && this.hass.states[sidebarMenuItem.state].state != 'unavailable' ? 'active' : ''}" data-type="${sidebarMenuItem.action}" data-path="${sidebarMenuItem.navigation_path ? sidebarMenuItem.navigation_path : ''}" data-menuitem="${JSON.stringify(sidebarMenuItem)}">
                      <span>${sidebarMenuItem.name}</span>
                      ${sidebarMenuItem.icon
                          ? html`
                            <ha-icon @click="${(e) => this._menuAction(e)}" icon="${sidebarMenuItem.icon}"></ha-icon>
                          `
                          : html``}
                    </li>
                  `;
                })}

              </ul>
            `
          : html``}
        ${this.config.template
          ? html`
              <ul class="template">
                ${this.templateLines.map((line) => {
                  return html`
                    ${createElementFromHTML(line)}
                  `;
                })}
              </ul>
            `
          : html``}
        ${this.bottomCard
          ? html`
              <div class="bottom"></div>
            `
          : html``}
      </div>
    `;
  }

  _runClock() {
    let hoursampm;
    let digitalTime;
    const date = new Date();

    let fullHours = date.getHours().toString();
    const realHours = date.getHours();
    const hours = ((realHours + 11) % 12) + 1;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const hour = Math.floor((hours * 60 + minutes) / 2);
    const minute = minutes * 6;
    const second = seconds * 6;

    if (this.clock) {
      this.shadowRoot.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
      this.shadowRoot.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
      this.shadowRoot.querySelector('.second').style.transform = `rotate(${second}deg)`;
    }
    if (this.digitalClock && !this.twelveHourVersion) {
      const minutesString = minutes.toString();
      digitalTime = fullHours.length < 2 ? '0' + fullHours + ':' : fullHours + ':';
      if (this.digitalClockWithSeconds) {
        digitalTime += minutesString.length < 2 ? '0' + minutesString + ':' : minutesString + ':';
        const secondsString = seconds.toString();
        digitalTime += secondsString.length < 2 ? '0' + secondsString : secondsString;
      } else {
        digitalTime += minutesString.length < 2 ? '0' + minutesString : minutesString;
      }
      this.shadowRoot.querySelector('.digitalClock').textContent = digitalTime;
    } else if (this.digitalClock && this.twelveHourVersion && !this.period) {
      hoursampm = date.getHours();
      hoursampm = hoursampm % 12;
      hoursampm = hoursampm ? hoursampm : 12;
      fullHours = hoursampm.toString();
      const minutesString = minutes.toString();
      digitalTime = fullHours.length < 2 ? '0' + fullHours + ':' : fullHours + ':';
      if (this.digitalClockWithSeconds) {
        digitalTime += minutesString.length < 2 ? '0' + minutesString + ':' : minutesString + ':';
        const secondsString = seconds.toString();
        digitalTime += secondsString.length < 2 ? '0' + secondsString : secondsString;
      } else {
        digitalTime += minutesString.length < 2 ? '0' + minutesString : minutesString;
      }
      //digitalTime;
      this.shadowRoot.querySelector('.digitalClock').textContent = digitalTime;
    } else if (this.digitalClock && this.twelveHourVersion && this.period) {
      const ampm = realHours >= 12 ? 'pm' : 'am';
      hoursampm = date.getHours();
      hoursampm = hoursampm % 12;
      hoursampm = hoursampm ? hoursampm : 12;
      fullHours = hoursampm.toString();
      const minutesString = minutes.toString();
      digitalTime = fullHours.length < 2 ? '0' + fullHours + ':' : fullHours + ':';
      if (this.digitalClockWithSeconds) {
        digitalTime += minutesString.length < 2 ? '0' + minutesString + ':' : minutesString + ':';
        const secondsString = seconds.toString();
        digitalTime += secondsString.length < 2 ? '0' + secondsString : secondsString;
      } else {
        digitalTime += minutesString.length < 2 ? '0' + minutesString : minutesString;
      }
      digitalTime += ' ' + ampm;
      this.shadowRoot.querySelector('.digitalClock').textContent = digitalTime;
    }
  }

  _runDate() {
    const now = moment();
    now.locale(this.hass.language);
    this.shadowRoot.querySelector('.date').textContent = now.format(this.dateFormat);
  }

  updateSidebarSize() {
    const sidebarInner = this.shadowRoot.querySelector('.sidebar-inner');
    const headerHeightPx = getHeaderHeightPx();

    if (sidebarInner) {
      sidebarInner.style.width = this.offsetWidth + 'px';
      if (isTopMenuHidden(this.config, document.body.clientWidth)) {
        sidebarInner.style.height = `${window.innerHeight}px`;
        sidebarInner.style.top = '0px';
      } else {
        sidebarInner.style.height = `calc(${window.innerHeight}px - `+headerHeightPx+`)`;
        sidebarInner.style.top = headerHeightPx;
      }
    }
  }

  firstUpdated() {
    provideHass(this);

    setTimeout(() => {
      this.updateSidebarSize();
      this._updateActiveMenu();
    }, 50);

    setTimeout(() => {
      this.updateSidebarSize();
    }, 350);

    if (this.bottomCard) {
      setTimeout(async () => {
        const card = Object.assign({ type: this.bottomCard.type }, this.bottomCard.cardOptions);
        log2console('firstUpdated', 'Bottom card: ', card);
        if (!card.type) {
          error2console('firstUpdated', 'Bottom card config error!');
        } else {
          // hui-card loads built-in cards on demand and waits for custom cards to be defined,
          // a bare document.createElement() often had no setConfig yet (#90, #146, #147)
          await customElements.whenDefined('hui-card');
          const cardElement: any = document.createElement('hui-card');
          cardElement.config = card;
          cardElement.hass = hass();

          const bottomSection = this.shadowRoot.querySelector('.bottom');
          bottomSection.appendChild(cardElement);
          provideHass(cardElement);

          if (this.bottomCard.cardStyle && this.bottomCard.cardStyle != '') {
            const style = this.bottomCard.cardStyle;
            let itterations = 0;
            const interval = setInterval(function() {
              // the actual card is the child of hui-card; skip the placeholder shown while it loads
              const innerCard = cardElement.firstElementChild;
              if (innerCard && innerCard.shadowRoot && innerCard.localName !== 'hui-error-card') {
                window.clearInterval(interval);
                const styleElement = document.createElement('style');
                styleElement.innerHTML = style;
                innerCard.shadowRoot.appendChild(styleElement);
              } else if (++itterations === 50) {
                window.clearInterval(interval);
              }
            }, 100);
          }
        }
      }, 2);
    }
  }

  _updateActiveMenu() {
    if(this.updateMenu) {
      this.shadowRoot.querySelectorAll('ul.sidebarMenu li[data-type="navigate"]').forEach((menuItem) => {
        menuItem.classList.remove('active');
      });
      const activeEl = this.shadowRoot.querySelector('ul.sidebarMenu li[data-path="' + document.location.pathname + '"]');
      if (activeEl) {
        activeEl.classList.add('active');
      }
    }
  }

  _menuAction(e) {
    if ((e.target.dataset && e.target.dataset.menuitem) || (e.target.parentNode.dataset && e.target.parentNode.dataset.menuitem)) {
      const menuItem = JSON.parse(e.target.dataset.menuitem || e.target.parentNode.dataset.menuitem);
      this._customAction(menuItem);
      // Markus:
      // This line is commented out because the menu update is now triggered by the 'location-changed' event
      //this._updateActiveMenu();
    }
  }

  _evaluateVisibleCondition(template: string | undefined, hass: any): boolean {
    if (!template) return true;

    // Clean outer braces and whitespace
    const cleaned = template.trim().replace(/^{{\s*|\s*}}$/g, "").trim();

    try {
      // --- is_state('entity', 'value') ---
      const matchState = cleaned.match(/is_state\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\)/);
      if (matchState) {
        const [, entityId, expected] = matchState;
        return hass.states[entityId]?.state === expected;
      }

      // --- is_state_attr('entity', 'attr', 'value') ---
      const matchAttr = cleaned.match(
          /is_state_attr\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\)/
      );
      if (matchAttr) {
        const [, entityId, attr, expected] = matchAttr;
        return hass.states[entityId]?.attributes?.[attr] === expected;
      }

      // --- states['entity_id'] == 'value' ---
      const matchEquals = cleaned.match(/states\[['"]([^'"]+)['"]\]\s*==\s*['"]([^'"]+)['"]/);
      if (matchEquals) {
        const [, entityId, expected] = matchEquals;
        return hass.states[entityId]?.state === expected;
      }

      // ---  Handle simple comparisons, e.g. "states['sensor.temp'] | int > 20"
      //      Support "| int", "| float" filters and numeric comparisons.
      const numericMatch = cleaned.match(
          /states\[['"]([^'"]+)['"]\]\s*\|\s*(int|float)\s*([<>]=?|==)\s*([\d.]+)/
      );
      if (numericMatch) {
        const [, entityId, type, operator, thresholdStr] = numericMatch;
        const raw = hass.states[entityId]?.state;
        if (raw === undefined) return false;
        const num = type === "float" ? parseFloat(raw) : parseInt(raw, 10);
        const threshold = parseFloat(thresholdStr);

        switch (operator) {
          case ">": return num > threshold;
          case "<": return num < threshold;
          case ">=": return num >= threshold;
          case "<=": return num <= threshold;
          case "==": return num == threshold;
          default: return false;
        }
      }

      // Fallback: if expression doesn’t match known patterns, log a warning
      console.warn("sidebar-card: could not parse visible template:", cleaned);
      return true;
    } catch (err) {
      console.error("sidebar-card: visible template evaluation error:", err);
      return true; // fail open
    }
  }

  _customAction(tapAction) {
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
            const code = tapAction.service
            .toString()
            .replace(/^\[\[\[\s*|\s*\]\]\]$/g, '');
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

  setConfig(config) {
    this.config = config;

    if (this.config.template) {
      subscribeRenderTemplate(
        null,
        (res) => {
          const regex = /<(?:li|div)(?:\s+(?:class|id)\s*=\s*"([^"]*)")*\s*>([^<]*)<\/(?:li|div)>/g
          // a template that renders no <li>/<div> must not throw (#108)
          this.templateLines = res.match(regex) || [];
          this.requestUpdate();
        },
        {
          template: this.config.template,
          variables: { config: this.config },
          entity_ids: this.config.entity_ids,
        }
      );
    }
  }

  getCardSize() {
    return 1;
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        // --face-color: #FFF;
        // --face-border-color: #FFF;
        // --clock-hands-color: #000;
        // --clock-seconds-hand-color: #FF4B3E;
        // --clock-middle-background: #FFF;
        // --clock-middle-border: #000;
        // --sidebar-background: #FFF;
        // --sidebar-text-color: #000;
        // --sidebar-icon-color: #000;
        // --sidebar-selected-text-color: #000;
        // --sidebar-selected-icon-color: #000;
        background-color:  var(--sidebar-background, var(--paper-listbox-background-color, var(--primary-background-color, #fff)));
      }
      .sidebar-inner {
        padding: 20px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        position: fixed;
        width: 0;
        overflow: hidden auto;
      }
      .sidebarMenu {
        list-style: none;
        margin: 20px 0;
        padding: 20px 0;
        border-top: 1px solid var(--sidebar-divider-color, rgba(255, 255, 255, 0.2));
        border-bottom: 1px solid var(--sidebar-divider-color, rgba(255, 255, 255, 0.2));
      }
      .sidebarMenu li {
        color: var(--sidebar-text-color, #000);
        position: relative;
        padding: 10px 20px;
        border-radius: 12px;
        font-size: 18px;
        line-height: 24px;
        font-weight: 300;
        white-space: normal;
        display: block;
        cursor: pointer;
      }
      .sidebarMenu li ha-icon {
        float: right;
        color: var(--sidebar-icon-color, #000);
      }
      .sidebarMenu li.active {
        color: var(--sidebar-selected-text-color);
      }
      .sidebarMenu li.active ha-icon {
        color: var(--sidebar-selected-icon-color, rgb(247, 217, 89));
      }
      .sidebarMenu li.active::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--sidebar-selected-icon-color, #000);
        opacity: 0.12;
        border-radius: 12px;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 32px;
        line-height: 32px;
        font-weight: 200;
        color: var(--sidebar-text-color, #000);
        cursor: default;
      }
      h1.digitalClock {
        font-size: 60px;
        line-height: 60px;
        cursor: default;
      }
      h1.digitalClock.with-seconds {
        font-size: 48px;
        line-height: 48px;
        cursor: default;
      }
      h1.digitalClock.with-title {
        margin-bottom: 0;
        cursor: default;
      }
      h2 {
        margin: 0;
        font-size: 26px;
        line-height: 26px;
        font-weight: 200;
        color: var(--sidebar-text-color, #000);
        cursor: default;
      }
      .template {
        margin: 0;
        padding: 0;
        list-style: none;
        color: var(--sidebar-text-color, #000);
      }

      .template li {
        display: block;
        color: inherit;
        font-size: 18px;
        line-height: 24px;
        font-weight: 300;
        white-space: normal;
      }

      .clock {
        margin: 20px 0;
        position: relative;
        padding-top: calc(100% - 10px);
        width: calc(100% - 10px);
        border-radius: 100%;
        background: var(--face-color, #fff);
        font-family: 'Montserrat';
        border: 5px solid var(--face-border-color, #fff);
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
        background: var(--clock-hands-color, #000);
        transform-origin: bottom center;
        transform: rotate(0deg);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
        z-index: 1;
      }

      .clock .minute {
        position: absolute;
        height: 41%;
        width: 4px;
        top: -38%;
        left: 0;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
        transform: rotate(90deg);
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
        transform: rotate(180deg);
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
        background: var(--clock-middle-background, #fff);
        border: 2px solid var(--clock-middle-border, #000);
        border-radius: 100px;
        margin: auto;
        z-index: 1;
      }

      .bottom {
        display: flex;
        margin-top: auto;
      }
    `;
  }
}

customElements.define('sidebar-card', SidebarCard);

// ##########################################################################################
// ###   The default CSS of the Sidebar Card element
// ##########################################################################################

function createCSS(sidebarConfig: any, width: number) {
  const hideTopMenu = isTopMenuHidden(sidebarConfig, width);
  const headerHeightPx = getHeaderHeightPx();
  let sidebarWidth = 25;

  if (typeof sidebarConfig.width == 'number') {
    sidebarWidth = sidebarConfig.width;
  } else if (sidebarConfig.width && typeof sidebarConfig.width == 'object') {
    if (width <= sidebarConfig.breakpoints.mobile) {
      sidebarWidth = sidebarConfig.width.mobile;
    } else if (width <= sidebarConfig.breakpoints.tablet) {
      sidebarWidth = sidebarConfig.width.tablet;
    } else {
      sidebarWidth = sidebarConfig.width.desktop;
    }
  }
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
      width:${sidebarWidth}%;
      overflow:hidden;
      ${sidebarWidth == 0 ? 'display:none;' : ''}
      ${hideTopMenu ? '' : 'margin-top: calc(' + headerHeightPx + ' + env(safe-area-inset-top));'}
    }
    #view {
      width:${100 - sidebarWidth}%;
      ${hideTopMenu ? 'padding-top:0!important;margin-top:0!important;' : ''}
    }
  `;
}

// ##########################################################################################
// ###   Helper methods
// ##########################################################################################

function getLovelace() {
  let root: any = document.querySelector('home-assistant');
  root = root && root.shadowRoot;
  root = root && root.querySelector('home-assistant-main');
  root = root && root.shadowRoot;
  root = root && root.querySelector('ha-drawer partial-panel-resolver');
  root = root && root.shadowRoot || root;
  root = root && root.querySelector('ha-panel-lovelace');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hui-root');
  if (root) {
      const ll = root.lovelace;
      ll.current_view = root.___curView;
      return ll;
  }
  return null;
}

async function log2console(method: string, message: string, object?: any) {
  const lovelace = await getConfig();
  if (lovelace.config.sidebar) {
    const sidebarConfig = Object.assign({}, lovelace.config.sidebar);
    if (sidebarConfig.debug === true) {
      console.info(`%c${SIDEBAR_CARD_TITLE}: %c ${method.padEnd(24)} -> %c ${message}`, 'color: chartreuse; background: black; font-weight: 700;', 'color: yellow; background: black; font-weight: 700;', '', object);
    }
  }
}

async function error2console(method: string, message: string, object?: any) {
  const lovelace = await getConfig();
  if (lovelace.config.sidebar) {
    const sidebarConfig = Object.assign({}, lovelace.config.sidebar);
    if (sidebarConfig.debug === true) {
      console.error(`%c${SIDEBAR_CARD_TITLE}: %c ${method.padEnd(24)} -> %c ${message}`, 'color: red; background: black; font-weight: 700;', 'color: white; background: black; font-weight: 700;', 'color:red', object);
    }
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
    return headerHeightPx;   // Fallback for Safari LOG entry: (evaluating 'root.shadowRoot')
  }
  const view = root.shadowRoot.getElementById('view');
	//debugger;
	if(view!==undefined && window.getComputedStyle(view)!==undefined) {
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

// true when the HA header should be hidden at this screen width
function isTopMenuHidden(sidebarConfig: any, width: number) {
  return (
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

// hides (if requested) the HA header, HA footer and/or HA sidebar and hides this sidebar if configured so
function updateStyling(appLayout: any, sidebarConfig: any) {
  // listeners of a dashboard that is not shown anymore must not restyle the current one
  if (!appLayout.isConnected) return;
  const width = document.body.clientWidth;
  const hideTopMenu = isTopMenuHidden(sidebarConfig, width);
  const style = appLayout.querySelector('#customSidebarStyle');
  style.textContent = createCSS(sidebarConfig, width);
  if (!hideTopMenu) {
    // measure the header again now that #view has its top padding back
    style.textContent = createCSS(sidebarConfig, width);
  }

  const root = getRoot();
  // SAFETY CHECK: the HA UI root (or its shadowRoot) may not be ready yet — e.g. a
  // resize event firing mid-render in Firefox. Bail out instead of crashing. Fixes #149.
  if (!root || !root.shadowRoot) {
    error2console('updateStyling', 'Root element or shadowRoot not found!');
    return;
  }
  const hassHeader = root.shadowRoot.querySelector('.header');
  log2console('updateStyling', hassHeader ? 'Home Assistant header found!' : 'Home Assistant header not found!');
  const hassFooter = root.shadowRoot.querySelector('ch-footer') || root.shadowRoot.querySelector('app-footer');
  log2console('updateStyling', hassFooter ? 'Home Assistant footer found!' : 'Home Assistant footer not found!');
  const offParam = getParameterByName('sidebarOff');
  const view = root.shadowRoot.getElementById('view');

  if (sidebarConfig.hideTopMenu === true && offParam == null) {
    log2console('updateStyling', `Action: ${hideTopMenu ? 'Hide' : 'Show'} Home Assistant header and footer!`);
    if (hassHeader) {
      hassHeader.style.display = hideTopMenu ? 'none' : 'block';
    }
    if (hassFooter) {
      hassFooter.style.display = hideTopMenu ? 'none' : 'flex';
    }
    if (view) {
      view.style.minHeight = hideTopMenu ? 'calc(100vh)' : 'calc(100vh - ' + getHeaderHeightPx() + ')';
    }
  }

  if (sidebarConfig.hideHassSidebar === true && offParam == null) {
    // keep the HA sidebar usable when its menu button is shown on mobile (#74, #145)
    setHassSidebarHidden(!(sidebarConfig.showTopMenuOnMobile === true && width <= sidebarConfig.breakpoints.mobile));
  }
}

// true when hideOnPath lists the current path; accepts a single path and ignores trailing slashes (#153)
function isPathHidden(sidebarConfig: any) {
  const trim = (path: string) => String(path).replace(/\/+$/, '');
  return ([] as any[]).concat(sidebarConfig.hideOnPath).map(trim).includes(trim(window.location.pathname));
}

// watch and handle the resize and location-changed events
function subscribeEvents(appLayout: any, sidebarConfig: any, contentContainer: any, sidebar: any) {
  window.addEventListener(
    'resize',
    function() {
      updateStyling(appLayout, sidebarConfig);
    },
    true
  );

  if ('hideOnPath' in sidebarConfig) {
    window.addEventListener('location-changed', () => {
      if (isPathHidden(sidebarConfig)) {
        contentContainer.classList.add('hideSidebar');
        sidebar.classList.add('hide');
      } else {
        contentContainer.classList.remove('hideSidebar');
        sidebar.classList.remove('hide');
      }
    });

    if (isPathHidden(sidebarConfig)) {
      log2console('subscribeEvents', 'Disable sidebar for this path');
      contentContainer.classList.add('hideSidebar');
      sidebar.classList.add('hide');
    }
  }
}

function watchLocationChange() {
  setTimeout(() => {
    window.addEventListener('location-changed', () => {
      const root = getRoot();
      // location changed before finishing dom rendering — bail if root/shadowRoot/layout aren't ready
      if (!root || !root.shadowRoot) return;
      const appLayout = root.shadowRoot.querySelector('div');
      if (!appLayout) return;
      const customSidebarWrapper = appLayout.querySelector('#customSidebarWrapper');
      if (!customSidebarWrapper) {
        buildSidebar();
      } else {
        const customSidebar = customSidebarWrapper.querySelector('#customSidebar');
        if (!customSidebar) {
          buildSidebar();
        }
      }
    });
  }, 1000);
}

// build the custom sidebar card
async function buildCard(sidebar: any, config: any) {
  const sidebarCard = document.createElement('sidebar-card') as SidebarCard;
  sidebarCard.setConfig(config);
  sidebarCard.hass = hass();

  sidebar.appendChild(sidebarCard);
}

// non-blocking sleep function
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// gets the lovelace config
async function getConfig() {
  let lovelace: any;
  while (!lovelace) {
    lovelace = getLovelace();
    if (!lovelace) {
      await sleep(500);
    }
  }

  return lovelace;
}

function createElementFromHTML(htmlString: string) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}




// ##########################################################################################
// ###   The Sidebar Card code base initialisation
// ##########################################################################################

async function buildSidebar() {
  const lovelace = await getConfig();
  if (lovelace.config.sidebar) {
    const sidebarConfig = Object.assign({}, lovelace.config.sidebar);
    if (!sidebarConfig.width || (sidebarConfig.width && typeof sidebarConfig.width == 'number' && sidebarConfig.width > 0 && sidebarConfig.width < 100) || (sidebarConfig.width && typeof sidebarConfig.width == 'object')) {
      const root = getRoot();
      const offParam = getParameterByName('sidebarOff');
    
      // SAFETY CHECK: Only continue if root and shadowRoot are valid
      if (!root || !root.shadowRoot) {
        // Prevents crash if Home Assistant UI root or its shadowRoot is not ready
        error2console('buildSidebar', 'Root element or shadowRoot not found!');
        return;
      }
      await root.updateComplete;
      const appLayout = root.shadowRoot.querySelector('div');
      // Startup and the location-changed watcher can both get here; build only once (#152).
      // Nothing below awaits before the wrapper is in the DOM, so this check cannot race.
      if (!appLayout || !appLayout.querySelector('#view') || appLayout.querySelector('#customSidebarWrapper')) {
        return;
      }

      // Now safe to access shadowRoot
      if (sidebarConfig.hideTopMenu && sidebarConfig.hideTopMenu === true && offParam == null) {
        if (root.shadowRoot.querySelector('ch-header')) root.shadowRoot.querySelector('ch-header').style.display = 'none';
        if (root.shadowRoot.querySelector('app-header')) root.shadowRoot.querySelector('app-header').style.display = 'none';
        if (root.shadowRoot.querySelector('ch-footer')) root.shadowRoot.querySelector('ch-footer').style.display = 'none';
        if (root.shadowRoot.getElementById('view')) root.shadowRoot.getElementById('view').style.minHeight = 'calc(100vh)';
      }

      if (sidebarConfig.dockHassSidebar === true && offParam == null) {
        // Same as the profile setting "always hidden"; HA stores it per browser
        document.querySelector('home-assistant')?.dispatchEvent(
          new CustomEvent('hass-dock-sidebar', { detail: { dock: 'always_hidden' }, bubbles: true, composed: true }),
        );
      }
      if (!sidebarConfig.breakpoints) {
        sidebarConfig.breakpoints = {
          tablet: 1024,
          mobile: 768,
        };
      } else if (sidebarConfig.breakpoints) {
        if (!sidebarConfig.breakpoints.mobile) {
          sidebarConfig.breakpoints.mobile = 768;
        }
        if (!sidebarConfig.breakpoints.tablet) {
          sidebarConfig.breakpoints.tablet = 1024;
        }
      }

      const css = createCSS(sidebarConfig, document.body.clientWidth);
      const style: any = document.createElement('style');
      style.setAttribute('id', 'customSidebarStyle');
      appLayout.appendChild(style);
      style.type = 'text/css';
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      // get element to wrap
      const contentContainer = appLayout.querySelector('#view');
      // create wrapper container
      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'customSidebarWrapper');
      // insert wrapper before el in the DOM tree
      contentContainer.parentNode.insertBefore(wrapper, contentContainer);
      // move el into wrapper
      const sidebar = document.createElement('div');
      sidebar.setAttribute('id', 'customSidebar');
      if (sidebarConfig.showRight) {
        wrapper.appendChild(contentContainer);
        wrapper.appendChild(sidebar);
      } else {
        wrapper.appendChild(sidebar);
        wrapper.appendChild(contentContainer);
      }
      await buildCard(sidebar, sidebarConfig);
      //updateStyling(appLayout, sidebarConfig);
      subscribeEvents(appLayout, sidebarConfig, contentContainer, sidebar);
      setTimeout(function() {
        updateStyling(appLayout, sidebarConfig);
      }, 1);
    } else {
      error2console('buildSidebar', 'Error sidebar in width config!');
    }
  } else {
    log2console('buildSidebar', 'No sidebar in config found!');
  }
}

  // show console message on init
console.info(
  `%c  ${SIDEBAR_CARD_TITLE.padEnd(24)}%c
  Version: ${SIDEBAR_CARD_VERSION.padEnd(9)}      `,
  'color: chartreuse; background: black; font-weight: 700;',
  'color: white; background: dimgrey; font-weight: 700;'
);

buildSidebar();
watchLocationChange();
