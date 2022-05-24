import { LitElement, html, css } from 'lit';
import { customElement, query, state, property } from 'lit/decorators.js';

@customElement('npld-player')
export class NPLDPlayer extends LitElement {
  static initialWebAddress = process.env.NPLD_PLAYER_INITIAL_WEB_ADDRESS;

  static styles = css`
    header {
      display: flex;
      align-items: center;
      background-color: #fefefe;
      border-bottom: 1px solid #dfdfdf;
    }

    .icon-button-group {
      display: flex;
      align-items: center;
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

    .zoom-scale-label {
      display: inline-block;
      background-color: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-600);
      padding: 0.25rem;
      border-radius: var(--sl-border-radius-small);
      width: 2.5rem;
      font-size: var(--sl-font-size-x-small);
      text-align: center;
    }

    sl-icon-button {
      font-size: 1.25rem;
    }

    main {
      height: calc(100vh - 41px); /* app height - app bar height */
      width: 100vw;
      overflow: hidden;
    }

    webview {
      background: #eee;
      height: 100%;
      width: 100%;
    }
  `;

  @state()
  private isReady = false;

  @state()
  private isLoading = false;

  @state()
  private canGoBack = false;

  @state()
  private canGoForward = false;

  // https://www.electronjs.org/docs/latest/api/webview-tag#tag-attributes
  @query('webview')
  private webview?: any;

  // https://www.electronjs.org/docs/latest/api/webview-tag#webviewsetzoomfactorfactor
  @state()
  private zoomFactor = 1;

  private zoomLevel = 0;

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
        ${this.zoomFactor !== 1
          ? html`<div
                class="zoom-scale-label"
                aria-label="Zoom scale"
                aria-live="polite"
              >
                ${(this.zoomFactor * 100).toFixed(0)}%
              </div>

              <sl-button variant="text" size="small" @click=${this.resetZoom}
                >Reset</sl-button
              > `
          : html``}

        <sl-icon-button
          name="zoom-in"
          label="Zoom in"
          @click=${this.zoomIn}
          ?disabled=${NPLDPlayer.zoomFactorMap[this.zoomLevel + 1] ===
          undefined}
        ></sl-icon-button>
        <sl-icon-button
          name="zoom-out"
          label="Zoom out"
          @click=${this.zoomOut}
          ?disabled=${NPLDPlayer.zoomFactorMap[this.zoomLevel - 1] ===
          undefined}
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
          src=${NPLDPlayer.initialWebAddress}
          @dom-ready=${this.onWebviewReady}
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
      url = new URL(NPLDPlayer.initialWebAddress);
    } catch {
      return '';
    }

    const [prefix, suffix] = NPLDPlayer.initialWebAddress.split(url.hostname);

    return html`
      <div class="address-field" tabindex="0">
        <span class="text-gray">${prefix}</span>${url.hostname}<span
          class="text-gray"
          >${suffix}</span
        >
      </div>
    `;
  }

  private onWebviewReady() {
    this.zoomFactor = this.webview.getZoomFactor();
    this.isReady = true;
  }

  private onNavigate() {
    NPLDPlayer.initialWebAddress = this.webview.getURL();
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
    this.webview.loadURL(NPLDPlayer.initialWebAddress);
  }

  private zoomIn() {
    this.zoomLevel += 1;
    this.updateZoomFactor();
  }

  private zoomOut() {
    this.zoomLevel -= 1;
    this.updateZoomFactor();
  }

  private resetZoom() {
    this.zoomLevel = 0;
    this.updateZoomFactor();
  }

  private updateZoomFactor() {
    const factor = NPLDPlayer.zoomFactorMap[this.zoomLevel];

    if (factor !== undefined) {
      this.webview.setZoomFactor(factor);
      this.zoomFactor = factor;
    }
  }

  private printPage() {
    console.log('TODO printPage');
  }

  // Map zoom level to zoom factor
  // Manually copied from Chrome, the Chromium max is
  // 500% and min and 25%
  static zoomFactorMap: Record<number, number> = {
    9: 5.0,
    8: 4.0,
    7: 3.0,
    6: 2.5,
    5: 2.0,
    4: 1.75,
    3: 1.5,
    2: 1.25,
    1: 1.1,
    0: 1.0,
    [-1]: 0.9,
    [-2]: 0.8,
    [-3]: 0.75,
    [-4]: 0.67,
    [-5]: 0.5,
    [-6]: 0.33,
    [-7]: 0.25,
  };
}
