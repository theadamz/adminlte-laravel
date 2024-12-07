<?php

namespace App\View\Components\inputs;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class textbox extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct(
        public string $label,
        public ?string $placeholder = null,
        public ?bool $isRequired = false,
        public ?string $elementId = null,
        public string $elementName,
        public ?string $class = "form-control font-weight-normal",
        public ?string $value = null,
        public ?int $maxLength = null,
        public ?string $textHelper = null,
    ) {
        $this->placeholder = $placeholder ?? $label;
        $this->elementId = $elementId ?? $elementName;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.inputs.textbox');
    }
}
