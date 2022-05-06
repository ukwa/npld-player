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

  @property({ type: String })
  private webAddress = '';

  @state()
  private isLoading = false;

  @state()
  private canGoBack = false;

  @state()
  private canGoForward = false;

  @query('webview')
  private webview?: any;

  render() {
    return html` ${this.renderAppBar()} ${this.renderMain()}`;
  }

  private renderAppBar() {
    return html`<header>
      <div class="icon-button-group">
        <sl-icon-button
          name="chevron-left"
          ?disabled=${!this.canGoBack}
          @click=${this.goBack}
        ></sl-icon-button>
        <sl-icon-button
          name="chevron-right"
          ?disabled=${!this.canGoForward}
          @click=${this.goForward}
        ></sl-icon-button>
        <sl-icon-button name="house" @click=${this.goHome}></sl-icon-button>
        ${this.webAddress
          ? html`<sl-icon-button
              name=${this.isLoading ? 'x-lg' : 'arrow-clockwise'}
              slot="prefix"
              style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
              @click=${this.isLoading ? this.cancelLoad : this.reload}
            ></sl-icon-button>`
          : ''}
      </div>
      ${this.renderWebAddress()}
      <div class="icon-button-group">
        <sl-icon-button name="zoom-in" @click=${this.zoomIn}></sl-icon-button>
        <sl-icon-button name="zoom-out" @click=${this.zoomOut}></sl-icon-button>
        <sl-icon-button
          name="printer"
          @click=${this.printPage}
        ></sl-icon-button>
      </div>
    </header>`;
  }

  private renderMain() {
    return html`
      <main>
        <webview
          src=${this.webAddress}
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
      url = new URL(this.webAddress);
    } catch {
      return '';
    }

    const [prefix, suffix] = this.webAddress.split(url.hostname);

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
    this.webAddress = this.webview.getURL();
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
    this.webview.loadURL(this.webAddress);
  }

  private zoomIn() {
    console.log('TODO zoomIn');
  }

  private zoomOut() {
    console.log('TODO zoomOut');
  }

  private printPage() {
    console.log('TODO printPage');
  }
}
