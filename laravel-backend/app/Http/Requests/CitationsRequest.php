<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CitationsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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

            'citations.authors' => ['nullable', 'string'],
            'citations.author_ids' => ['required', 'array'],
            'citations.author_ids.*' => [
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
            'citations.cited_authors' => ['required', 'string'],
            'citations.cited_article_title' => ['required', 'string'],
            'citations.research_title' => ['required', 'string'],
            'citations.journal_title' => ['required', 'string'],
            'citations.issno_vol_pages' => ['nullable', 'string'],
            'citations.date' => ['required', 'date'],
            'citations.publisher_name' => ['required', 'string'],
            'citations.url_link' => ['nullable', 'url'],
            'citations.scopus_link' => ['nullable', 'url'],
            'citations.points' => ['required', 'integer'],
        ];
    }
}

