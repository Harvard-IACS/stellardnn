class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <!-- ========== HEADER ========== -->
<header class="header header-box-shadow-on-scroll header-abs-top header-bg-transparent header-show-hide"
        data-hs-header-options='{
      "fixMoment": 1000,
      "fixEffect": "slide"
    }' id="header">
    <!-- Search -->
    <div class="search-push-top" id="searchPushTop">
        <div class="container position-relative">
            <div class="search-push-top-content pt-3">
                <!-- Close Button -->
                <div class="search-push-top-close-btn">
                    <div class="hs-unfold">
                        <a class="js-hs-unfold-invoker btn btn-icon btn-xs btn-soft-secondary mt-2 mr-2"
                           data-hs-unfold-options='{
            "target": "#searchPushTop",
            "type": "jquery-slide",
            "contentSelector": ".search-push-top"
           }' href="javascript:;">
                            <svg height="10" viewBox="0 0 18 18" width="10" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5,9.5l5-5c0.2-0.2,0.2-0.6-0.1-0.9l-1-1c-0.3-0.3-0.7-0.3-0.9-0.1l-5,5l-5-5C4.3,2.3,3.9,2.4,3.6,2.6l-1,1 C2.4,3.9,2.3,4.3,2.5,4.5l5,5l-5,5c-0.2,0.2-0.2,0.6,0.1,0.9l1,1c0.3,0.3,0.7,0.3,0.9,0.1l5-5l5,5c0.2,0.2,0.6,0.2,0.9-0.1l1-1 c0.3-0.3,0.3-0.7,0.1-0.9L11.5,9.5z"
                                      fill="currentColor"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <!-- End Close Button -->

                <!-- Input -->
                <form class="input-group">
                    <input aria-label="Search Front" class="form-control" placeholder="Search Front" type="search">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button">Search</button>
                    </div>
                </form>
                <!-- End Input -->
    
                <!-- Content -->
                <div class="row d-none d-md-flex mt-7">
                    <div class="col-sm-6">
                        <span class="h5">Quick Links</span>
    
                        <div class="row">
                            <!-- Nav Link -->
                            <div class="col-6">
                                <div class="nav nav-sm nav-x-0 flex-column">
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Search Results List
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Search Results Grid
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> About
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Services
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Invoice
                                    </a>
                                </div>
                            </div>
                            <!-- End Nav Link -->
    
                            <!-- Nav Link -->
                            <div class="col-6">
                                <div class="nav nav-sm nav-x-0 flex-column">
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Profile
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> User Contacts
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Reviews
                                    </a>
                                    <a class="nav-link" href="#">
                                        <i class="fas fa-angle-right mr-1"></i> Settings
                                    </a>
                                </div>
                            </div>
                            <!-- End Nav Link -->
                        </div>
                    </div>
    
                    <div class="col-sm-6">
                        <!-- Banner -->
                        <div class="rounded search-push-top-banner">
                            <div class="d-flex align-items-center">
                                <div class="search-push-top-banner-container">
                                    <img alt="Image Description" class="img-fluid search-push-top-banner-img"
                                         src="assets/front_v3_3/img/mockups/img3.png">
                                    <img alt="Image Description" class="img-fluid search-push-top-banner-img"
                                         src="assets/front_v3_3/img/mockups/img2.png">
                                </div>
    
                                <div>
                                    <div class="mb-4">
                                        <span class="h5">Featured Item</span>
                                        <p>Create astonishing web sites and pages.</p>
                                    </div>
                                    <a class="btn btn-xs btn-soft-success transition-3d-hover" href="javascript:;">Apply
                                        Now <i class="fas fa-angle-right fa-sm ml-1"></i></a>
                                </div>
                            </div>
                        </div>
                        <!-- End Banner -->
                    </div>
                </div>
                <!-- End Content -->
            </div>
        </div>
    </div>
    <!-- End Search -->
    
    <div class="header-section">


        <div class="container" id="logoAndNav">
            <!-- Nav -->
            <nav class="js-mega-menu navbar navbar-expand-lg">
                <!-- Logo -->
                <a aria-label="Front" class="navbar-brand" href="./index.html">
                    <img style="Width:300pt" alt="Logo" src="assets/general/img/logo-stellardnn.svg">
                </a>
                <!-- End Logo -->
    
                <!-- Responsive Toggle Button -->
                <button aria-controls="navBar" aria-expanded="false" aria-label="Toggle navigation"
                        class="navbar-toggler btn btn-icon btn-sm rounded-circle" data-target="#navBar"
                        data-toggle="collapse" type="button">
      <span class="navbar-toggler-default">
        <svg height="14" viewBox="0 0 18 18" width="14" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.4,6.2H0.6C0.3,6.2,0,5.9,0,5.5V4.1c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,5.9,17.7,6.2,17.4,6.2z M17.4,14.1H0.6c-0.3,0-0.6-0.3-0.6-0.7V12c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,13.7,17.7,14.1,17.4,14.1z"
                fill="currentColor"/>
        </svg>
      </span>
                    <span class="navbar-toggler-toggled">
        <svg height="14" viewBox="0 0 18 18" width="14" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5,9.5l5-5c0.2-0.2,0.2-0.6-0.1-0.9l-1-1c-0.3-0.3-0.7-0.3-0.9-0.1l-5,5l-5-5C4.3,2.3,3.9,2.4,3.6,2.6l-1,1 C2.4,3.9,2.3,4.3,2.5,4.5l5,5l-5,5c-0.2,0.2-0.2,0.6,0.1,0.9l1,1c0.3,0.3,0.7,0.3,0.9,0.1l5-5l5,5c0.2,0.2,0.6,0.2,0.9-0.1l1-1 c0.3-0.3,0.3-0.7,0.1-0.9L11.5,9.5z"
                fill="currentColor"/>
        </svg>
      </span>
                </button>
                <!-- End Responsive Toggle Button -->
    
                <!-- Navigation -->
                <div class="collapse navbar-collapse" id="navBar">
                    <div class="navbar-body header-abs-top-inner">
                        <ul class="navbar-nav">
                            <!-- Home -->
                            <li class="hs-has-mega-menu navbar-nav-item">
                                <a aria-expanded="false" aria-haspopup="true" class="hs-mega-menu-invoker nav-link"
                                   href="/index.html"> Home</a>
                            </li>
                            <!-- End Home -->


                            <!-- Research -->
                            <li class="hs-has-sub-menu navbar-nav-item">
                                <a aria-expanded="false" aria-haspopup="true" class="hs-mega-menu-invoker nav-link"
                                   href="/projects.html">Research</a>
                            </li>
                            <!-- End Research -->
    
                            <!-- People -->
                            <li class="hs-has-sub-menu navbar-nav-item">
                                <a aria-expanded="false" aria-haspopup="true" class="hs-mega-menu-invoker nav-link"
                                   href="/people.html">People</a>
                            </li>
                            <!-- End Newsroom -->
    
                            <!-- Newsroom -->
                            <li class="hs-has-sub-menu navbar-nav-item">
                                <a aria-expanded="false" aria-haspopup="true" class="hs-mega-menu-invoker nav-link"
                                   href="/publications.html">Publications</a>
                            </li>
                            <!-- Educations -->
                            <li class="hs-has-sub-menu navbar-nav-item">
                                <a aria-expanded="false" aria-haspopup="true" class="hs-mega-menu-invoker nav-link"
                                   href="/courses.html">Education</a>
                            </li>
                            <!-- End Educations -->
    
                            <!-- End Newsroom -->


                            <!-- Work With Us -->
                            <li class="hs-has-sub-menu navbar-nav-item">
                                <a aria-expanded="false" aria-haspopup="true" class="hs-mega-menu-invoker nav-link"
                                   href="/contact_us.html">Contact Us</a>
                            </li>
                            <!-- End Work With Us -->
                        </ul>
                    </div>
                </div>
                <!-- End Navigation -->
            </nav>
            <!-- End Nav -->
        </div>
    </div>
</header>
<!-- ========== END HEADER ========== --></div>
`
    }
}

customElements.define('header-component', Header);