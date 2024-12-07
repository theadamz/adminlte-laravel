<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserUpdateRequest extends FormRequest
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
        $password = !app()->isProduction() ? Password::min(6) : Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised();

        return [
            "id" => ["required", "uuid", Rule::exists("users", "id")],
            "email" => ["required", "email", "min:10", "max:255"],
            "name" => ["required", "string", "min:3", "max:255"],
            "password" => ["nullable", $password, "max:150"],
            "role" => ["required", "uuid", Rule::exists("roles", "id")],
            "timezone" => ["required", 'timezone'],
            "is_active" => ["required", "boolean"],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            "id" => $this->route("id"),
            'is_active' => $this->has('is_active') ? filter_var($this->post('is_active'), FILTER_VALIDATE_BOOLEAN) : false,
        ]);
    }
}
