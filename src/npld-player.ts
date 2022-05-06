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
      padding: 0 5px;
    }

    .address-form {
      flex: 1;
      padding: 3px 5px;
    }

    sl-icon-button {
      font-size: 1.2rem;
    }

    webview {
      display: inline-flex;
      background: #eee;
      height: calc(100vh - 47px); /* app height - app bar height */
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

  @query('.address-form')
  private addressForm?: HTMLFormElement;

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
      </div>
      <form @submit=${this.onSubmit} class="address-form">
        <sl-input
          name="address"
          placeholder="https://"
          value=${this.webAddress}
          filled
        >
          ${this.webAddress
            ? html`<sl-icon-button
                name=${this.isLoading ? 'x-lg' : 'arrow-clockwise'}
                slot="prefix"
                style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
                @click=${this.isLoading ? this.cancelLoad : this.reload}
              ></sl-icon-button>`
            : ''}

          <sl-icon-button
            name="arrow-right"
            slot="suffix"
            style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
            @click=${this.goToAddress}
          ></sl-icon-button>
        </sl-input>
      </form>
      <div>
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

  private onSubmit(e: Event) {
    e.preventDefault();
    this.goToAddress();
  }

  private async goToAddress() {
    if (this.isLoading) {
      this.cancelLoad();
    }

    const addressValue = new FormData(this.addressForm).get(
      'address'
    ) as string;

    // TODO URL formatting
    const address = addressValue.startsWith('http')
      ? addressValue
      : `https://${addressValue}`;

    // TODO add $WEB_ARCHIVE_PREFIX
    try {
      await this.webview.loadURL(`${address.replace(/$\//, '')}/`);

      this.webAddress = address;
    } catch (e) {
      console.error(e);

      // TODO handle error
    }

    this.canGoBack = this.webview.canGoBack();
    this.canGoForward = this.webview.canGoForward();
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
