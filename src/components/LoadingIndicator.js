export class LoadingIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="spinner"></div>
      `;
    this.classList.toggle('active', this.hasAttribute('active'));
  }
}

customElements.define('loading-indicator', LoadingIndicator);
