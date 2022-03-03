class Footer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div id="footer">
    	<div class="container">
    		<div class="fbox1-center">
    			<span class="icon icon-github"></span>
             <a href="https://github.com/cridonoso/ASTROMER/" rel="nofollow">Source code</a>
    		</div>
    	</div>
    </div>`;
  }
}

window.customElements.define('main-footer', Footer);
