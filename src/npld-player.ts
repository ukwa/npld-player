import { LitElement, html, css } from 'lit';
import { customElement, query, state, property } from 'lit/decorators.js';

@customElement('npld-player')
export class NPLDPlayer extends LitElement {
  static styles = css`
    :host {
      height: 100vh;
      width: 100vw;
    }

    header {
      display: flex;
      align-items: center;
      background-color: #fefefe;
      border-bottom: 1px solid #dfdfdf;
    }

    .icon-button-group {
      padding: 2px 5px;
      user-select: none;
    }

    .address-field {
      position: relative;
      flex: 1;
      padding: 5px;
      color: var(--sl-color-neutral-900);
      line-height: 1;
      font-size: var(--sl-font-size-small);
      overflow-x: auto;
      overflow-y: hidden;
      width: auto;
      white-space: nowrap;
    }

    .address-field::-webkit-scrollbar {
      display: none;
    }

    /* Visual indication of URL overflow */
    .address-field:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      height: 1.4rem;
      width: 1rem;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    }

    .text-gray {
      color: var(--sl-color-neutral-500);
    }

    sl-icon-button {
      font-size: 1.25rem;
    }

    webview {
      display: inline-flex;
      background: #eee;
      height: calc(100vh - 41px); /* app height - app bar height */
      width: 100vw;
    }
  `;

  // Chromium visual zoom minimum/maximum level
  static zoomLevelMax = 9;
  static zoomLevelMin = -8;

  @property({ type: String })
  private url = '';

  @state()
  private isLoading = false;

  @state()
  private canGoBack = false;

  @state()
  private canGoForward = false;

  // https://www.electronjs.org/docs/latest/api/webview-tag#webviewsetzoomlevellevel
  @state()
  private zoomLevel = 0;

  // https://www.electronjs.org/docs/latest/api/webview-tag#tag-attributes
  @query('webview')
  private webview?: any;

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.get('zoomLevel') !== undefined &&
      changedProperties.has('zoomLevel')
    ) {
      this.zoomWebview();
    }
  }

  render() {
    return html` ${this.renderAppBar()} ${this.renderMain()}`;
  }

  private renderAppBar() {
    return html`<header>
      <div class="icon-button-group">
        <sl-icon-button
          name="chevron-left"
          label="Back"
          ?disabled=${!this.canGoBack}
          @click=${this.goBack}
        ></sl-icon-button>
        <sl-icon-button
          name="chevron-right"
          label="Forward"
          ?disabled=${!this.canGoForward}
          @click=${this.goForward}
        ></sl-icon-button>
        <sl-icon-button
          name="house"
          label="Home"
          @click=${this.goHome}
        ></sl-icon-button>
        ${this.isLoading
          ? html`<sl-icon-button
              name="x-lg"
              label="Cancel"
              slot="prefix"
              @click=${this.cancelLoad}
            ></sl-icon-button>`
          : html`<sl-icon-button
              name="arrow-clockwise"
              label="Reload"
              slot="prefix"
              @click=${this.reload}
            ></sl-icon-button>`}
      </div>
      ${this.renderWebAddress()}
      <div class="icon-button-group">
        <sl-icon-button
          name="zoom-in"
          label="Zoom in"
          @click=${this.zoomIn}
          ?disabled=${this.zoomLevel === NPLDPlayer.zoomLevelMax}
        ></sl-icon-button>
        <sl-icon-button
          name="zoom-out"
          label="Zoom out"
          @click=${this.zoomOut}
          ?disabled=${this.zoomLevel === NPLDPlayer.zoomLevelMin}
        ></sl-icon-button>
        <sl-icon-button
          name="printer"
          label="Print"
          @click=${this.printPage}
        ></sl-icon-button>
      </div>
    </header>`;
  }

  private renderMain() {
    return html`
      <main>
        <webview
          src=${this.url}
          @did-start-loading=${() => (this.isLoading = true)}
          @did-stop-loading=${() => (this.isLoading = false)}
          @did-finish-loading=${() => (this.isLoading = false)}
          @did-fail-load=${() => (this.isLoading = false)}
          @did-navigate=${this.onNavigate}
        ></webview>
      </main>
    `;
  }

  private renderWebAddress() {
    let url: URL;

    try {
      url = new URL(this.url);
    } catch {
      return '';
    }

    const [prefix, suffix] = this.url.split(url.hostname);

    return html`
      <div class="address-field" tabindex="0">
        <span class="text-gray">${prefix}</span>${url.hostname}<span
          class="text-gray"
          >${suffix}</span
        >
      </div>
    `;
  }

  private onNavigate() {
    this.url = this.webview.getURL();
    this.canGoBack = this.webview.canGoBack();
    this.canGoForward = this.webview.canGoForward();
  }

  private reload() {
    this.webview.reload();
  }

  private cancelLoad() {
    this.webview.stop();
  }

  private goBack() {
    this.webview.goBack();
  }

  private goForward() {
    this.webview.goForward();
  }

  private goHome() {
    this.webview.loadURL(this.url);
  }

  private zoomIn() {
    if (this.zoomLevel < NPLDPlayer.zoomLevelMax) {
      this.zoomLevel += 1;
    }
  }

  private zoomOut() {
    if (this.zoomLevel > NPLDPlayer.zoomLevelMin) {
      this.zoomLevel -= 1;
    }
  }

  private zoomWebview() {
    if (!this.webview || this.webview.getZoomLevel() === this.zoomLevel) {
      return;
    }

    this.webview.setZoomLevel(this.zoomLevel);
  }

  private printPage() {
    console.log('TODO printPage');
  }
}
