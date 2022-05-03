import { LitElement, html, css } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

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

  @state()
  private isLoading = false;

  @query('.address-form')
  private formElem?: HTMLFormElement;

  @query('webview')
  private webviewElem?: any;

  render() {
    return html` ${this.renderAppBar()} ${this.renderMain()}`;
  }

  private renderAppBar() {
    return html`<header>
      <div class="icon-button-group">
        <sl-icon-button
          name="chevron-left"
          @click=${this.goBack}
        ></sl-icon-button>
        <sl-icon-button
          name="chevron-right"
          @click=${this.goForward}
        ></sl-icon-button>
        <sl-icon-button name="house" @click=${this.goHome}></sl-icon-button>
      </div>
      <form @submit=${this.onSubmit} class="address-form">
        <sl-input name="address" placeholder="https://" filled>
          <sl-icon-button
            name=${this.isLoading ? 'x-lg' : 'arrow-clockwise'}
            slot="prefix"
            style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
            @click=${console.log}
          ></sl-icon-button>
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
        <!-- TODO update initial view/page -->
        <webview
          src="https://webrecorder.net"
          @did-start-loading=${() => (this.isLoading = true)}
          @did-stop-loading=${() => (this.isLoading = false)}
        ></webview>
      </main>
    `;
  }

  private onSubmit(e: Event) {
    e.preventDefault();
    this.goToAddress();
  }

  private goToAddress() {
    const address = new FormData(this.formElem).get('address');

    // TODO add $WEB_ARCHIVE_PREFIX
    // TODO URL formatting
    this.webviewElem.loadURL(`${address}`);
  }

  private goBack() {
    console.log('TODO goBack');
  }

  private goForward() {
    console.log('TODO goForward');
  }

  private goHome() {
    console.log('TODO goHome');
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
