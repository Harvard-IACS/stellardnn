class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <footer class="bg-dark">
        <div class="container">
            <div class="space-top-2 space-bottom-1 space-bottom-lg-2">
                <div class="row justify-content-lg-between">
                    <div class="col-lg-3 ml-lg-auto mb-5 mb-lg-0">
                        <!-- Logo -->
                        
                        <!-- End Logo -->

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item">
                                <a class="nav-link media" href="https://goo.gl/maps/GMKQnV4LsEbwrw2i8">
                                    <span class="media">
                      <span class="fas fa-location-arrow mt-1 mr-2"></span>
                                        <span class="media-body">
                                            SEC ADDRESS: 150 Western Ave, Bosto, MA 02134
                                        </span>
                                    </span>
                                </a>

                        </ul>
                        <!-- End Nav Link -->
                    </div>



                    <div class="col-6 col-md-3 col-lg mb-5 mb-lg-0">
                        <h5 class="text-white">Publications</h5>

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item"><a class="nav-link" href="https://scholar.google.com/citations?user=hlFnwxwAAAAJ&hl=en">Google Scholar</a></li>
                            <li class="nav-item"><a class="nav-link" href="https://ui.adsabs.harvard.edu/search/q=(%20author%3A%22protopapas%2C%20p%22%20AND%20year%3A1991-)&sort=date%20desc%2C%20bibcode%20desc&p_=0">ADS</a></li>
                        </ul>
                        <!-- End Nav Link -->
                    </div>

                    <div class="col-6 col-md-3 col-lg">
                        <h5 class="text-white">People</h5>

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item"><a class="nav-link" href="people.html#Members">Members</a></li>
                            <li class="nav-item"><a class="nav-link" href="people.html#Collaborators">Collaborators</a></li>
                            <li class="nav-item"><a class="nav-link" href="people.html#Alumni">Alumni</a></li>
                        </ul>
                        <!-- End Nav Link -->
                    </div>

                    <div class="col-6 col-md-3 col-lg">
                        <h5 class="text-white">Resources</h5>

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item">
                                <a class="nav-link" href="contact_us.html">
                                    <span class="media align-items-center">
                      <i class="fa fa-info-circle mr-2"></i>
                      <span class="media-body">Contact</span>
                                    </span>
                                </a>
                            </li>

                        </ul>
                        <!-- End Nav Link -->
                    </div>
                </div>
            </div>

            <hr class="opacity-xs my-0">

            <div class="space-1">
                <div class="row align-items-md-center mb-7">
                    <div class="col-md-6 mb-4 mb-md-0">
                        
                    </div>

                    
                </div>

                <!-- Copyright -->
                
                <!-- End Copyright -->
            </div>
        </div>
    </footer>
`
    }
}

customElements.define('footer-component', Footer);