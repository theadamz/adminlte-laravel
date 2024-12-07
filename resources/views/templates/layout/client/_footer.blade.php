<!-- Main Footer -->
<footer class="main-footer py-2">
    <!-- Default to the left -->
    {{ Date::now()->translatedFormat('l, j F Y') }}
    <!-- To the right -->
    <div class="float-right d-none d-sm-inline">
        &copy; 2024 &copy;
        <a class="text-muted" href="mailto:theadamz91@gmail.com">
            {!! config('setting.general.copyright') !!}
        </a>
    </div>
</footer>
