<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PresentedResearchProductionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'research_involvement_type' => ['required', 'integer'],
            'research_documents' => ['required', 'array'],
            'research_documents.*' => ['string'],
            'sdg_mappings' => ['required', 'array'],
            'sdg_mappings.*' => ['integer'],
            'agenda_mappings' => ['required', 'array'],
            'agenda_mappings.*' => ['integer'],

            'presented.date_presented' => 'required|string',
            'presented.conference_name' => 'required|string|max:255',
            'presented.conference_type' => 'required|string|max:255',
            'presented.conference_nature' => 'required|string|max:255',
            'presented.conference_place' => 'required|string|max:255',
            'presented.conference_organization' => 'required|string|max:255',
            'presented.presentation_title' => 'required|string|max:255',
            'presented.presenter_name' => 'nullable|string|max:255',
            'presented.author_ids' => 'required|array',
            'presented.author_ids.*' => [
                function ($attribute, $value, $fail) {
                    if (is_numeric($value)) {
                        if (!\Illuminate\Support\Facades\DB::table('users')->where('id', $value)->exists()) {
                            $fail('The selected author is invalid.');
                        }
                    } elseif (!is_string($value)) {
                        $fail('The author must be a valid user ID or a string name.');
                    } elseif (strlen($value) > 255) {
                        $fail('The custom author name must not exceed 255 characters.');
                    }
                }
            ],
            'presented.points' => 'required|numeric|min:0',
        ];
    }
}

