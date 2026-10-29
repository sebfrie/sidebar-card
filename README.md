[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs) &nbsp;&nbsp;&nbsp; [![GitHub release (latest by date)](https://img.shields.io/github/v/release/DBuit/sidebar-card?style=for-the-badge)](https://github.com/DBuit/sidebar-card/releases) <!-- markdownlint-disable MD041 -->

# Sidebar card [WIP]

This card adds a sidebar to your interface which you can configure globally so every page has the sidebar. It can replace your top navigation but can also give extra functionality.

<a href="https://www.buymeacoffee.com/ZrUK14i" target="_blank"><img height="41px" width="167px" src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" /></a> <!-- markdownlint-disable MD033 -->

## Installation Instructions

### HACS Installation

Go to the hacs store and use the repo url `https://github.com/DBuit/sidebar-card` and add this as a custom repository under settings.

In Home Assistant's global settings, add the resource:

1. Go to **Settings → Dashboards → Three-dots menu → Resources** in the top right
2. Click **+ Add Resource** button in the bottom right
3. Enter in the following:
    * **URL:** /hacsfiles/sidebar-card/sidebar-card.js
    * **Resource Type:** JavaScript Module
4. Click Create

### Manual Installation

Copy the .js file from the dist directory to your www directory and add the following to your ui-lovelace.yaml file:

```yaml
resources:
  url: /local/sidebar-card.js
  type: module
```

## Configuration

The YAML configuration happens at the root of your Lovelace config under `sidebar:` at the same level as `resources:` and `views:`. Example:

```yaml
resources:
  - url: /local/sidebar-card.js?v=0.0.1
    type: module   
sidebar:
  title: "Sidebar title"
views:
...
```

### Editing in the dashboard editor

You do not need YAML for the sidebar. Add an empty `sidebar: {}` once in the raw configuration editor of the dashboard,
then open the dashboard's edit mode: a pencil flag sticks out of the sidebar's outer edge. It opens a panel on the other
side of the screen with all options below, shows every change live and saves it into the dashboard config. Clocks and
dates are a list there: add them with a button, drag them into order, open one to change it. The views themselves stay
normal Home Assistant views with native cards that you edit as usual.

In edit mode the Home Assistant header is always shown, even with `hideTopMenu`. To get into edit mode while the header
is hidden, add `?edit=1` to the dashboard's address (e.g. `/dashboard-home/home?edit=1`); `?haUi=true` shows the
header and the Home Assistant sidebar again until the page is reloaded (`?haUi=false` hides them again).

### Main Options

Under `sidebar:` you can configure the following options:

| Name | Type | Default | Supported Options | Description |
| -------------- | ----------- | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title` | string | optional | `Title` | Title to show in the sidebar |
| `elements` | list | optional | *see info below* | Clocks and dates at the top of the sidebar, in this order |
| `clock` | boolean | optional | `true` | Show analog clock in sidebar (older option, `elements` replaces it) |
| `date` | boolean | optional | `false` | If date is enabled it will display the current date |
| `dateFormat` | string | optional | `dddd, D. MMMM` (German), `dddd, MMMM D` (other languages) | If date is enabled you define how it should show the date with dateFormat, to see the options check this url: [https://momentjs.com/docs/#/parsing/string-format/](https://momentjs.com/docs/#/parsing/string-format/) |
| `digitalClock` | boolean | optional | `true` | Show digital clock in sidebar (older option, `elements` replaces it) |
| `digitalClockWithSeconds`, `twelveHourVersion`, `period`, `seconds`, `timeFormat`, `clockSize`, `analogClockSize` | | optional | | Older clock options, still read when there is no `elements` list; the editor converts them |
| `showRight` | boolean | optional | `false` | If showRight is enabled the sidebar will be shown on the right side of the screen |
| `viewMenu` | boolean | optional | `false` | Show one menu item per view of the dashboard, with the view's title and icon. Subviews and views hidden for the user are left out. New views show up on their own |
| `viewMenuExclude` | list | optional | | Paths (or indexes) of views to leave out of `viewMenu`; the editor shows every view with an eye to switch it |
| `sidebarMenu` | object | optional | *see info below* | Create a menu that can switch to different pages but also call any service you want. Shown below the views of `viewMenu` |
| `menuIcons` | string | optional | `left` | `left`, `right` or `none`: where menu icons are shown |
| `menuFontSize` | number | optional | `18` | Font size of the menu in px (up to 40); the spacing of the items grows with it |
| `menuPosition` | string | optional | `top` | `top` (right below the clocks), `center` or `bottom` of the free space |
| `menuOffset` | number | optional | `0` | Space above the menu (`menuPosition: top`) or below it (`bottom`) in px |
| `menuIconSize` | number | optional | grows with `menuFontSize` | Size of the menu icons in px |
| `menuIconGap` | number | optional | grows with `menuFontSize` | Space between menu icon and text in px |
| `menuItemSpacing` | number | optional | `4` | Space between menu items in px |
| `bottomButtons` | list | optional | *see info below* | Entities and buttons pinned to the bottom of the sidebar |
| `bottomButtonsLayout` | string | optional | `row` | `row` (icon bar) or `list` (icon, name and state) |
| `bottomButtonsShowName` | boolean | optional | `false` | Show names below the icons in the `row` layout |
| `background` | string | optional | card background | Color of the sidebar: a theme color name as Home Assistant's color picker stores it (`primary`, `red`, `blue-grey`, ...) or any CSS color, e.g. `rgba(0, 0, 0, 0.4)`. The same goes for the other colors |
| `textColor` | string | optional | primary text color | Text color |
| `iconColor` | string | optional | secondary text color | Color of the menu and button icons |
| `accentColor` | string | optional | primary color | Color of the active menu item and of active buttons |
| `dividerColor` | string | optional | divider color | Color of the divider lines |
| `dividers` | boolean | optional | `true` | `false` hides the divider lines around the menu and above the footer |
| `glass` | boolean | optional | `false` | Glass effect: the sidebar becomes semi-transparent and blurs the dashboard background behind it. With your own `background`, its transparency is used |
| `blur` | number | optional | `12` | Strength of the glass effect's blur in px |
| `shadow` | boolean | optional | `false` | Casts a shadow onto the dashboard next to the sidebar |
| `shadowSize` | number | optional | `12` | Size of the shadow in px |
| `widthUnit` | string | optional | `%` | `%` or `px`, the unit of the numbers in `width` |
| `updateMenu` | boolean | optional | `true` | When false the active state of the sidebar will not change by navigating to a different view |
| `template` | template | optional | *see info below* | Template rules that will show messages to inform you for example with how many lights are on |
| `style` | css | optional | *see info below* | Overwrite some color variables or write your own styles |
| `width` | object | optional | *see info below* | The width of the sidebar for different screens, in percent or pixels (`widthUnit`) |
| `breakpoints` | object | optional | *see info below* | For the width we set different sizes for different screens with breakpoints you can overwrite these breakpoints |
| `bottomCard` | object | optional | *see info below* | Define any card that will be rendered at the bottom of the sidebar |
| `showTopMenuOnMobile` | boolean | optional | `true` | If you hide the top menu you can set this to `true` so that it will be shown on mobile |
| `hideHassSidebar` | boolean | optional | `true` | Hide the home assistant sidebar |
| `dockHassSidebar` | boolean | optional | `false` | Collapse the home assistant sidebar to its narrow icon bar (without animation) while this dashboard is shown; the menu button still expands it, and the previous setting comes back when you leave the dashboard or switch the option off |
| `hideOnPath` | array | optional | /lovelace/camera | If you don't want the sidebar on every path you can add a list of paths where it should hide the sidebar. Use the full path from the browser address bar without host and query, e.g. `/lovelace/camera` or `/dashboard-kiosk/cameras` |
| `hideTopMenu` | boolean | optional | `true` | Hide the top home assistant menu |
| `debug` | boolean | optional | `false` | Show debugging messages in the browser's developer console |

When using **hideTopMenu**, **hideHassSidebar** and/or **dockHassSidebar** you can disable this by adding `?haUi=true` to the url
until the page is reloaded. For example: `https://myhomeassistant.duckdns.org/lovelace/home?haUi=true`

#### Elements

`elements` lists the clocks and dates at the top of the sidebar; each type has its own options:

| Type | Options |
| --- | --- |
| `digitalClock` | `timeFormat` (`24`, `12`, `12ampm`; default `24`), `seconds` (default `false`), `size` (largest font size in px, default `60`; the time always fits the sidebar), `color`, `timeZone` |
| `analogClock` | `seconds` (second hand, default `true`), `size` (px, default `220`, never wider than the sidebar), `color` (hands), `secondsColor` (second hand), `timeZone` |
| `date` | `format` (moment.js, default `dddd, D. MMMM` in German, `dddd, MMMM D` otherwise), `size` (px, default `22`), `color`, `timeZone` |

Colors are theme color names as Home Assistant's color picker stores them (`red`, `primary`, ...) or any CSS color; without one, the sidebar's text color is used.

`timeZone` is empty for the time zone of Home Assistant (default), `local` for this device's or any IANA name such as `America/New_York`.

```yaml
sidebar:
  elements:
    - type: digitalClock
    - type: analogClock
      seconds: false
    - type: date
      format: dd, D.M.
```

#### Width

The width of the sidebar can be manually specified. By default it will be `25%` of the width on all screens.
With the `width` option you can set the width for 3 sizes: `mobile`, `tablet` and `desktop`.
You can also set the width to `0` to make the sidebar not appear.

The numbers are percent unless `widthUnit: px` is set; a string such as `280px` or `22vw` is used as it is.

Example to set width (This example hides the sidebar on mobile):

```yaml
sidebar:
  width:
    mobile: 0
    tablet: 25
    desktop: 20
```

#### Breakpoints

Above we have set the width for 3 sizes but you can also set the breakpoints for these sizes to change the moment the size of the page changes.
The breakpoint is activated when the width is smaller or equal to the value that is set.
Default mobile is `768px` or smaller, tablet `1024px` or smaller and above `1024px` is desktop.

Example to set breakpoints:

```yaml
sidebar:
  breakpoints:
    mobile: 768
    tablet: 1024
```

#### sidebarMenu

To add a menu to the sidebar you can use `sidebarMenu`.
Within the sidebarMenu you can add actions which will show as menu items.
Below is a table with options for these actions:

| Name              | Type   | Default | Supported Options                                                     | Description                                                                                                                                                                                                                                                             |
|-------------------|--------| -------- |-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `action`          | string | `toggle` | `more-info`, `toggle`, `call-service`, `none`, `navigate`, `url`      | Action to perform                                                                                                                                                                                                                                                       |
| `entity`          | string | none | Any entity id                                                         | **Only valid for `action: more-info` and `action: toggle`** to call `more-info` pop-up for this entity or `toggle` this entity                                                                                                                                          |
| `navigation_path` | string | none | Eg: `/lovelace/0/`                                                    | Path to navigate to (e.g. `/lovelace/0/`) when action defined as navigate                                                                                                                                                                                               |
| `url_path`        | string | none | Eg: `https://www.google.fr`                                           | URL to open on click when action is `url`. The URL will open in a new tab                                                                                                                                                                                               |
| `service`         | string | none | Any service                                                           | Service to call (e.g. `media_player.media_play_pause`) when `action` defined as `call-service`                                                                                                                                                                          |
| `service_data`    | object | none | Any service data                                                      | Service data to include (e.g. `entity_id: media_player.bedroom`)                                                                                                                                                                                                        |
| `icon`            | string | none | Any icon (Eg: `mdi:`)                                                 | Display icon besided the name                                                                                                                                                                                                                                           |
| `state`           | string | none | Any entity `light.demo`                                               | Set an entity (light, switch etc.) and when this entities state is on the item will display on and when it is off it will be displayed off                                                                                                                              |
| `conditional`     | string | none | Use template to evaluate conditional logic to show/hide the menu item | Supports `is_state`, `is_state_attr`, `states["value"]`  <br/>Example: `{{ is_state('binary_sensor.xmas_time', 'on') }}` <br/>Example: `{{ is_state_attr('climate.living_room', 'hvac_mode', 'cool') }}` <br/>Example: `{{ states['sensor.indoor_temp'] \| int > 25 }}` |

When you use the `navigation` action type (see example below) and set the navigation_path to the lovelace views it will act as a normal menu and display an active state when you are on the url you defined in the sidebarMenu.

```yaml
sidebar:
  sidebarMenu:
    - action: navigate
      navigation_path: "/lovelace/home"
      name: "Home"
      active: true
    - action: navigate
      navigation_path: "/lovelace/lampen"
      name: "Lampen"
    - action: navigate
      navigation_path: "/lovelace/music"
      name: "Muziek"
    - action: navigate
      navigation_path: "/lovelace/4"
      name: "Test"
    - action: navigate
      navigation_path: "/lovelace/christmas-lights"
      name: "Christmas lights"
      conditional: "{{ is_state('binary_sensor.xmas_time', 'on') }}"
    - action: toggle
      entity: light.beganegrond
      name: Lichtstrip
      state: light.beganegrond
      icon: mdi:led-strip-variant
```

#### Template

The `template` option gives you a place to template a list of messages than can be shown.
Every message must start with the HTML tag `<li>` and end with `</li>`. Within the tags you can template your message.

For example, to say Goedemorgen == Good morning for non dutch people, or display how many lights or media_players are on, etc. Additional examples are below:

```yaml
sidebar:
  template: |
    <li>
      {% if now().hour  < 5 %} Goede nacht {{'\U0001F634'}}
      {% elif now().hour < 12 %} Goedemorgen {{'\u2615\uFE0F'}}
      {% elif now().hour < 18 %} Goedenmiddag {{'\U0001F44B\U0001F3FB'}}
      {% else %} Goedenavond {{'\U0001F44B\U0001F3FB'}}{% endif %}
    </li>
    {% if "Vandaag" in states('sensor.blink_gft') %} <li>Vandaag groenebak aan de straat</li> {% endif %}
    {% if "Vandaag" in states('sensor.blink_papier') %} <li>Vandaag oudpapier aan de straat</li> {% endif %}
    {% if "Vandaag" in states('sensor.blink_pmd') %} <li>Vandaag plastic aan de straat</li> {% endif %}
    {% if "Vandaag" in states('sensor.blink_restafval') %} <li>Vandaag grijzebak aan de straat</li> {% endif %}
    {% if "Morgen" in states('sensor.blink_gft') %} <li>Morgen groenebak aan de straat</li> {% endif %}
    {% if "Morgen" in states('sensor.blink_papier') %} <li>Morgen oudpapier aan de straat</li> {% endif %}
    {% if "Morgen" in states('sensor.blink_pmd') %} <li>Morgen plastic aan de straat</li> {% endif %}
    {% if "Morgen" in states('sensor.blink_restafval') %} <li>Morgen grijzebak aan de straat</li> {% endif %}
    {% if states('sensor.current_lights_on') | float > 0 %} <li>{{states('sensor.current_lights_on')}} lampen aan</li> {% endif %}
    {% if states('sensor.current_media_players_on') | float > 0 %} <li>{{states('sensor.current_media_players_on')}} speakers aan</li> {% endif %}
```

#### Style

By default the sidebar follows your theme (card background, primary text and primary color).
The design options `background`, `textColor`, `iconColor`, `accentColor` and `dividerColor` cover most needs;
the variables below go further, and of course you can also add your own styles.

Example:

```yaml
sidebar:
  style: |
    :host {
        --sidebar-background: #FFF;
        --sidebar-text-color: #000;
        --face-color: #FFF;
        --face-border-color: #FFF;
        --clock-hands-color: #000;
        --clock-seconds-hand-color: #FF4B3E;
        --clock-middle-background: #FFF;
        --clock-middle-border: #000;
        --sidebar-divider-color: rgba(255, 255, 255, 0.2);
    }

```

#### Bottom buttons

`bottomButtons` pins entities or plain buttons to the bottom of the sidebar; the menu above scrolls when it gets long.
Every item takes the usual card options:

| Name | Description |
| --- | --- |
| `entity` | Entity to show; its icon and color follow the state |
| `name` | Name, defaults to the entity's name |
| `icon` | Icon, defaults to the entity's icon |
| `tap_action` | Any Home Assistant action. Default: toggle for lights, switches, fans, input booleans, automations and scripts, more-info for everything else |
| `hold_action` | Any Home Assistant action. Default: more-info |

```yaml
sidebar:
  bottomButtons:
    - entity: light.living_room
    - entity: lock.front_door
      tap_action:
        action: more-info
    - name: Assist
      icon: mdi:microphone
      tap_action:
        action: assist
  bottomButtonsLayout: row
```

#### Bottom Custom Card

`bottomCard` shows any Home Assistant card at the very bottom of the sidebar, below the bottom buttons.
To start, add `bottomCard` to your sidebar config.
`bottomCard` has 3 parts.

1. `type` - This can be the default home assistant card or any custom card.
2. `cardOptions` - Most cards need some configuration (i.e.: an entity). This should be placed under `cardOptions`.
3. `cardStyle` (optional) - To make sure the card fits your sidebar style you can add extra CSS rules for the card to make it fit better.

Example:

```yaml
sidebar:
  bottomCard:
    type: horizontal-stack
    cardOptions:
      cards:
        - type: "custom:button-card"
          color_type: card
          color: rgb(255, 255, 255)
          icon: mdi:home
        - type: "custom:button-card"
          color_type: card
          color: rgb(255, 255, 255)
          icon: mdi:lightbulb
    cardStyle: |
      :host {
        width: 100%;
        background-color:#FFF;
      }
```

## Screenshots

![Screenshot default](screenshots/screenshot-default.png)

![Screenshot styled](screenshots/screenshot-styled.png)
