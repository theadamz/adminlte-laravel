<div class="form-group fv-row">
    <label class="form-label font-weight-normal mb-1">{{ $label }}
        @if ($isRequired)
            <span class="text-danger">*</span>
        @endif
    </label>
    <input type="text" id="{{ $elementId }}" name="{{ $elementName }}" class="{{ $class }}"
        placeholder="{{ $placeholder }}" value="{{ $value }}" maxlength="{{ $maxLength }}" autocomplete="off" />
    @if (!empty($textHelper))
        <small class="text-muted">{{ $textHelper }}</small>
    @endif
</div>
