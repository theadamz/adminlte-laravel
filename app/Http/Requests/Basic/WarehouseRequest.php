<?php

namespace App\Http\Requests\Basic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class WarehouseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'code' => ['required', 'string', "max:10", "regex:" . config("setting.regxp.forCode")],
            'name' => ['required', 'string', 'min:1', 'max:50'],
            'address' => ['nullable', 'string', 'min:1', 'max:100'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'fax' => ['nullable', 'string', 'max:20'],
            'is_active' => ['required', 'boolean'],
        ];

        // update
        if (in_array($this->method(), ["PUT", "PATCH"])) {
            $rules = array_merge($rules, [
                "id" => ["required", "uuid", Rule::exists("warehouses", "id")],
            ]);
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->has('is_active') ? filter_var($this->post('is_active'), FILTER_VALIDATE_BOOLEAN) : false,
        ]);

        // update
        if (in_array($this->method(), ["PUT", "PATCH"])) {
            $this->merge([
                'id' => $this->route('id')
            ]);
        }
    }
}