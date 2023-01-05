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
                        <div class="mb-4">
                            <a aria-label="Front" href="index.html">
                                <img alt="Logo" class="brand" src="/assets/front_v3_3/svg/logos/logo-white.svg">
                            </a>
                        </div>
                        <!-- End Logo -->

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item">
                                <a class="nav-link media" href="javascript:;">
                                    <span class="media">
                      <span class="fas fa-location-arrow mt-1 mr-2"></span>
                                    <span class="media-body">
                        SEC ADDRESS
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
                            <li class="nav-item"><a class="nav-link" href="#">Arxiv</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">ADS</a></li>
                        </ul>
                        <!-- End Nav Link -->
                    </div>

                    <div class="col-6 col-md-3 col-lg">
                        <h5 class="text-white">People</h5>

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item"><a class="nav-link" href="#">Members</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Associates</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Alumni</a></li>
                        </ul>
                        <!-- End Nav Link -->
                    </div>

                    <div class="col-6 col-md-3 col-lg">
                        <h5 class="text-white">Resources</h5>

                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-x-0 nav-white flex-column">
                            <li class="nav-item">
                                <a class="nav-link" href="#">
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
                        <!-- Nav Link -->
                        <ul class="nav nav-sm nav-white nav-x-sm align-items-center">
                            <li class="nav-item">
                                <a class="nav-link" href="#">Privacy &amp; Policy</a>
                            </li>
                            <li class="nav-item opacity mx-3">&#47;</li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Terms</a>
                            </li>
                            <li class="nav-item opacity mx-3">&#47;</li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Site Map</a>
                            </li>
                        </ul>
                        <!-- End Nav Link -->
                    </div>

                    <div class="col-md-6 text-md-right">
                        <ul class="list-inline mb-0">
                            <!-- Social Networks -->
                            <li class="list-inline-item">
                                <a class="btn btn-xs btn-icon btn-soft-light" href="#">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a class="btn btn-xs btn-icon btn-soft-light" href="#">
                                    <i class="fab fa-google"></i>
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a class="btn btn-xs btn-icon btn-soft-light" href="#">
                                    <i class="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a class="btn btn-xs btn-icon btn-soft-light" href="#">
                                    <i class="fab fa-github"></i>
                                </a>
                            </li>
                            <!-- End Social Networks -->

                            <!-- Language -->
                            <li class="list-inline-item">
                                <div class="hs-unfold">
                                    <a class="js-hs-unfold-invoker dropdown-toggle btn btn-xs btn-soft-light" data-hs-unfold-options='{
                        "target": "#footerLanguage",
                        "type": "css-animation",
                        "animationIn": "slideInDown"
                       }' href="javascript:;">
                                        <img alt="United States Flag" class="dropdown-item-icon" src="/assets/front_v3_3/vendor/flag-icon-css/flags/4x3/us.svg">
                                        <span>United States</span>
                                    </a>

                                    <div class="hs-unfold-content dropdown-menu dropdown-unfold dropdown-menu-bottom mb-2" id="footerLanguage">
                                        <a class="dropdown-item active" href="#">English</a>
                                        <a class="dropdown-item" href="#">Deutsch</a>
                                        <a class="dropdown-item" href="#">Español</a>
                                        <a class="dropdown-item" href="#">Français</a>
                                        <a class="dropdown-item" href="#">Italiano</a>
                                        <a class="dropdown-item" href="#">日本語</a>
                                        <a class="dropdown-item" href="#">한국어</a>
                                        <a class="dropdown-item" href="#">Nederlands</a>
                                        <a class="dropdown-item" href="#">Português</a>
                                        <a class="dropdown-item" href="#">Русский</a>
                                    </div>
                                </div>
                            </li>
                            <!-- End Language -->
                        </ul>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="w-md-75 text-lg-center mx-lg-auto">
                    <p class="text-white opacity-sm small">&copy; Front. 2020 Htmlstream. All rights reserved.</p>
                    <p class="text-white opacity-sm small">When you visit or interact with our sites, services or tools, we or our authorised service providers may use cookies for storing information to help provide you with a better, faster and safer experience and for marketing purposes.</p>
                </div>
                <!-- End Copyright -->
            </div>
        </div>
    </footer>
`
    }
}

customElements.define('footer-component', Footer);