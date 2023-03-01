class Header extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div id="header-wrapper">
    	<div id="header" class="container">
    		<div id="logo">
    			<h1><a href="#">ASTROMER Package</a></h1>
          <h2>A pre-trained model for the representation of light curves</h2>
    		</div>
    		<div id="menu">
    			<ul>
    				<li><a href="${this.getAttribute('root')}index.html" accesskey="1" title="">Get started</a></li>
    				<li><a href="${this.getAttribute('root')}pages/about_astromer.html" accesskey="2" title="">About ASTROMER</a></li>
    				<li><a href="https://astromer.readthedocs.io/en/main/" accesskey="3" title="">Documentation</a></li>
					<li><a href="${this.getAttribute('root')}pages/team.html" accesskey="4" title="">Team</a></li>
    				<li><a href="${this.getAttribute('root')}pages/contact.html" accesskey="5" title="">Contact Us</a></li>
					
    			</ul>
    		</div>
    	</div>
    </div>`;
  }
}

window.customElements.define('main-header', Header);
