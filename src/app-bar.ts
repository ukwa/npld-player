import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';

@customElement('app-bar')
export class AppBar extends LitElement {
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
  `;

  @query('.address-form')
  formElem?: HTMLFormElement;

  render() {
    return html`
      <header>
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
            <!-- <sl-icon-button
            name="arrow-clockwise"
            slot="prefix"
            style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
          ></sl-icon-button> -->
            <sl-icon-button
              name="arrow-right"
              slot="suffix"
              style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
              @click=${this.goToAddress}
            ></sl-icon-button>
            <!-- <sl-icon-button
            name="x-lg"
            slot="prefix"
            style="--sl-input-spacing-medium: var(--sl-spacing-x-small)"
          ></sl-icon-button> -->
          </sl-input>
        </form>
        <div>
          <sl-icon-button name="zoom-in" @click=${this.zoomIn}></sl-icon-button>
          <sl-icon-button
            name="zoom-out"
            @click=${this.zoomOut}
          ></sl-icon-button>
          <sl-icon-button
            name="printer"
            @click=${this.printPage}
          ></sl-icon-button>
        </div>
      </header>
    `;
  }

  private onSubmit(e: Event) {
    e.preventDefault();
    this.goToAddress();
  }

  private goToAddress() {
    console.log(
      'TODO goToAddress:',
      new FormData(this.formElem).get('address'),
      serialize(this.formElem)
    );
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
