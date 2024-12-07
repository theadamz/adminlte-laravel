<!-- Navbar -->
<nav class="main-header navbar navbar-expand-md navbar-light navbar-white">
    <div class="container-fluid">
        <a href="{{ url('/') }}" class="navbar-brand">
            <img src="{{ url('assets/images/web_image.png') }}" alt="{{ config('setting.general.web_name') }}"
                class="brand-image" style="opacity: .8">
        </a>

        <div class="collapse navbar-nav navbar-collapse order-2" id="navbarCollapse">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a href="{{ route('client.dashboard') }}"
                        class="nav-link font-weight-bolder {{ request()->is('clients/dashboard') || request()->is('clients/dashboard/*') ? 'active' : '' }}"><i
                            class="fas fa-chart-line mr-2"></i>
                        Dashboard</a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('client.request.index') }}"
                        class="nav-link font-weight-bolder {{ request()->is('clients/requests') || request()->is('clients/requests/*') ? 'active' : '' }}"><i
                            class="fas fa-layer-group mr-2"></i>
                        Requests</a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('client.issue.index') }}"
                        class="nav-link font-weight-bolder {{ request()->is('clients/issues') || request()->is('clients/issues/*') ? 'active' : '' }}"><i
                            class="fas fa-tasks mr-2"></i>
                        Issues</a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('client.knowledge.index') }}"
                        class="nav-link font-weight-bolder {{ request()->is('clients/knowledges') || request()->is('clients/knowledges/*') ? 'active' : '' }}"><i
                            class="fas fa-book-open mr-2"></i>
                        Knowledge Base</a>
                </li>
            </ul>

            <!-- Left navbar links -->
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link" data-toggle="dropdown" href="javascript:;" title="Account">
                        <i class="fas fa-user mr-3"></i>
                        Hello, <span class="font-weight-bold mr-2"> {{ session('name') }}</span> <i
                            class="fas fa-caret-down"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                        <span class="dropdown-item dropdown-header">{{ session('email') }}</span>
                        <div class="dropdown-divider"></div>
                        @if (!str(session('def_path'))->contains('client'))
                            <a href="{{ session('def_path') }}" class="dropdown-item">
                                <i class="fas fa-globe mr-2"></i> Web Admin
                            </a>
                            <div class="dropdown-divider"></div>
                        @endif
                        <a href="{{ route('client.change-profile') }}" class="dropdown-item">
                            <i class="fas fa-user mr-2"></i> Profile
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="{{ route('client.change-password') }}" class="dropdown-item">
                            <i class="fas fa-key mr-2"></i> Change Password
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="{{ route('client.sign-in-history') }}" class="dropdown-item">
                            <i class="fas fa-file mr-2"></i> Sign In History
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="{{ url('/sign-out') }}" class="dropdown-item">
                            <i class="fas fa-sign-out-alt mr-2"></i> Sign Out
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>
<!-- /.navbar -->
